import type { ChatRequest, ChatResponse } from './types';
import { MAX_MESSAGE_LENGTH } from './types';

const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
const TIMEOUT_MS = 30_000;
const RATE_LIMIT = { maxRequests: 10, windowMs: 60_000 };

let requestTimestamps: number[] = [];

function isRateLimited(): boolean {
  const now = Date.now();
  requestTimestamps = requestTimestamps.filter(t => now - t < RATE_LIMIT.windowMs);
  if (requestTimestamps.length >= RATE_LIMIT.maxRequests) return true;
  requestTimestamps.push(now);
  return false;
}

function errorResponse(error: string): ChatResponse {
  return { success: false, data: { message: '', timestamp: '' }, error };
}

export async function sendMessage(
  request: ChatRequest,
  signal?: AbortSignal,
): Promise<ChatResponse> {
  if (!WEBHOOK_URL) {
    return errorResponse('Webhook URL not configured');
  }

  if (!request.message.trim()) {
    return errorResponse('Message cannot be empty');
  }

  if (request.message.length > MAX_MESSAGE_LENGTH) {
    return errorResponse(`Message too long (max ${MAX_MESSAGE_LENGTH} characters)`);
  }

  if (isRateLimited()) {
    return errorResponse('Too many messages. Please wait a moment before sending another.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return errorResponse(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === 'AbortError') {
      return errorResponse('Request timed out. Please try again.');
    }
    return errorResponse(error instanceof Error ? error.message : 'Unknown error occurred');
  }
}
