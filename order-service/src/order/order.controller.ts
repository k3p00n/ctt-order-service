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
  public async getOrders(): Promise<OrderDto[]> {
    return this.orderService.getOrders();
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
  public async createOrder(@Body() order: InputOrderDto): Promise<OrderDto> {
    return this.orderService.createOrder(order);
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
  public async deleteAllOrders(): Promise<void> {
    this.orderService.deleteAllOrders();
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
  public async getOrderById(
    @Param('orderID') orderID: string,
  ): Promise<OrderDto> {
    return this.orderService.getOrder(orderID);
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
  public async updateOrder(
    @Param('orderID') orderID: string,
    @Body() order: InputOrderDto,
  ): Promise<OrderDto> {
    return this.orderService.updateOrder(orderID, order);
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
  public async updateOrderPartial(
    @Param('orderID') orderID: string,
    @Body() order: Partial<InputOrderDto>,
  ): Promise<OrderDto> {
    return this.orderService.updateOrderPartial(orderID, order);
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
  public async deleteOrder(@Param('orderID') orderID: string): Promise<void> {
    return this.orderService.deleteOrder(orderID);
  }
}
