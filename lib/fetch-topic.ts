// pages/api/fetch-topics.ts

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { TopicItem } from "@/types/topics";

// Define the type for the topic response (you can adjust this based on actual response structure)


// lib/fetchTopics.ts
;

export const FetchTopics = async (): Promise<TopicItem[]> => {
  const username = process.env.BASIC_AUTH_USER!;
  const password = process.env.BASIC_AUTH_PASS!;
  const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

  const response = await axios.get("https://web.pharmaplus.co.ke/ecmws/read_blog_topic/fetch", {
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
  });

  if (response.data && Array.isArray(response.data.content)) {
    console.log(response.data.content)
    return response.data.content;
  } else {
    throw new Error("Unexpected response format");
  }
};



export  async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      const topics = await FetchTopics();
      res.status(200).json({ content: topics });
    } catch (err: any) {
      console.error("Error in API route:", err.message);
      res.status(500).json({ message: "Failed to fetch topics" });
    }
  }
