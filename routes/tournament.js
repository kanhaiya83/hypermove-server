const express = require("express");
const { TournamentModel, UserModel } = require("../config/database");
const verifyJWT = require("../middlewares/verifyJWT");
const router = express.Router();

router.get("/",async(req,res)=>{

    try{
const tournamentsList=await  TournamentModel.find({}) 
return res.send({success:true,tournamentsList})
    }
    catch(e){
        console.log("Error in tournament/get =>",e);
        res.status(500).send({success:false})
    }
})



router.post("/",verifyJWT,async(req,res)=>{
// await UserModel.updateOne({_id:req.userId},{gems:100,tickets:20})
    try{
        const {entryFee}=req.body.tournamentData
        const gemsUsed=  parseInt(entryFee.gems)
        const ticketsUsed=  parseInt(entryFee.tickets)

        const foundUser = await UserModel.findById(req.userId)
        if(foundUser.gems< (gemsUsed) || foundUser.tickets < (ticketsUsed)){
            return res.send({success:false})
        }
        const user = await UserModel.findByIdAndUpdate(req.userId,{$inc : {gems:(-gemsUsed),tickets:(-ticketsUsed)}},{new:true}) 
        const newTour= new TournamentModel(req.body.tournamentData)
        const savedTournament = await newTour.save()
        return res.send({success:true,savedTournament,user})
    }
    catch(e){
        console.log("Error in tournament/get =>",e);
        res.status(500).send({success:false})
    }
})
router.get("/delete",async(req,res)=>{
 await    TournamentModel.deleteMany({})
 res.send("Done")
})
module.exports = router