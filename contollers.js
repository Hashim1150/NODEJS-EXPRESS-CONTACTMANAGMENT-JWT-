const asyncHandler = require("express-async-handler");     //alternative to try catch
const Contact = require("../models/contactModel");
const { constants } = require("../constants");

const getContacts =asyncHandler( async (req,res)=>{
    const contacts =await Contact.find({user_id :req.user.id}); //finding all the contact of logedin user
    res.status(200).json({ details : contacts});
});


const createContact =asyncHandler( async (req,res)=>{
    const{name,email,phone}=req.body;
    if(!name||!email ||!phone){
        res.status(400);
        throw new Error("all fields are mandatory!");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id :req.user.id,
    });
    res.status(201).json({
        message : "contact created",
        details : contact,
    });
});


const getContact =asyncHandler( async (req,res)=>{
    const id = req.params.id;
    //console.log("got id");
    const contact = await Contact.findById(id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found !");
    }
    res.status(200).json({ 
    message : `contact with id: ${id} found`,
    details : contact
   });
});
 

const updateContact =asyncHandler( async (req,res)=>{
    const id = req.params.id;
  //  console.log("got id");
    const contact =await Contact.findById(id); // first finding the contact if it is present or not..
    if(!contact){
        res.status(404);
        throw new Error("Contact not found !");
    }
    if(contact.user_id.toString()!==req.user.id){
        res.status(403);
        throw new Error("Cant update another user contact");
    }

    const updatecontact =await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new : true }
    );
    res.status(200).json({ 
        message : `contact with id: ${id} updated`,
        New_details : updatecontact
       });
});


const deleteContact =asyncHandler( async (req,res)=>{
    const id = req.params.id;
    //console.log("got id")
    const contact = await Contact.findById(id); // first finding the contact if it is present or not..
    if(!contact){
        res.status(404);
        throw new Error("Contact not found !");
    } 
     if(contact.user_id.toString()!==req.user.id){
        res.status(403);
        throw new Error("Cant delete another user contact");
    }
    await Contact.findByIdAndDelete(id);
    res.status(200).json({  
       // details : contact,
        message : `contact with id: ${id} Deleted`,
   });
});
module.exports= {
    getContact,
    createContact,
    updateContact,
    getContacts,
    deleteContact,
};
