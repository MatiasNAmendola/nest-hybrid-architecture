import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString, Length, MinLength } from 'class-validator-multi-lang';
import { WebsiteContact } from '../../../domain/entities';

export class WebsiteContactDTO implements WebsiteContact {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  @Length(6, 100)
  fullName: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsEmail()
  @Length(6, 100)
  email: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  @MinLength(20)
  message: string;

  constructor({ fullName, email, message }: any = {}) {
    this.fullName = fullName;
    this.email = email;
    this.message = message;
  }
}
