'use strict';

const express = require('express');
const router = new express.Router();
const db = require('../db');
const User = db.model('user');

router.post('/signup', function (req, res, next) {
  User.create(req.body)
  .then(user => res.status(201).json(user))
  .catch(next);
});

router.get('/:id', function (req, res, next) {
  User.findOne({
    where: {
      id: req.params.id
    }
  })
  .then(function (response) {
    res.json(response);
  })
  .catch(next);
});

module.exports = router;
