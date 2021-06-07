// 引入 Express 和 Express 路由器
const express = require("express")
const router = express.Router()
// JWT
const passport = require("../config/passport")

const dataController = require("../controllers/api/dataController.js")

// JSON Web Token (JWT) Signin
const userController = require("../controllers/api/userController.js")

// passport.authenticate()：是 passport-jwt 提供的方法，此處依官方文件設定，但把方法封裝成 authenticated，準備當成 middleware 加入路由。
const authenticated = passport.authenticate("jwt", { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) {
      return next()
    }

    return res.json({
      status: "error",
      message: "permission denied"
    })

  } else {
    return res.json({
      status: "error",
      message: "permission denied"
    })
  }
}

// Data API
// 注意：
// 1. 不需要登入驗證 authenticatedAdmin
// 2. prefix 不須再加上 api/，例如：api/admin/data
// 3. 仍注意URL前面都有"/"，例如：/admin/data
router.get("/admin/data/v1", authenticated, authenticatedAdmin, dataController.getPriceData)

// JSON Web Token (JWT) SignIn & SignUp
router.post("/signin", userController.signIn)

router.post("/signup", userController.signUp)

// 匯出 Route 模組
module.exports = router
