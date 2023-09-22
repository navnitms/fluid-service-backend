import { getEnvValue, getNumericValue } from './env.property.provider';

export const configuration = {
  server: {
    port: getNumericValue('SERVER_PORT'),
    env: getEnvValue('ENVIRONMENT'),
  },
  db: {
    type: 'postgres',
    database: getEnvValue('DB_NAME'),
    username: getEnvValue('DB_USER'),
    password: getEnvValue('DB_PASSWORD'),
    host: getEnvValue('DB_HOST'),
    port: getNumericValue('DB_PORT'),
    logging: true,
  },
  jwt: {
    jwtExpiry: getNumericValue('JWT_TOKEN_EXP_TIME'),
    refreshExpiry: getNumericValue('JWT_REFRESH_TOKEN_EXP_TIME'),
    secret: getEnvValue('JWT_SECRET'),
  },
  aws: {
    bucket: getEnvValue('AWS_BUCKET'),
    s3Url: getEnvValue('AWS_S3_URL'),
    region: getEnvValue('AWS_S3_REGION', 'ap-south-1'),
    expiry: getNumericValue('AWS_EXPIRY'),
    accessKey: getEnvValue('AWS_ACCESS_KEY_ID'),
    secret: getEnvValue('AWS_SECRET_ACCESS_KEY'),
  },
  defaultTenantId: getEnvValue('DEFAULT_TENANT'),
};
