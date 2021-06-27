## E-commerce Platform with Multi-Payment Gateway

### Features

#### Admin
1. Manage all products
2. Launch new products
3. Create new categories
4. User Authority
5. Operational data visualization

#### Customers / Visitors
1.	Product detail
2.	Categories
3.	Wishlist
4.	Pagination
5.	Searching products
6.	Shopping carts＆Orders
7.	Multiple Payment Gateway－Neweb Pay(藍新金流)

#### Operational Data API
1. Object-oriented programming: Design operational data API (JSON), including subtotal amount, average selling price, items, and quantity sorted by categories.

### Built With

#### Back-end
1.	[Node.js](https://nodejs.org/en/) / [Express](https://expressjs.com/) / [Express-handlebars](https://www.npmjs.com/package/express-handlebars) & handlebars-helpers
2.	MVC Framework
3.	RESTful API
4.	Third-party APIs
  - [Passport－Facebook Strategy](http://www.passportjs.org/docs/facebook/)
  - [Multiple Payment Gateway－Neweb Pay (藍新金流)](https://www.newebpay.com/website/Page/content/download_api)
  - [Imgur](https://imgur.com/)
5.	Object-oriented programming

#### Front-end
1. JavaScript (ES6+)
2. HTML 5 / CSS 3
3. Bootstrap / RWD / Font Awesome
4. [Highcharts (data visualization)](https://www.highcharts.com/)

### Package
1. [body-parser](https://www.npmjs.com/package/body-parser)
2. [method-override](https://www.npmjs.com/package/method-override)
3. [express](https://www.npmjs.com/package/express)
4. [express-handlebars](https://www.npmjs.com/package/express-handlebars)
5. [express-session](https://www.npmjs.com/package/express-session)
6. [connect-flash](https://www.npmjs.com/package/connect-flash)
7. [cookie-parser](https://www.npmjs.com/package/cookie-parser)
8. [moment](https://www.npmjs.com/package/moment)
9. [multer](https://www.npmjs.com/package/multer)
10. [imgur-node-api](https://www.npmjs.com/package/imgur-node-api)
11.	[bcryptjs](https://www.npmjs.com/package/bcryptjs)
12.	[passport](https://www.npmjs.com/package/passport)
13.	[passport-local](https://www.npmjs.com/package/passport-local)
14.	[passport-facebook](https://www.npmjs.com/package/passport-facebook)
15.	[passport-jwt](https://www.npmjs.com/package/passport-jwt)
16.	[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
17.	[dotenv](https://www.npmjs.com/package/dotenv)
18.	[pg](https://www.npmjs.com/package/pg)
19.	[faker](https://www.npmjs.com/package/faker)
20.	[mysql2](https://www.npmjs.com/package/mysql2)
21.	[sequelize](https://www.npmjs.com/package/sequelize)
22.	[sequelize-cli](https://www.npmjs.com/package/sequelize-cli)
23. [Highcharts (data visualization)](https://www.highcharts.com/)

### Deployment
[Heroku](https://www.heroku.com/home): [side-project-ecommerce](https://side-project-ecommerce.herokuapp.com/signin)

+ Admin - Test Account
  - email: root@example.com
  - password: 12345678

+ Customer / Visitor - Test Account
  - email: user1@example.com
  - password: 12345678

### Run MySQL server locally
#### Prerequisites
1. [npm](https://www.npmjs.com/)
2. [Node.js](https://nodejs.org/en/) 
3. [MySQL](https://www.mysql.com/) [(Sequelize)](https://sequelize.org/master/index.html)
4. [MySQL Workbench](https://www.mysql.com/products/workbench/)

#### Clone
Clone repository to local machine

    $ git clone https://github.com/Mando-R/Side-Project-Ecommerce.git

#### Database Setup－MySQL Workbench

    drop database if exists side_project_ecommerce;
    create database side_project_ecommerce;
    use side_project_ecommerce;

#### App Setup
1.Enter the app project folder

    $ cd side-project-ecommerce

2.Install packages via npm

    $ npm install

3.Create .env file

    $ touch .env

4.Sign up accounts for developer & Get secret keys
+ [Facebook for developers](https://developers.facebook.com/)
+ [Multiple Payment Gateway－Neweb Pay(藍新金流)](https://www.newebpay.com/website/Page/content/download_api)
+ [Imgur](https://imgur.com/)

+ Tech Blog:
  - [OAuth life cycle ＆ passport-FacebookStrategy](https://ryanx94.medium.com/oauth-life-cycle-passport-facebookstrategy-392b689e472c)
  - [Third-party API: Multiple Payment Gateway (Neweb Pay)](https://ryanx94.medium.com/third-party-api-multiple-payment-gateway-neweb-pay-89be25f4bab0)

5.Store Secret / API Keys in .env file

    SESSION_SECRET=
    
    IMGUR_CLIENT_ID=
    
    URL=
    MERCHANT_ID=
    HASH_KEY=
    HASH_IV=
    
    FACEBOOK_ID=
    FACEBOOK_SECRET=
    FACEBOOK_CALLBACK=
    
    JWT_SECRET=  

6.Edit password & database in config/config.json file
  
    "development": {
      "username": "root",
      "password": "password",
      "database": "Side_Project_Ecommerce",
      "host": "127.0.0.1",
      "dialect": "mysql"
    }

7.Edit scripts in package.json file 

    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "start": "node app.js",
      "dev": "nodemon app.js"
    }

8.Update and run Migration

    $ npx sequelize db:migrate

9.Add Seeders

    $ npx sequelize db:seed:all

10.Activate app

    $ npm run dev

11.Find the message below for successful activation

    App listening on port 3000!

12.Get Operational data API
+ Get API by accessing URL: [http://localhost:3000/api/admin/data/v1](http://localhost:3000/api/admin/data/v1)

+ Use [POSTMAN](https://www.postman.com/downloads/) to test API.
+ POSTMAN: Sign in `JWT`－To get the `Token` and put into the `Header's Authorization`.
  - Method: `POST`
  - URL: http://localhost:3000/api/signin
  - `Body` setup: Key－Value
    * email－root@example.com
    * password－12345678

+ POSTMAN: To get `API`.
  - Method: `GET`
  - URL: https://side-project-ecommerce.herokuapp.com/api/admin/data/v1
  - `Header` setup: Key－Value
    * `Authorization`－Bearer＋Space＋`Token`

+ Tech Blog: 
  - [Design Operational Data API sorted by Categories](https://ryanx94.medium.com/design-operational-data-api-sorted-by-categories-ce256f6b0a94)

### Reference
+ [Shopline showcases](https://shopline.tw/showcase):
  - [CHIA YI SHI RI (賈以食日)](https://www.chiaselect.com/)
  - [HYDY bottle](https://shoptw.myhydy.com/)
  - [greenvines(綠藤生機)](https://www.greenvines.com.tw/), etc.
