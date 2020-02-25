const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const request = require("request")

const FriendModel = mongoose.model('Friend')
const logger = require('./../libs/loggerLib')
const responseLib = require('./../libs/responseLib')
const token = require('./../libs/tokenLib')
const check = require('./../libs/checkLib')

let isAuthorized = (req, res, next) => {
  

  if (req.body) {
    FriendModel.findOne({$or:[
        {$and:[{userId:req.body.userId},{friendReqId:req.body.friendId}]},
        {$and:[{userId:req.body.friendId},{friendId:req.body.userId}]}
    ]}, (err, friendDetails) => {
      if (err) {
        console.log(err)
        logger.error(err.message, 'FriendMiddleware', 10)
        let apiResponse = responseLib.generate(true, 'Failed To Authorized', 500, null)
        res.send(apiResponse)
      } else if (check.isEmpty(friendDetails)) {
        logger.error('No ID Is Present', 'FriendMiddleware', 10)
        let apiResponse = responseLib.generate(true, 'No Id is present', 204, null)
        res.send(apiResponse)
      } else 
      
      {
          next()
            }
    })
  } else {
    logger.error('Data Missing', 'FriendMiddleware', 5)
    let apiResponse = responseLib.generate(true, 'Data Is Missing In Request', 400, null)
    res.send(apiResponse)
  }
}


module.exports = {
  isAuthorized: isAuthorized
}
