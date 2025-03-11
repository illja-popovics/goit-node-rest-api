import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  favorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,  
  },
  owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'contacts',
  timestamps: false,
});

export default Contact;
