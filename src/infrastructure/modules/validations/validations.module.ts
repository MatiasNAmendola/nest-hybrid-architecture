import { Global, Module } from '@nestjs/common';
import { ValidationsService } from './validations.service';

@Global()
@Module({
  providers: [ValidationsService],
  exports: [ValidationsService],
})
export class ValidationsModule {}
