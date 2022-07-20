import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthModule } from '../../infrastructure/modules/auth';
import { MoviesController } from '../../application/controllers';
import { MoviesService } from '../services';
import { MovieEntity } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity]), JwtAuthModule],
  providers: [MoviesService],
  controllers: [MoviesController],
})
export class MoviesModule {}
