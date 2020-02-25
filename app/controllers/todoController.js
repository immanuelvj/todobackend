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
const ToDoModel = mongoose.model('ToDo')
const HistoryToDoModel = mongoose.model('HistoryToDo')

let createToDoFunction = (req,res) =>{
    console.log(req.body)
        let newToDo = new ToDoModel({
            userId: req.body.userId,
            toDoId:shortid.generate(),
            title:req.body.title,
            createrName:req.body.createrName,
            modifierId:req.body.modifierId,
            modifierName:req.body.modifierName,
            createdOn:time.now(),
            ModifiedOn:time.now()    
        })
        console.log('req content')
        newToDo.listdata = req.body.listdata
        newToDo.save((err, newUser) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'ToDoController: createUser', 10)
                let apiResponse = response.generate(true, 'Failed to create new ToDo', 500, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false,'New ToDo Created',200,newUser)
                res.send(apiResponse)
            }
        })
}
    
let getAllTodo = (req, res) => {
    console.log(req.body)
    ToDoModel.find({userId:req.body.userId})
        .skip(parseInt(req.body.skip) || 0)
        .lean()
        .limit(3)
        .sort({'createdOn':-1})
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Todo Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find Todo Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'Todo Controller: getAllUser')
                let apiResponse = response.generate(true, 'No New ToDo Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All Request Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all Todo

//get a single ToDo for edit

let getTodo = (req, res) => {
    ToDoModel.findOne({toDoId:req.body.toDoId})
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Todo Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find Todo Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'Todo Controller: getAllUser')
                let apiResponse = response.generate(true, 'No ToDo Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All Request Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all req

//Delete a Todo 

let DeleteTodo = (req, res) => {
    ToDoModel.findOneAndRemove({toDoId:req.body.toDoId})
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Todo Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find Todo Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'Todo Controller: getAllUser')
                let apiResponse = response.generate(true, 'No ToDo Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'ToDo Deleted', 200, result)
                res.send(apiResponse)
            }
        })
}

//Edit a Todo

let EditTodo = (req,res)=>{
    
    let saveEditToDo = (data) =>{
        return new Promise((resolve,reject)=>{
            console.log('***Saving edit data')
            console.log(req.body)
            let newToDo = new ToDoModel({
                userId: req.body.userId,
                toDoId:req.body.toDoId,
                title:req.body.title,
                createrName:req.body.createrName,
                modifierId:req.body.modifierId,
                modifierName:req.body.modifierName,
                createdOn:req.body.createdOn,
                ModifiedOn:time.now(), 
                historyToDoId:data.toDoId
            })
            
            console.log('req content')
            newToDo.listdata = req.body.listdata
            newToDo.save((err, newUser) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'ToDoController: createUser', 10)
                    let apiResponse = response.generate(true, 'Failed to create new ToDo', 500, null)
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false,'New ToDo Created',200,newUser)
                    resolve(newUser)
                }
            })
        })
    }
    let FindHistoryToDo = () =>{
        return new Promise((resolve,reject)=>{
            console.log('****Finding History Details')
            console.log(req.body)
            ToDoModel.findOne({toDoId:req.body.toDoId})
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Todo Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find Todo Details', 500, null)
                reject(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'Todo Controller: getAllUser')
                let apiResponse = response.generate(true, 'No ToDo Found', 404, null)
                reject(apiResponse)
            } else {
                resolve(result)
            }
        })
        })
    }
    let saveHistoryToDo = (result)=>{
        return new Promise((resolve,reject)=>{
            console.log('****saving Data')
            let newToDo = new HistoryToDoModel({
                userId: result.userId,
                toDoId:shortid.generate(),
                title:result.title,
                createrName:result.createrName,
                modifierId:result.modifierId,
                modifierName:result.modifierName,
                createdOn:result.createdOn,
                ModifiedOn:result.ModifiedOn, 
            })
            console.log('req content')
            newToDo.listdata = result.listdata
            newToDo.save((err, newUser) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'ToDoController: createUser', 10)
                    let apiResponse = response.generate(true, 'Failed to create new ToDo', 500, null)
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false,'History ToDo Created',200,newUser)
                    resolve(newUser)
                }
            })
        })
    }
    let deleteHistoryToDo =(data)=>{
        return new Promise((resolve,reject)=>{
            ToDoModel.findOneAndRemove({toDoId:req.body.toDoId})
            .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Todo Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find Todo Details', 500, null)
                reject(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'Todo Controller: getAllUser')
                let apiResponse = response.generate(true, 'No ToDo Found', 404, null)
                reject(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'ToDo Deleted', 200, result)
                resolve(data)
            }
        })
        })
    }
    FindHistoryToDo(req, res)
    .then(saveHistoryToDo)
    .then(deleteHistoryToDo)
    .then(saveEditToDo)
        .then((resolve) => {
        
            let apiResponse = response.generate(false, 'ToDo edited', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })
}

let undoToDo = (req,res) =>{
    let FindHistoryToDo = () =>{
        return new Promise((resolve,reject)=>{
            
            HistoryToDoModel.findOne({toDoId:req.body.historyToDoId})
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Todo Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find Todo Details', 500, null)
                reject(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'Todo Controller: getAllUser')
                let apiResponse = response.generate(true, 'No ToDo Found', 404, null)
                reject(apiResponse)
            } else {
                resolve(result)
            }
        })
        })
    }
    let saveHistoryToDo = (result)=>{
        return new Promise((resolve,reject)=>{
            let newToDo = new ToDoModel({
                userId: result.userId,
                toDoId:req.body.toDoId,
                title:result.title,
                createrName:result.createrName,
                modifierId:result.modifierId,
                modifierName:result.modifierName,
                createdOn:result.createdOn,
                ModifiedOn:result.ModifiedOn,
                historyToDoId:result.historyToDoId 
            })
            console.log('req content')
            newToDo.listdata = result.listdata
            newToDo.save((err, newUser) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'ToDoController: createUser', 10)
                    let apiResponse = response.generate(true, 'Failed to create new ToDo', 500, null)
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false,'History ToDo Created',200,newUser)
                    resolve(newUser)
                }
            })
        })
    }
    let deleteHistoryToDo =()=>{
        return new Promise((resolve,reject)=>{
            HistoryToDoModel.findOneAndRemove({toDoId:req.body.historyToDoId})
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Todo Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find Todo Details', 500, null)
                reject(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'Todo Controller: getAllUser')
                let apiResponse = response.generate(true, 'No ToDo Found', 404, null)
                reject(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'ToDo Deleted', 200, result)
                resolve(result)
            }
        })
        })
    }
    
    let deleteToDo =()=>{
        return new Promise((resolve,reject)=>{
            ToDoModel.findOneAndRemove({toDoId:req.body.toDoId})
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Todo Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find Todo Details', 500, null)
                reject(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'Todo Controller: getAllUser')
                let apiResponse = response.generate(true, 'No ToDo Found', 404, null)
                reject(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'ToDo Deleted', 200, result)
                resolve(apiResponse)
            }
        })
        })
    }
    deleteToDo(req, res)
    .then(FindHistoryToDo)

    .then(saveHistoryToDo)
    .then(deleteHistoryToDo)
  
        .then((resolve) => {
        
            let apiResponse = response.generate(false, 'ToDo Restored', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })
}

module.exports = {
createToDoFunction:createToDoFunction,
getAllTodo:getAllTodo,
getTodo:getTodo,
DeleteTodo:DeleteTodo,
EditTodo:EditTodo,
undoToDo:undoToDo
}// end exports