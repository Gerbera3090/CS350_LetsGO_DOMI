import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import {
  ApiMnt001RequestBody,
  ApiMnt001RequestParam,
  ApiMnt001Response,
  ApiMnt002Response,
} from '@depot/api/monitor';

@Controller()
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}
  @Get('/monitor/hello')
  getHello(): string {
    return 'hello in monitor';
  }

  // Tracker가 track을 보내는 API
  @Post('/monitor/track/:lmId')
  async postTrackData(
    @Param('lmId') lmId: string,
    @Body() body: ApiMnt001RequestBody,
  ): Promise<ApiMnt001Response> {
    const parsedLmId = Number(lmId);
    if (isNaN(parsedLmId)) {
      throw new Error('Invalid lmId'); // lmId 유효성 검사
    }
    console.log(JSON.stringify({ lmId: parsedLmId, body }));
    const res = await this.monitorService.postTrackData(
      { lmId: parsedLmId },
      body as ApiMnt001RequestBody,
    );
    return res;
  }

  @Get('/monitor/tracks')
  async getTracks(): Promise<ApiMnt002Response> {
    return await this.monitorService.getTracks();
  }
}
