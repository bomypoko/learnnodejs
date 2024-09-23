const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const fileUpload = require('express-fileupload')

//! import from Controller
const bookController = require('./controllers/BookController')
const customerController = require('./controllers/CustomerController')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use('/book',bookController)
app.use('/customer/list', (req,res) => customerController.list(req,res))
app.use(fileUpload())

//TODO Upload File 
app.post('/book/test',(req,res) => {
    try {
        const myFile = req.files.myFile
        myFile.mv('./uploads' + myFile.name, (err) => {
            if(err){
                return res.status(500).send({error : err})
            }
        })
        res.send({message: "success"})
    } catch (e) {
        res.send(500).send({message: e.message})
    }
})


// Import jwt เข้ามา
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const { verify } = require('crypto');

dotenv.config()

// Check If login token Function 
    // token จะมาพร้อมกับ Header 
const checkSignIn = (req,res,next) => {
    try {
        const secret = process.env.TOKEN_SECRET
        const token = req.headers['authorization']
        const result = jwt.verify(token,secret)
        
        if(result != undefined) {
            next()
        }
    } catch (e) {
        res.status(500).send({ error : e.message})
    }
}





app.get('/user/info',checkSignIn,(req,res,next)=>{
    try {
        res.send('hello admin bom')
    } catch (e) {
        res.status(500).send({error : e.message})
    }
})


// Start Lean Config JWT TOKEN


app.post('/user/createToken', (req,res)=>{
   try {
    const secret = process.env.TOKEN_SECRET
    const payload = {
        id:100,
        name:'bom',
        level:"admin"
    }
    const token = jwt.sign(payload,secret,{expiresIn: '1d'})
    res.send({token:token})
   } catch (e) {
    res.send(500).send({error: e.message})
   }
})

// app.post('/user/checkToken', (req,res) => {
//     const secret = process.env.TOKEN_SECRET
//     const payload = {
//         id: 25,
//         name:'Joshoe',
//         level:'admin'
//     }
//     const token = jwt.sign(payload,secret,{expiresIn: '1d'})
//     res.send({token:token})
// })

app.get('/user/verification', (req,res)=>{
    try {
        const secret = process.env.TOKEN_SECRET
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwLCJuYW1lIjoiYm9tIiwibGV2ZWwiOiJhZG1pbiIsImlhdCI6MTcyNjk5MDkyNiwiZXhwIjoxNzI3MDc3MzI2fQ.2eNe0fyY0xYPdyZWuY8BiQ2nMZT4gR43dY-nVZoTI6Y"
        const result = jwt.verify(token,secret)
        res.send({result:result})
    } catch (e) {
        res.send(500).send({error: e.message})
    }
})

//END Config ToKen


// Relational Database session

app.get('/OneToOne' , async(req,res)=>{
    try {
        const data = await prisma.orderDetail.findMany({
            include:{
                book: true
            }
        })
        res.send({result: data})
    } catch (e) {
        res.send(500).send({error : e.message})
    }
})

app.get('/OneToMany', async(req,res)=>{
    try {
        const data = await prisma.book.findMany({
            include:{
            OrderDetail:true
            }
        })
        res.send({result: data})
    } catch (e) {
        res.send(500).send({error : e.message})
    }
})

app.get('/multiModel' , async(req,res)=>{
    try {
        const data = await prisma.customer.findMany({
            include:{
                Order:{
                    include:{
                        OrderDetail:{
                            include:{
                                book:true
                            }
                        }
                    }
                }
            }
        })
        res.send({result:data})
    } catch (e) {
        res.status(500).send({error : e.message})
    }
})


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

// ต้องขยายไปที่ตัวแปร // startsWith is a function
app.post('/book/startWith', async(req,res)=>{
    const keyword = req.body.keyword
    const data = await prisma.book.findMany({
        where:{
            name: {
                startsWith: keyword,
                
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

app.get('/book/max', async(req,res)=>{
    const data = await prisma.book.aggregate({
        _max:{
            price: true
        }
    })
    res.send({result:data})
})

app.get('/book/min', async(req,res)=>{
    const data = await prisma.book.aggregate({
        _min:{
            price: true
        }
    })
    res.send({result:data})
})

app.get('/book/avg', async(req,res)=>{
    const data = await prisma.book.aggregate({
        _avg:{
            price: true
        }
    })
    res.send({result:data})
})

app.get('/book/findYandDandM' , async(req,res)=>{
    const data = await prisma.book.findMany({
        where:{
            registerDate: new Date("2024-05-09")
        }
    })

    res.send({result : data})
})

app.get('/book/findDateBetween', async(req,res)=>{
    const data = await prisma.book.findMany({
        where:{
            registerDate:{
                gte: new Date("2024-05-01"),
                lte: new Date("2024-09-31")
            }
        }
    })
    res.send({result:data})
})




app.listen(3000)