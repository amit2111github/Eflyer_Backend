<h1 align="center">  🛒 &nbsp; Shopping App 🛒 </h1>

> Built with MERN stack (MongoDB, Express, React and Node).


### <h2 align="center"> ⚡⚡⚡ &nbsp; [Live Demo](https://github.com/amit2111github/Eflyer_Backend/) ⚡⚡⚡ </h2>

## 📜 &nbsp; Table of contents

- [Main Features](#--main-features)
- [Technologies](#--technologies)
- [Key Concepts](#--key-concepts)
- [UML Diagram](#--uml-diagram)
- [Setup](#--setup)

## 🚩 &nbsp; Main Features

An ecommerce store built with MERN stack, and utilizes third party API's. This ecommerce store enable two main different flows or implementations:

1. Buyers browse the store categories, products and brands
2. Sellers or Merchants manage their own brand component 


* features:
  * Node provides the backend environment for this application
  * Express middleware is used to handle requests, routes
  * Mongoose schemas to model the application data
  * React for displaying UI components
  * Images are stored on cloudinary


#### 📝&nbsp; Project methodology

- *Register and signin system*
  - Anyone can register himself as a customer.
  - Customers can apply to be sellers. 
  - Shipper only created by the Admin.
  - Admins can create any other admins.
- *Product life cycle*
  - A seller add a product.
  - A customer order some products, number in stock decreases.
  - The customer tracks the order's state since it's placed. 
  - The product's seller get a notification about the order. 

- *Other facilities*
  - Users can edit their account info. 
  - Users can track their order's state. 
  - Users can add, delete or edit addresses. 
  - Users can have a wishlist with any amount of products.

#### Users roles -

- *Customer*
  - Sign up & login.
  - Switch the account to seller.
  - Purchase order of any amount of products.

- *Seller* -> all above plus.
  - Add and edit his own products.
  - Receive notifications of the new orders the customer make (only his products).

- *Admin* -> all above plus
  - Add, Edit and Delete categories.
  - Add, Edit and Delete any products.
  - Create other Admins.
  - Restrict any user from all the permissions.

## 💹 &nbsp; Technologies

> Project is created with:

#### Backend

- Express
- Mongoose
- Json Web Token (For authentication)
- bcryptjs (for data encryption)
- cloudinary
#### Frontend

- React JS
- React-router (To handle routing)
- Axios (For http requests)
- React Bootstrap


## 💡 &nbsp; Key Concepts

- MVC (Model-View-Controller)
- CRUD operations
- Authentication system
- Encrypting passwords
- Images handling using multer
- OOP (Object Oriented Programming)

## 📈 &nbsp; UML Diagram

> It's my first time to design a UML so maybe it sucks :D

![UML Diagram](https://res.cloudinary.com/dnd5dhyzv/image/upload/v1636538666/Logo/arche_lsuz82.jpg)

## 💻 &nbsp; Setup

To run this project, install it locally using npm:

1. First and foremost, open your terminal and type to clone this repository.
  
  git clone https://github.com/amit2111github/Eflyer_Backend.git
  
2. Install the necessary dependencies to your app by running 
  
  npm install
  
3. Launch the development build of the app, by running  
  
  npm start
  
4. Open your favourite browser and type
  
  http://localhost:8000/
  
5. Clone the backend of this repo by visiting [this](https://github.com/amit2111github/Eflyer_Backend)
Happy Coding :)

# Author

👤 &nbsp; *Amit Kumar*

- Github: [@amit2111github](https://github.com/amit2111github)
- Email: [amit.dev.nit@gmail.com](mailto:amit.dev.nit@gmail.com)
