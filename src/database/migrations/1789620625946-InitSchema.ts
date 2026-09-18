import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1789620625946 implements MigrationInterface {
    name = 'InitSchema1789620625946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "eps" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_5da8e3a0bc18f9b646d8b5e1a74" DEFAULT NEWSEQUENTIALID(), "codigo" varchar(20) NOT NULL, "nombre" nvarchar(150) NOT NULL, "activo" bit NOT NULL CONSTRAINT "DF_075588219caaab3814b8d599e70" DEFAULT 1, CONSTRAINT "UQ_ff795e0aaf28ef8f96859ed2e4c" UNIQUE ("codigo"), CONSTRAINT "UQ_e05d704e872abcc5e6f3980155d" UNIQUE ("nombre"), CONSTRAINT "PK_5da8e3a0bc18f9b646d8b5e1a74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contactos_emergencia" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_ab94724bf63907a98709212230d" DEFAULT NEWSEQUENTIALID(), "persona_id" uniqueidentifier NOT NULL, "nombre" nvarchar(150) NOT NULL, "telefono" varchar(20) NOT NULL, "parentesco" nvarchar(50) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_45f567bc75e6b2dec4e7ddf6dc8" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_867aad07f3df2312f2d5644c2c2" DEFAULT getdate(), CONSTRAINT "PK_ab94724bf63907a98709212230d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "personas" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_714aa5d028f8f3e6645e971cecd" DEFAULT NEWSEQUENTIALID(), "nombre" nvarchar(150) NOT NULL, "correo" nvarchar(150) NOT NULL, "tipo_identificacion" varchar(3) NOT NULL, "numero_identificacion" varchar(20) NOT NULL, "tipo_sangre" varchar(2) NOT NULL, "factor_rh" varchar(1) NOT NULL, "eps_id" uniqueidentifier NOT NULL, "activo" bit NOT NULL CONSTRAINT "DF_fb7a291b1ba766f4575c273947a" DEFAULT 1, "created_at" datetime2 NOT NULL CONSTRAINT "DF_67956a010e1f55a888e47c5cd78" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_a64444f85d6d624d65a8854f7c6" DEFAULT getdate(), CONSTRAINT "UQ_ff907fe5bec1743e6bac9eedc9a" UNIQUE ("correo"), CONSTRAINT "UQ_8e8ac90cef787f9db0ec47a8ec5" UNIQUE ("numero_identificacion"), CONSTRAINT "PK_714aa5d028f8f3e6645e971cecd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contactos_emergencia" ADD CONSTRAINT "FK_db2277420a4be100dd282927d27" FOREIGN KEY ("persona_id") REFERENCES "personas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "personas" ADD CONSTRAINT "FK_8bdffaf3ceea73b8658dbd0bfe1" FOREIGN KEY ("eps_id") REFERENCES "eps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "personas" DROP CONSTRAINT "FK_8bdffaf3ceea73b8658dbd0bfe1"`);
        await queryRunner.query(`ALTER TABLE "contactos_emergencia" DROP CONSTRAINT "FK_db2277420a4be100dd282927d27"`);
        await queryRunner.query(`DROP TABLE "personas"`);
        await queryRunner.query(`DROP TABLE "contactos_emergencia"`);
        await queryRunner.query(`DROP TABLE "eps"`);
    }

}
