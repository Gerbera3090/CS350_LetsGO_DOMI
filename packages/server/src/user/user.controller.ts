import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  // @Get('/user/hello')
  // getHello(): string {
  //   return 'hello in user';
  // }

  // // Tracker가 track을 보내는 API
  // @Post('/user/track/:lmId')
  // async postTrackData(
  //   @Param('lmId') lmId: string,
  //   @Body() body: ApiMnt001RequestBody,
  // ): Promise<ApiMnt001Response> {
  //   const parsedLmId = Number(lmId);
  //   if (isNaN(parsedLmId)) {
  //     throw new Error('Invalid lmId'); // lmId 유효성 검사
  //   }
  //   console.log(JSON.stringify({ lmId: parsedLmId, body }));
  //   const res = await this.userService.postTrackData(
  //     { lmId: parsedLmId },
  //     body as ApiMnt001RequestBody,
  //   );
  //   return res;
  // }

  // @Get('/user/tracks')
  // async getTracks(): Promise<ApiMnt002Response> {
  //   return await this.userService.getTracks();
  // }
}
