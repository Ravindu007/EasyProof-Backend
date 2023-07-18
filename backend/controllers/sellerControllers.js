const businessRegistrationModel = require("../models/businessRegistrationModel")
const productModel = require("../models/productModel")
const reportModal = require("../models/reportModal")

const {admin}  = require("../server")
const bucket  = admin.storage().bucket(process.env.BUCKET)


// business Registration 

// get business registration Details reated to email
const getBusinessRegistrationDetails = async(req,res) => {
  const userEmail = req.query.userEmail
  try{
    const details = await businessRegistrationModel.findOne({userEmail:userEmail})
    res.status(200).json(details)
  }catch(error){
    res.status(400).json(error)
  }
}

// create business registration
const createBusinessRegistrationDetails = async(req,res) => {
  const {businessName, businessType,businessOwner,userEmail, businessRegistrationDate,approvalByAdmin, adminComment,package, productsPublished} = req.body 


  try{
    const files = req.files;

    if (!files || files.length < 2) {
      res.status(400).send('Please upload 2 requested files');
      return;
    } else {
      const fileUrls = [];
      let numUploaded = 0;

      const fileArray = Object.values(files);

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i][0];
        const fileName = file.originalname;
        const fileRef = bucket.file(fileName);
        
        const stream = fileRef.createWriteStream({
          metadata: {
            contentType: file.mimetype
          }
        });
   
        stream.on("error", (err) => {
          console.log(err);
          res.status(500).json({ error: 'An error occurred while uploading the images.' });
        });

        stream.on("finish", async () => {
          const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`
          fileUrls.push(url);
          numUploaded++;

          if (numUploaded === fileArray.length) {
            try {
              const business = await businessRegistrationModel.create({
                businessName, businessType,businessOwner,userEmail, businessRegistrationDate,approvalByAdmin, adminComment,package, productsPublished,
                businessLogo: fileUrls[0],
                businessLegalDocument: fileUrls[1]
              });

              res.status(200).json(business);
            } catch (error) {
              console.log(error);
              res.status(500).json({ error: 'An error occurred while creating the product.' });
            }
          }
        });

        stream.end(file.buffer);
      }
    }
  }catch(error){
    res.status(400).json(error)
  }  
}

const updateBusinessRegistrationDetails = async(req,res) => {

  const {id} = req.params

  try{
    const existingDetails = await businessRegistrationModel.findById(id)

    // update text fields
    existingDetails.approvalByAdmin = req.body.approvalByAdmin || existingDetails.approvalByAdmin
    existingDetails.adminComment = req.body.adminComment || existingDetails.adminComment
    existingDetails.package = req.body.package || existingDetails.package
    existingDetails.productsPublished = req.body.productsPublished || existingDetails.productsPublished


    let fileUrl = null

    if(req.file){
      const {originalname, buffer} = req.file 

      const file = bucket.file(`registrations/${originalname}`)

      await file.save(buffer, {contentType:"application/pdf"})

      fileUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`

      existingDetails.businessLegalDocument = fileUrl

      const updatedBusinessRegistrationDetails = await existingDetails.save()

      res.status(200).json(updatedBusinessRegistrationDetails)
    }else{
      const updatedBusinessRegistrationDetails = await existingDetails.save()
      res.status(200).json(updatedBusinessRegistrationDetails)
    }
  }catch(error){
    res.status(400).json(error)
  }
}

// delete business details 
const deleteBusinessRegistrationDetails = async(req,res) => {
  const {id} = req.params

  try {
    const deletedBusinessDetails = await businessRegistrationModel.findByIdAndDelete({_id:id})
    res.status(200).json(deletedBusinessDetails)
  } catch (error) {
    res.status(400).json(error)
  }
}








// get all products - seller listed
const getAllSellerProducts = async(req,res)=>{
  const userEmail = req.query.userEmail
  try {
    const allProducts = await productModel.find({userEmail:userEmail}).sort({createdAt:-1})
    res.status(200).json(allProducts)
  } catch (error) {
    res.status(400).json(error)
  }
}


// create product
const createSellerProduct = async(req,res) => {
  const {productName,businessId,businessName, userEmail, productCategory, numberOfItems,requestedToAddToBlockChain, blockChainId, QRcode} = req.body

  try{
    const files = req.files;

    if (!files || files.length < 3) {
      res.status(400).send('Please upload three product images.');
      return;
    } else {
      const imageUrls = [];
      let numUploaded = 0;

      const fileArray = Object.values(files);

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i][0];
        const fileName = file.originalname;
        const fileRef = bucket.file(fileName);
        
        const stream = fileRef.createWriteStream({
          metadata: {
            contentType: file.mimetype
          }
        });
   
        stream.on("error", (err) => {
          console.log(err);
          res.status(500).json({ error: 'An error occurred while uploading the images.' });
        });

        stream.on("finish", async () => {
          const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`
          imageUrls.push(imageUrl);
          numUploaded++;

          if (numUploaded === fileArray.length) {
            try {
              const product = await productModel.create({
                productName, userEmail,businessId,businessName, productCategory, numberOfItems,requestedToAddToBlockChain,blockChainId,QRcode,
                productImage1: imageUrls[0],
                productImage2: imageUrls[1],
                productImage3: imageUrls[2]
              });

              res.status(200).json(product);
            } catch (error) {
              console.log(error);
              res.status(500).json({ error: 'An error occurred while creating the product.' });
            }
          }
        });

        stream.end(file.buffer);
      }
    }
  }catch(error){
    res.status(400).json(error)
  }
}


// update - product
const updateSellerProduct = async (req, res) => {
  const { id } = req.params;

  const { numberOfItems, requestedToAddToBlockChain,blockChainId } = req.body;

  const updateObj = {};

  if (numberOfItems) {
    updateObj.numberOfItems = numberOfItems;
  }

  if(requestedToAddToBlockChain){
    updateObj.requestedToAddToBlockChain = requestedToAddToBlockChain;
  }

  if(blockChainId){
    updateObj.blockChainId = blockChainId
  }


  if (req.files) {
    const { productImage1, productImage2, productImage3 } = req.files;

    const imageUploadPromises = [];

    if (productImage1) {
      const fileName = productImage1[0].originalname;
      const fileRef = bucket.file(fileName);
    
      const stream = fileRef.createWriteStream({
        metadata: {
          contentType: productImage1[0].mimetype,
        },
      });
    
      stream.on("error", (err) => {
        console.log(err);
        res
          .status(500)
          .json({ error: "An error occurred while uploading the image." });
      });
    
      const promise = new Promise((resolve, reject) => {
        stream.on("finish", async () => {
          const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          updateObj.productImage1 = imageUrl;
          resolve();
          stream.end();
        });
      });
    
      imageUploadPromises.push(promise);
      stream.end(productImage1[0].buffer);
      
    }
    
    if (productImage2) {
      const fileName = productImage2[0].originalname;
      const fileRef = bucket.file(fileName);
    
      const stream = fileRef.createWriteStream({
        metadata: {
          contentType: productImage2[0].mimetype,
        },
      });
    
      stream.on("error", (err) => {
        console.log(err);
        res
          .status(500)
          .json({ error: "An error occurred while uploading the image." });
      });
    
      const promise = new Promise((resolve, reject) => {
        stream.on("finish", async () => {
          const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          updateObj.productImage2 = imageUrl;
          resolve();
          stream.end();
        });
      });
    
      imageUploadPromises.push(promise);
    
      stream.end(productImage2[0].buffer);
    }
    
    if (productImage3) {
      const fileName = productImage3[0].originalname;
      const fileRef = bucket.file(fileName);
    
      const stream = fileRef.createWriteStream({
        metadata: {
          contentType: productImage3[0].mimetype,
        },
      });
    
      stream.on("error", (err) => {
        console.log(err);
        res
          .status(500)
          .json({ error: "An error occurred while uploading the image." });
      });
    
      const promise = new Promise((resolve, reject) => {
        stream.on("finish", async () => {
          const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          updateObj.productImage3 = imageUrl;
          resolve();
          stream.end();
        });
      });
    
      imageUploadPromises.push(promise);
    
      stream.end(productImage3[0].buffer);
    }
    
    await Promise.all(imageUploadPromises);
  }

  try {
    const product = await productModel.findByIdAndUpdate({_id: id},updateObj,{new: true}
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the product." });
  }
};

// adding qr code to product
const updateSellerProductQRCode = async(req,res) => {
  const { id } = req.params;

  try {
    const existingProduct = await productModel.findById(id)

  
  if (req.file) { 
      const filename = req.file.originalname
      const file = bucket.file(filename)

      const stream = file.createWriteStream({
        metadata:{
          contentType:req.file.mimetype
        }
      })

      stream.on("error",(err)=>{
        console.error(err);
      })

      stream.on("finish",async()=>{
        imgUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

        existingProduct.QRcode = imgUrl

        const updatedProduct = await existingProduct.save()
        res.status(200).json(updatedProduct)
      })
      stream.end(req.file.buffer)
    }

  } catch (error) {
    res.status(400).json(error)
  }
  
}


const deleteProduct = async(req,res) => {
  const {id} = req.params

  try {
    const deletedProduct = await productModel.findByIdAndDelete(id)
    res.status(200).json(deletedProduct)
  } catch (error) {
    res.status(400).json(error)
  }
}




// getting all the reports related to the business
const getAllRelatedReportsRelatedToBusiness = async(req,res) => {

  const businessId = req.query.businessId
  try{
    const allReports = await reportModal.find({businessId:businessId})
    res.status(200).json(allReports)
  }catch(error){
    res.status(400).json(error)
  }
}

module.exports = {
  getAllSellerProducts, createSellerProduct,updateSellerProduct,updateSellerProductQRCode,deleteProduct,
  
  getBusinessRegistrationDetails, createBusinessRegistrationDetails, updateBusinessRegistrationDetails, deleteBusinessRegistrationDetails,
  
  getAllRelatedReportsRelatedToBusiness

}