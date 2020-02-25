'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  
  // let subTodoitemSchema =  new Schema({
  //   subitemname:{type:String},
  //   completed:{type:Boolean}
  // })

  let listdataSchema = new Schema({
    itemname:{type:String},
    itemcompleted:{type:Boolean},
    subTodoitem:[{type:Schema.Types.ObjectId,ref:"SubToDo"}] 
    })
    
    
mongoose.model('ListData', listdataSchema);