import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Sequelize from "sequelize";
import dbConfig from "../configs/db.config.js";
import initUserModel from "./models/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename + "");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const User = initUserModel(sequelize);
db.User = User;

// Set up associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
// };

// // Execute the async function immediately
// await loadModels();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
