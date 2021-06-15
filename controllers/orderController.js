const db = require("../models")
const { Product, Order, OrderItem, Cart } = db

// ---------- NewebPay 基本串接設定 ----------

// 1. ngrok(測試用臨時網址) || Heroke 網址
// const URL = process.env.URL
const URL = "https://fd7b740b36a6.ngrok.io"
// const URL = "https://side-project-ecommerce.herokuapp.com"


// 2. MerchantID(商店代號)
const MerchantID = process.env.MERCHANT_ID

// TradeInfo(AES加密) = (HashKey + HashIV) + DataChain 交易參數(未加密)
// 3. API 串接金鑰：HashKey
const HashKey = process.env.HASH_KEY
// 4. API 串接金鑰：HashIV
const HashIV = process.env.HASH_IV

// ngrok測試：先明碼固定

// 5. 串接測試網址(P.26)
const PayGateWay = "https://ccore.newebpay.com/MPG/mpg_gateway"

// route：POST/newebpay/callback
// const ReturnURL = URL + "/newebpay/callback?from=ReturnURL"
// const NotifyURL = URL + "/newebpay/callback?from=NotifyURL"
// const ClientBackURL = URL + "/orders"

// 6. NotifyURL(step 6)：藍新告知賣方後端
// const NotifyURL = "https://side-project-ecommerce.herokuapp.com/newebpay/callback?from=NotifyURL"
const NotifyURL = "https://fd7b740b36a6.ngrok.io/newebpay/callback?from=NotifyURL"

// 7. ReturnURL(step 7-1)：藍新頁面顯示交易結果
// const ReturnURL = "https://side-project-ecommerce.herokuapp.com/newebpay/callback?from=ReturnURL"
const ReturnURL = "https://fd7b740b36a6.ngrok.io/newebpay/callback?from=ReturnURL"

// 8. ClientBackURL(step 7-2)：頁面導回商店網頁(/orders)
// const ClientBackURL = "https://side-project-ecommerce.herokuapp.com/orders"
const ClientBackURL = "https://fd7b740b36a6.ngrok.io/orders"

// ---------- Arrange & Deliver TradeInfo ----------

// 引入 crypto(加密套件)
const crypto = require("crypto")

// 1. DataChain(串聯交易參數 TradeInfo)
function genDataChain(TradeInfo) {
  let results = []
  // Object.entries()：returns an array of a given object's own enumerable string-keyed property [key, value] pairs.
  for (let keyValue of Object.entries(TradeInfo)) {
    results.push(`${keyValue[0]}=${keyValue[1]}`)
  }
  // console.log("results", results)

  // .join()：將陣列或類陣列物件中所有元素連接、合併成一字串，並回傳此字串。
  return results.join("&")
}

// 2-1. AES 加密
function create_mpg_aes_encrypt(TradeInfo) {
  // .createCipheriv("aes256", HashKey, HashIV)：加密方法("加密方式 aes256"), 加密混入內容參數 HashKey HashIV)
  let encrypt = crypto.createCipheriv("aes256", HashKey, HashIV)

  let enc = encrypt.update(genDataChain(TradeInfo), "utf8", "hex")
  // .final("hex")：返回加密後數據、hex：進位
  return enc + encrypt.final("hex")
}

// 2-2. AES 解密
function create_mpg_aes_decrypt(TradeInfo) {
  let decrypt = crypto.createDecipheriv("aes256", HashKey, HashIV)
  // .setAutoPadding(false) 和 .replace(/[\x00-\x20]+/g, "")：清除亂碼字串或空白
  decrypt.setAutoPadding(false)
  let text = decrypt.update(TradeInfo, "hex", "utf8")
  let plainText = text + decrypt.final("utf8")
  let result = plainText.replace(/[\x00-\x20]+/g, "")

  return result
}

