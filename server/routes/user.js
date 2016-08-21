'use strict';

const express = require('express');
const router = new express.Router();
const User = require('../db/models').User;

router.post('/signup', function (req, res, next) {
  console.log(req.body);
  User.create(req.body)
  .then(user => res.status(201).json(user))
  .catch(next);
});

router.post('/auth', function (req, res, next) {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(function (response) {
    console.log('Did we get to response?', response);
    if (response && response.password === req.body.password) {
      res.send(response);
    } else {
      res.status(402).send('User not found');
    }
  })
  .catch(next);
});

module.exports = router;
