const graphileMigrateConfig = {
  connectionString: process.env.POSTGRES_URL,
  migrationsFolder: "src/migrations",
};

module.exports = graphileMigrateConfig;
