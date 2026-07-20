const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function generatedApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(API_BASE_URL + path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error('Generated API request failed: ' + response.status);
  }

  return (await response.json()) as T;
}
