import { config } from 'dotenv';

config();

export default class AppConfig {
  static readonly PORT = parseInt(process.env.PORT || '3011');
  static readonly DB_HOST = process.env.DB_HOST || 'localhost';
  static readonly DB_PORT = parseInt(process.env.DB_PORT || '5432');
  static readonly DB_USERNAME = process.env.DB_USERNAME || 'postgres';
  static readonly DB_PASSWORD = process.env.DB_PASSWORD || 'Tho2003@';
  static readonly DATABASE_NAME =
    process.env.DATABASE_NAME || 'tutor_test_grading';
  static readonly JWT_SECRET = process.env.JWT_SECRET || 'tutor';
  static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
  static readonly GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  static readonly GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  static readonly REDIRECT_URL = process.env.REDIRECT_URL;
  static readonly REFRESH_TOKEN = process.env.REFRESH_TOKEN;
  static readonly FOLDER_ID = process.env.FOLDER_ID;
}
