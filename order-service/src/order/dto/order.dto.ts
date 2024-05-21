import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsUUID, ValidateNested } from 'class-validator';
import { PersonDto } from './person.dto';
import { BaseOrderDto } from './base-order.dto';

export class OrderDto extends BaseOrderDto {
  @ApiProperty({ description: 'Unique identifier' })
  @IsUUID()
  orderID: string;

  @ApiProperty({
    description: 'Person whom the order was sold to',
    type: PersonDto,
  })
  @ValidateNested()
  @Type(() => PersonDto)
  soldTo: PersonDto;

  @ApiProperty({
    description: 'Person whom the order will be billed to',
    type: PersonDto,
  })
  @ValidateNested()
  @Type(() => PersonDto)
  billTo: PersonDto;

  @ApiProperty({
    description: 'Person whom the order will be shipped to',
    type: PersonDto,
  })
  @ValidateNested()
  @Type(() => PersonDto)
  shipTo: PersonDto;
}
