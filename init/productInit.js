const Product = require('../model/products');
const mongoose=require('mongoose');

//connect db

mongoose.connect('mongodb://localhost/cappelo-cafe',{useNewUrlParser:true} , (err)=>{
  if(err){
    console.log(err)
  }else{
    console.log('connected to db .....')
  }
})

//products initiallization

const products = [new Product ({
    imagePath : 'images/coffe.png',
    productName : 'coffe',
    price : 76  ,
}),
new Product ({
    imagePath : 'images/smothie.png',
    productName : 'smoothie',
    price : 42 ,
}),
new Product ({
    imagePath : 'images/milk.png',
    productName : 'Milk-Shakes',
    price : 20 ,
}),
new Product ({
    imagePath : 'images/coffe.png',
    productName : 'hot drinks',
    price : 15 ,
}),
new Product ({
    imagePath : 'images/breakfast.png',
    productName : 'breakfast',
    price : 99  ,
}),
new Product ({
    imagePath : 'images/dessert.png',
    productName : 'dinner',
    price : 35  ,
})

]


//loop to save 
var done =0;

for(var i =0; i<products.length;i++){
   
    products[i].save((error , doc)=>{
        if(error){
            console.log(error)
        }
                console.log(doc)
            done++;
            if(done === products.length){
                mongoose.disconnect();
            
        
        }
        
    })
}


