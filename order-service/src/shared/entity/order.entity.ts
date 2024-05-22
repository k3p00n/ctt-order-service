import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Person } from './person.entity';

@Entity()
export class Order {
  @Column()
  orderDate: string;

  @Column('decimal')
  orderValue: number;

  @Column('decimal')
  taxValue: number;

  @Column()
  currencyCode: string;

  @Column('jsonb')
  items: OrderItem[];

  @PrimaryGeneratedColumn('uuid')
  orderID: string;

  @ManyToOne(() => Person, (person) => person.id, { nullable: true })
  soldTo?: Person| null;

  @ManyToOne(() => Person, (person) => person.id, { nullable: true })
  billTo?: Person| null;

  @ManyToOne(() => Person, (person) => person.id, { nullable: true })
  shipTo?: Person| null;
}

export class OrderItem {
  itemID: string;

  productID: string;

  quantity: number;

  itemPrice: number;

  order: Order;
}