import { TemplatePack } from "@/packages/renderer/src";
import React from "react";
import MainLayout from "./layouts/MainLayout";
import ProjectsSectionMain from "./pages/p-projects/sections/ProjectsSectionMain";
import ClientUpsertSectionMain from "./pages/p-clients/p-upsert/sections/ClientUpsertSectionMain";
import ClientsSectionMain from "./pages/p-clients/sections/ClientsSectionMain";
import FactorySectionMain from "./pages/p-factory/sections/FactorySectionMain";
import FactoryTemplatesSectionMain from "./pages/p-factory/p-templates/FactoryTemplatesSectionMain";
import FactoryPagesSectionMain from "./pages/p-factory/p-pages/sections/FactoryPagesSectionMain";
import FactorySectionsSectionMain from "./pages/p-factory/p-sections/sections/FactorySectionsSectionMain";
import FactoryWidgetsSectionMain from "./pages/p-factory/p-widgets/sections/FactoryWidgetsSectionMain";
import TemplateUpsertSectionMain from "./pages/p-factory/p-templates/p-upsert/sections/TemplateUpsertSectionMain";
import FactoryThemesSectionMain from "./pages/p-factory/p-themes/FactoryThemesSectionMain";
import ThemeUpsertSectionMain from "./pages/p-factory/p-themes/p-upset/sections/ThemeUpsertSectionMain";
import LayoutUpsertSectionMain from "./pages/p-factory/p-layouts/p-upsert/sections/LayoutUpsertSectionMain";
import FactoryLayoutsSectionMain from "./pages/p-factory/p-layouts/FactoryLayoutsSectionMain";

function DashboardSectionMain({ node }: any) {
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
    "pro.layout.main.v1": MainLayout,
  },
  sections: {
    "pro.dashboard.main.v1": DashboardSectionMain,
    "pro.projects.main.v1": ProjectsSectionMain,
    "pro.clients.main.v1": ClientsSectionMain,
    "pro.client.upsert.main.v1": ClientUpsertSectionMain,
    "pro.factory.main.v1": FactorySectionMain,
    "pro.factory.templates.main.v1": FactoryTemplatesSectionMain,
    "pro.factory.templates.upsert.main.v1": TemplateUpsertSectionMain,
    "pro.factory.themes.main.v1": FactoryThemesSectionMain,
    "pro.factory.themes.upsert.main.v1": ThemeUpsertSectionMain,
    "pro.factory.layouts.main.v1": FactoryLayoutsSectionMain,
    "pro.factory.layouts.upsert.main.v1": LayoutUpsertSectionMain,
    "pro.factory.pages.main.v1": FactoryPagesSectionMain,
    "pro.factory.sections.main.v1": FactorySectionsSectionMain,
    "pro.factory.widgets.main.v1": FactoryWidgetsSectionMain,
  },
  widgets: {
  },
};
