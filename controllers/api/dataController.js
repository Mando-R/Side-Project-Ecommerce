// 注意：../../ 多一層Folder
const db = require("../../models")
const { Category, Product } = db

const dataController = {
  getPriceData: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true,
    })
      .then(categories => {
        // 1. 整理 CategoryId 陣列：用於 productQuantityArray－Product.findAll 的 where 條件，進行 for loop。
        const categoryIdArray = categories.map((item, i, categories) => {
          return item.id
        })
        console.log("=================================")
        console.log("categoryIdArray", categoryIdArray)
        console.log("=================================")

        // 2. subTotal_amount：
        // (1) 建立空陣列[]：subTotalArray、(2) Product.findAll＋where條件(注意：for loop)、
        // (3) .length：計算product quantity、(4) for loop＋.push 依序推入 空陣列[] subTotalArray。
        let subTotalArray = []
        let itemQuantityArray = []
        let priceAveArray = []
        let productQTYArray = []

        for (let i = 0; i < categoryIdArray.length; i++) {
          Product.findAll({
            raw: true,
            nest: true,
            where: [{ CategoryId: `${categoryIdArray[i]}` }]
          })
            .then(products => {
              // 1. subTotal amount
              // console.log("products", products)
              const priceXQuantity = products.map((item, i, products) => {
                return item.price * item.quantity
              })
              //console.log("priceXQuantity", priceXQuantity)
              const subTotal = priceXQuantity.reduce(function (prev, next) {
                return prev + next;
              })
              //console.log("subTotal", subTotal)
              subTotalArray.push(subTotal)
              // console.log("subTotalArray", subTotalArray)
              // console.log("=================================")

              // 2. item quantity
              const itemQuantity = products.length
              // console.log("itemQuantity", itemQuantity)
              // console.log("=================================")
              itemQuantityArray.push(itemQuantity)
              // console.log("itemQuantityArray", itemQuantityArray)
              // console.log("=================================")

              // 3. Average selling price
              const priceArray = products.map((item, i, products) => {
                return item.price
              })
              // console.log("priceArray", priceArray)
              // console.log("=================================")
              const priceSum = priceArray.reduce(function (prev, next) {
                return prev + next
              })
              // console.log("priceSum", priceSum)
              // console.log("=================================")
              const priceAve = priceSum / itemQuantity

              // console.log("priceAve", priceAve)
              // console.log("=================================")

              priceAveArray.push(Math.round(priceAve))

              // console.log("avePriceArray", priceAveArray)
              // console.log("=================================")

              // 4. SubTotal Product Quantity
              const quantityArray = products.map((item, i, products) => {
                return item.quantity
              })

              console.log("quantityArray", quantityArray)
              console.log("=================================")

              const productQTYSum = quantityArray.reduce(function (prev, next) {
                return prev + next
              })

              console.log("productQTYSum", productQTYSum)
              console.log("=================================")

              productQTYArray.push(productQTYSum)

              console.log("productQTYArray", productQTYArray)
              console.log("=================================")
            })
        }

        // 3. 測試 where 條件的 CategoryId，驗證各 Category 的 Products 數量。
        // Product.findAll({
        //   raw: true,
        //   nest: true,
        //   where: [{ CategoryId: 61 }]
        // })
        //   .then(products => {
        //     console.log("products", products)
        //     // console.log("products.length 61", products.length)
        //   })
        // console.log("=====$ Alert:[productQuantityArray] slower than [categories] =====")
        // console.log("categories", categories)
        // console.log("=================================")

        // 4. setTimeout：設定 200 毫秒，因非同步，上面[productQuantityArray]計算處理速度比 下面[對稱合併＆Constructor] 慢。
        setTimeout(function () {
          // 5. 2個陣列長度相同(共用相同 i)，對稱合併：1層 for loop＋"[CategoryId, name]＋[productQuantity]"
          // 注意：因陣列長度相同(共用相同 i)，所以只須 1層 for loop。
          for (let i = 0; i < categories.length; i++) {
            categories[i].subTotal_amount = subTotalArray[i]
          }
          // console.log("categories", categories)
          // console.log("=================================")

          for (let i = 0; i < categories.length; i++) {
            categories[i].item_quantity = itemQuantityArray[i]
          }

          for (let i = 0; i < categories.length; i++) {
            categories[i].price_ave = priceAveArray[i]
          }

          for (let i = 0; i < categories.length; i++) {
            categories[i].subTotal_product_quantity = productQTYArray[i]
          }

          // 6. Constructor(物件導向 建構式函式)：建立 資料格式 & 資料 Title。
          function CategoryData(CategoryId, category_name, subTotal_amount, price_ave, item, subTotal_product_quantity) {
            this.CategoryId = CategoryId
            this.category_name = category_name
            this.subTotal_amount = subTotal_amount
            this.price_ave = price_ave
            this.item = item
            this.subTotal_product_quantity = subTotal_product_quantity
          }

          // 7. Constructor + .map()：以 Contstructor & .map()，建立 Instance，並產生新陣列[]。
          const data = categories.map((item, i, categories) => {
            // console.log("categories", categories)
            return new CategoryData(`${item.id}`, `${item.name}`, `${item.subTotal_amount}`, `${item.price_ave}`, `${item.item_quantity}`, `${item.subTotal_product_quantity}`)
          })

          // console.log("data", data)
          // console.log("=================================")

          // 8. res.json：回傳 JSON 格式的 API 資料。
          // return res.render("dataAnalysis.hbs", {
          //   data: data
          // })
          return res.json({ Data: data })
        }, 200)
      })
  }
}


module.exports = dataController