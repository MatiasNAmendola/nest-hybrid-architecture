import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from '../entities';
import { MoviesSeederService } from '../services';
import { MoviesModule } from './movies.module';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity]), MoviesModule],
  providers: [MoviesSeederService],
})
export class MoviesSeederModule {}
