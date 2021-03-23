'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Product [M] -> [M] Order
      Product.belongsToMany(models.Order, {
        through: models.OrderItem,
        foreignKey: "Product_Id",
        as: "productFindOrder"
      })

      // Product [M] -> [M] Cart
      Product.belongsToMany(models.Cart, {
        through: models.CartItem,
        foreignKey: "Product_Id",
        as: "productFindCart"
      })

      // Product [M] -> [M] User
      Product.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: "Product_Id",
        as: "productFindUser"
      })
    }
  };
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    Category_Id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};