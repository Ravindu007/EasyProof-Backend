const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")

const requireAuth =  async(req,res,next) => {
  // verify authentication 
  const {authorization} = req.headers

  if(!authorization){
    return res.status(401).json({error:"Authorization token required"})
  }

  // grabbing the token from authorization headers
  const token = authorization.split(" ")[1]

  try {
    const {_id} = jwt.verify(token, process.env.SECRET)

    // get the id of the user relaed to to the token and add it to the request
    req.user = await userModel.findOne({_id}).select('_id') //select the id
    next()
  } catch (error) {
    res.status(401).json({error:"Request not authorized"})
  }
}

module.exports = requireAuth