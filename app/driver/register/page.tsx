'use client';

import React from 'react';
import { DriverRegisterForm } from '@/components/forms/DriverRegisterForm';

export default function DriverRegisterPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto py-8">
        <DriverRegisterForm />
      </div>
    </div>
  );
}
