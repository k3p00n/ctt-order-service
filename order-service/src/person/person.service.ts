import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Order } from 'src/shared/entity/order.entity';
import { Person } from 'src/shared/entity/person.entity';
import { NotFoundError } from 'src/shared/error/not-found.error';
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

  private async getPersonFromRemoteService(id: string): Promise<Person> {
    const contractServiceUrl = this.configService.get<string>(
      'CONTRACT_SERVICE_URL',
    );
    const response = await firstValueFrom(
      await this.httpService.get<Person>(
        `${contractServiceUrl}/api/v1/person/${id}`,
      ),
    );

    switch (response.status) {
      case 200:
        return response.data;
      case 404:
        throw new NotFoundError('Person not found');
      default:
        throw new Error('Unknown error');
    }
  }
}
