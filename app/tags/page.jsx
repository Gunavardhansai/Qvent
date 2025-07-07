'use client';

import React, { useState, useEffect } from "react";
import Tag from "@/components/Tag";
import { useRouter } from "next/navigation";

const TagsPage = () => {
  const router = useRouter();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("https://qevent-backend.labs.crio.do/tags");
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
        setTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <p>Loading tags...</p>
      </div>
    );
  }

  return (
    <div className="h-[80vh] flex justify-center items-center">
      <div className="basis-3/4 p-4 flex justify-center flex-wrap gap-4">
        {tags.map((tag) => (
          <div
            key={tag.id}
            onClick={() => router.push(`/events?tag=${encodeURIComponent(tag.name)}`)}
            className="cursor-pointer"
          >
            <Tag text={tag.name} id={tag.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagsPage;
