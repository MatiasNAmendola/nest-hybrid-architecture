import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator-multi-lang';

export class JwtTokensDTO {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  access_token: string;

  constructor({ access_token }: any = {}) {
    this.access_token = access_token;
  }
}
