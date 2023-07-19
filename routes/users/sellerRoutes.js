const express = require("express")
const multer = require("multer")


// controllers
const {
  getAllSellerProducts, createSellerProduct, updateSellerProduct,updateSellerProductQRCode,deleteProduct,

  getBusinessRegistrationDetails, createBusinessRegistrationDetails, updateBusinessRegistrationDetails, deleteBusinessRegistrationDetails, 

  getAllRelatedReportsRelatedToBusiness
} = require("../../controllers/sellerControllers")

// middleware
const requireAuth = require("../../middleware/requireAuth")

const router = express.Router()


// productMulter 
const uploadProduct = multer({
  storage:multer.memoryStorage()
})


const uploadRegistration = multer({
  storage:multer.memoryStorage()
})



router.use(requireAuth)


// registrationRoutes

// get gegistration details by email
router.get("/getAllRegistrationDetails", getBusinessRegistrationDetails)

router.post("/createRegistrationDetails", uploadRegistration.fields([
  { name: 'businessLogo' },
  { name: 'businessLegalDocument' }
]), createBusinessRegistrationDetails)

router.patch("/updateRegistrationDetails/:id", uploadRegistration.single('businessLegalDocument'),updateBusinessRegistrationDetails)

router.patch("/UpdateQR/details/:id", uploadProduct.single('QRcode'),updateSellerProductQRCode)

router.delete("/deleteRegistrationDetails/:id", deleteBusinessRegistrationDetails)





// get all products listed by the seller 
router.get("/getAllProducts", getAllSellerProducts )

// creating a product 
router.post('/createProduct', uploadProduct.fields([
  { name: 'productImage1' },
  { name: 'productImage2' },
  { name: 'productImage3' }
]), createSellerProduct);


router.patch("/updateProduct/:id", uploadProduct.fields([
  { name: 'productImage1' },
  { name: 'productImage2' },
  { name: 'productImage3' }
]), updateSellerProduct)


router.delete("/deleteProduct/:id", deleteProduct)




// get all related reports
router.get("/getAllRelatedReports" , getAllRelatedReportsRelatedToBusiness)

module.exports = router