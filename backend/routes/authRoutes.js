const express = require('express');
const { signupUser, loginUser } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signupUser);
router.post('/register', signupUser);
router.post('/login', loginUser);
router.post('/signin', loginUser);

module.exports = router;
