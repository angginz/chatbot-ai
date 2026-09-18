import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = "gemini-3.6-flash";

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));

app.post("/api/chat", async (req, res) => {
  const { conversation } = req.body;
  try {
    if (!Array.isArray(conversation))
      throw new Error("Messages must be an array");

    const contents = conversation.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: `
                Anda adalah AI Student Assistant bernama Rama yang membantu siswa dan mahasiswa dalam proses belajar.

                Jawab hanya pertanyaan yang berkaitan dengan pendidikan, pembelajaran, tugas, materi pelajaran, dan pengembangan akademik.

                Gunakan bahasa yang ramah, sederhana, dan mudah dipahami.

                Jika pengguna bertanya tentang suatu materi, jelaskan secara bertahap dan berikan contoh jika diperlukan.

                Jika pengguna meminta bantuan belajar, tanyakan mata pelajaran atau topik apa yang ingin dipelajari.

                Jika pertanyaan tidak berkaitan dengan pendidikan, beri tahu dengan sopan bahwa Anda hanya dapat membantu seputar pembelajaran dan pendidikan.

                `,
      },
    });
    const result =
      typeof response.text === "string" ? response.text.trim() : "";

    if (!result) {
      console.warn("AI connection = EMPTY RESPONSE");
      return res.status(502).json({ error: "AI returned an empty response" });
    }

    console.log("AI connection = OK");
    return res.status(200).json({ result });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    const errorStatus = e?.status ?? e?.statusCode;
    const isLimitError =
      errorStatus === 429 ||
      /rate.?limit|quota|resource exhausted|too many requests/i.test(
        errorMessage,
      );

    if (isLimitError) {
      console.warn("AI Connection Limit");
      return res.status(429).json({ error: "AI service limit reached" });
    }

    console.error("AI connection error:", errorMessage);
    return res
      .status(500)
      .json({ error: "AI service temporarily unavailable" });
  }
});
