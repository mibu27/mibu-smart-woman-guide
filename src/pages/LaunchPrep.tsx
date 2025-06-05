
import React from 'react';
import MainLayout from '@/components/MainLayout';
import LaunchChecklist from '@/components/LaunchChecklist';

const LaunchPrep = () => {
  return (
    <MainLayout title="Persiapan Launch">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Persiapan Launch Aplikasi</h1>
          <p className="text-gray-600">
            Checklist lengkap untuk memastikan aplikasi siap di-launch untuk testing 1 bulan
          </p>
        </div>
        
        <LaunchChecklist />
      </div>
    </MainLayout>
  );
};

export default LaunchPrep;
