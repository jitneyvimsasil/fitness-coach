import type { ChatRequest, ChatResponse } from './types';

const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

export async function sendMessage(request: ChatRequest): Promise<ChatResponse> {
  if (!WEBHOOK_URL) {
    return {
      success: false,
      data: { message: '', timestamp: '' },
      error: 'Webhook URL not configured',
    };
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      return {
        success: false,
        data: { message: '', timestamp: '' },
        error: `Request failed: ${response.status}`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      data: { message: '', timestamp: '' },
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
