import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname } from 'path';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ensureDirectory,
  getRecipeUploadsDir,
  RECIPE_UPLOADS_PREFIX,
} from './upload-paths';

@ApiTags('uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  @Post('recipes')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_request: any, _file: any, callback: any) => {
          callback(null, ensureDirectory(getRecipeUploadsDir()));
        },
        filename: (_request: any, file: any, callback: any) => {
          callback(
            null,
            `${randomUUID()}${extname(file.originalname || '').toLowerCase()}`,
          );
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (_request, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          callback(
            new BadRequestException('Можно загружать только изображения'),
            false,
          );
          return;
        }

        callback(null, true);
      },
    }),
  )
  uploadRecipePhoto(@UploadedFile() file?: any) {
    if (!file) {
      throw new BadRequestException('Файл не был загружен');
    }

    return {
      url: `${RECIPE_UPLOADS_PREFIX}/${file.filename}`,
      filename: file.filename,
    };
  }
}
