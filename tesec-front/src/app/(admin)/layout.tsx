import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout'; 

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}