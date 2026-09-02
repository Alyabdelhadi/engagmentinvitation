import { splitTypographyProps, usePageTypography, type PageTypographyProps } from "./pageTypography";
import { BESTSELLERS_TYPOGRAPHY, COMPLETE_SHELF_TYPOGRAPHY, ENGAGEMENT_TYPOGRAPHY, KAGE_TYPOGRAPHY, SYLVA_TYPOGRAPHY } from "./pageRecipes";
import { LandingPageFrame, type LandingPageFrameProps, type LandingPageProps } from "./LandingPageFrame";

export { LandingPageFrame };
export type { LandingPageFrameProps, LandingPageProps };

function TypographyPage({ recipe, title, sourceUrl, ...props }: LandingPageProps & PageTypographyProps & { recipe: typeof KAGE_TYPOGRAPHY; title: string; sourceUrl: string }) {
  const [type, frame] = splitTypographyProps(props);
  const customization = usePageTypography(recipe, type);
  return <LandingPageFrame {...frame} customization={customization} title={title} sourceUrl={sourceUrl} />;
}

export function KageLandingPage(props: LandingPageProps & PageTypographyProps) { return <TypographyPage {...props} recipe={KAGE_TYPOGRAPHY} title="Kage — Where stillness reveals the unseen" sourceUrl="/landing-pages/kage.html" />; }
export function CompleteShelfLandingPage(props: LandingPageProps & PageTypographyProps) { return <TypographyPage {...props} recipe={COMPLETE_SHELF_TYPOGRAPHY} title="Working Volumes — Seven Tools for Making" sourceUrl="/landing-pages/complete-shelf-v2.html" />; }
export function BestsellersBookShowcase(props: LandingPageProps & PageTypographyProps) { return <TypographyPage {...props} recipe={BESTSELLERS_TYPOGRAPHY} title="Field Manuals — Tools for Thought" sourceUrl="/landing-pages/bestsellers-book-showcase.html" />; }
export function MengToSketchbookLandingPage(props: LandingPageProps) { return <LandingPageFrame {...props} title="Meng To — Singapore Sketchbook" sourceUrl="/landing-pages/meng-to-sketchbook.html" />; }
export function SylvaHero(props: LandingPageProps & PageTypographyProps) { return <TypographyPage {...props} recipe={SYLVA_TYPOGRAPHY} title="Sylva — Into the living world" sourceUrl="/landing-pages/inner-green-3d.html" />; }

/** The languages the invitation is authored in. */
export type Language = "en" | "ar";

export type EngagementInvitationProps = LandingPageProps & PageTypographyProps & {
  /** Language the invitation opens in. The visitor can still switch. */
  defaultLanguage?: Language;
  /** Which switches the page offers. */
  supportedLanguages?: readonly Language[];
  /** "auto" lets each language pick its own direction — ar is rtl, en is ltr. */
  direction?: "auto" | "ltr" | "rtl";
};

export function MengToSketchbookEngagementInvitation({
  defaultLanguage = "en",
  supportedLanguages = ["en", "ar"],
  direction = "auto",
  ...props
}: EngagementInvitationProps) {
  const [type, frame] = splitTypographyProps(props);
  const customization = usePageTypography(ENGAGEMENT_TYPOGRAPHY, type);
  const query = new URLSearchParams({ lang: defaultLanguage, langs: supportedLanguages.join(",") });
  if (direction !== "auto") query.set("dir", direction);
  return <LandingPageFrame
    {...frame}
    customization={customization}
    title="Our Engagement — Alaa & Ali"
    sourceUrl={`/landing-pages/meng-to-sketchbook-engagement.html?${query.toString()}`} />;
}
