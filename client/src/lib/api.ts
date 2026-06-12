import type { ContactFormData, ApiResponse } from '@app-types/index';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export async function submitContact(
  data: ContactFormData,
): Promise<ApiResponse> {
  const res = await fetch(`${BASE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json: ApiResponse = await res.json();

  if (!res.ok) {
    throw new Error(json.message ?? 'Something went wrong');
  }

  return json;
}
