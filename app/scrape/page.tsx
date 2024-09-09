"use client";

import { useEffect, useState } from "react";

export default function ScrapePage() {
  const [data, setData] = useState<{
    title: string;
    links: { href: string; text: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/scrape");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Scraped Data</h1>
      <h2>Page Title</h2>
      <p>{data?.title}</p>
      <h2>Links</h2>
      <ul>
        {data?.links.map((link, index) => (
          <li key={index}>
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              {link.text || "No text"}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
