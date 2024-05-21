import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from 'src/shared/entity/person.entity';
import { PersonService } from './person.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Person]), HttpModule],
  controllers: [],
  providers: [PersonService],
  exports: [PersonService],
})
export class PersonModule {}
