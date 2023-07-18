const express = require("express")
const multer = require("multer")


// controllers
const {
  getAllBusinessRegistrationDetails, giveAdminApprovalToBusiness,
  getAllSentToAdminProducts
} = require("../../controllers/adminControllers")


// middleware
const requireAuth = require("../../middleware/requireAuth")

const router = express.Router()


const upload = multer({
  storage:multer.memoryStorage()
})


router.use(requireAuth)


// admin routes - business details / registrations
router.get("/getAllRegistrationDetails", getAllBusinessRegistrationDetails)

// give approval to bsiness
router.patch("/registrationDetails/approval/:id", upload.none() ,giveAdminApprovalToBusiness )




module.exports = router