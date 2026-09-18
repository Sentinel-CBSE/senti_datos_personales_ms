import AppDataSource from './data-source';

async function run() {
  const dataSource = await AppDataSource.initialize();
  await dataSource.runMigrations();
  await dataSource.destroy();
}

run()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Migraciones ejecutadas correctamente.');
    process.exit(0);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Error ejecutando migraciones:', error);
    process.exit(1);
  });
