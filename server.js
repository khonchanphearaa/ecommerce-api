import dotenv from "dotenv";
dotenv.config(); // <-- MUST be called before using process.env
import app from "./src/app.js";

const PORT = process.env.PORT || 5050;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
})