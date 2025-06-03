import express from "express"
import { createServer} from "node:http"
import mongoose from 'mongoose'
import cors from "cors"
import { ConnectToSocket } from "./controller/socketManager.js"
import userRoute from './routes/user.js'






const app= express();
///this is use because express and socket run on the same server
const server= createServer(app)
const io=ConnectToSocket(server)



app.set("port",(process.env.PORT|| 8000))

app.use(cors())
app.use(express.json({limit:'40kb'}))
app.use(express.json({limit:'40kb', extended: true}))



app.use('/api/v1/users',userRoute)
const start=async ()=>{
    const connectiondb=await mongoose.connect('mongodb+srv://amansagar60281:e0TGlTO8Vfletf97@cluster0.fm2qvki.mongodb.net/')
    console.log(`MONGO DB CONNECTED HOST ${connectiondb.connection.host}`);
    server.listen(app.get("port"),()=>{
        console.log('sever is listing at 8000');
    })
}


start()