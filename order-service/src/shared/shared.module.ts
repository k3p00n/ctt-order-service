import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { logLevel } from 'kafkajs';
import { KafkaService } from './service/kafka.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        inject: [ConfigService],
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [configService.get('KAFKA_BROKER')],
            },
            consumer: {
              groupId: 'order-service-consumer',
            },
          },
        }),
      },
    ]),
  ],
  controllers: [],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class SharedModule {}
