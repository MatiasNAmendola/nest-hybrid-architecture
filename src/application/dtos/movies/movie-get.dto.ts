import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDefined, IsUUID } from 'class-validator-multi-lang';
import { MovieCreateDTO } from './movie-create.dto';
import { Movie } from '../../../domain/entities';

export class MovieGetDTO extends MovieCreateDTO implements Movie {
  @ApiProperty({ required: true })
  @IsUUID('4')
  id: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsDateString()
  createdAt: Date;

  @ApiProperty({ required: false })
  @IsDefined()
  @IsDateString()
  updatedAt: Date;

  constructor({ id, title, url, description, categories = [], publishDate, createdAt, updatedAt }: any = {}) {
    super({ title, url, description, categories, publishDate });
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
