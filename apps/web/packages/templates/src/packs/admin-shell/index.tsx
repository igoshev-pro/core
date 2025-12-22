import { TemplatePack } from "@/packages/renderer/src";
import React from "react";

function AdminLayout({ children, slots, ctx }: any) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "100vh" }}>
      <aside style={{ borderRight: "1px solid #ddd", padding: 16 }}>
        {slots?.sidebar ?? <div>Sidebar</div>}
        <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
          tenant: {ctx.projectId}
        </div>
      </aside>
      <div>
        <header style={{ borderBottom: "1px solid #ddd", padding: 16 }}>
          {slots?.header ?? <div>Admin Header</div>}
        </header>
        <main style={{ padding: 16 }}>{children}</main>
      </div>
    </div>
  );
}

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
  widgets: {},
};
