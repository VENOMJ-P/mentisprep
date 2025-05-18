import db from "../db/index.js";
const { User } = db;

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findByUsername(username) {
    return await User.findOne({
      where: { username },
      raw: true,
    });
  }

  async findById(id) {
    return await User.findByPk(id, {
      attributes: [
        "id",
        "username",
        "firstname",
        "lastname",
        "age",
        "createdAt",
      ],
      raw: true,
    });
  }
}

export default UserRepository;
