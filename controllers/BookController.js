const express = require('express')
const book = express.Router()

// GET:{{url}}/book/list
book.get('/list', (req,res)=>{
    res.send('Hello Book List')
})




module.exports = book