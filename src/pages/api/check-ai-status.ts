import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch("https://api.openai.com/v1/engines", {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });
    if (response.ok) {
      res.status(200).json({ status: "ok" });
    } else {
      res
        .status(response.status)
        .json({ status: "down", error: response.statusText });
    }
  } catch (error: any) {
    res.status(500).json({ status: "down", error: error.message });
  }
}
