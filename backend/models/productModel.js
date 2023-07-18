const mongoose = require("mongoose")

const Schema = mongoose.Schema

const productSchema = new Schema({
  // id will be auto added 
  productName:{type:String, required:true},
  businessId:{type:String, required:true},
  businessName:{type:String, required:true},
  userEmail:{type:String, required:true},
  productCategory:{type:String, required:true},
  numberOfItems:{type:Number, required:true},
  productImage1:{type:String, required:true},
  productImage2:{type:String, required:true},
  productImage3:{type:String, required:true},
  requestedToAddToBlockChain:{type:Boolean, required:true},
  blockChainId:{type:String, required:true},
  QRcode:{type:String, required:true}
},{timestamps:true})

module.exports = mongoose.model('product', productSchema)