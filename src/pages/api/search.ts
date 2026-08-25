import type { APIRoute } from 'astro';
import { GET as searchJsonGet } from './search.json';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  return searchJsonGet(context);
};
