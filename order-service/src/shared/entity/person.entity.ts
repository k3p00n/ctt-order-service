import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

@Entity()
export class Person {
  @PrimaryColumn()
  id: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column('json')
  extensionFields: object;

  @Column()
  firstName: string;

  @Column()
  houseNumber: string;

  @Column()
  lastName: string;

  @Column()
  streetAddress: string;

  @Column()
  zip: string;

  @OneToMany(() => Person, (person) => person.id)
  orders: Person[];
}
