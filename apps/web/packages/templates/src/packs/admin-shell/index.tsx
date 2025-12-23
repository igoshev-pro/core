import { TemplatePack } from "@/packages/renderer/src";
import React from "react";
import AdminLayout from "./layouts/AdminLayout";

function AdminDashboardSection({ node }: any) {
  return (
    <section>
      <h2 style={{ margin: 0 }}>Dashboard</h2>
      <div style={{ marginTop: 8, opacity: 0.8 }}>
        {(node.props?.hint as string) ?? "CRM / Analytics placeholder"}
      </div>
    </section>
  );
}

export const adminShellPack: TemplatePack = {
  _id: "admin-shell",
  version: "1.0.0",
  layouts: {
    "admin.shell": AdminLayout,
  },
  sections: {
    "admin.dashboard.v1": AdminDashboardSection,
  },
  widgets: {
  },
};
