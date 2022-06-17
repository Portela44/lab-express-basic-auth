const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;


router.get("/signup", async (req, res, next) => {
    res.render("auth/signup");
});

router.get("/login", async (req, res, next) => {
    res.render("auth/login");
})

router.post("/signup", async (req, res, next) => {
    const {username, password} = req.body;
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.create({username, hashedPassword});
        res.redirect("/auth/login");
    } catch (error) {
        next(error);
    }
});

router.post("/login", async (req, res, next) => {
    const {username, password} = req.body;
    if(!username || !password) {
        res.render("auth/login", {error: "At least try you loser."});
        return;
    } 
    try {
        const user = await User.findOne({username: username});
        if(!user) {
            res.render("auth/login", {error: "Username is not registered, Try with another one."});
            return;
        } else {
            const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
            if(passwordMatch) {
                req.session.currentUser = user;
                res.render("auth/profile", user)
            } else {
                res.render("auth/login", {error: "Invalid, try again"});
            }
        }
    } catch (error) {
        next(error);
    }
})

router.post("/logout", (req, res, next) => {
    req.session.destroy((err) => {
        if(err) {
            next(err)
        } else {
            res.redirect("/auth/login")
        }
    });
})

module.exports = router;

