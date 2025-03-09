import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, 
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Sync database (Create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

export default sequelize;
