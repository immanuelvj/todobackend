/**
 * modules dependencies.
 */
const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib.js');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const time = require('./../libs/timeLib');
const tokenLib = require("./tokenLib.js");
const check = require("./checkLib.js");
const response = require('./responseLib')
const NotificationModel = mongoose.model('Notification');




let setServer = (server) => {

    
    let io = socketio.listen(server);

    let myIo = io.of('/')

    myIo.on('connection', (socket) => {

        
        socket.on('Notification', (data) => {
            console.log("socket Notification called")
            console.log(data);
            data['notificationId'] = shortid.generate()
            console.log(data);

            // event to save Notification.
            setTimeout(function () {

                eventEmitter.emit('save-notification', data);

            }, 2000)
            console.log('emmiting data')
            io.emit(data.userId, data)

        });

        socket.on('Changes',(data)=>{
            console.log('emittin changes')
            io.emit('changesMade',data.userId)
        })

        




    });

}


// database operations are kept outside of socket.io code.

// saving chats to database.
eventEmitter.on('save-notification', (data) => {

    // let today = Date.now();
    console.log(data)
    let newNotification = new NotificationModel({

        notificationId: data.notificationId,
        toDoId:data.todoId,
        userId:data.userId,
        message:data.message,
        createdOn:time.convertToLocalTime()
    });

    newNotification.save((err, result) => {
        if (err) {
            console.log(`error occurred: ${err}`);
        }
        else if (result == undefined || result == null || result == "") {
            console.log("notification Is Not Saved.");
        }
        else {
            console.log("Notification Saved.");
            console.log(result);
        }
    });

}); 




module.exports = {
    setServer: setServer,
}
