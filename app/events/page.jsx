'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import EventCard from '@/components/EventCard';

const EventsPage = () => {
  const searchParams = useSearchParams();
  const tagQuery = searchParams.get('tag');

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://qevent-backend.labs.crio.do/events');
        const eventData = await response.json();

        const filteredEvents = tagQuery
          ? eventData.filter(
              event =>
                Array.isArray(event.tags) &&
                event.tags.includes(tagQuery)
            )
          : eventData;

        setEvents(filteredEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
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
        events.map(event => (
          <EventCard key={event.id} eventData={event} />
        ))
      ) : (
        <p className="text-center text-gray-500 w-full">No events found for tag: {tagQuery}</p>
      )}
    </div>
  );
};

export default EventsPage;
