import { generateContent } from "../services/ai.service.js";
export const getReview = async (req, res) => {
    const code = req.body.code;
    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }
    try {
      const response = await generateContent(code);
      res.type('text/plain');
      res.send(response);
    } catch (error) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}