import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subscription: {
    type: DataTypes.ENUM,
    values: ['starter', 'pro', 'business'],
    defaultValue: 'starter',
  },
  token: {
    type: DataTypes.STRING,
    defaultValue: null,
    },
  avatarURL: {
    type: DataTypes.STRING,  // Store avatar URL
    allowNull: true,
    },
  verify: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Нове поле для верифікації
  },
  verificationToken: {
    type: DataTypes.STRING, // Токен для верифікації
  },
});

export default User;
