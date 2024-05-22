import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PersonService } from './person.service';
import { EnvEventPattern } from 'src/shared/decorator/event-pattern.decorator';

@Controller()
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @EnvEventPattern('KAFKA_PERSON_EVENTS_CREATED_TOPIC')
  async handlePersonEventsCreated(@Payload() message: { data: { personid: string } }) {
    return this.personService.createPersonById(message.data.personid);
  }

  @EnvEventPattern('KAFKA_PERSON_EVENTS_CHANGED_TOPIC')
  async handlePersonEventsChanged(
    @Payload() message: { data: { personid: string } },
  ) {
    return this.personService.updatePersonById(message.data.personid);
  }

  @EnvEventPattern('KAFKA_PERSON_EVENTS_DELETED_TOPIC')
  async handlePersonEventsDeleted(@Payload() message: { data: { personid: string } }) {
    return this.personService.deletePerson(message.data.personid);
  }
}
