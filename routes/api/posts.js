const express = require('express');

const  router = express.Router();

router.get('/test',(req,res) => res.json({msg: "Post Works"}));

//res send as json for the get Request

module.exports = router; //exporting route