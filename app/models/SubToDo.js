'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  
  let subTodoitemSchema =  new Schema({
    subitemname:{type:String},
    completed:{type:Boolean}
  })

    
    
mongoose.model('SubToDo', subTodoitemSchema);