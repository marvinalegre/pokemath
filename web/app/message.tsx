"use client";

import { useEffect, useState } from "react";

export default function Message() {
  const [data, setData] = useState<{ message: string }>({ message: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch from backend");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading message...</p>;
  if (error) return <div className="text-destructive p-4">Error: {error}</div>;

  return <p>message from nest (via client): {data.message}</p>;
}
