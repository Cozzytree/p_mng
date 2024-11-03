import { useState } from "react";
import { toast } from "sonner";

export const useFetch = <T, A extends any[]>(
  cb: (...args: A) => Promise<T>,
) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any | null>(null);

  const fn = async (...args: any) => {
    setLoading(true);
    setError(null);
    try {
      const data = await cb(...args);
      setData(data);
      setError(null);
    } catch (err: any) {
      if (err) {
        setError(err.message || "error while fetching data");
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return { data, loading, error, fn, setData };
};
