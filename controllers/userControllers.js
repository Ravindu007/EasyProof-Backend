const jwt = require("jsonwebtoken")

const userModel = require("../models/userModel")

//token creation
const createToken = (_id) => {
  return jwt.sign({_id:_id},process.env.SECRET, {expiresIn:'3d'})
}


// login user 
const loginUser = async(req, res) => {
  const {email, password} = req.body 

  try {
    const user = await userModel.login(email, password)
    // create token 
    const token = createToken(user._id)

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error:error.message})
  }
}

const signupUser = async(req,res) => {

  const {email, password} = req.body 

  try {
    const user = await userModel.signup(email, password)
    // token creation after saving to database 
    const token = createToken(user._id)
    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error:error.message})
  }
}

module.exports = {loginUser, signupUser}