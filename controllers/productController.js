// 引入 Model
const db = require("../models")
const { User, Product, Category } = db

const productController = {
  // [Read] products
  getProducts: (req, res) => {
    // whereQuery = {}：建立傳入 findAll 的參數，包裝成物件{}。
    const whereQuery = {}
    // 空 String：放入 whereQuery = {} 內的 function
    let categoryId = ""
    // 對照 products.hbs 的 href="?categoryId={{this.id}}：若 request 內含 categoryId
    if (req.query.categoryId) {
      // 將 req.query.categoryId 從 String 轉成 Nunber，才能傳入 Sequelize 的 findAll()的 where 參數。
      categoryId = Number(req.query.categoryId)
      // 將 categoryId 存入 whereQuery 物件{}。
      whereQuery.categoryId = categoryId
    }

    Product.findAll({
      include: [{ model: Category }],
      // where(Category／categoryId)：where 篩選，須為物件{}。
      where: whereQuery
    })
      .then(products => {
        // .map() ：建立新 Array
        const data = products.map(product => ({
          ...product.dataValues,
          // 注意：前面不可加 raw: true，否則不能新增新屬性(如categoryName)。
          categoryName: product.Category.name
        }))

        // 找出全部 Category
        Category.findAll({
          raw: true,
          nest: true
        })
          .then(categories => {
            // console.log("categories", categories)
            // console.log("======================")
            return res.render("products.hbs", {
              products: data,
              categories: categories,
              // categoryId = Number(req.query.categoryId) 回傳 views
              categoryId: categoryId
            })
          })
      })
  },

  getProduct: (req, res) => {
    return Product.findByPk(req.params.id, {
      include: [{ model: Category }]
    })
      .then(product => {
        return res.render("product.hbs", {
          product: product.toJSON()
        })
      })
  }

}


module.exports = productController

