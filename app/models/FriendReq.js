'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let FriendReqSchema = new Schema({
  friendsReqId:{
    type:String
  },
  userId: {
    type: String,
    default: '',
    },
  friendReqId: {
    type: String,
    default: ''
  },
 userFirstName: {
    type: String,
    default: ''
  },
  friendReqName:{
    type:String
  },
  createdOn :{
    type:Date,
    default:""
  }


})


mongoose.model('FriendReq', FriendReqSchema);