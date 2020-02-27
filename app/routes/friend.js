const express = require('express');
const router = express.Router();
const FriendController = require("./../../app/controllers/friendController");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')
module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/friend`;
    
    app.post(`${baseUrl}/sendReq`,auth.isAuthorized, FriendController.sendReqFunction);
    
        /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todo/create api for user login.
     *
     * @apiParam {string} userId of the user. (body params) (required)
     * @apiParam {string} userName of the user. (body params) (required)
     * @apiParam {string} friendReqName of the user. (body params) (required)
     * @apiParam {string} friendReqId of the user. (body params) (required)
 
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "req gathered",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "data": {
                "friendsId": da9sd8,
                "userId":"asdmlasd"
                "userName":"immanuel"
                "friendReqName":"sherin"
                "friendReqId":"xxxa3aw"
                
                
            }

        }
    */
    app.post(`${baseUrl}/view/all`, auth.isAuthorized, FriendController.getAllReq);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todo/create api for user login.
     *
     * @apiParam {string} userId of the user. (body params) (required)
  
 
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "friends gathered",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "data": {
                "friendsId": da9sd8,
                "userId":"asdmlasd"
                "userName":"immanuel"
                "friendReqName":"sherin"
                "friendReqId":"xxxa3aw"
                
                
            }

        }
    */
    app.post(`${baseUrl}/deletereq`, auth.isAuthorized, FriendController.deleteReq);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todo/create api for user login.
     *
     * @apiParam {string} friendsId of the user. (body params) (required)
 
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "ToDo gathered",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "data": {
                "friendsId": da9sd8,
                "userId":"asdmlasd"
                "userName":"immanuel"
                "friendReqName":"sherin"
                "friendReqId":"xxxa3aw"
                
                
            }

        }
    */
    app.post(`${baseUrl}/acceptreq`, auth.isAuthorized, FriendController.acceptReq);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todo/create api for user login.
     *
     * @apiParam {string} userId of the user. (body params) (required)
     * @apiParam {string} userName of the user. (body params) (required)
     * @apiParam {string} friendReqName of the user. (body params) (required)
     * @apiParam {string} friendReqId of the user. (body params) (required)
 
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Friend Created",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "data": {
                "friendsId": da9sd8,
                "userId":"asdmlasd"
                "userName":"immanuel"
                "friendName":"sherin"
                "friendId":"xxxa3aw"
                
                
            }

        }
    */
    app.post(`${baseUrl}/view/allfriends`, auth.isAuthorized, FriendController.getAllFriends);
        /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todo/create api for user login.
     *
     * @apiParam {string} userId of the user. (body params) (required)

     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Friend Gathered",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "data": {
                "friendsId": da9sd8,
                "userId":"asdmlasd"
                "userName":"immanuel"
                "friendName":"sherin"
                "friendId":"xxxa3aw"
                
                
            }

        }
    */
    app.post(`${baseUrl}/deletefriend`, auth.isAuthorized, FriendController.deleteFriend);
/**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todo/create api for user login.
     *
     * @apiParam {string} userId of the user. (body params) (required)
     * @apiParam {string} userName of the user. (body params) (required)
     * @apiParam {string} friendReqName of the user. (body params) (required)
     * @apiParam {string} friendReqId of the user. (body params) (required)
 
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Friend Deleted",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "data": {
                "friendsId": da9sd8,
                "userId":"asdmlasd"
                "userName":"immanuel"
                "friendName":"sherin"
                "friendId":"xxxa3aw"
                
                
            }

        }
    */

    app.post(`${baseUrl}/view/allreq`, auth.isAuthorized, FriendController.getAllFriendReq);
/**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todo/create api for user login.
     *
     * @apiParam {string} userId of the user. (body params) (required)
     * @apiParam {string} userName of the user. (body params) (required)
     * @apiParam {string} friendReqName of the user. (body params) (required)
     * @apiParam {string} friendReqId of the user. (body params) (required)
 
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Friend Viewed",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "data": {
                "friendsId": da9sd8,
                "userId":"asdmlasd"
                "userName":"immanuel"
                "friendName":"sherin"
                "friendId":"xxxa3aw"
                
                
            }

        }
    */
}
