const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

// Call Data

// Call data from database (Prisma) by import PrismaClient 
app.get('/book/list', async (req,res) => {
    const data = await prisma.book.findMany();
    // send data as json ({})
    res.send({ data: data})

}) 
// Add Book In Prisma from Front 
app.post('/book/create' , async (req,res) => {
    const data = req.body 
    const result = await prisma.book.create({data:data})
    res.send({result:result})
})
// Add Book In Prisma DataBase (Add Data)
app.post('/book/createManual', async (req,res) => {
    const result = await prisma.book.create({

        data:{
            isbn:'1003',
            name:'React',
            price: 4300
        }
        
    })
    res.send({data:result})
})


app.put('/book/update/:id' , async (req,res) =>{
    try {
        await prisma.book.update({
            data: {
                isbn: "1023",
                name: 'NextJs',
                price: 3000
            },
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.send({message:"success"})
    } catch (error) {
        res.send(500).send({error:error})
    }
    
})

app.delete('/book/remove/:id' , async (req,res) => {
    await prisma.book.delete({
        where: {
            id: parseInt(req.params.id)
        }
    })
    res.send({ message: "message"})
})


app.post('/book/search' , async(req,res)=>{
    const keyword = req.body.keyword
    const data = await prisma.book.findMany({
        where:{
            name:{
                contains: keyword,
            }
        }
    })
    res.send({results: data})
})

// Get 
app.get('/book/list/test', async(req,res)=>{
    await prisma.book.findMany()
    res.send({message: "message"})
})

// Create Data 
app.post('/book/create/test', async(req,res)=>{
    const data = req.body
    const payload = await prisma.book.create({data:data})
    res.send({data: payload})
})
//Create Data Manual 
app.post('/book/create/test1',async(req,res) =>{
    const payload = await prisma.book.create({
        data:{
            isbn: "1339",
            name:"Mai",
            price: 20
        }
    })
    res.send({data:payload})
})

//Update Data 
app.put('book/update/:id', async(req,res)=>{
    await prisma.book.update({
        data: {
            isbn: "1200",
            name:"Bom",
            price: 200
        }, where: {
            id: parseInt(req.params.id)
        }
    })
    res.send({update:message})
})

//delete 
app.delete('/book/remove/:id', async(req,res)=>{
    await prisma.book.delete({
        where: {
            id: parseInt(req.params.id)
        }
    })
    res.send({book:book})
})



// End Prisma





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


// ---------- Start Try and Catch

// ต้องขยายไปที่ตัวแปร 
app.post('/book/startWith', async(req,res)=>{
    const keyword = req.body.keyword
    const data = await prisma.book.findMany({
        where:{
            name: {
                startsWith: keyword
            }       
        }
    })
    res.send({result : data})
})

app.post('/book/endWith', async(req,res)=>{
    const keyword = req.body.keyword
    const data = await prisma.book.findMany({
        where:{
            name:{
                endsWith: keyword
            }
        }
    })
    res.send({result:data})
})


// Order By 
app.get('/book/orderBy', async(req,res)=>{
    const data = await prisma.book.findMany({
        orderBy: {
            price: "desc"
        }
    })
    res.send({result : data})
})


// gt stand for greater than and it is a method to use 
app.get('/book/betterThan' , async(req,res)=>{
    const data = await prisma.book.findMany({
        where:{
            price: {
                gt: 900
            }
        }
        
    })
    res.send({result: data})
})

app.get('/book/letterThan' , async(req,res)=>{
    const data = await prisma.book.findMany({
        where:{
            price: {
                lt: 900
            }
        }
        
    })
    res.send({result: data})
})

// หาค่าที่ไม่ใช้ Null ออกมาใน Database

app.get('/book/notNull',async(req,res)=>{
    const data = await prisma.book.findMany({
        where:{
            detail:{
                not: null
            }
        }
    })
    res.send({result : data})
})

// Learn lte - gte ค่า เท่าไหร่ถึงเท่าไหร่
app.get('/book/getBetween', async(req,res)=>{
    const data = await prisma.book.findMany({
        where:{
            price: {
                lte: 1500,
                gte: 900
            }
        }
    })
    res.send({result:data})
})

app.get('/book/sum', async(req,res)=>{
    const data = await prisma.book.aggregate({
        _sum:{
            price:true,
        }
    })
    res.send({result:data})
})

app.listen(3000)