import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const api = axios.create({ baseURL: API_URL });

export function useApiData<T = any>(endpoint: string, initialData?: T) {
  const [data, setData] = useState<T | any>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    api.get(endpoint)
      .then((res) => setData(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [endpoint]);

  return { data, isLoading, error };
}
