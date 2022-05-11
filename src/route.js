const express = require('express');
const route = express.Router();


// Public Route
route.get('/', (req, res) => res.render("pages/index",{page:'register'}));

route.get('/login', (req, res) => res.render("pages/index",{page:'login'}));

module.exports = route