// import dependencies
const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const morgan=require("morgan");
const authRoute=require('./routes/authRoute')
const port=process.env.PORT
const errorMiddleware =require('./middlewares/globalError')
const tripsRoutes=require("./routes/tripRoute")


//activation
require("dotenv").config();
const app=express();
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173', // Exact frontend origin (no trailing slash)
    credentials: true,                // Allow cookies / authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
); //----------------->to be continued
app.use(morgan('dev'));
app.use("/api/user",authRoute);
app.use("/api/user/trips",tripsRoutes);




//connections
const dbConnection=async()=>{
    const connection=await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo database is connected  (o_o) ");
}
dbConnection();
app.use(errorMiddleware)
app.listen(process.env.PORT || 5000,()=>{
    console.log(`server is listening on port ${process.env.PORT}`);
} );