const express = require('express');
const router = express.Router();
const todoController = require("./../../app/controllers/todoController");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')
const friendAuth = require('./../middlewares/friendAuth')
module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/todo`;
    
    app.post(`${baseUrl}/create`, todoController.createToDoFunction);
    app.post(`${baseUrl}/view/all`, auth.isAuthorized, todoController.getAllTodo);
    app.post(`${baseUrl}/view/todo`, auth.isAuthorized, todoController.getTodo);
    app.post(`${baseUrl}/delete/todo`, auth.isAuthorized, todoController.DeleteTodo);
    app.post(`${baseUrl}/edit`, auth.isAuthorized, todoController.EditTodo);
    app.post(`${baseUrl}/undo`, auth.isAuthorized, todoController.undoToDo);
    app.post(`${baseUrl}/editfriend`,friendAuth.isAuthorized, auth.isAuthorized, todoController.EditTodo);
    app.post(`${baseUrl}/view/allfriend`, friendAuth.isAuthorized,auth.isAuthorized, todoController.getAllTodo);
    app.post(`${baseUrl}/view/friendtodo`, friendAuth.isAuthorized,auth.isAuthorized, todoController.getTodo);   
}
