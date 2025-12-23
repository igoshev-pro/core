import { TemplatePack } from "@/packages/renderer/src";
import React from "react";
import AuthLayout from "./layouts/AuthLayout";
import { AdminLogin } from "./widgets/AdminLogin";

export const aythDefaultPack: TemplatePack = {
  _id: "auth-default",
  version: "1.0.0",
  layouts: {
    "auth.default": AuthLayout,
  },
  sections: {
  },
  widgets: {
    "admin.login.v1": AdminLogin
  },
};
