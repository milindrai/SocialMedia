const User = require('../models/User');
const Post = require('../models/Post');


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
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        const token = await user.generateToken();
        res.status(201).cookie("token", token, options).json({
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
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        const token = await user.generateToken();
        res.status(200).cookie("token", token, options).json({
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

exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide old and new password',
            });
        }
        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Old password is incorrect',
            });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}




exports.followUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot follow yourself',
            });
        }

        if (user.followers.includes(req.user._id)) {
            return res.status(400).json({
                success: false,
                message: 'You already follow this user',
            });
        }
        user.followers.push(req.user._id);
        await user.save();
        console.log("User followed");
        res.status(200).json({
            success: true,
            message: 'User followed',
        });

        const user2 = await User.findById(req.user._id);
        user2.following.push(user._id);
        await user2.save();
    }

    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.unfollowUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot unfollow yourself',
            });
        }
        if (!user.followers.includes(req.user._id)) {
            return res.status(400).json({
                success: false,
                message: 'You do not follow this user',
            });
        }
        const index = user.followers.indexOf(req.user._id);
        user.followers.splice(index, 1);
        await user.save();
        res.status(200).json({
            success: true,
            message: 'User unfollowed',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


exports.getFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        const followers = await User.find({ _id: { $in: user.followers } }).select('-email -followers -following -__v -posts');
        res.status(200).json({
            success: true,
            followers,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.getFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        const following = await User.find({ _id: { $in: user.following } }).select('-email -followers -following -__v -posts');
        res.status(200).json({
            success: true,
            following,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}



exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        const { name, email, avatar } = req.body;
        user.name = name;
        user.email = email;
        user.avatar = avatar;
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        await User.findByIdAndDelete(req.user._id);
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        const posts = await Post.find({ owner: req.user._id });
        for (let i = 0; i < posts.length; i++) {
            await Post.findByIdAndDelete(posts[i]._id);
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}