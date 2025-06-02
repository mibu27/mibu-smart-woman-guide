
import React, { useState } from 'react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, CalendarIcon, MapPin, Loader2 } from 'lucide-react';
import { useJadwal } from '@/hooks/useJadwal';
import { useAuth } from '@/contexts/AuthContext';

const Jadwal = () => {
  const { user } = useAuth();
  const { 
    todoList, 
    importantEvents, 
    isLoading,
    addTodo,
    toggleTodo,
    removeTodo,
    addEvent,
    removeEvent,
    updateEventDate
  } = useJadwal();

  const [date, setDate] = useState<Date>(new Date());
  const [newTodo, setNewTodo] = useState("");
  const [newEvent, setNewEvent] = useState({ 
    text: "", 
    location: "",
    date: new Date()
  });

  if (!user) {
    return (
      <MainLayout title="Jadwal">
        <div className="text-center py-8">
          <p className="text-gray-500">Silakan login untuk menggunakan fitur jadwal</p>
        </div>
      </MainLayout>
    );
  }
  
  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    addTodo(newTodo);
    setNewTodo("");
  };
  
  const handleAddEvent = () => {
    if (!newEvent.text.trim() || !newEvent.location.trim()) return;
    
    addEvent(newEvent.text, newEvent.location, newEvent.date);
    setNewEvent({ text: "", location: "", date: new Date() });
  };

  // Function to check if a date has events
  const hasEvents = (day: Date) => {
    return importantEvents.some(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };
  
  // Custom day rendering to add event indicators
  const renderDay = (day: Date) => {
    const hasEventOnDay = hasEvents(day);
    return (
      <div className="relative flex items-center justify-center w-full h-full">
        <div>{day.getDate()}</div>
        {hasEventOnDay && (
          <div className="absolute w-1.5 h-1.5 bg-mibu-purple rounded-full bottom-1"></div>
        )}
      </div>
    );
  };
  
  return (
    <MainLayout title="Jadwal">
      <div className="space-y-6">
        <section className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">To Do List Hari Ini</h2>
            <div className="text-sm text-mibu-purple">
              {format(date, "EEEE, d MMMM yyyy", { locale: idLocale })}
            </div>
          </div>
          <Card className="border-2">
            <CardContent className="p-4 space-y-4">
              <div className="flex gap-2">
                <Input 
                  value={newTodo} 
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Tambah kegiatan baru" 
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTodo();
                    }
                  }}
                />
                <Button 
                  onClick={handleAddTodo} 
                  className="bg-mibu-purple hover:bg-mibu-darkpurple"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tambah'}
                </Button>
              </div>
              
              {isLoading ? (
                <div className="text-center py-4 text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  <p className="mt-2">Memuat data...</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {todoList.map((todo) => (
                    <li key={todo.id} className="flex items-center gap-3">
                      <div
                        onClick={() => toggleTodo(todo.id)} 
                        className={`cursor-pointer w-5 h-5 rounded-full flex items-center justify-center border ${todo.completed ? 'bg-mibu-purple border-mibu-purple' : 'border-gray-300'}`}
                      >
                        {todo.completed && <Check size={12} className="text-white" />}
                      </div>
                      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                        {todo.text}
                      </span>
                      <button 
                        onClick={() => removeTodo(todo.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Hapus
                      </button>
                    </li>
                  ))}
                  {todoList.length === 0 && (
                    <div className="text-center py-2 text-gray-500">
                      Tidak ada kegiatan hari ini
                    </div>
                  )}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>
        
        <section className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Acara Penting</h2>
          </div>
          <Card className="border-2">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-3">
                <Input 
                  value={newEvent.text} 
                  onChange={(e) => setNewEvent({...newEvent, text: e.target.value})}
                  placeholder="Judul acara" 
                />
                <Input 
                  value={newEvent.location} 
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  placeholder="Lokasi" 
                />
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newEvent.date, "d MMMM yyyy", { locale: idLocale })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newEvent.date}
                        onSelect={(date) => date && setNewEvent({...newEvent, date})}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleAddEvent} 
                    className="bg-mibu-purple hover:bg-mibu-darkpurple"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tambah Acara'}
                  </Button>
                </div>
              </div>
              
              {isLoading ? (
                <div className="text-center py-4 text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  <p className="mt-2">Memuat data...</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {importantEvents.map((event) => (
                    <li key={event.id} className="p-3 bg-mibu-lightgray rounded-lg border border-gray-200">
                      <div className="flex justify-between">
                        <div className="font-medium">{event.text}</div>
                        <button 
                          onClick={() => removeEvent(event.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                      <div className="text-sm text-mibu-gray flex items-center mt-1">
                        <MapPin size={14} className="mr-1" /> {event.location}
                      </div>
                      <div className="flex items-center mt-2 text-sm text-mibu-gray">
                        <CalendarIcon size={14} className="mr-1" />
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="text-left hover:text-mibu-purple">
                              {format(event.date, "d MMMM yyyy", { locale: idLocale })}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={event.date}
                              onSelect={(date) => date && updateEventDate(event.id, date)}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        {event.time && (
                          <span className="ml-2">• {event.time}</span>
                        )}
                      </div>
                    </li>
                  ))}
                  {importantEvents.length === 0 && (
                    <div className="text-center py-2 text-gray-500">
                      Tidak ada acara penting
                    </div>
                  )}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>
        
        <section className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Kalender</h2>
          </div>
          <Card className="border-2">
            <CardContent className="p-4 flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                locale={idLocale}
                components={{
                  Day: ({ date, ...props }) => (
                    <button {...props}>
                      {renderDay(date)}
                    </button>
                  ),
                }}
                className="rounded-md border w-full pointer-events-auto"
              />
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
};

export default Jadwal;
