'use client';

import React from 'react';
import { CompanyRegisterForm } from '@/components/forms/CompanyRegisterForm';

export default function CompanyRegisterPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto py-8">
        <CompanyRegisterForm />
      </div>
    </div>
  );
}
