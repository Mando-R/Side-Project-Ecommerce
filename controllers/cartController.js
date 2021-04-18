// 引入 Model
const db = require("../models")
const { Product, Cart, CartItem } = db

const cartController = {
  getCart: (req, res) => {
    const cartId = req.session.cartId
    return Cart.findByPk(cartId, {
      // return Cart.findByPk(req.session.cartId, {
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

        cart = cart || { cartFindProducts: [] }

        // 拆除 dataValues
        cart = cart.cartFindProducts.map(product => ({
          ...product.dataValues,
          // cartId: cart.id,
          // 注意：Handlebars: Access has been denied to resolve the property "id" and "quantity" because it is not an "own property" of its parent.
          cartItemId: product.CartItem.id,
          quantity: product.CartItem.quantity,

          subTotalPrice: product.price * product.CartItem.quantity
        }))

        // console.log("cart", cart)
        // console.log("===========")
        // const cartAmount = cart.cartFindProducts.length > 0 ? cart.cartFindProducts.length : 0
        // console.log("cartAmount", cartAmount)

        // console.log("===========")
        // console.log("cart[0]", cart[0])

        // console.log("===========")
        // console.log("cart[0].CartItem", cart[0].CartItem)

        // console.log("===========")
        // console.log("cart[0].CartItem.quantity", cart[0].CartItem.quantity)

        // console.log("===========")
        // console.log("cart.cartFindProducts[0].subTotalPrice", cart.cartFindProducts[0].subTotalPrice)

        // console.log("===========")
        // console.log("cart.cartFindProducts[0].CartItem", cart.cartFindProducts[0].CartItem)

        let totalPrice = cart.length > 0 ? cart.map(product => product.price * product.quantity).reduce((a, b) => a + b) : 0

        let itemAmount = cart.length > 0 ? cart.length : 0

        console.log("cart", cart)
        console.log("===========")
        // console.log("===========")
        // console.log("totalPrice", totalPrice)

        // res.render("main.hbs", {
        //   itemAmount: itemAmount,
        // })

        res.render("carts.hbs", {
          // cart: cart.toJSON(),
          cart: cart,
          totalPrice: totalPrice,
          itemAmount: itemAmount,
          cartId: cartId
        })
      })
  },

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

        // return req.session.save(() => {
        //   return res.redirect("back")
        // })

        // 計算 cart 的 itemAmount，並存入 session：
        Cart.findByPk(cart.id, { include: "cartFindProducts" })
          .then(cart => {
            req.session.itemAmount = cart.length

            req.session.save(() => {
              // res.render("main.hbs")
              return res.redirect("back")
            })
          })
      })
  },

  // CartItem
  // (1) Plus
  addCartItem: (req, res) => {
    CartItem.findByPk(req.params.id)
      .then(cartItem => {
        cartItem.update({
          quantity: cartItem.quantity + 1,
        })
          .then(cartItem => {
            return res.redirect("back")
          })
      })
  },

  // (2) Minus
  subCartItem: (req, res) => {
    CartItem.findByPk(req.params.id)
      .then(cartItem => {
        cartItem.update({
          quantity: cartItem.quantity - 1 >= 1 ? cartItem.quantity - 1 : 1,
        })
          .then(cartItem => {
            return res.redirect("back")
          })
      })
  },

  // (3) Delete
  deleteCartItem: (req, res) => {
    CartItem.findByPk(req.params.id)
      .then(cartItem => {
        // console.log("cartItem", cartItem)
        // console.log("===========")
        cartItem.destroy()
          .then(cartItem => {
            // console.log("cartItem", cartItem)
            // console.log("===========")
            return res.redirect("back")
          })
      })
  },
}


module.exports = cartController

