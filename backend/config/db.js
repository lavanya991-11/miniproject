const sql = require('mssql');
const dotenv = require('dotenv');

dotenv.config();

const parseConnectionString = (connectionString) => {
  if (!connectionString) return null;

  const settings = {};
  connectionString.split(';').forEach((entry) => {
    const [rawKey, ...rawValue] = entry.split('=');
    const key = rawKey && rawKey.trim();
    const value = rawValue.join('=').trim();

    if (key) {
      settings[key.toLowerCase()] = value;
    }
  });

  let server = settings.server || settings['data source'] || settings['server name'];
  const database = settings.database || settings['initial catalog'];
  const user = settings['user id'] || settings.uid || settings.user || settings.username;
  const password = settings.password || settings.pwd;
  const encrypt = settings.encrypt === 'true';
  const trustServerCertificate = settings['trust server certificate'] === 'true' || settings['trustservercertificate'] === 'true';
  const port = settings.port || settings['port number'];

  if (!server || !database || !user || !password) {
    return null;
  }

  server = server.replace(/^tcp:/i, '').trim();

  return {
    server: port ? `${server},${port}` : server,
    database,
    user,
    password,
    options: {
      encrypt,
      trustServerCertificate,
    },
  };
};

const buildConfig = () => {
  const connectionString = process.env.DB_CONNECTION_STRING || process.env.MSSQL_CONNECTION_STRING || process.env.SQLSERVER_CONNECTION_STRING;
  const parsedConnectionString = parseConnectionString(connectionString);

  if (parsedConnectionString) {
    return parsedConnectionString;
  }

  const server = process.env.DB_SERVER || process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT;
  const database = process.env.DB_NAME || process.env.DB_DATABASE || 'miniapp';
  const user = process.env.DB_USER || process.env.DB_USERNAME || 'sa';
  const password = process.env.DB_PASSWORD || process.env.DB_PASS || 'YourStrongPassword123!';

  return {
    user,
    password,
    server: port ? `${server},${port}` : server,
    database,
    options: {
      encrypt: process.env.DB_ENCRYPT === 'true',
      trustServerCertificate: true,
    },
  };
};

const config = buildConfig();

const connectDB = async () => {
  try {
    const pool = await sql.connect(config);
    console.log('SQL Server connected successfully');
    return pool;
  } catch (error) {
    console.error('SQL Server connection failed:', error.message);
    throw error;
  }
};

module.exports = { connectDB, sql, config };
