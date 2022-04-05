// export const URL = 'https://www.ulexiaapp.com';
// export const URL = 'https://ulexia.app';
export const URL = 'https://ulexia.vercel.app';

// const prod = process.env.PROD != null;
// export const URL = prod ? 'https://www.ulexiaapp.com' : 'https://ulexia.app';

export const get = async <T> (endpoint: string): Promise<T> => {
  const res = await fetch(`${URL}/api/${endpoint}`);
  return await res.json() as T;
};

export const post = async <T> (endpoint: string, data = {}): Promise<T> => {
  const options = {
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  };
  const res = await fetch(`${URL}/api/${endpoint}`, options);
  return await res.json() as T;
};
