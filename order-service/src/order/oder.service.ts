import { Injectable } from '@nestjs/common';
import { InputOrderDto } from './dto/input-order.dto';
import { OrderDto } from './dto/order.dto';
import { PersonService } from 'src/person/person.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/shared/entity/order.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'src/shared/error/not-found.error';

@Injectable()
export class OrderService {
  constructor(
    private readonly personService: PersonService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  public async getOrders(): Promise<OrderDto[]> {
    return this.orderRepository.find({
      relations: ['soldTo', 'billTo', 'shipTo'],
    });
  }

  public async createOrder(inputOrder: InputOrderDto): Promise<OrderDto> {
    const allOrderPersonsExist = await this.checkIfAllPersonsExist([
      inputOrder.billToID,
      inputOrder.shipToID,
      inputOrder.soldToID,
    ]);
    if (!allOrderPersonsExist) {
      throw new NotFoundError('Person does not exist');
    }

    return this.orderRepository.save(inputOrder);
  }

  public async deleteAllOrders(): Promise<void> {
    try {
      await this.orderRepository.delete({});
    } catch (error) {
      console.error(error);
    }
  }

  public async getOrder(id: string): Promise<OrderDto> {
    try {
      return this.orderRepository.findOne({
        where: { orderID: id },
        relations: ['person'],
      });
    } catch (error) {
      if (error.code === '22P02') {
        throw new NotFoundError('Order not found');
      }
    }
  }

  public async updateOrder(
    id: string,
    inputOrder: InputOrderDto,
  ): Promise<OrderDto> {
    const allOrderPersonsExist = await this.checkIfAllPersonsExist([
      inputOrder.billToID,
      inputOrder.shipToID,
      inputOrder.soldToID,
    ]);
    if (!allOrderPersonsExist) {
      throw new Error('Person does not exist');
    }
    try {
      return await this.orderRepository.save({
        ...inputOrder,
        id,
      });
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
    const allOrderPersonsExist = await this.checkIfAllPersonsExist([
      inputOrder.billToID,
      inputOrder.shipToID,
      inputOrder.soldToID,
    ]);
    if (!allOrderPersonsExist) {
      throw new Error('Person does not exist');
    }
    try {
      const result = await this.orderRepository.update({ orderID: id }, inputOrder);
      return result.raw[0];
    } catch (error) {
      if (error.code === '22P02') {
        throw new NotFoundError('Order not found');
      }
    }
  }

  public async deleteOrder(id: string): Promise<void> {
    try {
      await this.orderRepository.delete({ orderID: id });
    } catch (error) {
      if (error.code === '22P02') {
        return;
      }
      throw error;
    }
  }

  private async checkIfAllPersonsExist(personIds: string[]): Promise<boolean> {
    try {
      await Promise.all(
        [...new Set(personIds)].map(async (id) => await this.personService.getPerson(id)),
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}
