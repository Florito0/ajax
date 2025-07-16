const express = require('express');
const router = express.Router();
const { getCodesByYear } = require('../controllers/codesJourController');

router.get('/', getCodesByYear);

module.exports = router;
