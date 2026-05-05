const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');

    if (env.dbSync) {
      await sequelize.sync({ alter: env.dbAlter });
      console.log('Database models synchronized');
    }

    app.listen(env.port, () => {
      console.log(`PayPlus API running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
