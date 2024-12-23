const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
    user_id :{
        type : mongoose.Schema.Types.ObjectId,
        required :true,
        ref :"User",
    },
    name : {
        type : String,
        required : [true ,"add name"],
    },
    email : {
        type : String,
        required : [true , "add email"],
    },
    phone : {
        type : String,
        required : [true , "add phone"],
    },  
},
{
    timestamps : true,
});

module.exports = mongoose.model("Contact",contactSchema)