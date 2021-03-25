const db = require("../models")
const { Category } = db

const categoryController = {
  // [Read]瀏覽 Category
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    })
      .then(categories => {
        return res.render("admin/categories.hbs", { categories: categories })
      })
  },

  // [Create]新增 Category
  postCategory: (req, res) => {

  },

  // [Update]修改 Category
  putCategory: (req, res) => {

  },

  // [Delete]刪除 Category
  deleteCategory: (req, res) => {

  }
}

module.exports = categoryController
