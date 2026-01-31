import axios from 'axios';

const WEBHOOK_ID = 'ae2800f0-5726-4468-8199-3f97088617a3';
const DEV_API_URL = `/api/webhook/${WEBHOOK_ID}`;
const PROD_API_URL = `https://n8n-neuracodeai.up.railway.app/webhook/${WEBHOOK_ID}`;
const API_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || (import.meta.env.DEV ? DEV_API_URL : PROD_API_URL);

interface ApiPayload {
  User_Message: string;
  Session_ID: string;
  Chat_Title: string;
  Username: string;
  About: string;
  Email: string;
  Custom_instructions: string;
  Current_Chat: string;
  Memory: string;
  Chat_List: string; // New field for chat titles
}

export const sendMessageToN8N = async (payload: ApiPayload) => {
  try {
    const response = await axios.post(API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const formatCurrentChat = (messages: any[]): string => {
  // Take last 10 messages
  const recent = messages.slice(-10);
  return recent.map(m => `${m.role === 'user' ? 'User' : 'Neura'}: ${m.content}`).join('\n');
};
