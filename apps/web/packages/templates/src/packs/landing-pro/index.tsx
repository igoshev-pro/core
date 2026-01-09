import React from "react";
import { TemplatePack } from "@/packages/renderer/src";
import MainLayout from "./layouts/MainLayout";
import HeroSection from "./sections/hero/HeroSection";
import SocialProofBar from "./sections/social-proof/SocialProofBar";
import ProblemSection from "./sections/problem/ProblemSection";
import SolutionSection from "./sections/solution/SolutionSection";
import HowItWorksSection from "./sections/how-it-works/HowItWorksSection";
import ComparisonTableSection from "./sections/comparison/ComparisonTableSection";
import CaseStudiesSection from "./sections/cases/CaseStudiesSection";
import PricingPreviewSection from "./sections/pricing/PricingPreviewSection";
import IndustriesSection from "./sections/industries/IndustriesSection";
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

export const landingProPack: TemplatePack = {
  _id: "landing-pro",
  version: "1.0.0",
  layouts: {
    "landing-pro.layout.main.v1": PublicLayout,
  },
  sections: {
    "landing-pro.hero.v1": HeroSection,
    "landing-pro.social-proof.v1": SocialProofBar,
    "landing-pro.problem.v1": ProblemSection,
    "landing-pro.solution.v1": SolutionSection,
    "landing-pro.how-it-works.v1": HowItWorksSection,
    "landing-pro.comparison.v1": ComparisonTableSection,
    "landing-pro.cases.v1": CaseStudiesSection,
    "landing-pro.pricing.v1": PricingPreviewSection,
    "landing-pro.industries.v1": IndustriesSection,
    "landing-pro.guarantees.v1": GuaranteesSection,
    "landing-pro.faq.v1": FAQSection,
    "landing-pro.final-cta.v1": FinalCTASection,
  },
  widgets: {},
};