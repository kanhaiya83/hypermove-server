const express=require("express")

const app=express()
const cors=require("cors")
var corsOptions = {
    origin: "*"
  };
  
  app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT=process.env.PORT || 5000;
const scoreRouter=require("./routes/score")

app.use("/score",scoreRouter)
app.listen(PORT,()=>{
    console.log(PORT);
})