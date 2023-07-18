require("dotenv").config()
const mongoose = require("mongoose")


// firebase configuration
const admin = require("firebase-admin")
const serviceAccount = require("./serviceAccount.json")


admin.initializeApp({
  credential:admin.credential.cert(serviceAccount),
  storageBucket:process.env.BUCKET
})


module.exports = {admin:admin}



// routes
const userRoutes = require("./routes/userRoutes")
const sellerRoutes = require("./routes/users/sellerRoutes")
const adminRoutes = require("./routes/admin/adminRoutes")
const consumerRoutes = require("./routes/users/consumerRoutes")



const express = require("express")
const app = express()

// middleware 
app.use(express.json())


app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-requested-Width, Content-Type, Accept"
  )
  next()
})


// routes
// user routes (not buyers)
app.use("/api/authUsers",userRoutes)
// admin routes
app.use("/api/admin",adminRoutes)
// seller routes
app.use("/api/users/seller",sellerRoutes )
// user routes
app.use("/api/users/consumer", consumerRoutes)




// database connection
mongoose.connect(process.env.DB_URI)
  .then(()=>{
    // listening to the port 
    app.listen(process.env.PORT,()=>{
      console.log("listening on PORT: ", process.env.PORT, " and connected to DB");
    })
  })
  .catch((error)=>{
    console.log(error);
  })