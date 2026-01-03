import dotenv from "dotenv";
dotenv.config(); // <-- MUST be called before using process.env
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5050;
connectDB();
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
})