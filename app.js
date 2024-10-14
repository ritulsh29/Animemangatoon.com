const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser")
const app=express();
mongoose.connect("mongodb://localhost:27017/Sample",{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log('Connected with mongodb')

}).catch((err)=>{
    console.log(err)
})
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json())

const productSchema=new mongoose.Schema({
    title: String,
    description: String,
    characters: [
       {
          name: String,
          role: String
       }
    ]
 }
 )

const Product = new mongoose.model("Product", productSchema)
app.post("/api/v1/product/new",async(req,res)=>{
    const product=await Product.create(req.body);
    res.status(200

    ).json({
        success:true,
        product
    })
})
app.get("/api/v1/products",async (req,res)=>{
    const products=await Product.find();

    res.status(200).json({success:true,
        products

    })
})

app.put("/api/v1/product/:id",async(req,res)=>{
    let product=await Product.findById(req.params.id);
    product=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,
        usefindModify:true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        product
    })
})
app.delete("/api/v1/product/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        
        await product.deleteOne(); 
        
        res.status(200).json({
            success: true,
            message: "Product is deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

app.listen(4500,()=>{
    console.log("Server running http://localhost:4500")
})