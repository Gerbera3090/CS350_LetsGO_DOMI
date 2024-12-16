import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import {
  ApiMnt001RequestBody,
  ApiMnt001RequestParam,
  ApiMnt001Response,
  ApiMnt002Response,
  ApiMnt003RequestBody,
  ApiMnt003Response,
  ApiMnt004RequestBody,
  ApiMnt004Response,
  ApiMnt005RequestBody,
  ApiMnt005Response,
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
    if (isNaN(parsedLmId) || parsedLmId <= 0) {
      throw new Error('Invalid lmId'); // lmId 유효성 검사
    }
    if (
      body.trackerId === undefined ||
      body.intensity === undefined ||
      body.trackerId <= 0 ||
      body.intensity < 0 ||
      body.intensity > 1023
    ) {
      throw new Error('Invalid body'); // body 유효성 검사
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

  // usageAlarm을 추가하는 API
  @Post('/monitor/usage-alarm')
  async postUsageAlarm(
    @Body() body: ApiMnt003RequestBody,
  ): Promise<ApiMnt003Response> {
    console.log('POST /monitor/usage-alarm');
    console.log(JSON.stringify({ body }));
    if (
      body.lmId === undefined ||
      body.userId === undefined ||
      body.lmId <= 0 ||
      body.userId <= 0
    ) {
      throw new Error('Invalid body'); // body 유효성 검사
    }
    const res = await this.monitorService.postUsageAlarm(
      body.lmId,
      body.userId,
    );
    return { usageAlarmId: res };
  }
  // usageAlarm을 삭제하는 API
  @Delete('/monitor/usage-alarm')
  async deleteUsageAlarm(
    @Body() body: ApiMnt004RequestBody,
  ): Promise<ApiMnt004Response> {
    console.log('DELETE /monitor/usage-alarm');
    console.log(JSON.stringify({ body }));
    if (
      body.lmId === undefined ||
      body.userId === undefined ||
      body.lmId <= 0 ||
      body.userId <= 0
    ) {
      throw new Error('Invalid body'); // body 유효성 검사
    }
    const res = await this.monitorService.deleteUsageAlarm(
      body.lmId,
      body.userId,
    );
    return { usageAlarmId: res };
  }

  // reserveAlarm을 추가하는 API
  @Post('/monitor/reserve-alarm')
  async postReserveAlarm(
    @Body() body: ApiMnt005RequestBody,
  ): Promise<ApiMnt005Response> {
    console.log('POST /lms/flm');
    console.log(JSON.stringify({ body }));
    if (
      body.lmId === undefined ||
      body.userId === undefined ||
      body.lmId <= 0 ||
      body.userId <= 0
    ) {
      throw new Error('Invalid body'); // body 유효성 검사
    }
    const res = await this.monitorService.postReserveAlarm(
      body.lmId,
      body.userId,
    );
    return { reserveAlarmId: res };
  }

  // usageAlarm을 삭제하는 API
  @Delete('/monitor/reserve-alarm')
  async deleteReserveAlarm(
    @Body() body: ApiMnt005RequestBody,
  ): Promise<ApiMnt005Response> {
    console.log('DELETE /lms/flm');
    console.log(JSON.stringify({ body }));
    if (
      body.lmId === undefined ||
      body.userId === undefined ||
      body.lmId <= 0 ||
      body.userId <= 0
    ) {
      throw new Error('Invalid body'); // body 유효성 검사
    }
    const res = await this.monitorService.deleteReserveAlarm(
      body.lmId,
      body.userId,
    );
    return { reserveAlarmId: res };
  }
}
