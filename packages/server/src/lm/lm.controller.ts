import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { LMService } from './lm.service';
import {
  ApiLmc001RequestQuery,
  ApiLmc001Response,
  ApiLmc003Response,
  ApiLmc003RequestBody,
  ApiLmc004RequestBody,
  ApiLmc004Response,
  ApiLmc002Response,
} from '@depot/api/lm';

@Controller()
export class LMController {
  constructor(private readonly lmService: LMService) {}
  @Get('/lms/hello')
  getHello(): string {
    return 'hello in lm';
  }

  // lm
  @Get('/lms')
  async getLMs(
    @Query('userId') userId: string,
    @Query('dormitoryFloorId') dormitoryFloorId: string,
  ): Promise<ApiLmc001Response> {
    const parsedUserId = Number(userId);
    const parsedFloorId = Number(dormitoryFloorId);
    if (
      isNaN(parsedUserId) ||
      isNaN(parsedFloorId) ||
      parsedUserId <= 0 ||
      parsedFloorId <= 0
    ) {
      throw new Error('Invalid parsed Id'); // lmId 유효성 검사
    }
    console.log(JSON.stringify({ userId, dormitoryFloorId }));
    const res = await this.lmService.getLMs({
      userId: parsedUserId,
      dormitoryFloorId: parsedFloorId,
    });
    return res;
  }

  // flm을 조회하는 API
  // 만약 USING인 FLM 이 있다면 맨 위로 주고, 그다음 order by priority
  @Get('/lms/flms')
  async getFLMs(@Query('userId') userId: string): Promise<ApiLmc002Response> {
    console.log('GET /lms/flms');
    const parsedUserId = Number(userId);
    if (isNaN(parsedUserId) || parsedUserId <= 0) {
      throw new Error('Invalid parsed Id');
    }
    const res = await this.lmService.getFLMs(parsedUserId);
    return res;
  }

  // FLM을 추가하는 API
  @Post('/lms/flm')
  async postFLM(
    @Body() body: ApiLmc003RequestBody,
  ): Promise<ApiLmc003Response> {
    console.log('POST /lms/flm');
    console.log(JSON.stringify({ body }));
    if (!body.lmId || !body.userId || body.lmId <= 0 || body.userId <= 0) {
      throw new Error('Invalid parsed Id');
    }
    const res = await this.lmService.postFLM(body.lmId, body.userId);
    return { flmId: res };
  }

  @Delete('/lms/flm')
  async deleteFLM(
    @Body() body: ApiLmc004RequestBody,
  ): Promise<ApiLmc004Response> {
    console.log('DELETE /lms/flm');
    console.log(JSON.stringify({ body }));
    if (!body.lmId || !body.userId || body.lmId <= 0 || body.userId <= 0) {
      throw new Error('Invalid parsed Id');
    }
    const res = await this.lmService.deleteFLM(body.lmId, body.userId);
    return { flmId: res };
  }
}
