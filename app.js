const express=require("express")
const jwt = require("jsonwebtoken");

const { recoverPersonalSignature } = require("eth-sig-util");
const Web3 = require("web3");
const scoreRouter=require("./routes/score")
const steamRouter=require("./routes/steam")
const adminRouter=require("./routes/admin")
const app=express()
require("./config/steam")(app)
const cors=require("cors");
const { UserModel } = require("./config/database");

  
  app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT=process.env.PORT || 5000;

app.use("/admin",adminRouter)
app.use("/score",scoreRouter)
app.use("/",steamRouter)




















const isValidEthAddress = (address) => Web3.utils.isAddress(address);

const makeId = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const getMessageToSign = async (req, res) => {
  try {
    const { address } = req.query;

    if (!isValidEthAddress(address)) {
      return res.send({ error: "invalid_address" });
    }

    const randomString = makeId(20);
    let messageToSign = `Wallet address: ${address} Nonce: ${randomString}`;

    // const user = await admin.firestore().collection("users").doc(address).get();
    const user = await UserModel.findOne({address})

console.log({user});
    if (user && user.messageToSign) {

      // messageToSign already exists for that particular wallet address
      messageToSign = user.messageToSign;
    } else {
    //   admin.firestore().collection("users").doc(address).set(
    //     {
    //       messageToSign,
    //     },
    //     {
    //       merge: true,
    //     }
    //   );
    if(user){
      await UserModel.updateOne({address},{messageToSign})
    }
    else{const savedUser=await UserModel({address,messageToSign}).save()}
    }
    return res.send({ messageToSign, error: null });
  } catch (error) {
    console.log(error);
    return res.send({ error: "server_error" });
  }
};

const isValidSignature = (address, signature, messageToSign) => {
  if (!address || typeof address !== "string" || !signature || !messageToSign) {
    return false;
  }

  const signingAddress = recoverPersonalSignature({
    data: messageToSign,
    sig: signature,
  });

  if (!signingAddress || typeof signingAddress !== "string") {
    return false;
  }
console.log({signingAddress,address});
  return signingAddress.toLowerCase() === address.toLowerCase();
};

const getJWT = async (req, res) => {
  try {
    const { address, signature } = req.query;

    if (!isValidEthAddress(address) || !signature) {
      return res.send({ error: "invalid_parameters" });
    }

    // const [customToken, doc] = await Promise.all([
    //   admin.auth().createCustomToken(address),
    //   admin.firestore().collection("users").doc(address).get(),
    // ]);
    const jwtPayload = {address};
    const authToken = await jwt.sign(jwtPayload, process.env.JWT_SECRET);

    // if (!doc.exists) {
    //   return res.send({ error: "invalid_message_to_sign" });
    // }
    const user=await UserModel.findOne({address})
    if(!user){
      return res.send("User not found")
    }
    messageToSign=user.messageToSign

    // const { messageToSign } = doc.data();

    if (!messageToSign) {
      return res.send({ error: "invalid_message_to_sign" });
    }

    const validSignature = isValidSignature(address, signature, messageToSign);

    if (!validSignature) {
      return res.send({ error: "invalid_signature" });
    }
    const updatedUser = await UserModel.findOneAndUpdate({address},{messageToSign:null,isMetamaskConnected:true},{new:true})

    
      return res.send({address,authToken,success:true,updatedUser})    

  } catch (error) {
    console.log(error);
    return res.send({ error: "server_error" });
  }
};

app.get("/jwt", getJWT);
app.get("/message", getMessageToSign);












app.listen(PORT,()=>{
    console.log(PORT);
})