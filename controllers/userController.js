// [signup.handlebars] POST -> [userController.js]
const bcrypt = require("bcryptjs")

const db = require("../models")
const { User } = db

//注意：render 檔案、redirect 路由
const userController = {
  // sign-up
  signUpPage: (req, res) => {
    return res.render("signup.hbs")
  },
  // 收到 [註冊 req]，[註冊 req]內攜帶 表單 Data。
  signUp: (req, res) => {
    // 1. Confirm password
    if (req.body.confirmPassword !== req.body.password) {
      req.flash("error_messages", `輸入密碼不同！`)
      return res.redirect("/signup")
    }
    else {
      // 2. Confirm unique user
      User.findOne({
        where: { email: req.body.email }
      })
        .then(user => {
          if (user) {
            req.flash("error_messages", "Email 重複！")
            return res.redirect("/signup")
          } else {
            User.create({
              // User 屬性 name 和 email ，設置成客戶端傳來的 Data。
              name: req.body.name,
              email: req.body.email,
              // bcrypt 雜湊 User 密碼，再存入 Database。
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            })
              .then(user => {
                req.flash("success_messages", "成功註冊帳號！")
                return res.redirect("/signin")
              })
          }
        })
    }
  },

  // sign-in
  signInPage: (req, res) => {
    return res.render("signin.hbs")
  },
  // signIn 動作無任何邏輯，直接轉 route，因已使用 Passport 的 middleware 處理，所以不必自己實作。
  signIn: (req, res) => {
    req.flash("success_messages", `成功登入!`)
    res.redirect("/products")
  },

  // Log-out
  logout: (req, res) => {
    req.flash("success_messages", `登出成功!`)
    req.logout() // passport 套件提供的 func
    res.redirect("/signin")
  },


}


module.exports = userController

