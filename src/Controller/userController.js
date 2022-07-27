const usermodel = require("../models/UserModel.js");
const jwt = require("jsonwebtoken");



const isValid = function (value) {
    if (typeof value == 'undefined' || value === null) return false
    if (typeof value == 'string' && value.trim().length === 0) return false
    return true
}
const titleValid = function (title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1

}
// user register==========================================================
const createUser = async function (req, res) {
    try {
        let userData = req.body
        if (Object.keys(userData) == 0) {
            return res.status(400).send({ status: false, msg: "please Enter the details of User" })
        }
        if (!userData.title) {
            return res.status(400).send({ status: false, msg: "title is required" })
        }
        if (!titleValid(userData.title.trim())) {
            return res.status(400).send({ status: false, msg: "please Enter valid title" })
        }
        if (!isValid(userData.name)) {
            return res.status(400).send({ status: false, msg: "name is required" })
        }
        if (!(/^[6-9]\d{9}$/.test(userData.mobile.trim()))) {
            return res.status(400).send({ status: false, msg: "invalid mobile Number" })
        }
        let dupMobile = await usermodel.findOne({ mobile: userData.mobile })
        if (dupMobile) {
            return res.status(400).send({ status: false, msg: "this mobile Number is already registered" })
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
        if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/).test(userData.password)) {
            return res.status(400).send({ status: false, msg: "password should contain at least [1,@.,a-zA]" })
        }
        if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/).test(userData.resetPasswordToken)) {
            return res.status(400).send({ status: false, msg: "resetPasswordToken should contain at least [1,@.,a-zA]" })
        }
        let saveData = await usermodel.create(userData)
        let result = {
            _id: saveData._id,
            title: saveData.title,
            name: saveData.name,
            email: saveData.email,
            password: saveData.password,
            resetPasswordToken: saveData.resetPasswordToken,
            createdAt: saveData.createdAt,
            updatedAt: saveData.updatedAt
        }
        return res.status(201).send({ status: true, data: result })

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

};

const login = async function (req, res) {
    try {
        let data = req.body
        if (Object.entries(data).length === 0) {
            res.status(400).send({ status: false, msg: "Kindly pass some data " })
        }

        let username = req.body.email
        let password = req.body.password

        if (!username) {
            return res.status(400).send({ status: false, msg: "Enter Valid Email" })
        }
        if (!password) {
            return res.status(400).send({ status: false, msg: "Enter valid Password" })
        }

        let user = await usermodel.findOne({ email: username, password: password })
        if (!user) {
            return res.status(400).send({ status: false, msg: "credentials dont match,plz check and try again" })
        }

        let token = jwt.sign({
            userId: user._id.toString(), exp: Math.floor(Date.now() / 1000) + (60 * 30)
        }, "Project_3")
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, data: token })

    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: error.message })
    }
};


const logout = (req, res) => {
    return res
        .clearCookie("access_token")
        .status(200)
        .json({ message: "Successfully logged out" });
};


const changePassword = async (req, res) => {
    try {
        if (!validator.isValidObjectId(req.params.userId))
            return res
                .status(400)
                .json({ status: false, message: `${userId} is invalid` });

        const userFound = await UserModel.findOne({ _id: req.params.userId });

        if (!userFound)
            return res
                .status(404)
                .json({ status: false, message: `User do not exists` });

        if (req.params.userId.toString() !== req.userId)
            return res.status(401).json({
                status: false,
                message: `UnAuthorized access to user`,
            });

        if (!validator.isValidRequestBody(req.body))
            return res
                .status(400)
                .json({ status: false, message: "Please provide details to update" });

        let { password } = req.body;

        let updateUserData = {};

        if (password.length < 8 || password.length > 15)
            return res
                .status(400)
                .json({ status: false, msg: "password length be btw 8-15" });

        if (validator.isValid(password)) {
            const encryptPass = await bcrypt.hash(password, saltRounds);
            updateUserData["password"] = encryptPass;
        }

        const updatedUserData = await UserModel.findOneAndUpdate(
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



module.exports = {createUser,login,logout,changePassword}; 