'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      // Cart [M] -> [M] Product 
      Cart.belongsToMany(models.Product, {
        through: models.CartItem,
        foreignKey: "Cart_Id",
        as: "cartFindProduct"
      })
    }
  };
  Cart.init({
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};