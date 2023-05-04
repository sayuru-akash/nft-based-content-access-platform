import AdminHeader from "./AdminHeader";
import { ReactNode } from "react";

type AdminLayoutProps = {
  children: ReactNode;
  currentPage: string;
};

export default function AdminLayout({
  children,
  currentPage,
}: AdminLayoutProps) {
  return (
    <>
      <div className="bg-white min-h-screen">
        <AdminHeader currentPage={currentPage} />
        <div className="max-w-7xl mx-auto py-6 px-6 lg:px-8">{children}</div>
      </div>
    </>
  );
}
