import AdminLayout from "./AdminLayout";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/dashboard");
  }, []);

  return (
    <AdminLayout currentPage="admin">
      <h1>Unauthorized Access</h1>
    </AdminLayout>
  );
}
