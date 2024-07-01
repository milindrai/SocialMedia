const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }

        user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: "sample_public_id",
                url: "sample_url",
            }
        });

        
        const options = {
            expires: new Date(Date.now() + 90*24*60*60*1000),
            httpOnly: true,
        };

        const token = await user.generateToken();
        res.status(201).cookie("token",token,options).json({
            success: true,
            user,
            token,
        });
        

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User does not exist',
            });
        }
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password',
            });
        }
      
        const options = {
            expires: new Date(Date.now() + 90*24*60*60*1000),
            httpOnly: true,
        };

        const token = await user.generateToken();
        res.status(200).cookie("token",token,options).json({
            success: true,
            user,
            token,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


exports.logout = async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: 'Logged out',
    });
}