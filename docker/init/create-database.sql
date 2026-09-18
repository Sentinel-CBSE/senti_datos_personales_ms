IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'senti_datos_personales_db')
BEGIN
    CREATE DATABASE senti_datos_personales_db;
END
GO
