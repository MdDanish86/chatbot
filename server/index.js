import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", chatRoutes);

app.get("/", (req, res) => {
    res.send("AI Chatbot API running...");
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
});
