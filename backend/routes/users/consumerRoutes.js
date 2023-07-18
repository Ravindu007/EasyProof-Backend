const express = require("express")
const multer = require("multer")


// controllers
const {
  getScanDetails,getAllAuthenticatedProducts, getAllBusinessRegistrationDetails, createReport
} = require("../../controllers/consumerControllers")

const router = express.Router()

const uploadReport = multer({
  storage:multer.memoryStorage()
})


// user Roues

// get scan details
router.get("/getScanDetails", getScanDetails)

// get all authenticated products
router.get("/getAllAuthenticatedProducts", getAllAuthenticatedProducts)



// get all registered business Details for report 
router.get("/gatAllBusinessNames", getAllBusinessRegistrationDetails)

// create a report 
router.post("/createReport",uploadReport.fields([
  { name: 'fakeProductImage1' },
  { name: 'fakeProductImage2' }
]), createReport)

module.exports = router