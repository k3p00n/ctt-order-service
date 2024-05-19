import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderDto } from './dto/order.dto';
import { InputOrderDto } from './dto/input-order.dto';
import { OrderService } from './oder.service';

@ApiTags('orders')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({
    summary: 'Get a list of Orders',
    description: 'This function retrieves all orders.',
    operationId: 'findAllUsingGET',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: [OrderDto],
  })
  @Get()
  public getOrders(): OrderDto[] {
    throw new Error('Not implemented');
  }

  @ApiOperation({
    summary: 'Create order',
    description: 'This function creates a new order.',
    operationId: 'createUsingPOST',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: OrderDto,
  })
  @Post()
  public createOrder(@Body() order: InputOrderDto): OrderDto {
    throw new Error('Not implemented');
  }

  @ApiOperation({
    summary: 'Delete all orders',
    description: 'This function deletes all orders.',
    operationId: 'deleteAllUsingDELETE',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @Delete()
  public deleteAllOrders(): void {
    throw new Error('Not implemented');
  }

  @ApiOperation({
    summary: 'Read Order by ID',
    operationId: 'readUsingGET',
    description: 'This function reads a single order.',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: OrderDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Get(':orderID')
  public getOrderById(@Param('orderID') orderID: string): OrderDto {
    throw new Error('Not implemented');
  }

  @ApiOperation({
    summary: 'Update Order',
    operationId: 'updateUsingPUT',
    description:
      'This function updates an order. This does not support delta updates.',
  })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully updated',
    type: OrderDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Put(':orderID')
  public updateOrder(
    @Param('orderID') orderID: string,
    @Body() order: InputOrderDto,
  ): OrderDto {
    throw new Error('Not implemented');
  }

  @ApiOperation({
    summary: 'Update Order',
    description:
      'This function updates a single order. This does support delta updates.',
    operationId: 'deltaUpdateUsingPATCH',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: OrderDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Patch(':orderID')
  public updateOrderPartial(
    @Param('orderID') orderID: string,
    @Body() order: Partial<InputOrderDto>,
  ): OrderDto {
    throw new Error('Not implemented');
  }

  @ApiOperation({
    summary: 'Delete Order by ID',
    description: 'This function deletes a single order.',
    operationId: 'deleteUsingDELETE',
  })
  @ApiResponse({
    status: 204,
    description: 'The order has been successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Delete(':orderID')
  public deleteOrder(@Param('orderID') orderID: string): void {
    throw new Error('Not implemented');
  }
}
