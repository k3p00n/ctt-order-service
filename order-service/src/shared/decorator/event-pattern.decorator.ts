import { applyDecorators } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { config } from 'dotenv';

config();

export const EnvEventPattern = (envVar: string): MethodDecorator => {
  return applyDecorators(EventPattern(process.env[envVar]));
};
