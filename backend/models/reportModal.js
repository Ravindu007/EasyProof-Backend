const mongoose = require("mongoose")

const Schema = mongoose.Schema

const reportSchema = new Schema({
  businessId:{type:String, required:true},
  businessName:{type:String, required:true},
  productName:{type:String, required:true},
  dateOfPurchase:{type:String, required:true},
  fakeProductImage1:{type:String, required:true},
  fakeProductImage2:{type:String, required:true}
},{timestamps:true})

module.exports = mongoose.model('report',reportSchema)