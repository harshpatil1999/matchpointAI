import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import TryCatch from "../middlewares/tryCatch.middleware.js";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import User from "../models/user.model.js";
import { ResumeAnalyzerPrompt } from "../config/prompt.js";

dotenv.config();

const aiResponse = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY_API! });

export const analyzeResume = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const { pdfBase64 } = req.body;
    if (!pdfBase64) {
      return res.status(400).json({
        message: "PDF is required!",
      });
    }
    const user = await User.findById(req.user?._id);
    if (!user || !user.canMakeRequest()) {
      return res.status(403).json({
        message: "Upgrade your plan to continue",
      });
    }
    const response = await aiResponse.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [
            { text: ResumeAnalyzerPrompt },
            {
              inlineData: {
                mimeType: "application/pdf",
                data: pdfBase64.replace(/^data:application\/pdf;base64,/, ""),
              },
            },
          ],
        },
      ],
    });
    const rawText = response.text?.replace(/```json|```/g, "").trim();
    if (!rawText) {
      return res.status(500).json({
        message: "Empty response!",
      });
    }
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(rawText);
    } catch (error) {
      return res.status(500).json({
        message: "Invalid JSON response!",
        rawResponse: response.text,
      });
    }
    if (!user.hasProAccess()) {
      user.freeRequestsUsed += 1;
      await user.save();
    }
    res.json(jsonResponse);
  },
);
