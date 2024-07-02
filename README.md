# Social Media 

This project is a simple yet feature-rich social networking application built with MongoDB, Express.js, and Node.js. It provides users with a platform to share their thoughts through posts, engage with others by liking and commenting on posts, and build a network by following other users.

# API Endpoints

## Authentication
- Register: `POST /api/v1/register`
- Login: `POST /api/v1/login`
- Logout: `POST /api/v1/logout` 
- Update Password: `PUT /api/v1/update/password` 

## Posts
- Create Post: `POST /api/v1/post/upload` 
- Delete Post: `DELETE /api/v1/post/:id` 
- Like/Unlike Post: `GET /api/v1/post/:id` 
- Comment on Post: `POST /api/v1/post/comment/:id` 
- Get Posts of Following: `GET /api/v1/posts`
- Update Post Caption: `PUT /api/v1/post/:id` 

## User Profile
- Update Profile: `PUT /api/v1/update/profile` 
- Delete User Profile: `DELETE /api/v1/delete/profile` 
- Get User Profile: `GET /api/v1/user/:id`
- Get All Users: `GET /api/v1/users` 

## Social Interactions
- Follow User: `POST /api/v1/follow/:id` 
- Unfollow User: `POST /api/v1/unfollow/:id` 
- Get Followers: `GET /api/v1/followers/:id` 
- Get Following: `GET /api/v1/following/:id`

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed
- MongoDB running on your local machine or set up a MongoDB Atlas account

## Setup Instructions

To get the project up and running on your local machine, follow these steps:

- **Clone the repository to your local machine.**
- **Install the dependencies by running `npm install`.**
- **Set up your MySQL database and ensure it is running.**
- **Create a `.env` file in the root directory and populate it with your database credentials and JWT secret key.**
- **Start the server with `npm run dev`.**

## Technologies Used
- Node.js
- Express.js
- MongoDB
- JSON Web Tokens (JWT) for authentication
