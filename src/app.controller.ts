import { Controller, Get } from '@nestjs/common';
@Controller()
export class AppController {
  @Get()
  olaMundo(): string { return 'Hello World!'; }
}
