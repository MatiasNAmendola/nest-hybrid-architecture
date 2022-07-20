import { Module } from '@nestjs/common';
import { IndexService } from '../services';
import { IndexController } from '../../application/controllers';

@Module({
  providers: [IndexService],
  controllers: [IndexController],
})
export class IndexModule {}
