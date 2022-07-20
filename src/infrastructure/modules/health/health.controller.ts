import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { HealthCheck, HealthCheckResult, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { ApiKeyGuard } from '../auth';

@ApiExcludeController()
@UseGuards(ApiKeyGuard)
@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService, private orm: TypeOrmHealthIndicator) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([() => this.orm.pingCheck('database')]);
  }
}
