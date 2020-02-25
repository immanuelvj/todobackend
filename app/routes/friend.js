const express = require('express');
const router = express.Router();
const FriendController = require("./../../app/controllers/friendController");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')
module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/friend`;
    
    app.post(`${baseUrl}/sendReq`,auth.isAuthorized, FriendController.sendReqFunction);
    app.post(`${baseUrl}/view/all`, auth.isAuthorized, FriendController.getAllReq);
    app.post(`${baseUrl}/deletereq`, auth.isAuthorized, FriendController.deleteReq);
    app.post(`${baseUrl}/acceptreq`, auth.isAuthorized, FriendController.acceptReq);
    
    app.post(`${baseUrl}/view/allfriends`, auth.isAuthorized, FriendController.getAllFriends);

    app.post(`${baseUrl}/deletefriend`, auth.isAuthorized, FriendController.deleteFriend);


    app.post(`${baseUrl}/view/allreq`, auth.isAuthorized, FriendController.getAllFriendReq);
}
