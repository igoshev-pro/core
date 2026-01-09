import React from "react";
import { TemplatePack } from "@/packages/renderer/src";
import MainLayout from "./layouts/MainLayout";
import HeroSection from "./sections/hero/HeroSection";
import SocialProofBar from "./sections/social-proof/SocialProofBar";
import IndustriesSection from "./sections/industries/IndustriesSection";
import ProblemSection from "./sections/problem/ProblemSection";
import SolutionSection from "./sections/solution/SolutionSection";
import HowItWorksSection from "./sections/how-it-works/HowItWorksSection";
import ComparisonTableSection from "./sections/comparison/ComparisonTableSection";
import PricingSection from "./sections/pricing/PricingSection";
import CaseStudiesSection from "./sections/cases/CaseStudiesSection";
import GuaranteesSection from "./sections/guarantees/GuaranteesSection";
import FAQSection from "./sections/faq/FAQSection";
import FinalCTASection from "./sections/final-cta/FinalCTASection";

function PublicLayout({ children, slots }: any) {
  return (
    <MainLayout slots={slots}>
      {children}
    </MainLayout>
  );
}

export const igoshevProPack: TemplatePack = {
  _id: "igoshev-pro",
  version: "1.0.0",
  layouts: {
    "igoshev-pro.layout.main.v1": PublicLayout,
  },
  sections: {
    "igoshev-pro.hero.v1": HeroSection,
    "igoshev-pro.social-proof.v1": SocialProofBar,
    "igoshev-pro.industries.v1": IndustriesSection,
    "igoshev-pro.problem.v1": ProblemSection,
    "igoshev-pro.solution.v1": SolutionSection,
    "igoshev-pro.how-it-works.v1": HowItWorksSection,
    "igoshev-pro.comparison.v1": ComparisonTableSection,
    "igoshev-pro.pricing.v1": PricingSection,
    "igoshev-pro.cases.v1": CaseStudiesSection,
    "igoshev-pro.guarantees.v1": GuaranteesSection,
    "igoshev-pro.faq.v1": FAQSection,
    "igoshev-pro.final-cta.v1": FinalCTASection,
  },
  widgets: {},
};
