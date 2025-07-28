import { registerAs } from '@nestjs/config';

export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
});
