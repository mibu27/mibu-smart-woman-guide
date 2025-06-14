import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from 'lucide-react';
import { TodoItem } from '@/types/shared';

interface TodoSectionCardProps {
  todoItems: TodoItem[];
  isLoading: boolean;
  toggleTodoItem: (todoId: string) => void;
}

export const TodoSectionCard = ({
  todoItems,
  isLoading,
  toggleTodoItem
}: TodoSectionCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-medium text-gray-800">Tugas Hari Ini</h2>
          <Link to="/jadwal" className="text-sm text-mibu-purple hover:underline">
            Kelola →
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-4">
            <Loader2 className="w-5 h-5 animate-spin mx-auto text-mibu-purple" />
            <p className="text-sm text-gray-500 mt-2">Memuat...</p>
          </div>
        ) : todoItems.length > 0 ? (
          <div className="space-y-2">
            {todoItems.slice(0, 5).map(todo => (
              <div key={todo.id} className="flex items-center py-2">
                <Checkbox 
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodoItem(todo.id)}
                  className="mr-3 data-[state=checked]:bg-mibu-purple"
                />
                <span className={`${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {todo.title}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p className="text-sm">Tidak ada tugas hari ini</p>
            <Link to="/jadwal" className="text-sm text-mibu-purple hover:underline mt-1 inline-block">
              Tambahkan tugas →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
