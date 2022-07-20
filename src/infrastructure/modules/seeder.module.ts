import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions, ormOptions } from '../config';
import { OrmModule } from '../database';
import { MoviesSeederModule } from '../../domain/modules';

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), OrmModule.forRootAsync(ormOptions), MoviesSeederModule],
  controllers: [],
})
export class SeederModule {}
