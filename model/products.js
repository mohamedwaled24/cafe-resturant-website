const mongoose=require('mongoose');
const productSchema = mongoose.Schema({
    imagePath :{

        type : String,
        required : true,
    },

    productName :{
        type : String,
        required : true,
    },

    // productInfo :{
    //     type :{

    //     }

    // },
    price :{
        type : Number,
        required : true ,
    }
})

module.exports = mongoose.model('products' , productSchema);