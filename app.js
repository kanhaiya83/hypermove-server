const express=require("express")

const scoreRouter=require("./routes/score")
const adminRouter=require("./routes/admin")
const app=express()
const cors=require("cors")
var corsOptions = {
    origin: "*"
  };
  
  app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT=process.env.PORT || 5000;
app.use("/admin",adminRouter)
app.use("/score",scoreRouter)
app.listen(PORT,()=>{
    console.log(PORT);
})