import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { QueryFeedDto } from './dto/query-feed.dto';
import { BffService } from './bff.service';

@ApiTags('bff')
@Controller('bff')
export class BffController {
  constructor(private readonly bffService: BffService) {}

  @ApiBearerAuth()
  @UseGuards(OptionalJwtAuthGuard)
  @Get('feed')
  feed(
    @Query() query: QueryFeedDto,
    @CurrentUser() currentUser?: AuthenticatedUser | null,
  ) {
    return this.bffService.getFeed(query, currentUser ?? null);
  }

  @ApiBearerAuth()
  @UseGuards(OptionalJwtAuthGuard)
  @Get('recipes/:id')
  recipe(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser?: AuthenticatedUser | null,
  ) {
    return this.bffService.getRecipeDetails(id, currentUser ?? null);
  }

  @ApiBearerAuth()
  @UseGuards(OptionalJwtAuthGuard)
  @Get('profiles/:userId')
  profile(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() currentUser?: AuthenticatedUser | null,
  ) {
    return this.bffService.getProfile(userId, currentUser ?? null);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me/dashboard')
  myDashboard(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.bffService.getMyDashboard(currentUser);
  }
}
