import React from "react";
import { AdminShell, Sidebar, Content } from "./AdminLayout.styles";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <AdminShell>
      <Sidebar>
        <AdminSidebar />
      </Sidebar>

      <Content>{children}</Content>
    </AdminShell>
  );
};

export default AdminLayout;
