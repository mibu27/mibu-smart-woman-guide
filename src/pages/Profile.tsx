
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Mail, MapPin, Phone, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  // This would be replaced with actual user data from your auth context
  const user = {
    name: "Siti Nurhaliza",
    email: "siti@example.com",
    avatar: "/placeholder.svg",
    address: "Jakarta, Indonesia",
    phone: "+62 812-3456-7890",
    joinedDate: "Januari 2024"
  };

  return (
    <MainLayout title="Profil Saya">
      <div className="space-y-6 py-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl font-semibold text-mibu-darkpurple">
                    {user.name}
                  </CardTitle>
                  <CardDescription>
                    Bergabung sejak {user.joinedDate}
                  </CardDescription>
                </div>
              </div>
              <Button 
                variant="outline"
                className="mt-4 md:mt-0"
                onClick={() => navigate("/profile/edit")}
              >
                <Edit size={16} className="mr-2" />
                Edit Profil
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User size={18} className="text-mibu-purple" />
                <span className="text-gray-600">{user.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-mibu-purple" />
                <span className="text-gray-600">{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-mibu-purple" />
                <span className="text-gray-600">{user.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-mibu-purple" />
                <span className="text-gray-600">{user.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>
              Aktivitas Anda dalam 7 hari terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Tidak ada aktivitas terbaru
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Profile;
