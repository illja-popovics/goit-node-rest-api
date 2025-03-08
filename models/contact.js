import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';

const Contact = sequelize.define(
  'Contact',
  {
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
  },
  {
    tableName: 'contacts', // 👈 Force lowercase table name
    timestamps: true, // Enables "createdAt" & "updatedAt" columns
  }
);

export default Contact;
