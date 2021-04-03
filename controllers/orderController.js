const db = require("../models")
const { Product, Order, OrderItem, Cart } = db

// const nodemailer = require("nodemailer")
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "",
//     pass: "",
//   },
// })

const orderController = {
  getOrders: (req, res) => {
    Order.findAll({
      // raw: true,
      // nest: true,
      include: [{ model: Product, as: "orderFindProducts" }],
      order: [["createdAt", "ASC"]]
    })
      .then(orders => {
        orders = orders.map(order =>
          // ...order.dataValues
          order.toJSON()
        )

        console.log("orders", orders)
        console.log("===============")

        return res.render("orders.hbs", {
          // orders: orders.toJSON()
          orders: orders
        })
      })
  },

  postOrder: (req, res) => {
    return Cart.findByPk(req.body.cartId,
      { include: [{ model: Product, as: "cartFindProducts" }] }
    )
      .then(cart => {
        cart.cartFindProducts = cart.cartFindProducts.map(product => ({
          ...product.dataValues,
          // items.toJSON(),
          // 注意：要修改此處
          // itemId: items.CartItem.id,
          // quantity: items.CartItem.quantity,
          // subtotal: items.price * items.CartItem.quantity
        }))

        console.log("cart", cart)
        console.log("===============")
        console.log("cart.cartFindProducts", cart.cartFindProducts)
        console.log("===============")

        // 寫入 Order
        return Order.create({
          name: req.body.name,
          address: req.body.address,
          phone: req.body.phone,
          shipping_status: req.body.shipping_status,
          payment_status: req.body.payment_status,
          amount: req.body.amount,
        })
          .then(order => {
            // order = order.map(order => ({
            //   ...order.dataValues,
            //   // items.toJSON(),
            //   // 注意：要修改此處
            //   // itemId: items.CartItem.id,
            //   // quantity: items.CartItem.quantity,
            //   // subtotal: items.price * items.CartItem.quantity
            // }))
            console.log("order", order)
            console.log("===============")

            let results = []

            for (let i = 0; i < cart.cartFindProducts.length; i++) {
              console.log(`order.id: ${order.id} ||`, `cart.cartFindProducts[i].id: ${cart.cartFindProducts[i].id}`)

              // 寫入 OrderItem
              results.push(
                OrderItem.create({
                  OrderId: order.id,
                  ProductId: cart.cartFindProducts[i].id,
                  price: cart.cartFindProducts[i].price,
                  quantity: cart.cartFindProducts[i].CartItem.quantity,
                })
              )
            }

            console.log("results", results)
            console.log("===============")

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
                console.log(`res.redirect("/orders")`),
                console.log("===============")
              )
          })
      })
  },

  cancelOrder: (req, res) => {
    return Order.findByPk(req.params.id, {}).then(order => {
      order.update({
        ...req.body,
        shipping_status: '-1',
        payment_status: '-1',
      })
        .then(order => {
          return res.redirect('back')
        })
    })
  },


}


module.exports = orderController
