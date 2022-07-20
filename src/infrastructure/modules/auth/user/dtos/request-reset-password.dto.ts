import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, Length } from 'class-validator-multi-lang';

export class RequestResetPasswordDTO {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  @Length(6, 50)
  username: string;

  constructor({ username }: any = {}) {
    this.username = username;
  }
}
