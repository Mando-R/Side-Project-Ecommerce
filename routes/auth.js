// 引入 Express 和 Express 路由器
const express = require("express")
const router = express.Router()

const passport = require("passport")

// ---------- Route 1：GET/facebook ----------
// passport.authenticate("facebook",...)：指 passport 套件的 authenticate 進行認證，使用 "facebookStrategy" 認證機制。
router.get("/facebook",
  passport.authenticate("facebook", {
    // scope：向[官方Facebook]取得：(1)User授權、(2)User授權資料：email & public_profile(姓名)，
    scope: ["email", "public_profile"]
  })
)

// ---------- Route 2：GET/facebook/callback ----------
// Facebook官方 呼叫 route
router.get("/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",            // 驗證成功：導回 首頁。
    failureRedirect: "/users/login", // 驗證失敗：導回 Log-in頁。                      
  })
)

// 匯出Route模組
module.exports = router