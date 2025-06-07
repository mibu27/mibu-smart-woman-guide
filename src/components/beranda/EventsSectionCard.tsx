
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";

interface ImportantEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
}

interface EventsSectionCardProps {
  importantEvents: ImportantEvent[];
}

export const EventsSectionCard = ({ importantEvents }: EventsSectionCardProps) => {
  if (importantEvents.length === 0) return null;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-medium text-gray-800">Acara Penting</h2>
          <Link to="/jadwal" className="text-sm text-mibu-purple hover:underline">
            Lihat Semua →
          </Link>
        </div>
        
        <div className="space-y-2">
          {importantEvents.slice(0, 3).map(event => (
            <div key={event.id} className="p-3 bg-mibu-lightgray rounded-lg">
              <div className="font-medium text-gray-800 text-sm">{event.title}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-mibu-purple">{formatDate(event.date)}</span>
                {event.time && (
                  <span className="text-xs text-gray-500">{event.time}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
