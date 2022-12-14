const jwt=require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET || "vhiorhowhguiheuighweuigheiowhgioegoheoghehgioiwg";

const verifyJWT=(req,res,next)=>{
    const receivedToken=req.header("auth-token")
    console.log({receivedToken})
    if(!receivedToken){
        return res.status(401).json({error:"Please provide a valid authToken",message:"Please provide a valid authToken",success:false,invalidAuthToken:true})
    }
    try{
        const data=jwt.verify( receivedToken,JWT_SECRET)
        req.userId= data.id
         next()
    }
    catch(e){
        res.status(403).send({error:e,message:"Unauthorized Request",success:false,invalidAuthToken:true})
    }
}

module.exports=verifyJWT