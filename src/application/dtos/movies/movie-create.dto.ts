import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDefined, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator-multi-lang';
import { Categories } from '../../../domain/enums';
import { Movie } from '../../../domain/entities';

export class MovieCreateDTO implements Movie {
  @ApiProperty({ required: true })
  @IsDefined()
  @MaxLength(50)
  title: string;

  @ApiProperty({ required: true })
  @IsUrl()
  @IsDefined()
  @MaxLength(100)
  url: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  description?: string;

  @ApiProperty({ required: true, enum: Categories, type: [String] })
  @IsDefined()
  categories: Set<Categories> | Categories[];

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  publishDate?: Date;

  constructor({ title, url, description, categories = [], publishDate }: any = {}) {
    this.title = title;
    this.url = url;
    this.description = description;
    this.categories = categories;
    this.publishDate = publishDate;
  }
}
