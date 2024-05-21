import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Person } from 'src/shared/entity/person.entity';
import { NotFoundError } from 'src/shared/error/not-found.error';
import { Not, Repository } from 'typeorm';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
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
      try {
        person = await this.getPersonFromRemoteService(id);
        await this.createPerson(person);
      } catch (error) {
        throw error;
      }
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

  public async updatePerson(id: string, person: Person): Promise<Person> {
    await this.personRepository.update({ id }, person);
    return this.getPersonFromDB(id);
  }

  public async deletePerson(id: string): Promise<void> {
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
