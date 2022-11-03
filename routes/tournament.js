const express = require("express");
const { TournamentModel } = require("../config/database");
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



router.post("/",async(req,res)=>{
    try{
        const newTour= new TournamentModel(req.body.tournamentData)
        const savedTournament = await newTour.save()
        return res.send({success:true,savedTournament})
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