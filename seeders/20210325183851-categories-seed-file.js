'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories',
      ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5", "Category 6", "Category 7"]
        .map((item, index) =>
        ({
          // 考慮遠端資料庫佈署使用 clearDB，而 clearDB 的 id 跳號採用間隔設計。
          // 因此計算資料 id 時，採用 clearDB 一致設計，即每次跳號間隔為 10。
          id: index * 10 + 1,
          name: item,

          createdAt: new Date(),
          updatedAt: new Date()
        })
        ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {})
  }
};
