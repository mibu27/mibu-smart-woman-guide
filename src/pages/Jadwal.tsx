
import React, { useState } from 'react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, CalendarIcon, Clock, MapPin } from 'lucide-react';

const Jadwal = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [todoList, setTodoList] = useState<{id: number; text: string; completed: boolean}[]>([
    { id: 1, text: "Pertemuan dengan guru 09:00", completed: false },
    { id: 2, text: "Antar anak les 15:30", completed: true },
    { id: 3, text: "Belanja bahan masakan", completed: false }
  ]);
  
  const [importantEvents, setImportantEvents] = useState<{id: number; text: string; location: string}[]>([
    { id: 1, text: "Pengajian ibu-ibu 19:30", location: "Masjid Al-Ikhlas" },
    { id: 2, text: "Ulang tahun suami", location: "Rumah" }
  ]);
  
  const [newTodo, setNewTodo] = useState("");
  const [newEvent, setNewEvent] = useState({ text: "", location: "" });
  
  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    
    setTodoList([...todoList, {
      id: Date.now(),
      text: newTodo,
      completed: false
    }]);
    setNewTodo("");
  };
  
  const handleToggleTodo = (id: number) => {
    setTodoList(todoList.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const handleRemoveTodo = (id: number) => {
    setTodoList(todoList.filter(todo => todo.id !== id));
  };
  
  const handleAddEvent = () => {
    if (!newEvent.text.trim() || !newEvent.location.trim()) return;
    
    setImportantEvents([...importantEvents, {
      id: Date.now(),
      text: newEvent.text,
      location: newEvent.location
    }]);
    setNewEvent({ text: "", location: "" });
  };
  
  const handleRemoveEvent = (id: number) => {
    setImportantEvents(importantEvents.filter(event => event.id !== id));
  };
  
  return (
    <MainLayout title="Jadwal">
      <div className="space-y-6">
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Kalender</h2>
          </div>
          <Card>
            <CardContent className="p-4 flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                locale={idLocale}
                className="rounded-md border w-full"
              />
            </CardContent>
          </Card>
        </section>
        
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">To Do List</h2>
            <div className="text-sm text-mibu-purple">
              {format(date, "EEEE, d MMMM yyyy", { locale: idLocale })}
            </div>
          </div>
          <Card>
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
                <Button onClick={handleAddTodo}>Tambah</Button>
              </div>
              
              <ul className="space-y-2">
                {todoList.map((todo) => (
                  <li key={todo.id} className="flex items-center gap-3">
                    <div
                      onClick={() => handleToggleTodo(todo.id)} 
                      className={`cursor-pointer w-5 h-5 rounded-full flex items-center justify-center border ${todo.completed ? 'bg-mibu-purple border-mibu-purple' : 'border-gray-300'}`}
                    >
                      {todo.completed && <Check size={12} className="text-white" />}
                    </div>
                    <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                      {todo.text}
                    </span>
                    <button 
                      onClick={() => handleRemoveTodo(todo.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Hapus
                    </button>
                  </li>
                ))}
                {todoList.length === 0 && (
                  <div className="text-center py-2 text-gray-500">
                    Tidak ada kegiatan
                  </div>
                )}
              </ul>
            </CardContent>
          </Card>
        </section>
        
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Kegiatan Penting</h2>
          </div>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Input 
                  value={newEvent.text} 
                  onChange={(e) => setNewEvent({...newEvent, text: e.target.value})}
                  placeholder="Judul kegiatan" 
                />
                <Input 
                  value={newEvent.location} 
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  placeholder="Lokasi" 
                />
                <div className="flex justify-end">
                  <Button onClick={handleAddEvent}>Tambah Kegiatan</Button>
                </div>
              </div>
              
              <ul className="space-y-3">
                {importantEvents.map((event) => (
                  <li key={event.id} className="p-3 bg-mibu-lightgray rounded-lg">
                    <div className="flex justify-between">
                      <div className="font-medium">{event.text}</div>
                      <button 
                        onClick={() => handleRemoveEvent(event.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Hapus
                      </button>
                    </div>
                    <div className="text-sm text-mibu-gray flex items-center mt-1">
                      <MapPin size={14} className="mr-1" /> {event.location}
                    </div>
                  </li>
                ))}
                {importantEvents.length === 0 && (
                  <div className="text-center py-2 text-gray-500">
                    Tidak ada kegiatan penting
                  </div>
                )}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
};

export default Jadwal;
