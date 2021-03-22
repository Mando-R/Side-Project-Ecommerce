'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // // 1. User [1] -> [M] Order
      // User.hasMany(models.Order)

      // // 2. isLiked
      // // User [M] -> [M] Product
      // // 注意：User 相關 Passport 套件，所以 Passport.js 新增{model}設定。
      // User.belongsToMany(models.Product, {
      //   through: models.Like,
      //   foreighKey: "UserId",
      //   as: "userLikedProduct"
      // })

      // // 3. 自關聯 (Self-referential Relationships) 或自連接 (Self Joins)
      // // Followship：User[M] <-> User[M]
      // // 注意：User 相關 Passport 套件，所以 Passport.js 新增{model}設定。
      // User.belongsToMany(User, {
      //   through: models.Followship,
      //   // User Model[固定 followingId(FK) -> followerId(FK)] -> User Model(從 following 找 follower)
      //   foreignKey: "followingId",
      //   // 追蹤者
      //   as: "Followers"
      // })

      // User.belongsToMany(User, {
      //   through: models.Followship,
      //   // User Model[固定 followerId(FK) -> followingId(FK)] -> User Model(從 follower 找 following)
      //   foreignKey: "followerId",
      //   // 被追蹤者
      //   as: "Followings"
      // })
    }
  };

  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};