// [signup.handlebars] POST -> [userController.js]
const bcrypt = require("bcryptjs")

// Model
const db = require("../../models")
const { User } = db

// JSON Web Token
const jwt = require("jsonwebtoken")
const passportJWT = require("passport-jwt")
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  // 收到 [註冊 req]，[註冊 req]內攜帶 表單 Data。
  // signUp 直接修改自 userController.js
  signUp: (req, res) => {
    // 1. Confirm password
    if (req.body.confirmPassword !== req.body.password) {
      return res.json({
        status: "error",
        message: "兩次密碼輸入不同！"
      })
    } else {
      // 2. Confirm unique user
      User.findOne({
        where: { email: req.body.email }
      })
        .then(user => {
          if (user) {
            return res.json({
              status: "error",
              message: "email 重複！"
            })
          } else {
            User.create({
              // User 屬性 name 和 email ，設置成客戶端傳來的 Data。
              name: req.body.name,
              email: req.body.email,
              // bcrypt 雜湊 User 密碼，再存入 Database。
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            })
              .then(user => {
                return res.json({
                  status: "success",
                  message: "You have successfully registered！"
                })
              })
          }
        })
    }
  },

  signIn: (req, res) => {
    // 檢查表單(req.body)必要資料：(1) email、(2) password
    if (!req.body.email || !req.body.password) {
      return res.json({
        status: "error",
        message: "Required fields didn't exist"
      })
    }

    // 檢查表單(req.body)：(1)user是否存在、(2)password是否正確
    let username = req.body.email
    let password = req.body.password

    User.findOne({
      where: { email: username }
    })
      .then(user => {
        // 若無 user 資料
        if (!user) {
          return res.status(401).json({
            status: "error",
            message: "No such user found"
          })
        }
        // 若 password 不符合
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({
            status: "error",
            message: "Passwords did not match"
          })
        }

        // 注意：簽發 Token
        // payload：要打包的資訊，放入 { id: user.id }，之後 Passport 設定檔內，解開 token 後才能用 id 找到 user。
        let payload = { id: user.id }

        // jwt.sign()：把資料變成 JSON web token，需2個參數：payload 和 密鑰。
        // token Hash：JWT 雜湊 "密鑰"＋header＋payload，產生一組不可逆亂數。若 payload 和 header 被纂改，會不符 token Hash。
        // 注意：commit 前放入 .env。
        let token = jwt.sign(payload, process.env.JWT_SECRET)

        return res.json({
          status: 'success',
          message: 'ok',
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
          }
        })
      })
  }
}


module.exports = userController
