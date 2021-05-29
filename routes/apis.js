// 引入 Express 和 Express 路由器
const express = require("express")
const router = express.Router()

const dataController = require("../controllers/api/dataController.js")

// JSON Web Token (JWT) Signin
const userController = require("../controllers/api/userController.js")

// Data API
// 注意：
// 1. 不需要登入驗證 authenticatedAdmin
// 2. prefix 不須再加上 api/，例如：api/admin/data
// 3. 仍注意URL前面都有"/"，例如：/admin/data
router.get("/admin/data/v1/categories", dataController.getCategoryData)

router.get("/admin/data/v1", dataController.getPriceData)

// JSON Web Token (JWT) Signin
router.post("/signin", userController.signIn)



// 匯出 Route 模組
module.exports = router