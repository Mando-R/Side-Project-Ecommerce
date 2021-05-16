// 引入 Model
const db = require("../models")
const { User, Product, Category, Cart } = db

// Pagination
// amountPerPage：限制每頁筆數，避免 magic number(未命名數字)。
const amountPerPage = 20

const productController = {
  // [Read] products
  getProducts: (req, res) => {
    // Pagination
    // offset：每次開始計算新一頁時，偏移(換頁)的數量
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * amountPerPage
    }

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

    // Product.findAll({
    Product.findAndCountAll({
      include: [{ model: Category }],
      // where(Category／categoryId)：where 篩選，須為物件{}。
      where: whereQuery,
      // Pagination
      offset: offset,
      limit: amountPerPage
    })
      // results = 篩選後的 products
      .then(results => {
        // Pagination
        // 1. 若||左為 false 或 undefined，取||右值(Page 1)。
        const thePage = Number(req.query.page) || 1
        // 2. findAndCountAll 撈 Data 後： 
        // (1)maxPages(最大頁數) = Math.ceil 無條件進位(result.count 餐廳總筆數／pageLimit 每頁筆數)
        const maxPages = Math.ceil(results.count / amountPerPage)

        // (2)totalPage(總頁數)：Array.from({length：maxPages最大頁數})產生符合長度的Array，map 代入真正數字(index＋1)，index 從 0 開始計算，所以+1。
        const totalPage = Array.from({ length: maxPages }).map((item, index) => index + 1)

        //(3)？(三元條件運算子)：前列條件式？True執行式：False執行式
        const prevPage = thePage - 1 < 1 ? 1 : thePage - 1
        const nextPage = thePage + 1 > maxPages ? maxPages : thePage + 1

        // .map() ：建立新 Array
        // const data = products.map(product => ({
        const data = results.rows.map(product => ({
          ...product.dataValues,
          // 注意：前面不可加 raw: true，否則不能新增新屬性(如categoryName)。
          categoryName: product.Category.name,

          // isLiked 屬性：User [M] -> [M] Product
          // 注意：passport.js 設定 passport.deserializeUser[Eager Loading] 放入 req.user(isLiked)
          isLiked: req.user.userFindProducts.map(userFindProduct => userFindProduct.id).includes(product.dataValues.id)
        }))

        // console.log("data", data)
        // console.log("======================")

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
              categoryId: categoryId,

              // Pagination
              thePage: thePage,
              totalPage: totalPage,
              prevPage: prevPage,
              nextPage: nextPage
            })
          })
      })
  },

  getProduct: (req, res) => {
    return Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        // isLiked：User [M] -> [M] Product
        { model: User, as: "productFindUsers" }
      ]
    })
      .then(product => {
        // console.log("req.params.id", req.params.id)
        // console.log("================")
        // console.log("product", product)
        // console.log("================")
        // console.log("product.productFindUsers", product.productFindUsers)

        // isLiked
        // Passport套件的req.user，其內部有一陣列[] userFindProducts，該陣列[]包含多筆 Product資料物件{} (命名為單數 userFindProduct) ，若該陣列[]內每一筆物件userFindProduct的id，includes() 原本 Database內Product Table的id，則 return TRUE，反之為False。
        const isLiked = product.productFindUsers.map(productFindUser => productFindUser.id).includes(req.user.id)

        return res.render("product.hbs", {
          product: product.toJSON(),
          // product: product,
          isLiked: isLiked
        })
      })
  },

}


module.exports = productController

