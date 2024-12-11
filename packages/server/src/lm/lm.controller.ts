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
    if (isNaN(parsedUserId) || isNaN(parsedFloorId)) {
      throw new Error('Invalid parsed Id'); // lmId 유효성 검사
    }
    console.log(JSON.stringify({ userId, dormitoryFloorId }));
    const res = await this.lmService.getLMs({
      userId: parsedUserId,
      dormitoryFloorId: parsedFloorId,
    });
    return res;
  }

  // FLM을 추가하는 API
  @Post('/lms/flm')
  async postFLM(
    @Body() body: ApiLmc003RequestBody,
  ): Promise<ApiLmc003Response> {
    console.log('POST /lms/flm');
    console.log(JSON.stringify({ body }));
    const res = await this.lmService.postFLM(body.lmId, body.userId);
    return { flmId: res };
  }

  @Delete('/lms/flm')
  async deleteFLM(
    @Body() body: ApiLmc004RequestBody,
  ): Promise<ApiLmc004Response> {
    console.log('DELETE /lms/flm');
    console.log(JSON.stringify({ body }));
    const res = await this.lmService.deleteFLM(body.lmId, body.userId);
    return { flmId: res };
  }
}
