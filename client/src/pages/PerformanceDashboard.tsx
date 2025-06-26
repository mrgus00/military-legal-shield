import React from 'react';
import PerformanceOptimization from '@/components/performance/PerformanceOptimization';

export default function PerformanceDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:py-8 max-w-7xl">
        <PerformanceOptimization />
      </div>
    </div>
  );
}