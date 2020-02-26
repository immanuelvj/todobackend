const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const passwordLib = require('./../libs/generatePasswordLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const token = require('../libs/tokenLib')
const AuthModel = mongoose.model('Auth')
const nodemailer = require("nodemailer")

/* Models */
const FriendReqModel = mongoose.model('FriendReq')
const FriendModel = mongoose.model('Friend')



// start sendReqFunction

let sendReqFunction = (req, res) => {
    let validateSentReqwithFriend = () =>{
        return new Promise((resolve,reject)=>{
            FriendModel.findOne({$or:[
                {$and:[{userId:req.body.userId},{friendReqId:req.body.friendReqId}]},
                {$and:[{userId:req.body.friendReqId},{friendReqId:req.body.userId}]}
            ]},(err,friendReqDetails)=>{
            if(err){
                logger.error('Failed to Retrieve Details','recoverController:findUser()',10)  
                let apiResponse = response.generate(true, 'Failed To Find FriendReq Details', 500, null)
                    reject(apiResponse)
            }
            else if(check.isEmpty(friendReqDetails)){
                resolve();
            }
            else{
                let apiResponse = response.generate(true,'You are already a friend !',302,null)
                reject(apiResponse)
            }
        })
        })
    }
    let validateSentReq = () =>{
        return new Promise((resolve,reject)=>{
            FriendReqModel.findOne({$or:[
                {$and:[{userId:req.body.userId},{friendReqId:req.body.friendReqId}]},
                {$and:[{userId:req.body.friendReqId},{friendReqId:req.body.userId}]}
            ]},(err,friendReqDetails)=>{
                if(err){
                    logger.error('Failed to Retrieve Details','recoverController:findUser()',10)  
                    let apiResponse = response.generate(true, 'Failed To Find FriendReq Details', 500, null)
                        reject(apiResponse)
                }
                else if(check.isEmpty(friendReqDetails)){
                    let newFriendReq = new FriendReqModel({
                        friendsReqId:shortid.generate(),
                        userId:req.body.userId,
                        userFirstName:req.body.userFirstName,
                        friendReqId:req.body.friendReqId,
                        friendReqName:req.body.friendReqName,
                        createdOn:time.now()
                    })
                    newFriendReq.save((err, newUser) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: createUser', 10)
                            let apiResponse = response.generate(true, 'Failed to create new FriendReq', 500, null)
                            reject(apiResponse)
                        } else {
                            let newUserObj = newUser.toObject();
                            resolve(newUserObj)
                        }
                    })

                }
                else{
                    if(friendReqDetails.userId == req.body.userId){
                    logger.error('Req Cannot Be Created.Req Already Present', 'userController: createUser', 4)
                        let apiResponse = response.generate(true, 'Request Already sent to the UserName', 403, null)
                        reject(apiResponse)
                    }else {
                        logger.error('Req Cannot Be Created.Req Already Present', 'userController: createUser', 4)
                        let apiResponse = response.generate(true, 'You have not accepted their Friend request', 403, null)
                        reject(apiResponse)
                        
                    }

                }
            })
        })
    }
    validateSentReqwithFriend(req, res)
    .then(validateSentReq)
        .then((resolve) => {
            delete resolve.password
            let apiResponse = response.generate(false, 'User created', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })


}// end sendReq Function


// get all request for particular user

let getAllReq = (req, res) => {
    FriendReqModel.find({userId:req.body.userId})
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find req Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller: getAllUser')
                let apiResponse = response.generate(true, 'No New Friend Req Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All Request Details Found', 200, result.reverse())
                res.send(apiResponse)
            }
        })
}// end get all req

// get all request for particular user

let getAllFriendReq = (req, res) => {
    FriendReqModel.find({friendId:req.body.userId})
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find req Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller: getAllUser')
                let apiResponse = response.generate(true, 'No New Friend Req Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All Request Details Found', 200, result.reverse())
                res.send(apiResponse)
            }
        })
}// end get all req


let deleteReq = (req, res) => {

    FriendReqModel.findOneAndRemove({ 'friendsReqId': req.body.friendsReqId }).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Friend Controller: deleteFriendrq', 10)
            let apiResponse = response.generate(true, 'Failed To delete rq', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: deleteUser')
            let apiResponse = response.generate(true, 'No Req Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'User Request Declined', 200, result)
            res.send(apiResponse)
        }
    });// end user model find and remove


}// end delete user

//accept the request function
acceptReq = (req,res) =>{
//creating data for user
let friendsId=shortid.generate()
let createdOn = time.now()
createUserData = () =>{
return new Promise((resolve,reject)=>{
    let newFriend = new FriendModel({
        friendsId:friendsId,
        userId:req.body.userId,
        userFullName:req.body.userFirstName,
        friendId:req.body.friendReqId,
        friendName:req.body.friendReqName,
        createdOn:createdOn
    })
    newFriend.save((err, newUser) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'userController: createUser', 10)
            let apiResponse = response.generate(true, 'Failed to add as new Friend', 500, null)
            res.send(apiResponse)
        } else {
            let newUserObj = newUser.toObject();
            resolve(newUserObj)
        }
    })
    
})
}
createSecondUserData = () =>{
return new Promise ((resolve,reject)=>{
    let newFriend = new FriendModel({
        friendsId:friendsId,
        userId:req.body.friendReqId,
        userFullName:req.body.friendReqName,
        friendId:req.body.userId,
        friendName:req.body.userFirstName,
        createdOn:createdOn
    })
    newFriend.save((err, newUser) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'userController: createUser', 10)
            let apiResponse = response.generate(true, 'Failed to add as new Friend', 500, null)
            res.send(apiResponse)
        } else {
            let newUserObj = newUser.toObject();
            resolve(newUserObj)
        }
    })

})    
}

deleteReq = () =>{
    return new Promise((resolve,reject)=>{
        FriendReqModel.findOneAndRemove({ 'friendsReqId': req.body.friendsReqId }).exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Friend Controller: deleteFriendrq', 10)
                let apiResponse = response.generate(true, 'Failed To delete rq', 500, null)
                reject(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller: deleteUser')
                let apiResponse = response.generate(true, 'No Req Found', 404, null)
                reject(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'User Request Deleted', 200, result)
                resolve(apiResponse)
            }
        });
    })
}



createUserData(req, res)
.then(createSecondUserData)
.then(deleteReq)
        .then((resolve) => {
            
            let apiResponse = response.generate(false, 'Friends created', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })


}

let getAllFriends = (req, res) => {
    FriendModel.find({userId:req.body.userId})
        .lean()
        .sort({'friendName':1})
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find req Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller: getAllUser')
                let apiResponse = response.generate(true, 'No Friends Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All Friend Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all req


let deleteFriend = (req, res) => {

    FriendModel.deleteMany({ 'friendsId': req.body.friendsId }).exec((err, result) => {
        console.log(req.body.friendReqId)
        if (err) {
            console.log(err)
            logger.error(err.message, 'Friend Controller: deleteFriendrq', 10)
            let apiResponse = response.generate(true, 'Failed To delete rq', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: deleteUser')
            let apiResponse = response.generate(true, 'No Req Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Friend Removed', 200, result)
            res.send(apiResponse)
        }
    });// end user model find and remove


}// end delete user


module.exports = {
sendReqFunction:sendReqFunction,
getAllReq:getAllReq,
deleteReq:deleteReq,
acceptReq:acceptReq,
getAllFriends:getAllFriends,
deleteFriend:deleteFriend,
getAllFriendReq:getAllFriendReq
}// end exports