import { IsMongoId, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PersonDto {
  @ApiProperty({ description: 'City Name' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Name of the Country' })
  @IsString()
  country: string;

  @ApiProperty({ description: 'Arbitrary json key value pairs' })
  @IsObject()
  extensionFields: object;

  @ApiProperty({ description: 'First Name of the Person' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'House Number' })
  @IsString()
  houseNumber: string;

  @ApiProperty({ description: 'Unique MongoDB identifier' })
  @IsMongoId()
  id: string;

  @ApiProperty({ description: 'Last Name of the Person' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Street name w/o house number' })
  @IsString()
  streetAddress: string;

  @ApiProperty({ description: 'House Number' })
  @IsString()
  zip: string;
}
