import { TemplatePack } from "@/packages/renderer/src";
import React from "react";
import AuthLayout from "./layouts/AuthLayout";
import { LoginWidget } from "./widgets/LoginWidget";
import { RegisterWidget } from "./widgets/RegisterWidget";

export const authDefaultPack: TemplatePack = {
  _id: "auth-default",
  version: "1.0.0",
  layouts: {
    "auth.layout.main.v1": AuthLayout,
  },
  sections: {

  },
  widgets: {
    "auth.register.main.v1": RegisterWidget,
    "auth.login.main.v1": LoginWidget
  },
};
