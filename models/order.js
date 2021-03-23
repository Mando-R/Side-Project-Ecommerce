'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Order [M] -> [1] User
      Order.belongsTo(models.User)

      // Order [1] -> [M] Payment
      Order.hasMany(models.Payment)

      // Order [M] -> [M] Product
      Order.belongsToMany(models.Product, {
        through: models.OrderItem,
        foreignKey: "Order_Id",
        as: "orderFindProduct"
      })
    }
  };
  Order.init({
    serialNumber: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    shipping_status: DataTypes.STRING,
    User_Id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};