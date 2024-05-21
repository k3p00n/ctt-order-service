import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './oder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/shared/entity/order.entity';
import { PersonModule } from 'src/person/person.module';

@Module({
  imports: [PersonModule, TypeOrmModule.forFeature([Order])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
