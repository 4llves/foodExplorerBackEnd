const path = require('path')

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      // buscar onde esta o banco de dados
      filename: path.resolve(__dirname, 'src', 'database', 'database.db'),
    },
    migrations: {
      directory: path.resolve(
        __dirname,
        'src',
        'database',
        'knex',
        'migrations',
      ),
    },
    useNullAsDefault: true,
  },
}
