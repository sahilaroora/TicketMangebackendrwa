// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors")

// const mydata  = require("./Controller/userRoutes")
// // const userRoute = require("./Controller/newuserRoute")
// // const userRoute = require("./Controller/newuserRoute")

// // const PORT = 8080;

// const app = express();



// app.use(cors())

// // Middleware
// app.use(express.json());

// // MongoDB Connection
// const connectDB = async () => {
//     try {
//         await mongoose.connect("mongodb://127.0.0.1:27017/bababasdfsd");
//         console.log("MongoDB Connected Successfully");
//     } catch (error) {
//         console.log("Database Connection Failed:", error.message);
//         process.exit(1);
//     }
// };

// connectDB();


// // Routes
// app.use("/api/users", mydata);



// // Server
// app.listen(PORT, () => {
//     console.log("Server is running on port " + PORT);
// });







require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const mydata = require("./Controller/userRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.log("Database Connection Failed:", error.message);
        process.exit(1);
    }
};

connectDB();

// Routes
app.use("/api/users", mydata);

// Server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
