const express = require("express");
const { register, login, updateProfile, getProfile, updateAddress, getAddress, createOrder, getOrder, refreshToken } = require("../controller/account.controller");
const router = express.Router();
const app = express();
app.use(express.json())

router.post("/user/register", register)
router.post("/user/login", login)
router.post("/user/updateProfile/:userId", updateProfile)
router.get("/user/getProfile/:userId", getProfile)
router.post("/user/updateAddress/:userId", updateAddress)
router.get("/user/getAddress/:userId", getAddress)
router.post("/order/createOrder", createOrder)
router.get("/order/getOrder/:userId", getOrder)
router.post("/user/refreshToken", refreshToken)




module.exports = router;