import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import TryCatch from "../middlewares/tryCatch.middleware.js";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import User from "../models/user.model.js";
import {
  ResumeAnalyzerPrompt,
  JobMatcherPrompt,
  generateInterviewPrompt,
} from "../config/prompt.js";

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

export const matchJob = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { mode, skills, experience, pdfBase64 } = req.body;

  if (!mode) return res.status(400).json({ message: "Mode is required" });
  if (mode === "manual" && (!skills?.length || !experience?.trim()))
    return res.status(400).json({
      message: "Skills and experience are required",
    });

  if (mode === "resume" && !pdfBase64)
    return res.status(400).json({
      message: "PDF is required",
    });

  const user = await User.findById(req.user?._id);

  if (!user || !user.canMakeRequest()) {
    return res.status(403).json({
      message: "Upgrade Your plan to continue",
    });
  }

  const parts: any[] = [{ text: JobMatcherPrompt(mode, skills, experience) }];

  if (mode === "resume") {
    parts.push({
      inlineData: {
        mimeType: "application/pdf",
        data: pdfBase64.replace(/^data:application\/pdf;base64,/, ""),
      },
    });
  }

  const response = await aiResponse.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: [{ role: "user", parts }],
  });

  const rawText = response.text?.replace(/```json|```/g, "").trim();

  if (!rawText) {
    return res.status(500).json({
      message: "Ai returned empty response",
    });
  }

  let jsonResponse;
  try {
    jsonResponse = JSON.parse(rawText);
  } catch (error) {
    return res.status(500).json({
      message: "Ai returned invailed Json",
      rawResponse: response.text,
    });
  }

  if (!user.hasProAccess()) {
    user.freeRequestsUsed += 1;
    await user.save();
  }

  res.json(jsonResponse);
});

export const generateInterviewQuestions = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const { mode, round, skills, experience, pdfBase64 } = req.body;

    if (!mode || !round)
      return res.status(400).json({ message: "Mode and round are required" });
    if (mode === "manual" && (!skills?.length || !experience?.trim()))
      return res.status(400).json({
        message: "Skills and experience are required",
      });

    if (mode === "resume" && !pdfBase64)
      return res.status(400).json({
        message: "PDF is required",
      });

    const user = await User.findById(req.user?._id);

    if (!user || !user.canMakeRequest()) {
      return res.status(403).json({
        message: "Upgrade Your plan to continue",
      });
    }

    const parts: any[] = [
      { text: generateInterviewPrompt(round, mode, skills, experience) },
    ];

    if (mode === "resume") {
      parts.push({
        inlineData: {
          mimeType: "application/pdf",
          data: pdfBase64.replace(/^data:application\/pdf;base64,/, ""),
        },
      });
    }

    const response = await aiResponse.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: [{ role: "user", parts }],
    });

    const rawText = response.text?.replace(/```json|```/g, "").trim();

    if (!rawText) {
      return res.status(500).json({
        message: "Ai returned empty response",
      });
    }

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(rawText);
    } catch (error) {
      return res.status(500).json({
        message: "Ai returned invailed Json",
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
