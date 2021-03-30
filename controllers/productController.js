// 引入 Model
const db = require("../models")
const { User, Product, Category } = db

const productController = {
  // [Read] products
  getProducts: (req, res) => {
    Product.findAll({
      include: [{ model: Category }]
    })
      .then(results => {
        // .map() ：建立新 Array
        const data = results.map(product => ({
          ...product.dataValues,
          // 注意：前面不可加 raw: true，否則不能新增新屬性(如categoryName)。
          categoryName: product.Category.name
        }))

        return res.render("products.hbs", {
          products: data
        })
      })
  }
}


module.exports = productController

