'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let FriendSchema = new Schema({
  friendsId:{
    type:String
  },
  userId: {
    type: String,
    default: '',
    },
  userFullName: {
    type: String,
    default: ''
  },
  friendId: {
    type: String,
    default: ''
  },
  friendName:{
    type:String
  },
  createdOn :{
    type:Date,
    default:""
  }


})


mongoose.model('Friend', FriendSchema);