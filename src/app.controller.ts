import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('saude')
  verificar(): { status: string } {
    return { status: 'API online' };
  }
}
