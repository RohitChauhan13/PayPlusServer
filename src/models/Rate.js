const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { WORK_FIELDS } = require('../constants/workFields');

const columns = {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  }
};

for (const field of WORK_FIELDS) {
  columns[`${field}_rate`] = {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  };
  columns[`${field}_commission`] = {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  };
}

const Rate = sequelize.define('Rate', columns, {
  tableName: 'rates'
});

module.exports = Rate;
