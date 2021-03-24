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

  // [Create] Single Product (1)：render -> create 頁面 [顯示頁面，非功能(POST動作)]
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

  // [Create] Single Product (2)：create 功能 [POST]
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
            req.flash("success_messages", `Product [ ${product.name} ] was successfully created`)

            return res.redirect("/admin/products")
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
          req.flash("success_messages", `Product [ ${product.name} ] was successfully created`)
          // 重新導回後台首頁，立即看到新增後的結果。
          return res.redirect("/admin/products")
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

  // [Edit/Update] Single Product (1)：view 和 create 共用
  editProduct: (req, res) => {
    console.log("req.params.id", req.params.id)

    return Product.findByPk(req.params.id, {
      // raw: true,
      // nest: true
    })
      .then(product => {
        console.log("product", product)

        return res.render("admin/create.hbs", { product: product.toJSON() })
      })

    // Category.findAll({
    //   raw: true,
    //   nest: true
    // })
    //   .then(categories => {
    //     return Product.findByPk(req.params.id)
    //       .then(product => {
    //         // 注意：render -> admin/create 頁面。
    //         // [Update]和[Create]表單類似，所以在[Create]表單做一點修改，之後只需維護一個表單！
    //         return res.render("admin/create.hbs", {
    //           categories: categories,
    //           product: product.toJSON()
    //         })
    //       })
    //   })
  },

  // [Edit/Update] Single Product (2)
  // upload.single("image")：multer 只要 req 內有圖片檔，就自動複製檔案至 temp 資料夾內。
  putProduct: (req, res) => {
    if (!req.body.name) {
      req.flash("error_messages", `Name didn't exist`)
      return res.redirect("back")
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Product.findByPk(req.params.id)
          .then(product => {
            product.update({
              name: req.body.name,
              description: req.body.description,
              price: req.body.price,
              quantity: req.body.quantity,
              image: file ? img.data.link : product.image,
              CategoryId: req.body.CategoryId
            })
              .then(product => {
                req.flash("success_messages", `Product [ ${product.name} ] was successfully updated`)

                res.redirect("/admin/products")
              })
          })
      })
    }
    else {
      return Product.findByPk(req.params.id)
        .then(product => {
          // restaurant.update：Update 資料
          product.update({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            image: file ? img.data.link : product.image,
            CategoryId: req.body.CategoryId
          })
            .then(product => {
              req.flash("success_messages", `Product [ ${product.name} ] was successfully updated`)

              res.redirect("/admin/products")
            })
        })
    }
  },

  // [Delete]刪除一筆餐廳資料：
  deleteProduct: (req, res) => {
    return Product.findByPk(req.params.id)
      .then(product => {
        // restaurant.destroy()：刪除
        product.destroy()
          .then(product => {
            req.flash("success_messages", `Product [ ${product.name} ] was successfully deleted`)
            res.redirect("/admin/products")
          })
      })
  },
  // Authority 設定(1)：set as user/admin
  getUser: (req, res) => {

  },
  // Authority 設定(1)：set as user/admin
  putUser: (req, res) => {

  }
}


module.exports = adminController
