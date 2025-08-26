import dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

console.log(`Environment Loaded: ${process.env.NODE_ENV || 'development'}`);

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET_KEY', 'EMAIL', 'PASSWORD'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Error: ${varName} is not set in ${envFile}`);
    process.exit(1);
  }
});

export default {
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_ADMIN_SECRET_KEY: process.env.JWT_ADMIN_SECRET_KEY,
  EMAIL: process.env.EMAIL,
  PASSWORD: process.env.PASSWORD,
};