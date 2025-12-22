import { TemplatePack } from "@/packages/renderer/src";
import { landingClassicPack } from "./packs/landing-classic";
import { adminShellPack } from "./packs/admin-shell";

const packs: Record<string, TemplatePack> = {
  [landingClassicPack._id]: landingClassicPack,
  [adminShellPack._id]: adminShellPack,
};

export function getTemplatePack(templateId: string): TemplatePack {
  const pack = packs[templateId];
  if (!pack) throw new Error(`Unknown template pack: ${templateId}`);
  return pack;
}
