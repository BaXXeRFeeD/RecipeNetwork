import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRoles1760100000000 implements MigrationInterface {
  name = 'AddUserRoles1760100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE user_role_enum AS ENUM ('user', 'admin');
    `);

    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN role user_role_enum NOT NULL DEFAULT 'user';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      DROP COLUMN IF EXISTS role;
    `);

    await queryRunner.query(`
      DROP TYPE IF EXISTS user_role_enum;
    `);
  }
}
