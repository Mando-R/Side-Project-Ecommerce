// 引入 Model
const db = require("../models")
const { User, Product, Category } = db

// 引入 multer 套件的 fs 模組
const fs = require("fs")
const { userInfo } = require("os")

// 引入 imgur 套件：整合第三方 Imgur API
const imgur = require("imgur-node-api")
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID  // Client ID -> .env(隱藏敏感資訊)


const adminController = {
  // [Read] All Products：
  getProducts: (req, res) => {
    return Product.findAll({
      raw: true,
      nest: true,
      include: [{ model: Category }]
    })
      .then(products => {
        // adminController.js 和 admin[Folder] 同一層
        return res.render("admin/products.hbs", { products: products })
      })
  },

  // [Create] Single Product (1)：render -> create 頁面 [顯示頁面，非功能(POST動作)]
  createProduct: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    })
      .then(categories => {
        return res.render("admin/create.hbs", {
          categories: categories
        })
      })
  },

  // [Create] Single Product (2)：create 功能 [POST]
  postProduct: (req, res) => {
    if (!req.body.name) {
      req.flash("error_messages", `Name didn't exist`)
      // 注意：res.redirect("back")：
      // POST 動作結束後，若未填 name，則導回原 create 頁面("admin/create")。
      return res.redirect("back")
    }
    // // destructuring(解構賦值)：const file = req.file
    // const { file } = req
    // // 1. 若有圖片：
    // if (file) {
    //   // 2. fs(file system)[node.js 內建讀檔 模組]：讀取 [temp 資料夾]內 圖片
    //   fs.readFile(file.path, (err, data) => {
    //     if (err) console.log("Error: ", err)
    //     // 3. 寫入正式 [upload 資料夾]
    //     fs.writeFile(`upload/${file.originalname}`, data, () => {
    //       // 4. 將 "檔案路徑" 寫入 product.image。
    //       return Product.create({
    //         name: req.body.name,
    //         description: req.body.description,
    //         price: req.body.price,
    //         quantity: req.body.quantity,
    //         image: file ? `/upload/${file.originalname}` : null,
    //         CategoryId: req.body.CategoryId
    //       })
    //         .then(product => {
    //           req.flash("success_messages", `Product [ ${product.name} ] was successfully created`)

    //           return res.redirect("/admin/products")
    //         })
    //     })
    //   })

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
    } else {
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
        return res.render("admin/product.hbs",
          { product: product.toJSON() }
        )
      })
  },

  // [Edit/Update] Single Product (1)：
  // 注意：Edit & Create 共用 view，方便維護。
  editProduct: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    })
      .then(categories => {
        return Product.findByPk(req.params.id)

          .then(product => {
            return res.render("admin/create.hbs", {
              categories: categories,
              product: product.toJSON()
            })
          })
      })
  },

  // [Edit/Update] Single Product (2)
  // upload.single("image")：multer 只要 req 內有圖片檔，就自動複製檔案至 temp 資料夾內。
  putProduct: (req, res) => {
    if (!req.body.name) {
      req.flash("error_messages", `Name didn't exist`)
      return res.redirect("back")
    }
    // const { file } = req
    // if (file) {
    //   fs.readFile(file.path, (err, data) => {
    //     if (err) console.log('Error: ', err)

    //     fs.writeFile(`upload/${file.originalname}`, data, () => {
    //       return Product.findByPk(req.params.id)
    //         .then(product => {
    //           product.update({
    //             name: req.body.name,
    //             description: req.body.description,
    //             price: req.body.price,
    //             quantity: req.body.quantity,
    //             image: file ? `/upload/${file.originalname}` : product.image,
    //             CategoryId: req.body.CategoryId
    //           })
    //         })
    //         .then(product => {
    //           // req.flash("success_messages", `Product [ ${product.name} ] was successfully updated`)
    //           req.flash("success_messages", `Product was successfully updated`)

    //           res.redirect("/admin/products")
    //         })
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
    } else {
      return Product.findByPk(req.params.id)
        .then(product => {
          product.update({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            // image: product.image,
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

  // User Authority 設定(1)：set as user/admin
  getUser: (req, res) => {
    User.findAll({
      raw: true,
      nest: true
    })
      .then(users => {
        return res.render("admin/users.hbs", { users: users })
      })
  },

  // User Authority 設定(2)：set as user/admin
  putUser: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        // 不須先轉成 plain object，因最後皆由 adminController.getUser 轉換。
        // 注意：isAdmin 切換 True/False
        user.isAdmin = !user.isAdmin

        user.save({ field: "isAdmin" })
          .then(user => {
            req.flash('success_messages',
              `User [ ${user.name} ] was successfully updated!`)

            res.redirect('/admin/users')
          })
      })
  },
}


module.exports = adminController
