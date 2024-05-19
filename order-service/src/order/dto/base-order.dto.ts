import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { OrderItemDto } from './order-item.dto';

export class BaseOrderDto {
  @ApiProperty({ description: 'Date of Order Capture' })
  @IsString()
  orderDate: string;

  @ApiProperty({ description: 'Value of the Order incl. taxes' })
  @IsNumber()
  orderValue: number;

  @ApiProperty({ description: 'Total taxes of the Order' })
  @IsNumber()
  taxValue: number;

  @ApiProperty({ description: 'Order Currency' })
  @IsString()
  currencyCode: string;

  @ApiProperty({ description: 'Order Items', type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