// 3. SHA256 Hash 雜湊(不可逆)：不須密鑰，無法逆向解出原始輸入。
function create_mpg_sha_encrypt(TradeInfo) {
  // .createHash("sha256")：指定雜湊方式為"sha256"
  let sha = crypto.createHash("sha256")

  // 拼接 HashKey、TradeInfo、HashIV
  let plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`

  // .toUpperCase()：雜湊後的結果，全轉成大寫，依API文件要求。
  return sha.update(plainText).digest("hex").toUpperCase()
}

// 4. 取得加密結果
// Amt(Amount)：商品訂單價格、Desc：商品敘述、email(User email)
function getTradeInfo(Amt, Desc, email) {
  // console.log("===== getTradeInfo =====")
  // console.log(Amt, Desc, email)
  // console.log("==========")

  data = {
    // (1) 商店代號
    "MerchantID": MerchantID,
    // (2) 回傳格式
    "RespondType": "JSON",
    // (3) 時間戳記
    "TimeStamp": Date.now(),
    // (4) 串接程式版本
    "Version": 1.5,
    // (5) 商店訂單編號
    "MerchantOrderNo": Date.now(),
    // (6) 智付通會員
    "LoginType": 0,
    // (7) 商店備註
    "OrderComment": "RShop",

    // (8) 訂單金額
    "Amt": Amt,
    // (9) 產品名稱
    "ItemDesc": Desc,
    // (10) 付款人電子信箱
    "Email": email,

    // (11) 支付完成返回商店網址
    "ReturnURL": ReturnURL,
    // (12) 支付通知網址/每期授權結果通知
    "NotifyURL": NotifyURL,
    // (13) 支付取消返回商店網址
    "ClientBackURL": ClientBackURL,
  }

  // console.log('===== getTradeInfo: data =====')
  // console.log(data)

  // AES 加密 & SHA256 雜湊 結果
  mpg_aes_encrypt = create_mpg_aes_encrypt(data)
  mpg_sha_encrypt = create_mpg_sha_encrypt(mpg_aes_encrypt)

  // console.log('===== getTradeInfo: mpg_aes_encrypt, mpg_sha_encrypt =====')
  // console.log(mpg_aes_encrypt)
  // console.log(mpg_sha_encrypt)

  tradeInfo = {
    // 商店代號
    "MerchantID": MerchantID,
    // AES 加密 & SHA256 雜湊
    "TradeInfo": mpg_aes_encrypt,
    "TradeSha": mpg_sha_encrypt,
    // 串接程式版本
    "Version": 1.5,
    // PayGateWay：發送 API 的位置
    "PayGateWay": PayGateWay,
    // MerchantOrderNo 商品代碼：存入Database的serialNumber
    "MerchantOrderNo": data.MerchantOrderNo,
  }

  // console.log('===== getTradeInfo: tradeInfo =====')
  // console.log(tradeInfo)

  return tradeInfo
}

// ---------- Controller ----------

const orderController = {
  getOrders: (req, res) => {
    Order.findAll({
      // raw: true,
      // nest: true,
      where: { UserId: req.user.id },
      include: [{ model: Product, as: "orderFindProducts" }],
      order: [["createdAt", "DESC"]]
    })
      .then(orders => {
        console.log("orders-before", orders)
        console.log("===============")
        console.log("orders[0].orderFindProducts", orders[0].orderFindProducts)
        console.log("===============")

        // 注意：此處.map 只有一層()，沒有({...})
        orders = orders.map(order =>
          // ...order.dataValues
          order.toJSON()
        )

        // orders = orders.map(order => ({
        //   ...order.dataValues
        //   // order.toJSON()
        // })
        // )

        console.log("orders-after", orders)
        console.log("===============")
        console.log("orders[0].orderFindProducts", orders[0].orderFindProducts)
        console.log("===============")

        return res.render("orders.hbs", {
          // orders: orders.toJSON()
          orders: orders
        })
      })
  },

  // getOrder: (req, res) => {
  //   Order.findByPk(req.params.id, {
  //     include: [{ model: Product, as: "orderFindProducts" }]
  //   })
  //     .then(order => {

  //       let paymentMethod = newebpay_helpers.getPayParam(order.dataValues.payment_method)

  //       let orderSn = order.sn

  //       const tradeInfo = newebpay_helpers.getTradeInfo(order.amount, '產品名稱', req.user.email, paymentMethod, orderSn)

  //       let orderItems = order.orderFindProducts.map(orderFindProduct => ({
  //         ...orderFindProduct.dataValues,
  //         price: orderFindProduct.OrderItem.price,
  //         quantity: orderFindProduct.OrderItem.quantity,
  //         subtotal: orderFindProduct.OrderItem.price * orderFindProduct.OrderItem.quantity
  //       }))

  //       return res.render("orderDetails", {
  //         order: order, orderItems: orderItems, tradeInfo: tradeInfo
  //       })
  //     })
  // },

  postOrder: (req, res) => {
    return Cart.findByPk(req.body.cartId,
      { include: [{ model: Product, as: "cartFindProducts" }] }
    )
      .then(cart => {
        console.log("req.body", req.body)
        console.log("===============")
        console.log("req.body.cartId", req.body.cartId)
        console.log("===============")

        console.log("cart", cart)
        console.log("===============")

        cart = cart.cartFindProducts.map(product => ({
          ...product.dataValues,
        }))

        console.log("cart", cart)
        console.log("===============")

        // 寫入 Order
        return Order.create({
          name: req.body.name,
          address: req.body.address,
          phone: req.body.phone,
          shipping_status: req.body.shipping_status,
          payment_status: req.body.payment_status,
          amount: req.body.amount,
          // 注意：寫入 UserId，才可findAll{where}
          UserId: req.user.id
        })
          .then(order => {
            let results = []

            for (let i = 0; i < cart.length; i++) {
              // console.log(`order.id: ${order.id} ||`, `cart.cartFindProducts[i].id: ${cart.cartFindProducts[i].id}`)

              // 寫入 OrderItem
              results.push(
                OrderItem.create({
                  OrderId: order.id,
                  ProductId: cart[i].id,
                  price: cart[i].price,
                  quantity: cart[i].CartItem.quantity,
                })
              )
            }

            // console.log("results", results)
            // console.log("===============")

            // let mailOptions = {
            //   from: "",
            //   to: "",
            //   subject: `${order.id} 訂單成立`,
            //   text: `${order.id} 訂單成立`,
            // }

            // transporter.sendMail(mailOptions, function (error, info) {
            //   if (error) {
            //     console.log(error);
            //   } else {
            //     console.log("Email sent: " + info.response);
            //   }
            // })

            return Promise.all(results)
              .then(() =>

                res.redirect("/orders"),
                // console.log(`res.redirect("/orders")`),
                // console.log("===============")
              )
          })
      })
  },

  cancelOrder: (req, res) => {
    return Order.findByPk(req.params.id, {})
      .then(order => {
        order.update({
          ...req.body,
          shipping_status: "-1",
          payment_status: "-1",
        })
          .then(order => {
            req.flash('success_message', 'Order is successfully canceled')

            return res.redirect("back")
          })
      })
  },

  // Payment Gateway
  // (1) Payment 付款頁面：Controller 傳送 交易參數 -> 藍新平台
  getPayment: (req, res) => {
    // console.log("===== getPayment =====")
    // console.log("req.params.id", req.params.id)
    // console.log("==========")

    return Order.findByPk(req.params.id, {})
      .then(order => {
        // order.amount(Amt 商品訂單價格)、"Product Desc"(商品敘述)、"v123582@gmail.com"(User email)
        // getTradeInfo：return tradeInfo
        const tradeInfo = getTradeInfo(order.amount, "Product Desc", "v123582@gmail.com")

        // console.log("order", order)
        // console.log("==============")
        // console.log("tradeInfo", tradeInfo)

        // 注意：將 Order Table的 serialNumber，更新成藍新金流平台提供的 訂單編號：tradeInfo.MerchantOrderNo。
        // 註：交易成功後，藍新金流平台回傳 spgatewayCallback: create_mpg_aes_decrypt 的 req.body.TradeInfo，其中TradeInfo 包含 MerchantOrderNo。
        order.update({
          ...req.body,
          // serialNumber 訂單編號：
          serialNumber: tradeInfo.MerchantOrderNo,
        })
          .then(order => {
            // console.log("order", order)

            return res.render("payments.hbs", {
              order: order.toJSON(),
              tradeInfo: tradeInfo
            })
          })
      })
  },

  // (2) 藍新平台 -> Controller 接收 付款完成資訊
  newebpayCallback: (req, res) => {
    // console.log("===== newebpayCallback =====")
    // // req.method：HTTP method
    // console.log("req.method", req.method)
    // console.log("==================")
    // // req.query：GET 網頁參數
    // console.log("req.query", req.query)
    // console.log("==================")
    // // req.body：POST 傳送的內容
    // console.log("req.body", req.body)
    // console.log("==================")

    // 加密後的結果
    // console.log("===== newebpayCallback: TradeInfo =====")
    // console.log("req.body.TradeInfo", req.body.TradeInfo)

    // 解密後的結果
    // JSON.parse()：把JSON字串轉換成JS數值或物件{}。
    const data = JSON.parse(create_mpg_aes_decrypt(req.body.TradeInfo))

    // console.log("===== newebpayCallback: create_mpg_aes_decrypt、data =====")
    // console.log(data)

    // 更新訂單付款狀態 payment_status：預設0(未付款)，改成1(已付款)
    // 承 getPayment 的 order.update－serialNumber: tradeInfo.MerchantOrderNo，
    return Order.findAll({
      // raw: true,
      // nest: true,
      // Result 陣列內的 MerchantOrderNo
      where: { serialNumber: data["Result"]["MerchantOrderNo"] }
    })
      .then(orders => {
        console.log("orders", orders)
        console.log("==============")
        console.log("orders[0]", orders[0])
        console.log("==============")

        orders[0].update({
          ...req.body,
          payment_status: 1,
        })
          .then(order => {
            console.log("order", order)
            return res.redirect("/orders")
            // return res.redirect(`${URL}/orders`)
          })
      })
  },
}


module.exports = orderController
