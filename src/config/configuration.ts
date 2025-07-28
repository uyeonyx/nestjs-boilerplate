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
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL || '60000', 10), // 1분
    limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10), // 1분당 100회
  },
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
    credentials: process.env.CORS_CREDENTIALS === 'true',
    methods: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS || 'Content-Type, Accept, Authorization',
  },
  security: {
    helmet: {
      enabled: process.env.HELMET_ENABLED !== 'false', // 기본값: true
    },
  },
});
