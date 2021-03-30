// 引入 faker：Fake Data
const faker = require("faker")

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // bulkInsert()：Insert records into a table.
    // 用陣列形式，將 Restaurant 物件傳入 MySQL Database。
    await queryInterface.bulkInsert("Products",
      // Array.from({ length: 200 })：建立長度為 200 的陣列
      Array.from({ length: 200 })
        // map(item, index, array)：讓長度為 200 的陣列，其中每一元素皆對應一個 "product 物件{Data}"，並回傳一個新 Array[]。
        .map((item, index, array) => (
          {
            // faker：產生 fake Data，如 name、tel、address、description。
            name: faker.name.findName(),
            price: faker.commerce.price(),
            description: faker.lorem.text(),

            image: `https://loremflickr.com/320/240/electricvehicle?random=${Math.random() * 100}`,

            quantity: Math.floor(Math.random() * 11) * 10,

            // 對應 Category Seeder
            CategoryId: Math.floor(Math.random() * 7) * 10 + 1,

            createdAt: new Date(),
            updatedAt: new Date(),
          }
        )
        ), {})
  },

  down: async (queryInterface, Sequelize) => {
    // bulkDelete()：Delete records from a table
    await queryInterface.bulkDelete("Products", null, {});
  }
};
