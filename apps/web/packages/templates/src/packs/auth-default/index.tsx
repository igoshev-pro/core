import { TemplatePack } from "@/packages/renderer/src";
import React from "react";
import AuthLayout from "./layouts/AuthLayout";
import { LoginWidget } from "./widgets/LoginWidget";
import { RegisterWidget } from "./widgets/RegisterWidget";

export const authDefaultPack: TemplatePack = {
  _id: "auth-default",
  version: "1.0.0",
  layouts: {
    "auth.default": AuthLayout,
  },
  sections: {

  },
  widgets: {
    "admin.register.v1": RegisterWidget,
    "admin.login.v1": LoginWidget
  },
};
