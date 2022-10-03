const express = require("express");
const randomstring = require("randomstring");
const jwt = require("jsonwebtoken");

const { recoverPersonalSignature } = require("eth-sig-util");
const Web3 = require("web3");
const scoreRouter = require("./routes/score");
const steamRouter = require("./routes/steam");
const adminRouter = require("./routes/admin");
const app = express();
require("./config/steam")(app);
const cors = require("cors");
const { UserModel } = require("./config/database");
var corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://hypermove-demov2.netlify.app",
    "https://hypermove.io",
    "https://www.hypermove.io",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://hypermove-demo.s3-website.ap-south-1.amazonaws.com"
  ],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

app.use("/admin", adminRouter);
app.use("/score", scoreRouter);
app.use("/", steamRouter);

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

    const user = await UserModel.findOne({ address });

    if (user && user.messageToSign) {
      // messageToSign already exists for that particular wallet address
      messageToSign = user.messageToSign;
    } else {
      if (user) {
        await UserModel.updateOne({ address }, { messageToSign });
      } else {

        const savedUser = await UserModel({
          address,
          messageToSign,
        }).save();
       
      }
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
  console.log({ signingAddress, address });
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

    // if (!doc.exists) {
    //   return res.send({ error: "invalid_message_to_sign" });
    // }
    const user = await UserModel.findOne({ address });
    if (!user) {
      return res.send("User not found");
    }
    messageToSign = user.messageToSign;

    // const { messageToSign } = doc.data();

    if (!messageToSign) {
      return res.send({ error: "invalid_message_to_sign" });
    }

    const validSignature = isValidSignature(address, signature, messageToSign);

    if (!validSignature) {
      return res.send({ success: false, error: "invalid_signature" });
    }
    const jwtPayload = { id: user._id };
    const authToken = await jwt.sign(jwtPayload, process.env.JWT_SECRET);

    const updatedUser = await UserModel.findOneAndUpdate(
      { address },
      { messageToSign: null, isMetamaskConnected: true },
      { new: true }
    );

    return res.send({ address, authToken, success: true, updatedUser });
  } catch (error) {
    console.log(error);
    return res.send({ error: "server_error" });
  }
};
app.get("/users/:method",async(req,res)=>{
  if(req.params.method ==="delete"){
      return res.send(await UserModel.deleteMany({}))
  }
  return res.send(await UserModel.find({}))
})
app.get("/jwt", getJWT);
app.get("/message", getMessageToSign);

app.listen(PORT, () => {
  console.log(PORT);
});
