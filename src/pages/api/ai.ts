import { MANIPAL_DEPARTMENTS } from "@/lib/departments";
import { firestore } from "@/lib/firebase.config";
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { addDoc, collection } from "firebase/firestore";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

interface AppointmentData {
  name: string;
  email: string;
  phone: string;
  dob: string;
  department: string;
  drName: string;
}

async function bookAppointment(data: AppointmentData) {
  const { name, email, phone, dob, department, drName } = data;

  try {
    const docRef = await addDoc(collection(firestore, "appointments"), {
      name,
      email,
      phone,
      dob,
      department,
      drName: drName ? drName : "",
      createdAt: new Date().toISOString(),
    });

    return true;
  } catch (e) {
    console.error("Error adding document: ", e);
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { prompt, language, conversationHistory = [] } = req.body;

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
You are an AI assistant for Manipal Hospital's website and PWA. Your tasks include booking appointments and other hospital-related queries. 

For appointment booking:
1. Collect the following information one by one:
   - Full Name
   - Email
   - Phone number
   - Date of birth
   - Department (from the list: ${departmentsList})
   - Preferred doctor (if any)
2. After collecting ALL information, summarize it clearly.
3. Ask for confirmation.
4. If confirmed, use the bookAppointment function to book the appointment.

Important:
- Retain all information provided by the user throughout the conversation.
- Do not ask for information that has already been provided.
- Summarize all collected information before booking.
- Only use the bookAppointment function when ALL required information is collected and confirmed.

Respond in the language: ${language}.
`;

  try {
    const messages = [
      { role: "system", content: initialMessage },
      ...conversationHistory,
      { role: "user", content: prompt },
    ];

    const stream = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      stream: true,
      functions: [
        {
          name: "bookAppointment",
          description: "Book an appointment with the collected information",
          parameters: {
            type: "object",
            properties: {
              name: { type: "string" },
              email: { type: "string" },
              phone: { type: "string" },
              dob: { type: "string" },
              department: { type: "string" },
              drName: { type: "string" },
            },
            required: ["name", "email", "phone", "dob", "department"],
          },
        },
      ],
      function_call: "auto",
    });

    let functionCallData = "";
    let appointmentBooked = false;

    for await (const chunk of stream) {
      if (chunk.choices[0]?.delta?.function_call) {
        functionCallData +=
          chunk.choices[0].delta.function_call.arguments || "";
      } else if (chunk.choices[0]?.delta?.content) {
        const content = chunk.choices[0].delta.content;
        res.write(content);
      }

      // Check if this is the last chunk
      if (
        chunk.choices[0]?.finish_reason === "function_call" &&
        !appointmentBooked
      ) {
        try {
          const appointmentData: AppointmentData = JSON.parse(functionCallData);
          const success = await bookAppointment(appointmentData);
          if (success) {
            res.write(
              `\nAppointment booked successfully for ${appointmentData.name}.`
            );
            appointmentBooked = true;
          } else {
            res.write(
              "\nThere was an error booking the appointment. Please try again."
            );
          }
        } catch (error) {
          console.error("Error booking appointment:", error);
          res.write(
            "\nThere was an error processing the appointment data. Please try again."
          );
        }
      }
    }

    // if (!appointmentBooked) {
    //   res.write(
    //     "\nNo appointment was booked. Please provide all necessary information and confirm."
    //   );
    // }

    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process request" });
  }
}

/*
const PREV_SYS_MESSAGE = `
  You are an AI assistant for Manipal Hospital's website and PWA. Your tasks include:

  1. Helping users book appointments
  2. Assisting patients in accessing their lab reports
  3. Providing general information about hospital services
  4. Guiding users to the appropriate department based on their symptoms or needs
  5. Handling emergency inquiries

  For appointment booking, follow these steps:
  1. Ask which department they need an appointment for. Available departments are: ${departmentsList}.
  2. Once the department is specified, collect the following information:
     - Name
     - Email
     - Phone number
     - Date of birth
     - Preferred doctor (if any)
  3. After collecting all information, summarize and ask for confirmation.
  4. If confirmed, inform the user that the appointment will be booked.

  For lab reports, direct users to the appropriate section of the website or app.

  For emergency situations, provide immediate guidance to contact emergency services or the nearest Manipal Hospital.

  If a user's query is not related to healthcare or Manipal Hospital services, politely inform them that you can't assist with that topic and redirect them to relevant hospital services.

  Do not provide specific medical advice or prescribe medicines. Always recommend consulting with a doctor for medical concerns.

  This is the language the application is in: ${language}. Respond in this language regardless of the prompt's language.

  Ask for one piece of information at a time and don't move to the next step until the current information is provided.
  `;
*/
