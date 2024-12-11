import { Injectable } from '@nestjs/common';
import { MonitorRepository } from './monitor.repository';

@Injectable()
export class MonitorPublicService {
  constructor(private readonly monitorRepository: MonitorRepository) {}
  async checkUsing(intensity: number): Promise<boolean> {
    const BORDER_LINE = 1015;
    return intensity < BORDER_LINE;
  }
}
