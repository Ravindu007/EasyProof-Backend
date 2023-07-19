const businessRegistrationModel = require("../models/businessRegistrationModel")
const productModel = require("../models/productModel")
const reportModal = require("../models/reportModal")

const {admin}  = require("../server")
const bucket  = admin.storage().bucket(process.env.BUCKET)


const getScanDetails = async(req, res) => {
  const result = req.query.result

  try{
    const scannedItem = await productModel.findOne({blockChainId:result})
    res.status(200).json(scannedItem)
  }catch(error){
    res.status(400).json(error)
  }
}

const getAllAuthenticatedProducts = async(req,res)=>{
  try{
    const allAuthenticProducts = await productModel.find({requestedToAddToBlockChain:true}).sort({createdAt:-1})
    res.status(200).json(allAuthenticProducts)
  }catch(error){
    res.status(400).json(error)
  }
}



// for reporting feature get all the business Details
const getAllBusinessRegistrationDetails = async(req,res) => {
  try {
    const allRegistrations = await businessRegistrationModel.find({}).select('businessName').sort({createdAt:-1})
    res.status(200).json(allRegistrations)
  } catch (error) {
    res.status(400).json(error)
  }
}

// create a report 
const createReport = async(req,res) => {
  const {businessId, businessName, productName, dateOfPurchase} = req.body

  const imageUrls = []
  if(req.files){
    const {fakeProductImage1, fakeProductImage2} = req.files 

    const imageUploadPromises = []

    if(fakeProductImage1){
      const filename = fakeProductImage1[0].originalname 
      const fileRef  = bucket.file(`/reports/${filename}`)

      const stream = fileRef.createWriteStream({
        metadata:{
          contentType:fakeProductImage1[0].mimetype
        }
      })

      stream.on("error",err => {
        console.error(err)
      })

      const promise = new Promise((resolve,reject) => {
        stream.on("finish",async()=>{
          const imgUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`
          imageUrls.push(imgUrl)
          resolve()
          stream.end()
        })
      })

      imageUploadPromises.push(promise)
      stream.end(fakeProductImage1[0].buffer)
    }
    if(fakeProductImage2){
      const filename = fakeProductImage2[0].originalname 
      const fileRef  = bucket.file(`/reports/${filename}`)

      const stream = fileRef.createWriteStream({
        metadata:{
          contentType:fakeProductImage2[0].mimetype
        }
      })

      stream.on("error",err => {
        console.error(err)
      })

      const promise = new Promise((resolve,reject) => {
        stream.on("finish",async()=>{
          const imgUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`
          imageUrls.push(imgUrl) 
          resolve()
          stream.end()
        })
      })

      imageUploadPromises.push(promise)
      stream.end(fakeProductImage2[0].buffer)
    }
    await Promise.all(imageUploadPromises)
  }

  try{
    const report = await reportModal.create({businessId, businessName, productName, dateOfPurchase, fakeProductImage1:imageUrls[0], fakeProductImage2:imageUrls[1] })
    res.status(200).json(report)
  }catch(error){
    res.status(400).json(error)
  }
}


module.exports = {getScanDetails,getAllAuthenticatedProducts,getAllBusinessRegistrationDetails, createReport}