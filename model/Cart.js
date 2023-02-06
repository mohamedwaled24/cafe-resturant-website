const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    _id : {
        require : true , 
        type : String
    },
    totalPrice : {
        require :true,
        type : Number
    },
    totalQuantity :{
        require:true,
        type : Number
    },
    selectedProduct :{
        require: true,
        type : Array , 
    }
})

module.exports = mongoose.model ("Cart" , cartSchema);