import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoute.js'
import productRoute from './routes/productRoute.js'
import { databaseConnection } from './databaseConnection.js'
import { Errors } from './middleware/error.js'
import cookieParser from 'cookie-parser'
import orderRoute from './routes/orderRoute.js'
dotenv.config()

const app = express()
app.use(cookieParser())
app.use(express.json())

process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log('shutting down the server due to uncaught Exception');
    process.exit(1)
})

app.use('/api/auths',authRoutes)
app.use('/api/products',productRoute)
app.use('/api/orders',orderRoute)


app.use(Errors)

const server = app.listen(process.env.PORT,()=>{
    console.log(`connected at port ${process.env.PORT}`)
    databaseConnection()
})

//unhandle promise rejection
process.on('unhandledRejection',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log('shutting down the server due to unhandled Rejection');
    server.close(()=>{
        process.exit(1)
    })
})