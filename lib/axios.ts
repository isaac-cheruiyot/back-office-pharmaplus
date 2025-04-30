// lib/axios.ts
import axios from 'axios';

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER || '';
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS|| '';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  },
});

export default axiosInstance;
