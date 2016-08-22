'use strict';

const router = require('express').Router();
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../../index.html');

// router.use('/train', require('./train'));
// router.use('/upload', require('./upload'));
// router.use('/results', require('./results'));
router.use('/user', require('./user'));

router.get('/*', function (req, res) {
  res.sendFile(indexHtmlPath);
});

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
  res.status(404).end();
});

module.exports = router;
