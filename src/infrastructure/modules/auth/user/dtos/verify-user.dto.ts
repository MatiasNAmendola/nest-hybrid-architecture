import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, Length } from 'class-validator-multi-lang';

export class VerifyUserDTO {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  @Length(6, 50)
  username: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  @Length(5, 20)
  code: string;

  constructor({ username, code }: any = {}) {
    this.username = username;
    this.code = code;
  }
}
