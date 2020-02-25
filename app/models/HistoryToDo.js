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

  // let listdataSchema = new Schema({
  //   itemname:{type:String},
  //   itemcompleted:{type:Boolean},
  //   subTodoitem:{type:Schema.Types.ObjectId,ref:listdataSchema} 
  //   })
    
    
    

  let HistorytoDoSchema = new Schema({
  userId: {
    type: String,
    },
  toDoId: {
    type: String,
    default: ''
  },
  title:{
    type:String
  },
  createrName: {
    type: String,
    default: ''
  },
  modifierName:{
    type:String
  },
  modifierId: {
    type: String,
},
  createdOn: {
    type: Date,
    default: ''
  },
  listdata:[{
    _id:false,
    itemname:{type:String},
    itemcompleted:{type:Boolean},
    subTodoitem:[{  
      _id:false,
      subitemname:{type:String},
      completed:{type:Boolean}}] 
    }],
  ModifiedOn :{
    type:Date,
    default:""
  },
  historyToDoId:{
    type:String,
    default:""
  }


})
mongoose.model('HistoryToDo', HistorytoDoSchema);