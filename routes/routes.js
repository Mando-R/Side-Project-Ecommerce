// 分流套件 Router()
const express = require("express")
const router = express.Router()

// Passport 套件
const passport = require("../config/passport")
const helpers = require("../_helpers")

// Controllers
const productController = require("../controllers/productController.js")
const adminController = require("../controllers/adminController.js")
const userController = require("../controllers/userController.js")
const categoryController = require("../controllers/categoryController.js")
const cartController = require("../controllers/cartController.js")

// multer 套件(image)：
// 上傳[temp 資料夾] vs. 使用[upload 資料夾]
// (1) 分開 上傳[temp 資料夾] vs. 使用[upload 資料夾] 邏輯，成功上傳 -> 才使用。
// (2) 上傳到 temp 過程可能錯誤，所以「上傳失敗」暫存檔留在 temp 資料夾內，需定時清空，但 upload 資料夾內必是對外使用的檔案。
// (3) 可順便自定義檔名(基礎的 multer 沒有自定義檔名的功能)
// 在要上傳檔案的route，加上 multer middleware，upload.single('image')。
const multer = require("multer")
const upload = multer({ dest: "temp/" })

// isAdmin 權限驗證(User Model)
// 1. isAdmin 前台：authenticated
const authenticated = (req, res, next) => {
  // (1) 若 User 登入，則 next()。
  // if (req.isAuthenticated()) {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  // (2) 若 User 未登入，則導回 Sign-in 頁。
  res.redirect("/signin")
}

// 2. isAdmin 權限驗證(後台)：
// authenticatedAdmin：
const authenticatedAdmin = (req, res, next) => {
  // (1) 若 User 登入，則 next()。
  // if (req.isAuthenticated()) {
  if (helpers.ensureAuthenticated(req)) {
    // 1-1. 若 req.user.isAdmin = TRUE，則 next()。
    // isAdmin：User Model 新增的身分驗證欄位(Boolean)
    // if (req.user.isAdmin) {
    if (helpers.getUser(req).isAdmin) {
      return next()
    }
    // 1-2. 若 req.user.isAdmin = FALSE，則導回 首頁。
    return res.redirect("/")
  }
  // (2) 若 User 未登入，則導回 Sign-in 頁。
  res.redirect("/signin")
}


// -------------------- 前台 ---------------------
// 1. Homepage 前台：restController ＋ authenticated
router.get("/", authenticated, (req, res) => {
  res.redirect("/products")
})

// [Read]瀏覽 全部 餐廳
router.get("/products", authenticated, productController.getProducts)

router.get("/products/:id", authenticated, productController.getProduct)


// -------------------- admin 後台 ---------------------

// 2. 後台：adminController ＋ authenticatedAdmin
router.get("/admin", authenticatedAdmin, (req, res) => {
  res.redirect("/admin/products")
})

// [Read] Products
router.get("/admin/products", authenticatedAdmin, adminController.getProducts)

// [Create] Single Product (1)：注意 route 順序在 "/admin/products/:id" 前面
// upload.single("image")：multer 只要碰到 req 內有圖片檔，就自動複製檔案至 temp 資料夾內。
router.get("/admin/products/create", authenticatedAdmin, adminController.createProduct)

// [Create] Single Product (2)
// upload.single("image")：multer 只要 req 內有圖片檔，就自動複製檔案至 temp 資料夾內。
router.post("/admin/products", authenticatedAdmin, upload.single("image"), adminController.postProduct)

// [Read/Detail] Single Product：動態路由:id -> req.params.id
router.get("/admin/products/:id", authenticatedAdmin, adminController.getProduct)

// [Edit/Update] Single Product (1)
router.get("/admin/products/:id/edit", authenticatedAdmin, adminController.editProduct)

// [Edit/Update] Single Product (2)
// upload.single("image")：multer 只要 req 內有圖片檔，就自動複製檔案至 temp 資料夾內。
router.put("/admin/products/:id", authenticatedAdmin, upload.single("image"), adminController.putProduct)

// [Delete] Single Product
router.delete("/admin/products/:id", authenticatedAdmin, adminController.deleteProduct)

// -------------------- User Authority ---------------------

router.get("/admin/users", authenticatedAdmin, adminController.getUser)

router.put("/admin/users/:id/toggleAdmin", authenticatedAdmin, adminController.putUser)

// -------------------- Category ---------------------

// (1)[Read] Category
router.get("/admin/categories", authenticatedAdmin, categoryController.getCategories)

// (2)[Create] Category
router.post("/admin/categories", authenticatedAdmin, categoryController.postCategory)

// (3)[Update] Category
// 注意：共用 [Read]Controllers 的 getCategories
router.get("/admin/categories/:id", authenticatedAdmin, categoryController.getCategories)

router.put("/admin/categories/:id", authenticatedAdmin, categoryController.putCategory)

// (4)[Delete] Category
router.delete("/admin/categories/:id", authenticatedAdmin, categoryController.deleteCategory)

// -------------------- Like(Wishlist) ---------------------

// (1) Like
router.post("/like/:productId", authenticated, userController.addLike)
// (2) Unlike
router.delete("/like/:productId", authenticated, userController.removeLike)

// -------------------- Shopping Carts ---------------------

router.get("/cart", cartController.getCart)

router.post("/cart", cartController.postCart)

// -------------------- 登入機制 ---------------------

// 3. Sign-up [User 註冊流程]
router.get("/signup", userController.signUpPage)
router.post("/signup", userController.signUp)

// 4. Sign-in [passport 驗證] & Log-out
router.get("/signin", userController.signInPage)
// 登入機制邏輯 func
router.post("/signin", passport.authenticate("local",
  { failureRedirect: "/signin", failureflash: true }), userController.signIn)

// Log-out
router.get("/logout", userController.logout)


module.exports = router

