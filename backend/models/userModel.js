const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const validator = require("validator")


const Schema = mongoose.Schema

const userSchema = new Schema({
  email:{type:String, required:true, unique:true},
  password:{type:String, required:true}
})


// signup method
userSchema.statics.signup = async function(email, password){

  if(!email || !password){
    throw Error("Both fields should be provided")
  }

  if(!validator.isEmail(email)){
    throw Error("This email is not valid")
  }

  if(!validator.isStrongPassword(password)){
    throw Error("Password is not strong enough")
  }
  
  const exists = await this.findOne({email})

  if(exists){
    throw Error("This email already exists")
  }

  // hashing the passsword 
  const salt = await bcrypt.genSalt(10)
  const hashPassword  = await bcrypt.hash(password, salt)

  const user = await this.create({email, password:hashPassword})
  return user
}

// login method
userSchema.statics.login = async function(email,password){
  if(!email || !password){
    throw Error("Both fields should be provided")
  }

  const user = await this.findOne({email})

  if(!user){
    throw Error("Incorrect Email")
  }

  const match = await bcrypt.compare(password, user.password)

  if(!match){
    throw Error("Incorrect Password")
  }

  return user
}


module.exports = mongoose.model('user', userSchema)