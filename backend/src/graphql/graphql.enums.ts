import { registerEnumType } from '@nestjs/graphql';

import { RecipeCategory } from '../recipes/entities/recipe-category.enum';
import { UserRole } from '../users/entities/user-role.enum';

registerEnumType(RecipeCategory, {
  name: 'RecipeCategory',
});

registerEnumType(UserRole, {
  name: 'UserRole',
});
