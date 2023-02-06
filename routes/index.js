var express = require('express');
var router = express.Router();
const product = require('../model/products');
const Cart = require("../model/Cart");
var User =require('../model/User');



/* GET home page. */
router.get('/', function (req, res, next) {
  var totalProducts = null;
  if(req.isAuthenticated()){
    if(req.user.cart){
         totalProducts=req.user.cart.totalQuantity;
    }else{
      totalProducts=0;
    }
 
  }
 
  // product.deleteMany({} ,(err,doc)=>{
  //   if(err){
  //     console.log(err)
  //   }
  //   console.log(doc)
  // })

  product.find({}, (error, doc) => {
    if (error) {
      console.log(error)
    } else {
      var productGrid = [];
      var grid = 3;
      for (var i = 0; i < doc.length; i += grid) {
        productGrid.push(doc.slice(i, i + grid))

        // console.log(productGrid)
      }
      res.render('index', { title: 'Cappello Cafe', 
      products: productGrid, 
      checkuser: req.isAuthenticated() , 
      totalProducts:totalProducts });
    }
  }).lean().limit(6)

});

router.get("/addtocart/:id/:price/:productName", function (req, res, next) {
  
  // Cart.deleteMany({},(error,doc)=>{
  //   if(error){
  //     console.log(error)
  //   }
  //   console.log(doc)
  // })
  
  console.log(req.params.id)
  console.log(req.params.price)
  console.log(req.user)
  const cartID = req.user._id;
  const newprodutprice = parseInt(req.params.price, 10);
  const newProduct = {
    _id: req.params.id,
    name: req.params.productName,
    price: newprodutprice,
    quantity :1,
  }

  Cart.findById(cartID, function (error, cart) {
    if (error) {

    }
    if (!cart) {
      const newcart = new Cart({
        _id: cartID,
        totalPrice: newprodutprice,
        totalQuantity: 1,
        selectedProduct: [newProduct],

      })
      newcart.save((error, cart) => {
        if (error) {
          console.log(error)
        } else {
          console.log(cart)
        }
      })
    }
    
    if (cart) {
      var indexOfProduct = -1;
      for (var i = 0; i < cart.selectedProduct.length; i++) {
        if (req.params.id === cart.selectedProduct[i]._id) {
          indexOfProduct = i;
          console.log(indexOfProduct)
          break;
        }
        }
        if (indexOfProduct >= 0) {
         cart.selectedProduct[indexOfProduct].price=cart.selectedProduct[indexOfProduct].price + newprodutprice;
         cart.selectedProduct[indexOfProduct].quantity=cart.selectedProduct[indexOfProduct].quantity + 1;
         cart.totalQuantity = cart.totalQuantity + 1;
         cart.totalPrice = cart.totalPrice + newprodutprice;
         Cart.updateOne({ _id: cartID }, { $set: cart }, (error, doc) => {
          if (error) {
            console.log(error)
          } 
            console.log(doc)
            console.log(cart)
          
        })

        } else {
          cart.totalQuantity = cart.totalQuantity + 1;
          cart.totalPrice = cart.totalPrice + newprodutprice;
          cart.selectedProduct.push(newProduct);
          Cart.updateOne({ _id: cartID }, { $set: cart }, (error, doc) => {
            if (error) {
              console.log(error)
            } 
              console.log(doc)
              console.log(cart)
            
          })
        }

      
    }
    
  })
  res.redirect('/')
})

router.get('/shopping-cart' , (req , res , next)=>{

  if(!req.isAuthenticated()){
    res.redirect('/users/signin')
    return ;
  }
  if(!req.user.cart){
    res.redirect('/')
    return ;
  }
  console.log(req.user.cart.selectedProduct.name)
  var userCart = req.user.cart;

  res.render('shoppingcart' , {userCart:userCart ,  
    checkuser: req.isAuthenticated() , 
    totalProducts:req.user.cart.totalQuantity})
 
})
router.get('/increase/:index' , (req,res,next)=>{
  const index =req.params.index ;
  const userCard=req.user.cart;
  const productPrice= userCard.selectedProduct[index].price / userCard.selectedProduct[index].quantity;

  userCard.selectedProduct[index].quantity=userCard.selectedProduct[index].quantity +1;
  userCard.selectedProduct[index].price=userCard.selectedProduct[index].price + productPrice;
  userCard.totalPrice=userCard.totalPrice + productPrice;
  userCard.totalQuantity=userCard.totalQuantity + 1;

  Cart.updateOne({_id:req.user._id} , {$set:userCard} , (err,doc)=>{
    if(err){
      console.log(err)
    }
    res.redirect('/shopping-cart')
  })

})


router.get('/decrease/:index' , (req,res,next)=>{
  const index =req.params.index ;
  const userCard=req.user.cart;
  const productPrice= userCard.selectedProduct[index].price / userCard.selectedProduct[index].quantity;

  userCard.selectedProduct[index].quantity=userCard.selectedProduct[index].quantity  - 1;
  userCard.selectedProduct[index].price=userCard.selectedProduct[index].price - productPrice;
  userCard.totalPrice=userCard.totalPrice - productPrice;
  userCard.totalQuantity=userCard.totalQuantity - 1;

  Cart.updateOne({_id:req.user._id} , {$set:userCard} , (err,doc)=>{
    if(err){
      console.log(err)
    }
    res.redirect('/shopping-cart')
  })

})

router.get('/delete/:index' , (req , res , next)=>{
  const index =req.params.index ;
  const userCard=req.user.cart;
  if(userCard.selectedProduct.length<=1){
    Cart.deleteOne({_id:req.user._id} ,(err , doc)=>{
      if(err){
        console.log(err)
      }
 
      console.log(doc) 
          res.redirect('/shopping-cart')
    })

  }else{
    userCard.totalPrice=userCard.totalPrice - userCard.selectedProduct[index].price;
    userCard.totalQuantity = userCard.totalQuantity - userCard.selectedProduct[index].quantity;
    userCard.selectedProduct.splice(index , 1)
    Cart.updateOne({_id:req.user._id} , {$set:userCard} , (err,doc)=>{
      if(err){
        console.log(err)
      }else{
         res.redirect('/shopping-cart')
      }
    })
    
  }

  

})


module.exports = router;
