export const URL = 'https://ulexia.vercel.app';

export const get = async <T> (endpoint: string): Promise<T> => {
  const res = await fetch(`${URL}/api/${endpoint}`);
  return await res.json() as T;
};

export const post = async <T> (endpoint: string, data = {}, json = true): Promise<T> => {
  const options = {
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  };
  const res = await fetch(`${URL}/api/${endpoint}`, options);

  if (res.ok && !json) {
    return {} as T;
  }

  return await res.json() as T;
};
