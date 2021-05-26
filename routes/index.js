// routes/index.js：成為分流入口

// 分流至 routes/routes.js
const routes = require("./routes")

// 分流至 routes/auth.js－第三方登入
const auth = require("./auth")

// 分流至 routes/apis.js
const apis = require("./apis")

module.exports = (app) => {
  // 透過 app.use，將 "/"(首頁 URL)，連至檔案 routes/routes.js [承上 const routes = require("./routes")]
  app.use("/", routes)
  app.use("/api", apis)
  app.use("/auth", auth)

  //app.use("/api", apis)
}