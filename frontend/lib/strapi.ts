
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || (process.env.NODE_ENV === 'production' ? 'https://nice-comfort-2b2c0f5c6c.strapiapp.com' : 'http://localhost:1337');

export function getStrapiURL(path = '') {
  return `${STRAPI_URL}${path}`;
}

export async function fetchAPI(path: string, options = {}) {
  try {
    const mergedOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };
    const requestUrl = getStrapiURL(path);
    const response = await fetch(requestUrl, mergedOptions);

    if (!response.ok) {
      console.error(response.statusText);
      throw new Error(`An error occured please try again`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
