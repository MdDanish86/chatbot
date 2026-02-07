import express from "express";
import axios from "axios";

const router = express.Router();
let conversation = [];

router.post("/chat", async (req, res) => {
  try {
    const userMessage = String(req.body.message || "").toLowerCase().trim();

    // ===== Rule-Based Responses =====
    if (userMessage.includes("who are you")) {
      return res.json({
        reply: "I am an AI chatbot built using MERN stack 🤖",
      });
    }

    if (userMessage.includes("mern")) {
      return res.json({
        reply:
          "MERN stands for MongoDB, Express, React, and Node.js. It is used for full-stack web development.",
      });
    }

    if (userMessage.includes("your name")) {
      return res.json({
        reply: "My name is MERN-AI Bot 😄",
      });
    }

    // ===== Calculation Handler =====
    const mathRegex = /(\d+\.?\d*)\s*([\+\-\*\/\%])\s*(\d+\.?\d*)/; // simple math
    const match = userMessage.match(mathRegex);

    if (match) {
      const num1 = parseFloat(match[1]);
      const operator = match[2];
      const num2 = parseFloat(match[3]);
      let result;

      switch (operator) {
        case "+": result = num1 + num2; break;
        case "-": result = num1 - num2; break;
        case "*": result = num1 * num2; break;
        case "/": 
          result = num2 !== 0 ? num1 / num2 : "Error: Division by zero";
          break;
        case "%": result = num1 % num2; break;
        default: result = "Invalid operation";
      }

      return res.json({ reply: `Answer: ${result}` });
    }

    // ===== Default/Fallback Response =====
    if (
      userMessage.length < 3 || 
      userMessage.includes("hello") || 
      userMessage.includes("hi")
    ) {
      return res.json({
        reply:
          "I’m learning new things every day! Ask me about MERN, AI, programming, or math 😎",
      });
    }

    // ===== Add user message to conversation =====
    conversation.push({ role: "user", content: userMessage });

    // ===== Call Groq AI =====
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192", 
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI chatbot built using MERN stack. Answer clearly and simply.",
          },
          ...conversation,
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    const aiReply = response.data.choices[0].message.content;

    conversation.push({ role: "assistant", content: aiReply });

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("🔥 AI ERROR 🔥", error.response?.data || error.message);
    res.status(500).json({
      reply: "Something went wrong 😢 Check backend logs.",
    });
  }
});

export default router;
