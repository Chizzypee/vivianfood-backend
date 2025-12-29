const express = require("express");
const cors = require("cors");
const { config } = require("./config");
const ProfileModel = require("./models/profile");
const { APIError } = require("./middlwares/error.Api");
require("dotenv").config
const app = express()
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(express.json())

app.use("/api/v1/status", (req, res) => {
    res.send(`Yes! welcome to ${config.APP_NAME}APP`);
})

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || "Something went wrong"
    });
});

module.exports = app;