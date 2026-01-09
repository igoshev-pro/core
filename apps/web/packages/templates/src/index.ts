import { TemplatePack } from "@/packages/renderer/src";
import { landingClassicPack } from "./packs/landing-classic";
import { adminShellPack } from "./packs/pro";
import { authDefaultPack } from "./packs/auth-default";
import { landingProPack } from "./packs/landing-pro";
import { igoshevProPack } from "./packs/igoshev-pro";

const packs: Record<string, TemplatePack> = {
  [landingClassicPack._id]: landingClassicPack,
  [adminShellPack._id]: adminShellPack,
  [authDefaultPack._id]: authDefaultPack,
  [landingProPack._id]: landingProPack,
  [igoshevProPack._id]: igoshevProPack,
};

export function getTemplatePack(templateId: string): TemplatePack {
  const pack = packs[templateId];
  if (!pack) throw new Error(`Unknown template pack: ${templateId}`);
  return pack;
}
