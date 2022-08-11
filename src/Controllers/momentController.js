const UserModel = require("../Models/userModel");
const MomentModel = require("../Models/momentModel");
const aws = require("../aws/aws")
const validator = require('../Middleware/validation');

//*********************************************************************Add Moment*****************************************************************************//
const postMoment = async function (req, res) {
    try {
        const data = req.body;
        const { momentImage, tags, comments } = data
        if (Object.keys(data).length <= 0) {
            return res.status(400).send({ status: false, msg: "Plz enter data in formdata!!!" });
        }

        const userId = req.params.userId;
        if (userId.length < 24 || userId.length > 24) {
            return res.status(400).send({ status: false, msg: "Plz Enter Valid userId in Params !!!" });
        }
        const userFind = await UserModel.findOne({ _id: userId });
        if (!userFind) {
            return res.status(404).send({ status: false, msg: "User not found !!!" });
        }

        const tokenId = req.userId;
        if (tokenId != userId) {
            return res.status(401).send({ status: false, msg: "Not authorized !!!" });
        }

        if (!validator.isValid(tags)) {
            return res.status(400).send({ status: false, message: "tags is required" })
        }
        if (!validator.isValidName(tags)) {
            return res.status(400).send({ status: false, message: "tags contains only Alpha characters" })
        }

        if (!validator.isValid(comments)) {
            return res.status(400).send({ status: false, message: "please add comments" })
        }
        if (comments.length > 100) {
            return res.status(400).send({ status: false, message: "you can add comment at max 100 characters" })
        }

        let files = req.files;
        if (files && files.length > 0) {
            let uploadedFileURL = await aws.uploadFile(files[0]);
            let momentImage = uploadedFileURL;

            let userData = { momentImage, tags, comments, userId }

            let savedData = await MomentModel.create(userData)
            return res.status(201).send({ status: true, message: "Moment added successfully", data: savedData })
        }
        else {
            return res.status(400).send({ status: false, msg: "No file found" });
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: "Error", error: err.message })
    }
};


//******************************************************************Get Moment List*********************************************************************** */
const getListOfMoments = async function (req, res) {
    try {
        let query = {isDeleted:false};
        let getAllMoment = await MomentModel.find(query)

        if (!(getAllMoment.length > 0)) {
            return res.status(404).send({ status: false, message: "Moments Not Found" })
        }
        return res.status(200).send({ status: true, count: getAllMoment.length, message: "Success", data: getAllMoment })
    }
    catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}


//*********************************************************************update Added Moment******************************************************************************** */

const updateMoments = async function (req, res) {
    try {

        // Validate body
        const body = req.body
        // const reqBody = JSON.parse(req.body.data)
        if (!validator.isValidBody(body)) {
            return res.status(400).send({ status: false, msg: "Details must be present to update" })
        }

        // Validate params
        userId = req.params.userId
        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: `${userId} is invalid` })
        }

        const userFound = await UserModel.findOne({ _id: userId })
        if (!userFound) {
            return res.status(404).send({ status: false, msg: "User does not exist" })
        }

        // AUTHORISATION
        if (userId !== req['userId']) {
            return res.status(401).send({ status: false, msg: "Unauthorised access" })
        }

        // Validate params
        momentId = req.params.momentId
        if (!validator.isValidObjectId(momentId)) {
            return res.status(400).send({ status: false, msg: `${momentId} is invalid` })
        }
        
        const buildM = await MomentModel.findOne({ _id: momentId })
        if (!buildM) {
            return res.status(404).send({ status: false, msg: `Cannot find any moment with this momentId - ${momentId}` })
        }


        // Destructuring
        const { momentImage, tags, comments } = body;


        let updatedData = {}
        if (validator.isValid(comments)) {
            if (!validator.isValidName(comments)) {
                return res.status(400).send({ status: false, msg: "Invalid comments" })
            }
            updatedData['comments'] = comments
        }
        if (validator.isValid(tags)) {
            if (!validator.isValidName(tags)) {
                return res.status(400).send({ status: false, msg: "Invalid tags" })
            }
            updatedData['tags'] = tags
        }

            let files = req.files;
            if (files && files.length > 0) {
                let uploadedFileURL = await aws.uploadFile(files[0]);
            updatedData["momentImage"] = uploadedFileURL;
            }
            const updated = await MomentModel.findOneAndUpdate({ _id: momentId, isDeleted:false }, updatedData, { new: true })

            return res.status(200).send({ status: true, data: updated })
        }
    catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

//*********************************************************************delete Moment******************************************************************************** */

const deleteMoments = async function (req, res) {
    try {

        const momentId = req.params.momentId

        if (!validator.isValidObjectId(momentId)) {
            return res.status(400).send({ status: false, msg: `this ${momentId} is not valid` })
        }

        let deletedMoment = await MomentModel.findById({ _id: momentId })
        if (!deletedMoment) {
            return res.status(404).send({ status: false, msg: `this ${momentId} is not exist in db` })
        }

        if (deletedMoment.isDeleted == true) {
            return res.status(404).send({ status: false, msg: `this ${momentId} is Not Found` })
        }

        await MomentModel.findByIdAndUpdate({ _id: momentId }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

        return res.status(200).send({ status: true, msg: "Moment successfully deleted" })
    }
    catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

module.exports = { postMoment, getListOfMoments, updateMoments, deleteMoments }
