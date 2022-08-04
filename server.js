const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./DB");
const userRoutes = require("./userRoutes");
const courseRoutes = require("./courseRoutes")

dotenv.config();
connectDB();

app.use(express.json());

app.use('/api/user',userRoutes);
app.use('/api/course',courseRoutes);


const PORT = process.env.PORT
app.listen(PORT,console.log(`Server is running on port ${PORT}`));
