const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let NotificationSchema = new Schema({
    notificationId:{
        type:String
    },
    toDoId:{
        type:String
    },
    userId:{
        type:String
    },
    message:{
        type:String
    },
    createdOn:{
        type:Date
    }
})

mongoose.model('Notification',NotificationSchema);