import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class OrderItemDto {
  @ApiProperty({ description: 'Identifier of the order item' })
  @IsString()
  itemID: string;

  @ApiProperty({ description: 'Identifier of the product' })
  @IsString()
  productID: string;

  @ApiProperty({ description: 'Quantity of the product' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Quantity of the product' })
  @IsNumber()
  itemPrice: number;
}
