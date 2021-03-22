// 引入 Restaurant Model
// const db = require("../models")
// const favorite = require("../models/favorite")
// const { Restaurant, Category, Comment, User, Favorite } = db

// Pagination：避免「magic number」(未命名數字)
// Pagination：amountPerPage 限制每頁顯示筆數
const amountPerPage = 10

// 抽取 req 處理程序至 controller 內。
const productController = {
  // [Read]瀏覽 全部 餐廳
  getProducts: (req, res) => {
    return res.render("products.hbs")

  },

  // [Read]瀏覽 單一 餐廳
  getRestaurant: (req, res) => {

  },

  // Dashboard
  getDashboard: (req, res) => {

  },

  // Top 10 Favorited Restaurants
  getTopRest: (req, res) => {

  },

  getFeeds: (req, res) => {

  }

}


module.exports = productController



