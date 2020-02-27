const express = require('express');
const router = express.Router();
const todoController = require("./../../app/controllers/todoController");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')
const friendAuth = require('./../middlewares/friendAuth')
module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/todo`;
    
    app.post(`${baseUrl}/create`, todoController.createToDoFunction);
    
        /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todo/create api for user login.
     *
     * @apiParam {string} userId of the user. (body params) (required)
     * @apiParam {string} createrName of the user. (body params) (required)
     * 
     * @apiParam {string} modifierName of the user. (body params) (required)
     * @apiParam {string} modifierId of the user. (body params) (required)
     * @apiParam {string} listdata of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "ToDo created sucessfully",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "data": {
                "toDoId": da9sd8,
                "userId":"asdmlasd"
                "createrName":"immanuel"
                "modifierName":"sherin"
                "modifierId":"xxxa3aw"
                listdata:listData
                
            }

        }
    */
    app.post(`${baseUrl}/view/all`, auth.isAuthorized, todoController.getAllTodo);

    
        /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todo/create api for user login.
     *
     * @apiParam {string} userId of the user. (body params) (required)
 
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "ToDo gathered",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "data": {
                "toDoId": da9sd8,
                "userId":"asdmlasd"
                "createrName":"immanuel"
                "modifierName":"sherin"
                "modifierId":"xxxa3aw"
                listdata:listData
                
            }

        }
    */
    app.post(`${baseUrl}/view/todo`, auth.isAuthorized, todoController.getTodo);
    
        /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todo/create api for user login.
     *
     * @apiParam {string} toDoId of the user. (body params) (required)
 
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "ToDo gathered",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "data": {
                "toDoId": da9sd8,
                "userId":"asdmlasd"
                "createrName":"immanuel"
                "modifierName":"sherin"
                "modifierId":"xxxa3aw"
                listdata:listData
                
            }

        }
    */
    app.post(`${baseUrl}/delete/todo`, auth.isAuthorized, todoController.DeleteTodo);
    
        /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todo/create api for user login.
     *
     * @apiParam {string} userId of the user. (body params) (required)
 
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "ToDo Deleted",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "data": {
                "toDoId": da9sd8,
                "userId":"asdmlasd"
                "createrName":"immanuel"
                "modifierName":"sherin"
                "modifierId":"xxxa3aw"
                listdata:listData
                
            }

        }
    */
    app.post(`${baseUrl}/edit`, auth.isAuthorized, todoController.EditTodo);
    
        /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todo/create api for user login.
     *
     * @apiParam {string} toDoId of the user. (body params) (required)
 
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "ToDo Edited",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "data": {
                "toDoId": da9sd8,
                "userId":"asdmlasd"
                "createrName":"immanuel"
                "modifierName":"sherin"
                "modifierId":"xxxa3aw"
                listdata:listData
                
            }

        }
    */
    app.post(`${baseUrl}/undo`, auth.isAuthorized, todoController.undoToDo);
    
        /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todo/create api for user login.
     *
     * @apiParam {string} toDoId of the user. (body params) (required)
 
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "ToDo Resotred",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "data": {
                "toDoId": da9sd8,
                "userId":"asdmlasd"
                "createrName":"immanuel"
                "modifierName":"sherin"
                "modifierId":"xxxa3aw"
                listdata:listData
                
            }

        }
    */
    app.post(`${baseUrl}/editfriend`,friendAuth.isAuthorized, auth.isAuthorized, todoController.EditTodo);
    app.post(`${baseUrl}/view/allfriend`, friendAuth.isAuthorized,auth.isAuthorized, todoController.getAllTodo);
    app.post(`${baseUrl}/view/friendtodo`, friendAuth.isAuthorized,auth.isAuthorized, todoController.getTodo);   
}
