const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let isrole = function (value) {
    return ["admin", "mentor", "mentee"].indexOf(value) !== -1;
};
let isguidance = function (value) {
    return (
        [
            "Life & personal Devlopment",
            "Business & Entrepreneurship",
            "Carrer & Study",
            "Health & Sports",
            "Creative & Arts",
        ].indexOf(value) !== -1
    );
};

const createuser = async (req, res) => {
    try {
        let requestbody = req.body;
        let { email,  password, role, guidance } =
            requestbody;
        if (!password) {
            return res
                .status(400)
                .send({ status: false, message: "password is required" });
        }
        const salt = await bcrypt.genSalt(12);
        requestbody.password = await bcrypt.hash(password, salt);

        const findMail = await userModel.findOne({ email: email });
        if (findMail) {
            return res
                .status(400)
                .send({ status: false, message: "mail is already exist" });
        }
        if (!isrole(role)) {
            return res
                .status(400)
                .send({ status: false, message: "please choose role properly" });
        }

        if (!isguidance(guidance)) {
            return res
                .status(400)
                .send({ status: false, message: "please choose guidance properly" });
        }

        const createusers = await userModel.create(requestbody);
        return res
            .status(201)
            .send({ status: true, message: "user is created", data: createusers });
    } catch (error) {
        return res.status(201).send({ status: false, message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const requestbody = req.body;
        const { email, password } = requestbody;
        const findMail = await userModel.findOne({ email: email });
        // console.log(findMail.role)
        if (!findMail) {
            return res
                .status(400)
                .send({ status: false, message: "email is incorrect" });
        }
        let checkpass = await bcrypt.compare(password, findMail.password);
        // console.log(checkpass)
        if (!checkpass)
            return res
                .status(401)
                .send({ status: false, messege: "password is incorrect" });

        let token = jwt.sign(
            { userId: findMail._id, role: findMail.role },
            "AdminPortal",
            { expiresIn: "2hr" }
        );
        res.setHeader("x-api-key", token);
        return res
            .status(200)
            .send({
                status: true,
                message: "user login successfully",
                token: token,
                userId: findMail._id,
                role: findMail.role,
            });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};
const getuser = async (req, res) => {
    try {
        const query = req.query;
        const findusers = await userModel.find(query);
        if (!findusers) {
            return res
                .status(400)
                .send({ status: false, message: "useris not found" });
        }
        return res
            .status(200)
            .send({
                status: true,
                message: "user find successfully",
                data: findusers,
            });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

const updateuser = async (req, res) => {
    const requestbody = req.body;
    const userId = req.params.id;
    const finduser = await userModel.findById(userId);
    if (!finduser) {
        return res
            .status(400)
            .send({ status: false, message: "user is not found" });
    }
    let { email, nickname, password, role, guidance, description, avatar } = requestbody;
    if (email == "") {
        return res
            .status(400)
            .send({ status: false, message: "email is required" });
    }
    const findMail = await userModel.findOne({ email: email });
    // console.log(findMail.role)
    if (findMail) {
        return res
            .status(400)
            .send({ status: false, message: "email is incorrect" });
    }
    if (nickname == "") {
        return res
            .status(400)
            .send({ status: false, message: "nickname is required" });
    }
    if (password == "") {
        return res
            .status(400)
            .send({ status: false, message: "password is required" });
    }
    if (password) {
        let salt = await bcrypt.genSalt(12);
        requestbody.password = await bcrypt.hash(password, salt);
    }

    if (role == "") {
        return res
            .status(400)
            .send({ status: false, message: "role is required" });
    }

    if (role) {
        if (!isrole(role)) {
            return res
                .status(400)
                .send({ status: false, message: "please choose role properly" });
        }
    }

    if (guidance == "") {
        return res
            .status(400)
            .send({ status: false, message: "guidance is required" });
    }
    if (guidance) {
        if (!isguidance(guidance)) {
            return res
                .status(400)
                .send({ status: false, message: "please choose guidance properly" });
        }
    }
    if (description == "") {
        return res
            .status(400)
            .send({ status: false, message: "description is required" });
    }

    if (avatar == "") {
        return res
            .status(400)
            .send({ status: false, message: "profile img is required" });
    }

    const updateuser = await userModel.findByIdAndUpdate(
        { _id: userId },
        requestbody,
        { new: true }
    );
    return res
        .status(200)
        .send({
            status: true,
            message: "user update successfully",
            data: updateuser,
        });
};
module.exports = { createuser, login, getuser, updateuser };
