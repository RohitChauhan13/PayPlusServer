const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { WORK_FIELDS } = require('../constants/workFields');

const columns = {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
};

for (const field of WORK_FIELDS) {
  columns[field] = {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  };

  columns[`${field}_payment_type`] = {
    type: DataTypes.ENUM('online', 'cash'),
    allowNull: false,
    defaultValue: 'cash'
  };
}

columns.total_amount = {
  type: DataTypes.DECIMAL(14, 2),
  allowNull: false,
  defaultValue: 0
};

columns.total_commission = {
  type: DataTypes.DECIMAL(14, 2),
  allowNull: false,
  defaultValue: 0
};

columns.online_amount = {
  type: DataTypes.DECIMAL(14, 2),
  allowNull: false,
  defaultValue: 0
};

columns.online_net_amount = {
  type: DataTypes.DECIMAL(14, 2),
  allowNull: false,
  defaultValue: 0
};

columns.cash_amount = {
  type: DataTypes.DECIMAL(14, 2),
  allowNull: false,
  defaultValue: 0
};

columns.salary_amount = {
  type: DataTypes.DECIMAL(14, 2),
  allowNull: false,
  defaultValue: 0
};

columns.remaining_amount = {
  type: DataTypes.DECIMAL(14, 2),
  allowNull: false,
  defaultValue: 0
};

columns.created_by = {
  type: DataTypes.INTEGER.UNSIGNED,
  allowNull: false
};

const WorkEntry = sequelize.define('WorkEntry', columns, {
  tableName: 'work_entries'
});

module.exports = WorkEntry;
