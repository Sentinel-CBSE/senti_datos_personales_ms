import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPersonasForFirebaseUid1789620625948 implements MigrationInterface {
  name = 'AlterPersonasForFirebaseUid1789620625948';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop FK de contactos_emergencia → personas (nombre puede variar)
    await queryRunner.query(`
      DECLARE @fk NVARCHAR(256)
      SELECT @fk = name FROM sys.foreign_keys
        WHERE parent_object_id = OBJECT_ID('contactos_emergencia')
          AND referenced_object_id = OBJECT_ID('personas')
      IF @fk IS NOT NULL EXEC('ALTER TABLE contactos_emergencia DROP CONSTRAINT [' + @fk + ']')
    `);

    // 2. Drop FK de personas → eps (si existe)
    await queryRunner.query(`
      DECLARE @fk NVARCHAR(256)
      SELECT @fk = name FROM sys.foreign_keys
        WHERE parent_object_id = OBJECT_ID('personas')
          AND referenced_object_id = OBJECT_ID('eps')
      IF @fk IS NOT NULL EXEC('ALTER TABLE personas DROP CONSTRAINT [' + @fk + ']')
    `);

    // 3. Quitar columnas viejas de personas (si existen)
    await queryRunner.query(`
      IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('personas') AND name = 'eps_id')
        ALTER TABLE personas DROP COLUMN eps_id
    `);
    await queryRunner.query(`
      IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('personas') AND name = 'nombre')
        ALTER TABLE personas DROP COLUMN nombre
    `);
    await queryRunner.query(`
      IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('personas') AND name = 'correo') BEGIN
        DECLARE @uq NVARCHAR(256)
        SELECT @uq = name FROM sys.key_constraints
          WHERE type = 'UQ' AND parent_object_id = OBJECT_ID('personas')
            AND name LIKE '%correo%'
        IF @uq IS NOT NULL EXEC('ALTER TABLE personas DROP CONSTRAINT [' + @uq + ']')
        ALTER TABLE personas DROP COLUMN correo
      END
    `);
    await queryRunner.query(`
      IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('personas') AND name = 'tipo_identificacion')
        ALTER TABLE personas DROP COLUMN tipo_identificacion
    `);
    await queryRunner.query(`
      IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('personas') AND name = 'numero_identificacion')
        ALTER TABLE personas DROP COLUMN numero_identificacion
    `);

    // 4. Agregar columna eps (si no existe)
    await queryRunner.query(`
      IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('personas') AND name = 'eps')
        ALTER TABLE personas ADD eps nvarchar(150) NULL
    `);

    // 5. Cambiar personas.id de uniqueidentifier a nvarchar(128) (si aplica)
    await queryRunner.query(`
      IF EXISTS (
        SELECT 1 FROM sys.columns
        WHERE object_id = OBJECT_ID('personas') AND name = 'id'
          AND system_type_id = TYPE_ID('uniqueidentifier')
      )
      BEGIN
        -- Quitar constraint DEFAULT (NEWSEQUENTIALID)
        DECLARE @def NVARCHAR(256)
        SELECT @def = dc.name FROM sys.default_constraints dc
          JOIN sys.columns c ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
          WHERE c.object_id = OBJECT_ID('personas') AND c.name = 'id'
        IF @def IS NOT NULL EXEC('ALTER TABLE personas DROP CONSTRAINT [' + @def + ']')

        -- Quitar PK
        DECLARE @pk NVARCHAR(256)
        SELECT @pk = name FROM sys.key_constraints
          WHERE type = 'PK' AND parent_object_id = OBJECT_ID('personas')
        IF @pk IS NOT NULL EXEC('ALTER TABLE personas DROP CONSTRAINT [' + @pk + ']')

        -- Cambiar tipo de columna
        ALTER TABLE personas ALTER COLUMN id nvarchar(128) NOT NULL

        -- Re-agregar PK
        ALTER TABLE personas ADD CONSTRAINT PK_personas PRIMARY KEY (id)
      END
    `);

    // 6. Cambiar contactos_emergencia.persona_id de uniqueidentifier a nvarchar(128) (si aplica)
    await queryRunner.query(`
      IF EXISTS (
        SELECT 1 FROM sys.columns
        WHERE object_id = OBJECT_ID('contactos_emergencia') AND name = 'persona_id'
          AND system_type_id = TYPE_ID('uniqueidentifier')
      )
        ALTER TABLE contactos_emergencia ALTER COLUMN persona_id nvarchar(128) NOT NULL
    `);

    // 7. Re-agregar FK contactos_emergencia → personas
    await queryRunner.query(`
      IF NOT EXISTS (
        SELECT 1 FROM sys.foreign_keys
          WHERE parent_object_id = OBJECT_ID('contactos_emergencia')
            AND referenced_object_id = OBJECT_ID('personas')
      )
        ALTER TABLE contactos_emergencia ADD CONSTRAINT FK_db2277420a4be100dd282927d27
          FOREIGN KEY (persona_id) REFERENCES personas(id) ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir es destructivo (cambiar nvarchar a uniqueidentifier perdería datos de Firebase UIDs)
    // Se deja vacío intencionalmente
  }
}
