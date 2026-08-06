import { describe, it, expect } from 'bun:test';
import { app } from '../src/app';

describe('Contact API Module', () => {
  it('should validate contact message input and return 400 for invalid data', async () => {
    const res = await app.request('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'A',
        email: 'invalid-email',
        subject: '',
        message: 'short'
      })
    });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.code).toBe('VALIDATION_ERROR');
  });

  it('should handle honeypot input silently and return 200/201 success response', async () => {
    const res = await app.request('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Bot User',
        email: 'bot@example.com',
        subject: 'Spam Subject',
        message: 'This is spam message content',
        website_hp: 'http://spambot-link.com'
      })
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
});
