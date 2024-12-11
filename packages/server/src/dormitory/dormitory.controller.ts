import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DormitoryService } from './dormitory.service';

@Controller()
export class DormitoryController {
  constructor(private readonly dormitoryService: DormitoryService) {}
  @Get('/dormitories/hello')
  getHello(): string {
    return 'hello in dormitory';
  }

  // // Tracker가 track을 보내는 API
  // @Post('/dormitory/track/:lmId')
  // async postTrackData(
  //   @Param('lmId') lmId: string,
  //   @Body() body: ApiMnt001RequestBody,
  // ): Promise<ApiMnt001Response> {
  //   const parsedLmId = Number(lmId);
  //   if (isNaN(parsedLmId)) {
  //     throw new Error('Invalid lmId'); // lmId 유효성 검사
  //   }
  //   console.log(JSON.stringify({ lmId: parsedLmId, body }));
  //   const res = await this.dormitoryService.postTrackData(
  //     { lmId: parsedLmId },
  //     body as ApiMnt001RequestBody,
  //   );
  //   return res;
  // }

  // @Get('/dormitories/floors')
  // async getTracks(): Promise<ApiDom001Response> {
  //   return await this.dormitoryService.getTracks();
  // }
}
