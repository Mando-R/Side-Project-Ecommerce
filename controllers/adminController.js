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
    if (!req.body.name) {
      req.flash("error_messages", `Name didn't exist`)
      // 注意：res.redirect("back")：
      // POST 動作結束後，若未填 name，則導回原 create 頁面("admin/create")。
      return res.redirect("back")
    }

    // destructuring(解構賦值)：const file = req.file
    const { file } = req
    // 1. 若有圖片：
    if (file) {
      // 2. 呼叫 imgur  API
      imgur.setClientID(IMGUR_CLIENT_ID);

      // 3. 圖片直接從暫存資料夾上傳上去，
      // .upload(file.path,...)：上傳至 file.path(指令位置)。
      // img：上傳完的圖片。
      imgur.upload(file.path, (err, img) => {
        // 4. 把這個網址放到資料庫裡。
        return Product.create({
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          quantity: req.body.quantity,
          // img.fata.link：取得上傳圖片後的 URL。上傳成功後 http://img.data.link/ 會是剛剛上傳後拿到的圖片網址。
          image: file ? img.data.link : null,
          CategoryId: req.body.CategoryId
        })
          .then(product => {
            req.flash('success_messages', 'product was successfully created')

            return res.redirect('/admin/products')
          })
      })
    }
    else {
      // Product Model 建立一個新 product，並將表單傳來的資料(req.body.XXX)填入新的 product
      return Product.create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        image: null,
        CategoryId: req.body.CategoryId
      })
        .then(product => {
          req.flash('success_messages', 'product was successfully created')
          // 重新導回後台首頁，立即看到新增後的結果。
          return res.redirect('/admin/products')
        })
    }
  },

  // [Read]瀏覽一個 Product：動態路由:id -> req.params.id
  getProduct: (req, res) => {
    // req.params.id：從 Route 傳過來的參數
    return Product.findByPk(req.params.id, {
      include: [{ model: Category }]
    })
      .then(product => {
        // console.log(restaurant)
        return res.render("admin/product.hbs", { product: product.toJSON() })
      })
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
