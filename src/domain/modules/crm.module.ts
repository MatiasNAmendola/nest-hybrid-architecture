import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsController } from '../../application/controllers';
import { CrmService } from '../services';
import { WebsiteContactEntity } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([WebsiteContactEntity])],
  providers: [CrmService],
  controllers: [LeadsController],
})
export class CrmModule {}
