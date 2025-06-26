import React from 'react';
import PerformanceOptimization from '@/components/performance/PerformanceOptimization';

export default function PerformanceDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <PerformanceOptimization />
      </div>
    </div>
  );
}