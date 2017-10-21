const config = require("../../config");
const express = require(config.Express);
const userController = require('../controllers/userController');
const router = express.Router();
router
    .get('/user', userController.getUser) 
    .post('/user', userController.createUser)
    .put('/user', userController.updateUser)
    .delete('/user', userController.deleteUser);
module.exports = router;
