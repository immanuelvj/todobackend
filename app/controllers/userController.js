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
const UserModel = mongoose.model('User')
const RecoverModel = mongoose.model('Recover')

/* Get all user Details */
let getAllUser = (req, res) => {
    UserModel.find()
        .select(' -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller: getAllUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all users

/* Get single user details */
let getSingleUser = (req, res) => {
    UserModel.findOne({ 'userId': req.params.userId })
        .select('-password -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getSingleUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller:getSingleUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get single user



let deleteUser = (req, res) => {

    UserModel.findOneAndRemove({ 'userId': req.params.userId }).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller: deleteUser', 10)
            let apiResponse = response.generate(true, 'Failed To delete user', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: deleteUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Deleted the user successfully', 200, result)
            res.send(apiResponse)
        }
    });// end user model find and remove


}// end delete user

let editUser = (req, res) => {

    let options = req.body;
    UserModel.update({ 'userId': req.params.userId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller:editUser', 10)
            let apiResponse = response.generate(true, 'Failed To edit user details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: editUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'User details edited', 200, result)
            res.send(apiResponse)
        }
    });// end user model update


}// end edit user


// start user signup function 

let signUpFunction = (req, res) => {

    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generate(true, 'Email Does not meet the requirement', 400, null)
                    reject(apiResponse)
                } else if (check.isEmpty(req.body.password)) {
                    let apiResponse = response.generate(true, '"password" parameter is missing"', 400, null)
                    reject(apiResponse)
                } else {
                    resolve(req)
                }
            } else {
                logger.error('Field Missing During User Creation', 'userController: createUser()', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }// end validate user input

    let createUser = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ userName: req.body.userName })
                .exec((err, retrievedUserDetails) => {
                    if (err) {
                        logger.error(err.message, 'userController: createUser', 10)
                        let apiResponse = response.generate(true, 'Failed To Create User', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedUserDetails)) {
                        console.log(req.body)
                        let newUser = new UserModel({
                            userId: shortid.generate(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName || '',
                            email: req.body.email.toLowerCase(),
                            mobileNumber: req.body.mobile,
                            userName:req.body.userName,
                            password: passwordLib.hashpassword(req.body.password),
                            createdOn: time.now()
                        })
                        newUser.save((err, newUser) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, 'userController: createUser', 10)
                                let apiResponse = response.generate(true, 'Failed to create new User', 500, null)
                                reject(apiResponse)
                            } else {
                                let newUserObj = newUser.toObject();
                                resolve(newUserObj)
                            }
                        })
                    } else {
                        logger.error('User Cannot Be Created.User Already Present', 'userController: createUser', 4)
                        let apiResponse = response.generate(true, 'User Already Present With this UserName', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    }// end create user function


    validateUserInput(req, res)
        .then(createUser)
        .then((resolve) => {
            delete resolve.password
            let apiResponse = response.generate(false, 'User created', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })


}// end user signup function 

// start of login function 
let loginFunction = (req, res) => {
    let findUser = () => {
        console.log("findUser");
        return new Promise((resolve, reject) => {
            if (req.body.userName) {
                console.log("req body UserName is there");
                console.log(req.body);
                UserModel.findOne({ userName: req.body.userName}, (err, userDetails) => {
                    /* handle the error here if the User is not found */
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                        /* generate the error message and the api response message here */
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                        /* if Company Details is not found */
                    } else if (check.isEmpty(userDetails)) {
                        /* generate the response and the console error message here */
                        logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        /* prepare the message and the api response here */
                        logger.info('User Found', 'userController: findUser()', 10)
                        resolve(userDetails)
                    }
                });
               
            } else {
                let apiResponse = response.generate(true, 'UserName parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }
    let validatePassword = (retrievedUserDetails) => {
        console.log("validatePassword");
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                } else if (isMatch) {
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                    delete retrievedUserDetailsObj.password
                    delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    delete retrievedUserDetailsObj.modifiedOn
                    resolve(retrievedUserDetailsObj)
                } else {
                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Password , Login Failed', 400, null)
                    reject(apiResponse)
                }
            })
        })
    }

    let generateToken = (userDetails) => {
        console.log("generate token");
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }
    let saveToken = (tokenDetails) => {
        console.log("save token");
        console.log(tokenDetails)
        return new Promise((resolve, reject) => {
            AuthModel.findOne({ userId: tokenDetails.userId }, (err, retrievedTokenDetails) => {
                if (err) {
                    console.log(err.message, 'userController: saveToken', 10)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else if (!check.isEmpty(retrievedTokenDetails)) {
                    let apiResponse = response.generate(true, 'User Already Logged In',500,null)
                    reject(apiResponse)
                } 
                else if(check.isEmpty(retrievedTokenDetails)){
                    let newAuthToken = new AuthModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
                
                else {
                    retrievedTokenDetails.authToken = tokenDetails.token
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrievedTokenDetails.tokenGenerationTime = time.now()
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
            })
        })
    }

    findUser(req,res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log("errorhandler");
            console.log(err);
            res.send(err)
        })

}



// end of the login function 


/**
 * function to logout user.
 * auth params: userId.
 */
let logout = (req, res) => {
  AuthModel.findOneAndRemove({userId: req.user.userId}, (err, result) => {
    if (err) {
        console.log(err)
        logger.error(err.message, 'user Controller: logout', 10)
        let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
        res.send(apiResponse)
    } else if (check.isEmpty(result)) {
        let apiResponse = response.generate(true, 'Already Logged Out or Invalid UserId', 404, null)
        res.send(apiResponse)
    } else {
        let apiResponse = response.generate(false, 'Logged Out Successfully', 200, null)
        res.send(apiResponse)
    }
  })
} // end of the logout function.

//recover UserName Function 
let recoverUserName = (req,res) =>{
 let validateUserName = () =>{
     return new Promise((resolve,reject)=>{
         UserModel.findOne({email:req.body.email},(err,userDetails)=>{
             console.log(req.body.email)
             if(err){
            logger.error('Failed to Retrieve Details','recoverController:findUser()',10)  
            let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                reject(apiResponse)
        }
             else if(check.isEmpty(userDetails)){
                logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
             }
             else 
             {
                logger.info('User Found', 'userController: findUser()', 10)
                resolve(userDetails)
             }
         })
     })
 }
 let sendUserNameEmail = (userDetails) =>{
     return new Promise((resolve,reject)=>{
         console.log('senduserEmail')
         console.log(userDetails[0])
        let transporter = nodemailer.createTransport({
            // host: "smtp.gmail.com",
            // port: 587,
            // secure: false, // true for 465, false for other ports
            service:'gmail',
            auth: {
              user:'immanueljeosherin@gmail.com', // generated ethereal user
              pass:'barneystinson' // generated ethereal password
            }
          });
          let mailOptions = {
            from:'ToDo ShareBook Team',
            to:userDetails.email,
            subject:"Recover UserName Request",
            html:`<h3>Hi ${userDetails.firstName}</h3>
            <br><p>This mail is in request that you have requested for your UserName , find below your details !</p>
            <h4>UserName is "${userDetails.userName}"</h4>
            <p>Thanks</p>`
          };

          console.log(mailOptions)

          let info = transporter.sendMail(mailOptions,(err,info)=>{
              if(err){
                  let apiResponse = response.generate('true','Error sending email','400',null)
                  console.log(err)
                  reject(apiResponse)
              }
              else{
                resolve(info);
                }
          
          });
 })
 }
 validateUserName(req,res)
 .then(sendUserNameEmail) 
 .then((resolve)=>{
     let apiResponse = response.generate(false,'User sent mail',200,resolve)
     res.status(200)
     res.send(apiResponse)
 })
 .catch((err)=>{
     console.log("error handler")
     console.log(err)
     res.send(err)
 })
}
// end of recoveruserName function

//recover Password Function


//end od recover password function

let recoverPassword = (req,res)=>{
    let validateUserName = () =>{
        return new Promise((resolve,reject)=>{
            UserModel.findOne({email:req.body.email},(err,userDetails)=>{
                console.log(req.body.email)
                if(err){
               logger.error('Failed to Retrieve Details','recoverController:findUser()',10)  
               let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                   reject(apiResponse)
           }
                else if(check.isEmpty(userDetails)){
                   logger.error('No User Found', 'userController: findUser()', 7)
                           let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                           reject(apiResponse)
                }
                else 
                {
                   logger.info('User Found', 'userController: findUser()', 10)
                   resolve(userDetails)
                }
            })
        })
    }
    let generateToken = (userDetails) => {
        console.log("generate token");
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.email = userDetails.email
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }
    let saveToken = (tokenDetails) => {
        console.log("save token");
        console.log(tokenDetails)
        return new Promise((resolve, reject) => {
            RecoverModel.findOne({ email : tokenDetails.email }, (err, retrievedTokenDetails) => {
                if (err) {
                    console.log(err.message, 'userController: saveToken', 10)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else if (!check.isEmpty(retrievedTokenDetails)) {
                    let apiResponse = response.generate(true, 'Request already exist',500,null)
                    reject(apiResponse)
                } 
                else if(check.isEmpty(retrievedTokenDetails)){
                    let newAuthToken = new RecoverModel({
                        userId:tokenDetails.userId,
                        email: tokenDetails.email,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
                
                else {
                    retrievedTokenDetails.authToken = tokenDetails.token
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrievedTokenDetails.tokenGenerationTime = time.now()
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
            })
        })
    }
    let sendPasswordEmail = (userDetails) =>{
        return new Promise((resolve,reject)=>{
            console.log('senduserEmail')
            console.log(userDetails)
           let transporter = nodemailer.createTransport({
               // host: "smtp.gmail.com",
               // port: 587,
               // secure: false, // true for 465, false for other ports
               service:'gmail',
               auth: {
                 user:'immanueljeosherin@gmail.com', // generated ethereal user
                 pass:'barneystinson' // generated ethereal password
               }
             });
             let mailOptions = {
               from:'ToDo ShareBook Team',
               to:userDetails.userDetails.email,
               
               subject:"Recover Password Request",
               html:`<h3>Hi ${userDetails.userDetails.firstName}</h3>
               <br><p>This mail is in request that you have requested for forgotten Password , Click the link below !</p>
               <a href="http://localhost:4200/passwordChange/${userDetails.userDetails.userId}/${userDetails.authToken}">link</a>
               <p>Thanks</p>`
             };
   
             console.log(mailOptions)
   
             let info = transporter.sendMail(mailOptions,(err,info)=>{
                 if(err){
                     let apiResponse = response.generate('true','Error sending email','400',null)
                     console.log(err)
                     reject(apiResponse)
                 }
                 else{
                   resolve(info);
                   }
             
             });
    })
    }
    validateUserName(req,res)
    .then(generateToken)
    .then(saveToken)
    .then(sendPasswordEmail)
    .then((resolve)=>{
        let apiResponse = response.generate(false,'User sent mail',200,resolve)
        res.status(200)
        res.send(apiResponse)
           })
    .catch((err)=>{
        console.log("error handler")
        console.log(err)
        res.send(err)
    })
      
}

resetPassword = (req,res) =>{
    let options = {'password':passwordLib.hashpassword(req.body.password)};
    UserModel.update({ 'userId': req.body.userId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller:editUser', 10)
            let apiResponse = response.generate(true, 'Failed To edit user details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: editUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'User details edited', 200, result)
            res.send(apiResponse)
            setTimeout(() => {
                console.log(apiResponse)
                RecoverModel.findOneAndRemove({'userId':req.body.userId},(err,result)=>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        console.log(result)
                    }
                })
            }, 500);
     
        }
    });// end user model update


}

module.exports = {

    signUpFunction: signUpFunction,
    getAllUser: getAllUser,
    editUser: editUser,
    deleteUser: deleteUser,
    getSingleUser: getSingleUser,
    loginFunction: loginFunction,
    logout: logout,
    recoverUserName:recoverUserName,
    recoverPassword:recoverPassword,
    resetPassword:resetPassword
}// end exports