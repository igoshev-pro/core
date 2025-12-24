import { TemplatePack } from "@/packages/renderer/src";
import { landingClassicPack } from "./packs/landing-classic";
import { adminShellPack } from "./packs/admin-shell";
import { authDefaultPack } from "./packs/auth-default";

const packs: Record<string, TemplatePack> = {
  [landingClassicPack._id]: landingClassicPack,
  [adminShellPack._id]: adminShellPack,
  [authDefaultPack._id]: authDefaultPack
};

export function getTemplatePack(templateId: string): TemplatePack {
  const pack = packs[templateId];
  if (!pack) throw new Error(`Unknown template pack: ${templateId}`);
  return pack;
}
