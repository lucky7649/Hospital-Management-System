// geminiRoutes.js
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const multer = require("multer");
const fs = require("fs");
const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");

const router = express.Router();

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const upload = multer({ dest: "uploads/" });
// API Route to check symptoms
router.post("/check-symptoms", async (req, res) => {
  const { age, gender, symptoms } = req.body;

  // Validation check
  if (!age || !gender || !symptoms || symptoms.length === 0) {
    return res
      .status(400)
      .json({ error: "Age, gender, and at least one symptom are required." });
  }

  // Creating the prompt for the model
  const prompt = `
    A ${age}-year-old ${gender} is experiencing the following symptoms: ${symptoms.join(
    ", "
  )}.
  What could be the most likely medical condition? 
  Provide a simple and clear explanation in 1-2 lines that a patient can easily understand. Avoid using medical jargon and focus on what the condition might be, its common causes, and what they can do to feel better.
  `;

  try {
    // Get the generative model for Gemini 1.5 Flash (change as per your requirement)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content using the model
    const result = await model.generateContent({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });

    // Extract the response text
    const responseText =
      result.response.text() || "No response received from AI.";

    // Send the response back to the client
    res.json({ response: responseText });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Failed to process symptoms." });
  }
});

router.post("/report-analysis", upload.single("file"), async (req, res) => {
  const { symptoms } = req.body;
  let extractedText = "";

  if (req.file) {
    const filePath = req.file.path;
    const fileType = req.file.mimetype;

    try {
      if (fileType === "application/pdf") {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        extractedText = pdfData.text;
      } else if (fileType.startsWith("text/")) {
        extractedText = fs.readFileSync(filePath, "utf-8");
      } else if (fileType.startsWith("image/")) {
        const { data } = await Tesseract.recognize(filePath, "eng");
        extractedText = data.text;
      } else {
        return res
          .status(400)
          .json({
            error: "Unsupported file type. Upload PDF, text, or image.",
          });
      }

      fs.unlinkSync(filePath);
    } catch (error) {
      console.error("Error processing file:", error);
      return res
        .status(500)
        .json({ error: "Failed to process the uploaded file." });
    }
  }

  const prompt = `
    The patient is giving Additional medical report: ${
      extractedText || "No additional information available."
    }
    Based on the given symptoms and medical report, list the possible diseases and provide patient-friendly explanations.
    Also, suggest recommended treatments in a simple and easy-to-understand manner.
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response received.";

    res.json({ response: responseText });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Failed to process symptoms." });
  }
});


module.exports = router;
