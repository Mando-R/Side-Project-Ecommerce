'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {

    }
  };
  OrderItem.init({
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    Order_Id: DataTypes.INTEGER,
    Product_Id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'OrderItem',
  });
  return OrderItem;
};