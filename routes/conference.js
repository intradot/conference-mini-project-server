const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
	res.send('okay');
});

module.exports = router;