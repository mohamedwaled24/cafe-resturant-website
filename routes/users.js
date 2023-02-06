const { compare } = require('bcrypt');
var express = require('express');
var router = express.Router();
const { check, validationResult, Result } = require('express-validator');
const User = require('../model/User');
const bcrypt=require('bcrypt');
const passport = require('passport');
const { session } = require('passport');
const csrf = require('csurf');
const Cart = require('../model/Cart');





router.use(csrf());

/* GET users listing. */
router.get('/signup', function (req, res, next) {
  var msgErrors = req.flash('error')
  console.log(msgErrors)
  res.render('user/signup' , {messages : msgErrors , token : req.csrfToken()})
});

router.post('/signup', [
  check('email').not().isEmpty().withMessage('email cant be empty'),
  check('email').isEmail().withMessage('please enter your email coorect'),
  check('Password').not().isEmpty().withMessage('please enter password'),
  check('Password').isLength({ min: 5 }).withMessage('password should be more than 5 char'),
  check('confirm-Password').custom((value, { req }) => {
    if (value !== req.body.Password) {
      throw new Error('password and confirm password are not matched')
    }
    return true;
  })

], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

  var validationMessages = [];
  for ( var i =0;i<errors.errors.length ;i++){
    validationMessages.push(errors.errors[i].msg)
  }
  req.flash('error' , validationMessages)
  res.redirect('signup')
  console.log(validationMessages);


    return;
  } else {
    const user = new User({
      email: req.body.email,
      password: new User().hashPassword(req.body.Password)
    })


    User.findOne({ email: req.body.email }, (err, result) => {
      if (err) {
        console.log(err)
      } if (result) {
        req.flash('error' , 'this email already exists')
        res.redirect('signup')
        return;
      }

      user.save((errors , doc) => {
        if (errors) {
          console.log(errors)
        } else {
          res.redirect('/')
        }

      })

    })


  }

})

// sign in form

//sign get method
router.get('/signin' , isNotSign ,(req , res , next )=>{
  console.log(req.user)
  console.log(req.Error)
  var signinErrors = req.flash('signerr');
  res.render('user/signin'  , { messag : signinErrors , token : req.csrfToken() })
})
router.post('/signin' , [
  check('email').not().isEmpty().withMessage('email cant be empty'),
  check('email').isEmail().withMessage('please enter your email coorect'),
  check('Password').not().isEmpty().withMessage('please enter password'),
  check('Password').isLength({ min: 5 }).withMessage('password should be more than 5 char'),

], (req , res , next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

  var validationMessages = [];
  for ( var i =0;i<errors.errors.length ;i++){
    validationMessages.push(errors.errors[i].msg)
  }
  req.flash('signerr' , validationMessages)
  res.redirect('signin')
  console.log(validationMessages);


    return;
  }
  next();

} 
,passport.authenticate('local-signin' ,{
  successRedirect:'../',
  failureRedirect:'signin',
  failureFlash:true ,

}))

router.get('/profile' , isSignin ,  (req , res , next)=>{
  if(req.user.cart){
    totalProducts = req.user.cart.totalQuantity;
  }else{
    totalProducts=0;
  }
  res.render('user/profile' , {checkuser: true, checkprofile: true , totalProducts:totalProducts})
})


router.get('/logout' , (req , res , next )=>{
  req.logOut();
  res.redirect('../')
})


function isSignin(req , res , next){
  if(!req.isAuthenticated()){
    res.redirect('signin')
    return;
  }
  next();

}


function isNotSign(req , res , next){
  if(req.isAuthenticated()){
    res.redirect('../')
    return;
  }
  next();
}
// ,passport.authenticate('local-signin' , {session : false, successRedirect:'../' , failureRedirect:'signin' , failureFlash:true})
//signin post method
// router.post('/signin' , [
//   check('email').not().isEmpty().withMessage('email cant be empty'),
//   check('email').isEmail().withMessage('please enter your email coorect'),
//   check('Password').not().isEmpty().withMessage('please enter password'),
 

// ] ,
// passport.authenticate('local-signin' , {
//   session : false, 
//   successRedirect:'signup', 
//   failureRedirect:'signin' ,
//   failureFlash:true,
//   }) 
//   , 
//   (req , res , next)=>{

//   var errorr = validationResult(req);

//   if(!errorr.isEmpty()){
//     console.log(errorr.errors)
    
  
//     var validMessages = [];
//     for (var i = 0; i<errorr.errors.length ; i++){
//       validMessages.push(errorr.errors[i].msg);

//     }
//     req.flash('signerr' , validMessages)
//     res.redirect('signin')
//     return ;


//   }
// })
  
//  User.findOne({email : req.body.email} ,(err , result)=>{
//    if(err){
//      console.log(err)
//    }
//  if(!result){
//    console.log('email not found')
//  }
// if(!result.comparePass(password)){
// console.log('password and confirm password are not matched')



// }
//   console.log('wrong pass')
//  })





module.exports = router;
