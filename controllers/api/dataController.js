// 注意：../../ 多一層Folder
const db = require("../../models")
const { Category, Product } = db

const dataController = {
  getCategoryShare: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true,
    })
      .then(categories => {
        // 1. 整理 CategoryId 陣列：用於 productQuantityArray－Product.findAll 的 where 條件，進行 for loop。
        const categoryIdArray = categories.map((item, i, categories) => {
          return item.id
        })
        // console.log("=================================")
        // console.log("categoryIdArray", categoryIdArray)
        // console.log("=================================")

        // 2. productQuantityArray：
        // (1) 建立空陣列[]：productQuantityArray、(2) Product.findAll＋where條件(注意：for loop)、
        // (3) .length：計算product quantity、(4) for loop＋.push 依序推入 空陣列[] productQuantityArray。
        let productQuantityArray = []
        for (let i = 0; i < categoryIdArray.length; i++) {
          Product.findAll({
            raw: true,
            nest: true,
            where: [{ CategoryId: `${categoryIdArray[i]}` }]
          })
            .then(products => {
              // console.log("products", products)
              productQuantity = products.length
              productQuantityArray.push(productQuantity)

              console.log("productQuantityArray", productQuantityArray)
            })
        }
        // 3. 測試 where 條件的 CategoryId，驗證各 Category 的 Products 數量。
        // Product.findAll({
        //   raw: true,
        //   nest: true,
        //   where: [{ CategoryId: 61 }]
        // })
        //   .then(products => {
        //     console.log("products.length 61", products.length)
        //   })
        // console.log("=====$ Alert:[productQuantityArray] slower than [categories] =====")
        // console.log("categories", categories)
        // console.log("=================================")

        // 4. setTimeout：設定 200 毫秒，因非同步，上面[productQuantityArray]計算處理速度比 下面[對稱合併＆Constructor] 慢。
        setTimeout(function () {
          // 5. 2個陣列長度相同(共用相同 i)，對稱合併：1層 for loop＋"[CategoryId, name]＋[productQuantity]"
          // 注意：因陣列長度相同(共用相同 i)，所以只須 1層 for loop。
          for (let i = 0; i < categories.length; i++) {
            categories[i].productQuantity = productQuantityArray[i]
          }
          // console.log("categories", categories)
          // console.log("=================================")

          // 6. Constructor(物件導向 建構式函式)：建立 資料格式 & 資料 Title。
          function CategoryData(CategoryId, name, productQuantity) {
            this.CategoryId = CategoryId
            this.name = name
            this.productQuantity = productQuantity
          }

          // 7. Constructor + .map()：以 Contstructor & .map()，建立 Instance，並產生新陣列[]。
          const data = categories.map((item, i, categories) => {
            // console.log("categories", categories)
            return new CategoryData(`${item.id}`, `${item.name}`, `${item.productQuantity}`)
          })

          // console.log("data", data)
          // console.log("=================================")

          // 8. res.json：回傳 JSON 格式的 API 資料。
          return res.json({ CategoryData: data })
        }, 200)
      })
  }
}


module.exports = dataController