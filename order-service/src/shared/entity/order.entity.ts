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

  @ManyToOne(() => Person, (person) => person.id)
  soldTo: Person;

  @ManyToOne(() => Person, (person) => person.id)
  billTo: Person;

  @ManyToOne(() => Person, (person) => person.id)
  shipTo: Person;
}

export class OrderItem {
  itemID: string;

  productID: string;

  quantity: number;

  itemPrice: number;

  order: Order;
}