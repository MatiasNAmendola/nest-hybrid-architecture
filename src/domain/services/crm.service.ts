import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { WebsiteContact, WebsiteContactEntity } from '../entities';

@Injectable()
export class CrmService {
  constructor(
    @InjectRepository(WebsiteContactEntity)
    private readonly repository: Repository<WebsiteContactEntity>,
  ) {}

  saveContactData(dto: WebsiteContact): Promise<WebsiteContactEntity> {
    const { fullName, email, message } = dto;

    const entity: WebsiteContactEntity = new WebsiteContactEntity();

    entity.fullName = fullName;
    entity.email = email;
    entity.message = message;

    return this.repository.save(entity);
  }
}
