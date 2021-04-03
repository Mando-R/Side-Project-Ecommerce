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
        // console.log("req.session", req.session)
        // console.log("===========")
        // console.log("cart", cart)
        // console.log("===========")
        // console.log("cart.toJSON()", cart.toJSON())
        // console.log("===========")
        // console.log("cart.items", cart.items)

        cart = cart || { cartFindProducts: [] }

        // 拆除 dataValues
        cart.cartFindProducts = cart.cartFindProducts.map(product => ({
          ...product.dataValues,
          // items.toJSON(),
          // 注意：要修改此處
          // itemId: items.CartItem.id,
          // quantity: items.CartItem.quantity,
          // subtotal: items.price * items.CartItem.quantity
        }))

        // console.log("cart", cart)
        // console.log("===========")
        // const cartAmount = cart.cartFindProducts.length > 0 ? cart.cartFindProducts.length : 0
        // console.log("cartAmount", cartAmount)

        // console.log("===========")
        // console.log("cart.cartFindProducts", cart.cartFindProducts)

        // console.log("===========")
        // console.log("cart.cartFindProducts[0].CartItem", cart.cartFindProducts[0].CartItem)
        let totalPrice = cart.cartFindProducts.length > 0 ? cart.cartFindProducts.map(cartFindProduct => cartFindProduct.price * cartFindProduct.CartItem.quantity).reduce((a, b) => a + b) : 0

        res.render("carts.hbs", {
          cart: cart.toJSON(),
          // cart: cart,
          totalPrice: totalPrice,
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

