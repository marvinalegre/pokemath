"use client";

import { useState, useEffect } from "react";

export default function Message() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL as string)
      .then((res) => res.json())
      .then((data) => {
        setData(data.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  return <p>message from nest (via client): {data}</p>;
}
