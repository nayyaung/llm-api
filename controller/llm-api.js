const { ChatVertexAI } = require("@langchain/google-vertexai");
const getAnswer = require("../services/llm-service"); 

const model = new ChatVertexAI({
    temperature: 0.7,
    model: "gemini-1.5-flash-001",
  });


exports.getResponse = async (req, res, next) => {
    try {
        const { question } = req.body;
        const result = await getAnswer(question);
        res.json({ result });
    } catch (error) {
        console.error(error);
        next(new Error("An error occurred. Please try again."));
    }
};