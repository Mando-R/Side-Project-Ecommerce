const db = require("../models")
const { Category, Product } = db

const Highcharts = require("highcharts")
const axios = require('axios')

const dataController = {

  getCategoryShare: (req, res) => {

    Category.findAll({
      raw: true,
      nest: true,
      // include: [{ model: Product }]
    })
      .then(categories => {
        // Constructor(物件導向 建構式函式)
        function CategoryName(name, y) {
          this.name = name
          this.y = y
        }

        const categoryName = categories.map((item, i, categories) => {
          // console.log(categories)
          // return categories[i] = new CategoryName(`${categories[i].name}`, 50)
          return new CategoryName(`${categories[i].name}`, 50)
        })

        console.log(JSON.stringify(categoryName.categoryName))
        // Highcharts接收格式為 JSON。
        return res.render("admin/dataAnalysis.hbs", { categoryName: JSON.stringify(categoryName) })
        // return res.render("admin/dataAnalysis.hbs", { categoryName: data })
        // return res.json({ categoryName: categoryName })
        // return res.render("admin/dataAnalysis.hbs")
      })
    // return res.render("admin/dataAnalysis.hbs")
  }
}


module.exports = dataController

