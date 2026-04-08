import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1760000000000 implements MigrationInterface {
  name = 'InitSchema1760000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE recipe_category_enum AS ENUM ('desserts', 'meat', 'drinks', 'vegan');
    `);

    await queryRunner.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT chk_users_username_not_blank CHECK (char_length(trim(username)) > 0),
        CONSTRAINT chk_users_email_not_blank CHECK (char_length(trim(email)) > 0)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE recipes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        category recipe_category_enum NOT NULL,
        photo_url TEXT NULL,
        ingredients JSONB NOT NULL,
        steps JSONB NOT NULL,
        author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT chk_recipes_title_not_blank CHECK (char_length(trim(title)) > 0),
        CONSTRAINT chk_recipes_ingredients_is_array CHECK (jsonb_typeof(ingredients) = 'array'),
        CONSTRAINT chk_recipes_steps_is_array CHECK (jsonb_typeof(steps) = 'array'),
        CONSTRAINT chk_recipes_ingredients_not_empty CHECK (jsonb_array_length(ingredients) > 0),
        CONSTRAINT chk_recipes_steps_not_empty CHECK (jsonb_array_length(steps) > 0)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE comments (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT chk_comments_content_not_blank CHECK (char_length(trim(content)) > 0)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE likes (
        id SERIAL PRIMARY KEY,
        recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_likes_recipe_user UNIQUE (recipe_id, user_id)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE favorites (
        id SERIAL PRIMARY KEY,
        recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_favorites_recipe_user UNIQUE (recipe_id, user_id)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE subscriptions (
        subscriber_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        target_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (subscriber_id, target_user_id),
        CONSTRAINT chk_subscriptions_not_self CHECK (subscriber_id <> target_user_id)
      );
    `);

    await queryRunner.query(`CREATE INDEX idx_recipes_author_id ON recipes(author_id);`);
    await queryRunner.query(`CREATE INDEX idx_recipes_category ON recipes(category);`);
    await queryRunner.query(`CREATE INDEX idx_comments_recipe_id ON comments(recipe_id);`);
    await queryRunner.query(`CREATE INDEX idx_comments_user_id ON comments(user_id);`);
    await queryRunner.query(`CREATE INDEX idx_likes_recipe_id ON likes(recipe_id);`);
    await queryRunner.query(`CREATE INDEX idx_likes_user_id ON likes(user_id);`);
    await queryRunner.query(`CREATE INDEX idx_favorites_recipe_id ON favorites(recipe_id);`);
    await queryRunner.query(`CREATE INDEX idx_favorites_user_id ON favorites(user_id);`);
    await queryRunner.query(`CREATE INDEX idx_subscriptions_target_user_id ON subscriptions(target_user_id);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_subscriptions_target_user_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_favorites_user_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_favorites_recipe_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_likes_user_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_likes_recipe_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_comments_user_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_comments_recipe_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_recipes_category;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_recipes_author_id;`);

    await queryRunner.query(`DROP TABLE IF EXISTS subscriptions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS favorites;`);
    await queryRunner.query(`DROP TABLE IF EXISTS likes;`);
    await queryRunner.query(`DROP TABLE IF EXISTS comments;`);
    await queryRunner.query(`DROP TABLE IF EXISTS recipes;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
    await queryRunner.query(`DROP TYPE IF EXISTS recipe_category_enum;`);
  }
}
