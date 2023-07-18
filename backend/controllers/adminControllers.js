const businessRegistrationModel = require("../models/businessRegistrationModel")

const {admin}  = require("../server")
const bucket  = admin.storage().bucket(process.env.BUCKET)

// get all the business registration details 
const getAllBusinessRegistrationDetails = async(req,res) => {
  try {
    const allRegistrations = await businessRegistrationModel.find({}).sort({createdAt:-1})
    res.status(200).json(allRegistrations)
  } catch (error) {
    res.status(400).json(error)
  }
}

const giveAdminApprovalToBusiness = async(req,res) => {
  const {id} = req.params

  try {
    const existingBusinessProfile = await businessRegistrationModel.findById({_id:id})

    // update fields
    existingBusinessProfile.approvalByAdmin = req.body.approvalByAdmin || existingBusinessProfile.approvalByAdmin

    existingBusinessProfile.adminComment = req.body.adminComment || existingBusinessProfile.adminComment

    // save existing updated profile
    const updatedBusinessProfile = await existingBusinessProfile.save()
    res.status(updatedBusinessProfile)
  } catch (error) {
    res.status(400).json(error)
  }
}



module.exports = {
  getAllBusinessRegistrationDetails, giveAdminApprovalToBusiness
}