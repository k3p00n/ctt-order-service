import { BadRequestException, Injectable } from '@nestjs/common';
import { InputOrderDto } from './dto/input-order.dto';
import { OrderDto } from './dto/order.dto';
import { PersonService } from 'src/person/person.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/shared/entity/order.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'src/shared/error/not-found.error';
import { ConfigService } from '@nestjs/config';
import { KafkaService } from 'src/shared/service/kafka.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly personService: PersonService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly kafkaService: KafkaService,
    private readonly configService: ConfigService,
  ) {}

  public async getOrders(): Promise<OrderDto[]> {
    return this.orderRepository.find({
      relations: ['soldTo', 'billTo', 'shipTo'],
    });
  }

  public async createOrder(inputOrder: InputOrderDto): Promise<OrderDto> {
    await this.checkIfOrderPersonsExist(inputOrder);

    const order = await this.orderRepository.save(this.prepareInputOrder(inputOrder));

    const topic = this.configService.get<string>(
      'KAFKA_ORDER_EVENTS_CREATED_TOPIC',
    );

    await this.kafkaService.sendMessage(topic, {
      orderid: order.orderID,
    });

    return this.getOrder(order.orderID);
  }

  public async deleteAllOrders(): Promise<void> {
    try {
      const orderIds = (await this.orderRepository.find()).map(
        (order) => order.orderID,
      );
      await this.orderRepository.delete({});

      const topic = this.configService.get<string>(
        'KAFKA_ORDER_EVENTS_DELETED_TOPIC',
      );
      await Promise.all(
        orderIds.map(async (orderId) => {
          await this.kafkaService.sendMessage(topic, {
            orderid: orderId,
          });
        }),
      );
    } catch (error) {
      console.error(error);
    }
  }

  public async getOrder(id: string): Promise<OrderDto> {
    try {
      const order = await this.orderRepository.findOne({
        where: { orderID: id },
        relations: ['soldTo', 'billTo', 'shipTo'],
      });
      if (!order) {
        throw new NotFoundError('Order not found');
      }
      return order;
    } catch (error) {
      throw error;
    }
  }

  public async updateOrder(
    id: string,
    inputOrder: InputOrderDto,
  ): Promise<OrderDto> {
    await this.checkIfOrderPersonsExist(inputOrder);

    try {
      const order = await this.orderRepository.save({
        ...this.prepareInputOrder(inputOrder),
        orderID: id,
      });
      const topic = this.configService.get<string>(
        'KAFKA_ORDER_EVENTS_CHANGED_TOPIC',
      );
      await this.kafkaService.sendMessage(topic, {
        orderid: order.orderID,
      });
      return this.getOrder(id);
    } catch (error) {
      if (error.code === '22P02') {
        throw new NotFoundError('Order not found');
      }
    }
  }

  public async updateOrderPartial(
    id: string,
    inputOrder: Partial<InputOrderDto>,
  ): Promise<OrderDto> {
    await this.checkIfOrderPersonsExist(inputOrder);
    try {
      await this.orderRepository.update(
        { orderID: id },
        {
          ...this.prepareInputOrder(inputOrder),
        },
      );

      const topic = this.configService.get<string>(
        'KAFKA_ORDER_EVENTS_CHANGED_TOPIC',
      );
      await this.kafkaService.sendMessage(topic, {
        orderid: id,
      });
      return this.getOrder(id);
    } catch (error) {
      if (error.code === '22P02') {
        throw new NotFoundError('Order not found');
      }
    }
  }

  public async deleteOrder(id: string): Promise<void> {
    try {
      await this.orderRepository.delete({ orderID: id });
      const topic = this.configService.get<string>(
        'KAFKA_ORDER_EVENTS_DELETED_TOPIC',
      );
      await this.kafkaService.sendMessage(topic, {
        orderid: id,
      });
    } catch (error) {
      if (error.code === '22P02') {
        return;
      }
      throw error;
    }
  }

  private async checkIfOrderPersonsExist(
    inputOrder: Partial<InputOrderDto>,
  ): Promise<boolean> {
    const personIds = [
      inputOrder.billToID,
      inputOrder.shipToID,
      inputOrder.soldToID,
    ];

    try {
      await Promise.all(
        [...new Set(personIds)]
          .filter((id) => id)
          .map(async (id) => await this.personService.getPerson(id)),
      );
      return true;
    } catch (error) {
      throw new BadRequestException('Person does not exist');
    }
  }

  private prepareInputOrder(inputOrder: Partial<InputOrderDto>): Order {
    const order = {
      ...inputOrder,
      shipTo: inputOrder.shipToID,
      billTo: inputOrder.billToID,
      soldTo: inputOrder.soldToID,
    }
    Object.keys(order).forEach(
      (key) => inputOrder[key] === undefined && delete inputOrder[key],
    );
    return order as unknown as Order;
  }
}
