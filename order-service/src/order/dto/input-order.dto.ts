import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseOrderDto } from './base-order.dto';

export class InputOrderDto extends BaseOrderDto {
  @ApiProperty({
    description: 'Unique identifier of the person whom the order was sold to',
  })
  @IsMongoId()
  soldToID: string;

  @ApiProperty({
    description: 'Unique identifier of the person whom the order is billed to',
  })
  @IsMongoId()
  billToID: string;

  @ApiProperty({
    description: 'Unique identifier of the person whom the order is sold to',
  })
  @IsMongoId()
  shipToID: string;
}
