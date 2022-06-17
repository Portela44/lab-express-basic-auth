const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;


router.get("/signup", async (req, res, next) => {
    res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
    const {username, password} = req.body;
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({username, hashedPassword});
        res.redirect("/");
    } catch (error) {
        next(error);
    }
});

module.exports = router;

