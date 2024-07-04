import { MANIPAL_DEPARTMENTS } from "@/lib/departments";
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { prompt, language } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "Prompt is required" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Transfer-Encoding", "chunked");

  const departmentsList = MANIPAL_DEPARTMENTS.join(", ");

  const initialMessage = `
  This is Manipal Hospital's website. If a prompt is not related to medicine or health, strictly state that it is out of context and you cannot provide information on that topic. Additionally, do not give medical advice or prescribe medicines. 
  If medical advice is requested, inform the user to visit a doctor and suggest they book an appointment. 
  The available departments are: ${departmentsList}.

  For example, if the user says, "I'm coughing a lot, what do I do?" Respond with a short, to-the-point message like: "Please book an appointment with our General Medicine or Pulmonology department for your symptoms."
  When the user specifies a department, ask for their name, email, phone number, and date of birth. Summarize the collected information and ask for confirmation. If confirmed, proceed with booking the appointment. 
  Ensure not to repeat questions or steps already completed.

  This is the language the application is in: ${language}. Even if the prompt is in English or any other language, give the response in the language the application is in.
`;

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: initialMessage,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`${content}`);
      }
    }

    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
}
