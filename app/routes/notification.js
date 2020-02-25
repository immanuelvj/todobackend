const express = require('express');
const router = express.Router();
const appConfig = require("./../../config/appConfig");
const auth = require('./../middlewares/auth');
const notificationController = require('../controllers/notificationController');

let setRouter = (app) =>{
    
    let baseUrl = `${appConfig.apiVersion}/notification`;
    
    app.get(`${baseUrl}/view/:userId`,notificationController.viewByUserId)
/**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {get} /api/v1/comment api for view comment.
     *
     * @apiParam {string} userId userId of the image. (body params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Successful",
            "status": 200,
            "data": {
                "NotificatoinDetails": {
                "issueId":"sdajkdsakad"    
                "userId":"asdjkasdn",
                "NotificationId": "-E9zxTYA8"
                "message":"jkdasnlka"    
            }

    
    */

}


module.exports = {
    setRouter:setRouter
}