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

// 前台
// 1. Homepage 前台：restController ＋ authenticated
router.get("/", authenticated, (req, res) => {
  res.redirect("/products")
})

// [Read]瀏覽 全部 餐廳
router.get("/products", authenticated, productController.getProducts)

// 後台
// 2. 後台：adminController ＋ authenticatedAdmin
router.get("/admin", authenticatedAdmin, (req, res) => {
  res.redirect("/admin/products")
})

router.get("/admin/products", authenticatedAdmin, adminController.getProducts)

// [Create]新增一筆餐廳資料
// upload.single("image")：multer 只要碰到 req 內有圖片檔，就自動複製檔案至 temp 資料夾內。
router.get("/admin/products/create", authenticatedAdmin, adminController.createProduct)

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

