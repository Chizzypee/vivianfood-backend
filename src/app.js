const express = require("express");
const cors = require("cors");
const { config } = require("./config")
require("dotenv").config
const app = express()
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}));

app.use("/api/v1/status", (req, res) => {
    res.send(`Yes! welcome to ${config.APP_NAME}APP`);
})

module.exports = app;