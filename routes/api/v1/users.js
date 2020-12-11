const passport = require('passport');

const express = require('express');
const router = express.Router();

const user_api = require('../../../controller/api/v1/user_api');

router.post('/create-session',user_api.createSession);

module.exports = router;