var passport=require('passport');
var localStrategy=require('passport-local').Strategy;
var User = require('../model/User');
var Cart = require('../model/Cart');

passport.serializeUser((user , done)=>{
  return done(null , user.id)
})
passport.deserializeUser((id , done)=>{
    User.findById(id , ('email') , (err , user)=>{
        Cart.findById(id,(err,cart)=>{
            if(!cart){
                return done (err , user)
            }else {
                user.cart=cart;
                return done (err , user)
            }

        })
    })
})

passport.use('local-signin' , new localStrategy({
    usernameField : 'email' ,
    passwordField : 'Password',
    passReqToCallback : true 
}, (req , email , password , done)=>{
    

  User.findOne({email : email } , (err , user)=>{
      if(err){
          return done(err)
      }
      if(!user){
          return done(null , false , req.flash('signerr' , 'not found'))
         
        
      }if(!user.comparePass(password)){
          return done(null , false , req.flash('signerr' , ' password is incorrect'))
         
      }

          return done(null , user);
      
      
  })
}))


passport.use('local-signup' , new localStrategy({
    usernameField:'email',
    passwordField: 'Password',
    passReqToCallback:true,
} , (req , email , password , done)=>{
    User.findOne({email : email} , (err , user)=>{
        if(err){
            return done(err)
        }
        if(user){
            return done(null , false , req.flash('error' , 'email already exists'))
        }
        const newUser = new User({
            email : email,
            password : password,
        })
        User.save((error , doc)=>{
            if(err){
                return done(error)
            }
            else {
                return done ( null , doc )
            }
        })
        
    } )
}))

