const sequelize = require('../config/database');
const User = require('./User');
const Rate = require('./Rate');
const WorkEntry = require('./WorkEntry');

User.hasMany(WorkEntry, {
  foreignKey: 'created_by',
  as: 'work_entries'
});

WorkEntry.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'creator'
});

module.exports = {
  sequelize,
  User,
  Rate,
  WorkEntry
};
