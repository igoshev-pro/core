import { TemplatePack } from "@/packages/renderer/src";
import React from "react";
import AdminLayout from "./layouts/AdminLayout";
import AdminProjectsSection from "./pages/projects/sections/AdminProjectsSection";
import ClientUpsertSectionMainS from "./pages/clients/upsert/sections/ClientUpsertSectionMainS";
import ClientsSectionMainS from "./pages/clients/sections/ClientsSectionMainS";

function AdminDashboardSection({ node }: any) {
  return (
    <section>
      <h2 style={{ margin: 0 }}>Проекты</h2>
      <div style={{ marginTop: 8, opacity: 0.8 }}>
        {(node.props?.hint as string) ?? "CRM / Analytics placeholder"}
      </div>
    </section>
  );
}

export const adminShellPack: TemplatePack = {
  _id: "pro",
  version: "1.0.0",
  layouts: {
    "pro.layout.main.v1": AdminLayout,
  },
  sections: {
    "pro.dashboard.main.v1": AdminDashboardSection,
    "pro.projects.main.v1": AdminProjectsSection,
    "pro.clients.main.v1": ClientsSectionMainS,
    "pro.client.upsert.main.v1": ClientUpsertSectionMainS
  },
  widgets: {
  },
};
