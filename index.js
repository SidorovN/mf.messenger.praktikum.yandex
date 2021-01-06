const express = require('express')
const path = require('path')
const fs = require('fs')

const PORT = 3000

const app = express()

app.listen(PORT,()=>{
    console.log(`server started at port ${PORT}`)
})

app.use(express.static(path.join(__dirname,'assets')));

app.use('/',(req,res)=> {
    res.sendFile(path.join(__dirname,'assets','pages','index','index.html'))
})
