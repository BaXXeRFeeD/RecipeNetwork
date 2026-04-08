import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('system')
@Controller()
export class AppController {
  @Get()
  getRoot(): { message: string; docs: string; health: string } {
    return {
      message: 'RecipeNetwork backend is running',
      docs: '/api/docs',
      health: '/api/health',
    };
  }

  @Get('health')
  getHealth(): { status: string } {
    return { status: 'ok' };
  }
}
