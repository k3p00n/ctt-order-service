import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './oder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/shared/entity/order.entity';
import { PersonModule } from 'src/person/person.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    PersonModule,
    TypeOrmModule.forFeature([Order]),
    SharedModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
