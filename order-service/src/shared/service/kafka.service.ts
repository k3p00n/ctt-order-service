import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KafkaService {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async sendMessage(topic: string, message: any) {
    try {
      if (!message) {
        throw new Error('Message is undefined or null');
      }

      const serializedMessage = JSON.stringify(message);
      const result = await firstValueFrom(this.kafkaClient.emit(topic, serializedMessage));
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }
}
