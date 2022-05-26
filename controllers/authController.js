const User = require('../models/userModel');

const bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {
    const {username, password} = req.body;
    // const hashPassword = await bcrypt.hash(password, 12);
    
    try {
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            username,
            password: hashPassword,
        });
        req.sessions.user = newUser;
        res.status(201).json({
            status: 'Signup success',
            data: {
                user: newUser,
            }
        });
    }catch(e){
        console.log(e);
        res.status(400).json({
            status: "Signup Fail"
        });
    }
};

exports.login = async(req, res) => {
    const {username, password} = req.body;
    try {
        const user = await User.findOne({username});

        if (!user) {
            return res.status(404).json({
                status: 'Fail',
                message: "user not found"
            });
        };

        const isCorrect = await bcrypt.compare(password, user.password);

        if (isCorrect) {
            req.session.user = user;
            res.status(200).json({
                status: "isCorrect success"
            });
        }
        else {
            res.status(404).json({
                status: 'fail',
                message: "incorrect Username or Password"
            });
        }
    }catch(e){
        console.log(e);
        res.status(400).json({
            status: "fail"
        });
    }
};