// 引入 Model
const db = require("../models")
const { User, Product, Category } = db

const adminController = {
  // [Read] All Products：
  getProducts: (req, res) => {
    return Product.findAll({
      raw: true,
      nest: true,
      include: [{ model: Category }]
    })
      .then(products => {
        // console.log(restaurants)
        // adminController.js 和 admin[Folder] 同一層
        return res.render("admin/products.hbs", { products: products })
      })
    // return res.render("admin/products.hbs")

  },

  // [Create]新增一筆餐廳資料(1)：render -> create 頁面 [顯示頁面，非功能(POST動作)]
  createProduct: (req, res) => {
    // Category.findAll({
    //   raw: true,
    //   nest: true
    // })
    //   .then(categories => {
    //     return res.render("admin/create.hbs", {
    //       categories: categories
    //     })
    //   })
    return res.render("admin/create.hbs")
  },

  // [Create]新增一筆餐廳資料(2)：create 功能 [POST]
  postProduct: (req, res) => {

  },

  // [Read]瀏覽一筆餐廳資料：動態路由:id -> req.params.id
  getProduct: (req, res) => {

  },

  // [Update]編輯一筆餐廳資料(1)：render -> create 頁面
  editProduct: (req, res) => {

  },

  // [Update／PUT]編輯一筆餐廳資料(2)：Update 功能 [PUT]
  putProduct: (req, res) => {

  },

  // [Delete]刪除一筆餐廳資料：
  deleteProduct: (req, res) => {

  },
  // Authority 設定(1)：set as user/admin
  getUser: (req, res) => {

  },
  // Authority 設定(1)：set as user/admin
  putUser: (req, res) => {

  }
}


module.exports = adminController
