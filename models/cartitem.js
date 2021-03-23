'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {

    }
  };
  CartItem.init({
    quantity: DataTypes.INTEGER,
    Cart_Id: DataTypes.INTEGER,
    Product_Id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CartItem',
  });
  return CartItem;
};