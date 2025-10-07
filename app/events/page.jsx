'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import EventCard from '@/components/EventCard';

/* ----------  Client component that actually uses the hook ---------- */
function EventsPageContent() {
  const searchParams = useSearchParams();
  const tagQuery = searchParams.get('tag');

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://qevent-backend.labs.crio.do/events');
        const data = await res.json();

        const filtered = tagQuery
          ? data.filter(
              (event) =>
                Array.isArray(event.tags) && event.tags.includes(tagQuery)
            )
          : data;

        setEvents(filtered);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [tagQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading events...
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-around mt-8 mb-32 gap-4">
      {events.length > 0 ? (
        events.map((event) => (
          <EventCard key={event.id} eventData={event} />
        ))
      ) : (
        <p className="text-center text-gray-500 w-full">
          No events found{tagQuery ? ` for tag: ${tagQuery}` : ''}.
        </p>
      )}
    </div>
  );
}

/* ----------  Page entry point wrapped in Suspense ---------- */
export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-64">
          Loading events...
        </div>
      }
    >
      <EventsPageContent />
    </Suspense>
  );
}
