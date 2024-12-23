const express = require('express');
const router = express.Router();
const validateToken = require('../middleware/validateTokenHandler');
const {
    getContact,
    createContact,
    updateContact,
    getContacts,
    deleteContact,
} = require("../Controller/contollers");
router.use(validateToken)
router.route("/").get(getContacts).post(createContact);
router.route("/:id").put(updateContact).get(getContact).delete(deleteContact);
module.exports =router;