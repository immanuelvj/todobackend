const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib');
const response = require('../libs/responseLib');
const NotificationModel = mongoose.model('Notification')



let viewByUserId = (req, res) => {

    if (check.isEmpty(req.params.userId)) {

        console.log('userId should be passed')
        let apiResponse = response.generate(true, 'UserId is missing', 403, null)
        res.send(apiResponse)
    } else {

        NotificationModel.find({'userId':req.params.userId}, (err, result) => {

            if (err) {

                console.log('Error Occured.')
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('Notification Not Found.')
                let apiResponse = response.generate(true, 'Notification Not Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Notification found successfully","NotificationController:NotificationByUserId",5)
                let apiResponse = response.generate(false, 'Notification Found Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

module.exports ={
    viewByUserId:viewByUserId
}