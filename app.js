const express = require("express")
const handlebars = require("express-handlebars")
const cors = require("cors")
const db = require("./models")
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
// helper 函式取代 passport 方法
const helpers = require("./_helpers")

const app = express()
const port = process.env.PORT || 3000

// 引入 .env 檔案
// 若現在環境 process.env.NODE_ENV 非 "production"，則使用 dotenv 資訊。注意：順序在 Passport 之前。
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

// 注意：避免先載入 passport，依順序卻尚未載入 dotenv。
// 調整順序讓 passport.js 吃到環境參數.env 檔案，passport 必須放在 process.env.NODE_ENV 下方。
// 也可在 passport.js 直接引入 require('dotenv').config()。
const passport = require("./config/passport.js")
const session = require("express-session")
const flash = require("connect-flash")
const cookieParser = require("cookie-parser")


// Handlebars
app.engine("hbs", handlebars({
  extname: ".hbs",
  defaultLayout: "main.hbs",
  helpers: require("./config/handlebars-helpers.js")
}))
app.set("view engine", "hbs")

// 靜態 Bootstrap、popper.js、jquery
// 引入靜態 css 檔案：注意用 __dirname 絕對路徑
app.use(express.static(__dirname + "/public"))

// app.use
app.use(cors())
// (1) bodyParser：202105改版
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Session & Shopping Cart
app.use(cookieParser())

// (2) express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,

  // Session & Shopping Cart
  cookie: { maxAge: 80000 },
  resave: false
}))

// (4) passport
// 初始化 Passport
app.use(passport.initialize())
// 啟動 session 功能，這組設定務必要放在 session() 之後
app.use(passport.session())

// (5) method-override
app.use(methodOverride("_method"))

// (3) connect-flash：注意 放在 passport 後面，res.locals.user 才能傳給 Views。
app.use(flash())
// [app.js] res.locals -> [Controllers] req.flash -> [Views] Handlebars
app.use((req, res, next) => {
  // req.flash 放入 res.locals 內
  // res.locals [view 專屬]：把變數放入 res.locals 內，讓所有 view 都能存取。
  res.locals.success_messages = req.flash("success_messages")
  res.locals.error_messages = req.flash("error_messages")

  // res.locals.user = req.user
  res.locals.user = helpers.getUser(req)  // 取代 req.user

  next()
})

// (6) multer(image)：設定靜態檔案路徑 /upload
// 加上 Route："/upload"，因為是靜態檔案，所以不需像其他 Route 路由一樣寫 Controller 邏輯，直接用 express.static 指定路徑即可。
app.use("/upload", express.static(__dirname + "/upload"))

// 1. routes/index.js 用 module.exports 匯出 Route 設定，接著到 app.js 透過 require 引入 function。

// 2. routes/index.js 的 app.get，這個 app 是外面傳進來的參數，要在app.js 內把 express() 傳給 Route。

// 3. 最後合併，變成 express.get(...)，即「Express 拿到這個畫面...」。

app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})

// 4. 注意：require('./routes')(app) 需放在 app.js 最後一行，因按照由上而下順序，當 app.js 把 app(即 express()) 傳入 Route 時，程式中間(routes/index.js)做的 Handlebars 設定、Server 設定，也一併透過 app 變數傳入。

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
// require("./routes")(app, passport) // 把 passport 傳入 routes

// 注意：現在因為分了兩層，所以 index.js 不需要用到 passport 了，請把 app.js 單純改成傳入 app 就好
// require("./routes")(app, passport)改成require("./routes")(app)，在routes.js變成const passport = require("../config/passport")，引入passport。
// app：Express 專案本體 express()套件
// passport：User 認證相關功能
require("./routes")(app)

module.exports = app
