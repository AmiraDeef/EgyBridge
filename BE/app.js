// import dependencies
const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const morgan=require("morgan");
const authRoute=require('./routes/authRoute')
const port=process.env.PORT
const errorMiddleware =require('./middlewares/globalError')
const tripsRoutes=require("./routes/tripRoute")
const bookingRoutes=require("./routes/bookingRoute")
const reviewRoutes=require("./routes/reviewRoute")
const emergencyRoutes=require("./routes/emergencyRoute")
const tripPlanRoutes=require("./routes/tripPlanRoute")
const placeRoutes=require("./routes/placeRoute")
const externalServiceRoutes=require("./routes/externalServiceRoute")


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
app.use("/api/user/bookings",bookingRoutes);
app.use("/api/user/reviews",reviewRoutes);
app.use("/api/user/emergency",emergencyRoutes);
app.use("/api/user/trip-plans",tripPlanRoutes);
app.use("/api/user/places",placeRoutes);
app.use("/api/user/services",externalServiceRoutes);




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