// 引入 Model
const db = require("../models")
const { Product, Cart, CartItem } = db

const cartController = {
  getCart: (req, res) => {
    return Cart.findByPk(req.session.cartId, {
      // raw: true,
      // nest: true,
      include: [{ model: Product, as: "cartFindProducts" }]
    })
      .then(cart => {
        console.log("req.session", req.session)
        console.log("===========")
        console.log("cart", cart)
        console.log("===========")
        // console.log("cart.toJSON()", cart.toJSON())
        // console.log("===========")
        // console.log("cart.items", cart.items)

        // cart = cart || { items: [] }
        cart = cart || { cartFindProducts: [] }

        // 拆除 dataValues
        // cart.items = cart.items.map(items => ({
        //   ...items.dataValues,
        //   // items.toJSON(),
        //   // 注意：要修改此處
        //   itemId: items.CartItem.id,
        //   quantity: items.CartItem.quantity,
        //   subtotal: items.price * items.CartItem.quantity
        // }))

        console.log("cart", cart)
        console.log("===========")

        console.log("===========")
        console.log("cart.cartFindProducts", cart.cartFindProducts)

        //let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0

        let totalPrice = cart.cartFindProducts.length > 0 ? cart.cartFindProducts.map(cartFindProduct => cartFindProduct.price * cartFindProduct.CartItem.quantity).reduce((a, b) => a + b) : 0

        return res.render("carts.hbs", {
          cart: cart.toJSON(),
          // cart: cart,
          totalPrice: totalPrice
        })
      })
  },

  // postCart: (req, res) => {
  //   return Cart.findOrCreate({
  //     // Client端每筆 req 皆自動帶入 session，並暫存至網頁後端。
  //     // Cookie 暫存前端 <-> Session 暫存後端。
  //     where: { id: req.session.cartId || 0 },
  //   })
  //     .spread(function (cart, created) {
  //       console.log("=======================",)
  //       console.log("req.session", req.session)
  //       console.log("=======================",)
  //       console.log("cart", cart)
  //       // 若未 find(無 cart)：則 create
  //       return CartItem.findOrCreate({
  //         where: {
  //           CartId: cart.id,
  //           ProductId: req.body.productId
  //         },
  //         default: {
  //           CartId: cart.id,
  //           ProductId: req.body.productId,
  //         }
  //       })
  //         // 若 find(有 cart)：QTY + 1
  //         .spread(function (cartItem, created) {
  //           console.log("=======================",)
  //           console.log("cartItem", cartItem)

  //           return cartItem.update({
  //             quantity: (cartItem.quantity || 0) + 1,
  //           })
  //             // 傳回 req.session.cartId
  //             .then((cartItem) => {
  //               req.session.cartId = cart.id

  //               return req.session.save(() => {
  //                 return res.redirect('back')
  //               })
  //             })
  //         })
  //     })
  // },

  postCart: async (req, res) => {
    const [cart, created] = await Cart.findOrCreate({
      where: {
        id: req.session.cartId || 0,
      },
    })

    const [cartItem, itemCreated] = await CartItem.findOrCreate({
      where: {
        CartId: cart.id,
        ProductId: req.body.productId
      },
      default: {
        CartId: cart.id,
        ProductId: req.body.productId,
      }
    })

    return cartItem.update({
      quantity: (cartItem.quantity || 0) + 1,
    })
      .then(cartItem => {
        req.session.cartId = cart.id

        return req.session.save(() => {
          return res.redirect("back")
        })

        // //出有多少cart中的有幾個items，並存在session裡：
        // Cart.findByPk(cart.id, { include: "cartFindProducts" })
        //   .then(cart => {
        //     req.session.cartItemCount = cart.items.length
        //     return req.session.save(() => {
        //       return res.redirect('back')
        //     })
        //   })
      })
  },
}


module.exports = cartController

