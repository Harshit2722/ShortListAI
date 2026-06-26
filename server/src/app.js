const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const errorMiddleware = require("./middlewares/error.middleware")

const authRoutes = require("./routes/auth.routes")

const app = express();

app.use(helmet());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use((req,res,next)=>{
    console.log(`${req.method} ${req.url}`)
    return next();
})

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

app.use("/api/v1/auth",authRoutes);

app.use(errorMiddleware);

module.exports = app;