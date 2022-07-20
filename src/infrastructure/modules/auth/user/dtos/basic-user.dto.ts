import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsDefined, IsEmail, IsString, IsUUID } from 'class-validator-multi-lang';
import { UserAvailable } from '../user.entity';

export class BasicUserDTO implements UserAvailable {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsUUID('4')
  id: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  provider: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  username: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  fullName: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsBoolean()
  isVerified: boolean;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsDateString()
  createdAt: Date;

  @ApiProperty({ required: false })
  @IsDefined()
  @IsDateString()
  updatedAt: Date;

  constructor(user: UserAvailable) {
    const { id, username, fullName, email, isVerified, isActive, createdAt, updatedAt, provider } = user;
    this.id = id;
    this.provider = provider;
    this.username = username;
    this.fullName = fullName;
    this.email = email;
    this.isVerified = isVerified;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
