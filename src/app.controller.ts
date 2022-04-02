import { Controller, Get, Render } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';
// import { AppService } from './app.service';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {}
  @Public()
  @Get()
  @Render('index')
  root() {
    return { message: 'Made with ❤️‍🔥 by zax4r0' };
  }
}
