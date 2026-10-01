import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedEpsAndConstraints1789620625947 implements MigrationInterface {
  name = 'SeedEpsAndConstraints1789620625947';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "personas" ADD CONSTRAINT "CK_personas_tipo_sangre"
      CHECK ("tipo_sangre" IN ('A', 'B', 'AB', 'O'))
    `);
    await queryRunner.query(`
      ALTER TABLE "personas" ADD CONSTRAINT "CK_personas_factor_rh"
      CHECK ("factor_rh" IN ('+', '-'))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "personas" DROP CONSTRAINT "CK_personas_factor_rh"`);
    await queryRunner.query(`ALTER TABLE "personas" DROP CONSTRAINT "CK_personas_tipo_sangre"`);
  }
}
