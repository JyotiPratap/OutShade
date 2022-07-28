const usermodel = require("../Model/UserModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;


const isValid = function (value) {
    if (typeof value == 'undefined' || value === null) return false
    if (typeof value == 'string' && value.trim().length === 0) return false
    return true
}
const titleValid = function (title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1

}
const isValidRequestBody = (requestBody) => {
    return Object.keys(requestBody).length !== 0;
};

const isValidObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId);
};

// user register==========================================================
const user = async function (req, res) {
    try {
        let userData = req.body
        if (Object.keys(userData) == 0) {
            return res.status(400).send({ status: false, msg: "please Enter the details of User" })
        }
        if (!userData.title) {
            return res.status(400).send({ status: false, msg: "title is required" })
        }
        if (!isValid(userData.name)) {
            return res.status(400).send({ status: false, msg: "name is required" })
        }
        if (!isValid(userData.email)) {
            return res.status(400).send({ status: false, msg: "email is required" })
        }
        if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(userData.email.trim()))) {
            return res.status(400).send({ status: false, msg: "invalid email id" })
        }
        let dupEmail = await usermodel.findOne({ email: userData.email })
        if (dupEmail) {
            return res.status(400).send({ status: false, msg: "this email ID is already registered" })
        }
        if (!isValid(userData.password)) {
            return res.status(400).send({ status: false, msg: "password is required" })
        }
        if (userData.password.length < 8 || userData.password.length > 15)
            return res.status(400).json({ status: false, msg: "password length be between 8-15" });

        let saveData = await usermodel.create(userData)
        let result = {
            _id: saveData._id,
            title: saveData.title,
            name: saveData.name,
            email: saveData.email,
            password: saveData.password
        }
        return res.status(201).send({ status: true, data: result })

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

};

const login = async (req, res) => {
    try {
      if (!isValidRequestBody(req.body))
        return res.status(400).json({ status: false, msg: "invalid paramaters please provide email-password", });
  
      let { email, password } = req.body;
  
      if (!isValid(email))
        return res.status(400).json({ status: false, msg: "email is required" });
  
      const findUser = await usermodel.findOne({ email });
  
      if (!findUser) {
        return res.status(401).send({ status: false, message: `Login failed! email is incorrect.` });
      }
  
      if (!isValid(password))
        return res.status(400).json({ status: false, msg: "password is required" });
  
      let enPassword = findUser.password;
  
      if (!enPassword) {
        return res.status(401).send({ status: false, message: `Login failed! password is incorrect.` });
      }
  
      let userId = findUser._id;
  
      let token = await jwt.sign(
        {
          userId: userId,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 7,
        },
        "Group-38"
      );
  
      res.status(200).json({ status: true, msg: "loggedin successfully", data: { userId, token }, });
    } catch (err) {
      res.status(500).json({ status: false, msg: err.message });
    }
  };

const logout = (req, res) => {
    return res.clearCookie("access_token").status(200).json({ message: "Successfully logged out" });
};




const changePassword = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.userId))
            return res
                .status(400)
                .json({ status: false, message: `${userId} is invalid` });

        const userFound = await usermodel.findOne({ _id: req.params.userId });

        if (!userFound)
            return res
                .status(404)
                .json({ status: false, message: `User do not exists` });

        if (req.params.userId.toString() !== req.userId)
            return res.status(401).json({
                status: false,
                message: `UnAuthorized access to user`,
            });

        if (!isValidRequestBody(req.body))
            return res
                .status(400)
                .json({ status: false, message: "Please provide details to update" });

        let { password } = req.body;

        let updateUserData = {};

        if (password.length < 8 || password.length > 15)
            return res
                .status(400)
                .json({ status: false, msg: "password length be btw 8-15" });

        if (isValid(password)) {
            const encryptPass = await bcrypt.hash(password, saltRounds);
            updateUserData["password"] = encryptPass;
        }

        const updatedUserData = await usermodel.findOneAndUpdate(
            { _id: req.params.userId },
            updateUserData,
            { new: true }
        );

        return res
            .status(201)
            .json({
                status: true,
                msg: "password changed successfully",
                data: updatedUserData,
            });
    } catch (error) {
        return res.status(500).json({ status: false, msg: error.message });
    }
};



module.exports = { user, login, logout, changePassword }; 