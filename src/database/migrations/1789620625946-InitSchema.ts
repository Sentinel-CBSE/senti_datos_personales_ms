import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1789620625946 implements MigrationInterface {
    name = 'InitSchema1789620625946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contactos_emergencia" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_ab94724bf63907a98709212230d" DEFAULT NEWSEQUENTIALID(), "persona_id" nvarchar(128) NOT NULL, "nombre" nvarchar(150) NOT NULL, "telefono" varchar(20) NOT NULL, "parentesco" nvarchar(50) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_45f567bc75e6b2dec4e7ddf6dc8" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_867aad07f3df2312f2d5644c2c2" DEFAULT getdate(), CONSTRAINT "PK_ab94724bf63907a98709212230d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "personas" ("id" nvarchar(128) NOT NULL, "nombre" nvarchar(150) NOT NULL, "correo" nvarchar(150) NOT NULL, "tipo_sangre" varchar(2) NULL, "factor_rh" varchar(1) NULL, "eps" nvarchar(150) NULL, "activo" bit NOT NULL CONSTRAINT "DF_fb7a291b1ba766f4575c273947a" DEFAULT 1, "created_at" datetime2 NOT NULL CONSTRAINT "DF_67956a010e1f55a888e47c5cd78" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_a64444f85d6d624d65a8854f7c6" DEFAULT getdate(), CONSTRAINT "UQ_ff907fe5bec1743e6bac9eedc9a" UNIQUE ("correo"), CONSTRAINT "PK_personas" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contactos_emergencia" ADD CONSTRAINT "FK_db2277420a4be100dd282927d27" FOREIGN KEY ("persona_id") REFERENCES "personas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contactos_emergencia" DROP CONSTRAINT "FK_db2277420a4be100dd282927d27"`);
        await queryRunner.query(`DROP TABLE "personas"`);
        await queryRunner.query(`DROP TABLE "contactos_emergencia"`);
    }

}
