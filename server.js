require("dotenv").config();
const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 5000;

connectDb().then(() => {
    app.listen(port, () => {
        console.log(`server running on port ${port}`);
    });
}).catch(err => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
});

app.use(express.json());
app.use(cookieParser());
app.use("/pixel/users/contacts", require("./Router/routes")); // crud
app.use("/pixel/users", require("./Router/UserRoutes"));
app.use(errorHandler);