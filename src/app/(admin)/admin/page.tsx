"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import UserList from "@/components/admin/UserList";
import FoodDatabase from "@/components/admin/FoodDatabase";
import Loading from "@/components/Loading";

function AdminPageContent() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("foods");

  // Only admins should access this page (also protected by middleware)
  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">Manage users and food database.</p>

      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="foods">Food Database</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="foods" className="space-y-6">
            <Suspense fallback={<Loading />}>
              <FoodDatabase />
            </Suspense>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Suspense fallback={<Loading />}>
              <UserList />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AdminPageContent />
    </Suspense>
  );
}
