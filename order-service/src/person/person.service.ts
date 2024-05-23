import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Order } from 'src/shared/entity/order.entity';
import { Person } from 'src/shared/entity/person.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public async getPerson(id: string): Promise<Person> {
    let person: Person;
    try {
      person = await this.getPersonFromDB(id);
    } catch (error) {
      console.warn(error);
    }
    if (!person) {
      person = await this.createPersonById(id);
    }
    return person;
  }

  public async createPerson(person: Person): Promise<Person> {
    try {
      const result = await this.personRepository.insert(person);
      return { ...person, id: result.identifiers[0].id };
    } catch (error) {
      if (error.code === '23505') {
        console.warn('Person already exists');
        return;
      }
      throw error;
    }
  }

  public async createPersonById(id: string): Promise<Person> {
    const person = await this.getPersonFromRemoteService(id);
    await this.createPerson(person);
    return person;
  }

  public async updatePersonById(id: string): Promise<Person> {
    const person = await this.getPersonFromRemoteService(id);
    await this.personRepository.save(person);
    return person;
  }

  public async deletePerson(id: string): Promise<void> {
    await Promise.all([
      this.orderRepository.update({ soldTo: { id: id } }, { soldTo: null }),
      this.orderRepository.update({ shipTo: { id: id } }, { shipTo: null }),
      this.orderRepository.update({ billTo: { id: id } }, { billTo: null }),
    ]);
    await this.personRepository.delete({ id });
  }

  private async getPersonFromDB(id: string): Promise<Person> {
    return this.personRepository.findOne({
      where: { id },
    });
  }

  private async getPersonFromRemoteService(id: string, timeout?: number): Promise<Person> {
    const contractServiceUrl = this.configService.get<string>(
      'CONTRACT_SERVICE_URL',
    );
    const requestTimeout = +timeout || this.configService.get<number>('CONTRACT_SERVICE_TIMEOUT') || 5000;
    const maxTimeout = this.configService.get<number>('CONTRACT_SERVICE_MAX_TIMEOUT') || 30000;
    if (+requestTimeout > +maxTimeout) {
      throw new InternalServerErrorException('Cannot get person from remote service');
    }
    try {
      const response = await firstValueFrom(
        await this.httpService.get<Person>(
          `${contractServiceUrl}/api/v1/person/${id}`,
          {
            timeout: requestTimeout
          },
        ),
      );

      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED' ) {
        return this.getPersonFromRemoteService(id, requestTimeout * 2);
      }
      if (error.response?.status === 404) {
        throw new BadRequestException('Person not found');
      }
      if (error.response?.status === 500) {
        throw new InternalServerErrorException('Cannot get person from remote service');
      }
      throw error;
    }
  }
}
