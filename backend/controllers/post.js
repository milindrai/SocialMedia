const Post= require('../models/Post');
const User = require('../models/User');



exports.createPost = async (req, res) => {
    try {
        const newPostData = {
            caption: req.body.caption,
            image: {
                public_id: req.body.public_id,
                url: req.body.url,
            },
            owner: req.user._id,
        };
        const post = await Post.create(newPostData);

        // Update the user's post array with the new post
        const user = await User.findById(req.user._id);
        user.posts.push(post._id);
        await user.save();
        
        res.status(201).json({
            success: true,
            post,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
};



exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        await Post.deleteOne({ _id: req.params.id });

        const user = await User.findById(req.user._id);
        const index = user.posts.indexOf(req.params.id);
        user.posts.splice(index, 1);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



exports.likeAndUnlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.likes.includes(req.user._id)) {
            const index = post.likes.indexOf(req.user._id);
            post.likes.splice(index, 1);
            await post.save();
            res.status(200).json({
                success: true,
                message: 'Post unliked',
            });
        } 
        else {
            post.likes.push(req.user._id);
            await post.save();
            res.status(200).json({
                success: true,
                message: 'Post liked',
            });
        }
    }
    catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message,
        });
    }
}

exports.commentOnPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        const comment = {
            comment: req.body.comment,
            user: req.user._id
        };
        post.comments.push(comment);
        await post.save();                  
        res.status(200).json({
            success: true,
            message: "Comment added successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


exports.getPostOfFollowing = async (req, res) => {
    try {
        const user=await User.findById(req.user._id);
        const posts=await Post.find({
            owner: {
                $in: user.following,
            }
        });
        res.status(200).json({
            success: true,
            posts,
        });
    } 
    
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


exports.updateCaption = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }
        post.caption = req.body.caption;
        await post.save();
        res.status(200).json({
            success: true,
            message: "Post updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}