const asyncHandler = require("express-async-handler");
const User = require("./Models/userModel");
const generateToken = require("./generateToken")

const registeruser = asyncHandler(async (req,res) => {
    const { name, email , password, contact, role } = req.body;

    if(!name || !email || !password || !contact || !role) {
      res.status(400);
      throw new Error("Please enter all the fields.")
    }

    const userExists = await User.findOne({ email });
    if(userExists) {
      res.status(400);
      throw new Error("User Already Exists.");
    }

 if(role == "TEACHER" || role == "STUDENT"){
  const user = await User.create({ name, email, password, contact, role });
  if(user){
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, contact: user.contact, role: user.role, token: generateToken(user._id), });
  }else{
    res.status(400);
    throw new Error("Failed To Create The User.");
  }
}else{
  res.status(401);
  throw new Error("Invalid Role");
}

});


const authoriseduser = asyncHandler(async (req,res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if(user && (await user.matchPassword(password))) {
    res.json({ _id: user._id, name: user.name, email: user.email, contact: user.contact, role: user.role, token: generateToken(user._id), });
  }else{
    res.status(401);
    throw new Error("Invalid Email or Password.");
  }
});

const allusers = asyncHandler(async (req,res) => {

        const users = await User.find();
        res.send(users);

});

module.exports = { registeruser, authoriseduser, allusers };
