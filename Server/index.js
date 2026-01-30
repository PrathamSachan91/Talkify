import express from 'express'
import cors from 'cors'
import routes from './routes/route.js'

const app=express()
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json())
app.use("/api", routes);
app.listen(process.env.PORT ,() => {
    console.log("server is running")
})
    
