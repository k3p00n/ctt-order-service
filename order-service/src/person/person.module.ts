import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from 'src/shared/entity/person.entity';
import { PersonService } from './person.service';
import { HttpModule } from '@nestjs/axios';
import { PersonController } from './person.controller';
import { SharedModule } from 'src/shared/shared.module';
import { Order } from 'src/shared/entity/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Person, Order]),
    HttpModule,
    SharedModule,
  ],
  controllers: [PersonController],
  providers: [PersonService],
  exports: [PersonService],
})
export class PersonModule {}
