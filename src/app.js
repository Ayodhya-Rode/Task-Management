import express from "express"
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js"


const app = express()
app.use(cookieParser());

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


app.use("/api/auth", authRoutes)


app.get("/", (req, res)=>{
    res.json("Home")
})

export default app