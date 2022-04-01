// export const URL = 'https://lxya-mjz-lxya.vercel.app';
// export const URL = 'https://lexia-mjz-lexia.vercel.app';
export const URL = 'https://www.ulexiaapp.com';

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
