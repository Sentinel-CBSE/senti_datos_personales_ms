import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedEpsAndConstraints1789620625947 implements MigrationInterface {
  name = 'SeedEpsAndConstraints1789620625947';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Restricciones de integridad a nivel de base de datos para los campos tipo-enum.
    // SQL Server no tiene un tipo ENUM nativo; se valida con CHECK ademas de la
    // validacion que ya hace la capa de aplicacion (class-validator).
    await queryRunner.query(`
      ALTER TABLE "personas" ADD CONSTRAINT "CK_personas_tipo_identificacion"
      CHECK ("tipo_identificacion" IN ('CC', 'TI', 'CE', 'PA', 'RC', 'PEP'))
    `);
    await queryRunner.query(`
      ALTER TABLE "personas" ADD CONSTRAINT "CK_personas_tipo_sangre"
      CHECK ("tipo_sangre" IN ('A', 'B', 'AB', 'O'))
    `);
    await queryRunner.query(`
      ALTER TABLE "personas" ADD CONSTRAINT "CK_personas_factor_rh"
      CHECK ("factor_rh" IN ('+', '-'))
    `);

    // Catalogo semilla de EPS (Entidades Promotoras de Salud) en Colombia.
    await queryRunner.query(`
      INSERT INTO "eps" ("codigo", "nombre") VALUES
        ('EPS001', 'Nueva EPS'),
        ('EPS002', 'Sura EPS'),
        ('EPS003', 'Sanitas EPS'),
        ('EPS004', 'Compensar EPS'),
        ('EPS005', 'Famisanar EPS'),
        ('EPS006', 'Salud Total EPS'),
        ('EPS007', 'Coosalud EPS'),
        ('EPS008', 'Mutual Ser EPS'),
        ('EPS009', 'Aliansalud EPS'),
        ('EPS010', 'Comfenalco Valle EPS'),
        ('EPS011', 'Capital Salud EPS'),
        ('EPS012', 'Savia Salud EPS'),
        ('EPS013', 'Emssanar EPS'),
        ('EPS014', 'Asmet Salud EPS'),
        ('EPS015', 'Comfama EPS')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "eps"`);
    await queryRunner.query(`ALTER TABLE "personas" DROP CONSTRAINT "CK_personas_factor_rh"`);
    await queryRunner.query(`ALTER TABLE "personas" DROP CONSTRAINT "CK_personas_tipo_sangre"`);
    await queryRunner.query(
      `ALTER TABLE "personas" DROP CONSTRAINT "CK_personas_tipo_identificacion"`,
    );
  }
}
