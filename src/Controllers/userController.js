const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/userModel");
const validator = require('../Middleware/validation');

//***********************************************************************SignUp User*********************************************************************//

const createUser = async function (req, res) {
    try {
        let body = req.body
        //Validate body 
        if (!validator.isValidBody(body)) {
            return res.status(400).send({ status: false, msg: "User body should not be empty" });
        }

        let { fname, lname, email, password, pincode, address } = body

        // Validate fname
        if (!validator.isValid(fname)) {
            return res.status(400).send({ status: false, message: "fname must be present" })
        }

        // Validation of fname
        if (!validator.isValidName(fname)) {
            return res.status(400).send({ status: false, msg: "Invalid fname" })
        }

        // Validate lname
        if (!validator.isValid(lname)) {
            return res.status(400).send({ status: false, message: "lname must be present" })
        }

        // Validation of lname
        if (!validator.isValidName(lname)) {
            return res.status(400).send({ status: false, msg: "Invalid lname" })
        }

        // Validate email
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: "email must be present" })
        }

        // Validation of email id
        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Invalid email id" })
        }

        // Validate password
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "password must be present" })
        }

        // Validation of password
        if (!validator.isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "Invalid password" })
        }

        // Validate address
        if (!address) {
            return res.status(400).send({ status: false, message: "Address is required" })
        }

        // Validate billing pincode
        if (!validator.isValidPincode(pincode)) {
            return res.status(400).send({ status: false, msg: "Invalid pincode" })
        }

        // Duplicate entries
        email = email.toLowerCase().trim()
        let isAlreadyInUsed = await UserModel.findOne({ email });
        if (isAlreadyInUsed) {
            return res.status(400).send({ status: false, message: `${email} mail is already registered` })
        }

        // encrypted password
        let encryptPassword = await bcrypt.hash(password, 12)

        let userData = { fname, lname, email, password: encryptPassword, address, pincode }

        let savedData = await UserModel.create(userData)
        return res.status(201).send({ status: true, message: "User created successfully", data: savedData })

    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
};


//*******************************************************Login User****************************************************************************//

const login = async function (req, res) {
    try {
        const data = req.body;
        if (Object.keys(data).length <= 0) {
            return res.status(400).send({ status: false, message: "Plz Enter Email & Password In Body !!!" });
        }
        const email = req.body.email;
        if (!email) {
            return res.status(400).send({ status: false, message: "Plz Enter Email In Body !!!" });
        }
        const findData = await UserModel.findOne({ email }).select({ email: 1, password: 1 });
        if (!findData) {
            return res.status(400).send({ status: false, message: "Plz Enter Valid Email-Id !!!" });
        }
        const password = req.body.password;
        if (!password) {
            return res.status(400).send({ status: false, message: "Plz Enter Password In Body !!!" });
        }
        const match = await bcrypt.compare(password, findData.password);
        if (!match) {
            return res.status(400).send({ status: false, message: "Plz Enter Valid Password !!!" });
        }


        const userId = findData._id;
        const token = jwt.sign({
            userId: userId
        },
            "buildMomentSecret@@##!", { expiresIn: "24H" }
        );

        res.status(200).send({
            status: true,
            message: "User login successfully",
            data: { userId: userId, token: token }
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};



module.exports = { createUser, login }