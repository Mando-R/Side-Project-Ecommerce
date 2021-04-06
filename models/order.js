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
        foreignKey: "OrderId",
        as: "orderFindProducts"
      })

    }
  };
  Order.init({
    // serialNumber: DataTypes.INTEGER,
    serialNumber: DataTypes.STRING,

    amount: DataTypes.INTEGER,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    shipping_status: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};