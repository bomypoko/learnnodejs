const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))



// Create Data
app.get('/',(req,res) => {
    res.send("hello")
})



app.get("/hello/:name",(req,res) => {
    res.send('Hello' + req.params.name)
})

app.get("/hi/:name/:age" , (req,res) =>{
    const name = req.params.name
    const age = req.params.age

    res.send(`Name = ${name} Age = ${age}`)
})

// Update

app.put("/myPut", (req,res) => {
    res.send(req.body)
})


app.post('/hello', (req,res) => {
    res.send(req.body)
})

app.delete('/myDelete/:id', (req,res) => {
    res.send('delete id = ' + req.params.id)
})

app.put('/UpdateName/:id', (req,res) =>{
    const id = req.params.id
    const data = req.body
    res.send({id: id , data: data})

})

app.listen(3000)