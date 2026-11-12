import { useState, type ReactNode } from "react";
import {
  Check,
  Image,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { HERO_PHOTOS, PAGE_COLORS, TEXT_COLORS } from "@/lib/editor/defaults";
import { selectedSection, useEditor } from "@/lib/editor/store";
import { cn } from "@/lib/cn";
import type {
  BrandItem,
  BrandsSection,
  BrandTemplate,
  HeroAnimation,
  HeroPadding,
  HeroRatio,
  HeroSection,
  HeroWidth,
  IntroSection,
  ProductImageRatio,
  ProductTypography,
  SheetKind,
} from "@/lib/editor/types";
import { Field, Group, PrimaryButton, TextArea, TextInput } from "@/components/editor/ui";

const TITLES: Record<SheetKind, { title: string; subtitle: string }> = {
  themes: { title: "Template", subtitle: "" },
  add: { title: "Add section", subtitle: "Place it above the footer." },
  "page-color": { title: "Background", subtitle: "The canvas behind every section." },
  "hero-width": { title: "Banner Width", subtitle: "Full-width or spaced margins." },
  "hero-background": { title: "Background", subtitle: "Color behind banner (default transparent)." },
  "hero-ratio": { title: "Aspect Ratio", subtitle: "Image height & proportions." },
  "hero-padding": { title: "Padding", subtitle: "Vertical and side spacing." },
  "hero-radius": { title: "Corner Curve", subtitle: "Corner rounding & curvature." },
  "hero-animation": { title: "Animation", subtitle: "Slide transitions & autoplay." },
  "hero-media": { title: "Banner Images", subtitle: "Manage hero slides in Dashboard." },
  "hero-layout": { title: "Template", subtitle: "" },
  "hero-photo": { title: "Photo", subtitle: "Replaces the current slide." },
  "hero-text": { title: "Hero text", subtitle: "The line under the photograph." },
  "intro-template": { title: "Template", subtitle: "" },
  "intro-text": { title: "Intro", subtitle: "Headline and supporting line." },
  "kicker-color": { title: "Accent", subtitle: "The small label above the headline." },
  "grid-layout": { title: "Template", subtitle: "" },
  "grid-items": { title: "Items", subtitle: "" },
  "catalog-template": { title: "Template", subtitle: "" },
  "catalog-text": { title: "Catalog", subtitle: "" },
  "product-template": { title: "Template", subtitle: "" },
  "product-text": { title: "Product", subtitle: "" },
  "footer-style": { title: "Template", subtitle: "" },
  "block-template": { title: "Template", subtitle: "" },
  "block-text": { title: "Section", subtitle: "Edit the words." },
  "section-color": { title: "Color", subtitle: "Background of this section." },
  "product-card-style": { title: "Card Style", subtitle: "" },
  "product-card-badges": { title: "Badges & WhatsApp", subtitle: "" },
  "categories-template": { title: "Categories Template", subtitle: "Cards, Story rings, Pills & Grid" },
  "brands-template": { title: "Brands Layout", subtitle: "Marquee ticker, Editorial, Grid & Stories" },
  "brands-style": { title: "Brand Settings", subtitle: "Speed, filters, direction & trust badge" },
  "brands-items": { title: "Brand Items", subtitle: "Manage logos, titles & images" },
  "banner-template": { title: "Template", subtitle: "" },
  "about-template": { title: "Template", subtitle: "" },
  "featured-template": { title: "Template", subtitle: "" },
};

export function Sheet() {
  const sheet = useEditor((s) => s.sheet);
  if (!sheet) return null;
  const meta = TITLES[sheet];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      <button
        type="button"
        aria-label="Close"
        className="animate-fade-in pointer-events-auto absolute inset-0 bg-transparent transition-opacity"
        onClick={() => useEditor.getState().closeSheet()}
      />
      <div className="animate-slide-up sheet-max pointer-events-auto relative flex w-full max-w-lg flex-col overflow-hidden rounded-t-4xl border-t border-slate-200/90 bg-surface shadow-[0_-14px_45px_rgba(0,0,0,0.18)]">
        <div className="flex justify-center pt-3">
          <div className="h-1 w-10 rounded-full bg-line" />
        </div>
        <div className="flex items-start justify-between px-5 py-3">
          <div>
            <h2 className="text-base font-semibold tracking-tight">{meta.title}</h2>
            {meta.subtitle ? <p className="text-xs text-muted">{meta.subtitle}</p> : null}
          </div>
          <button
            type="button"
            aria-label="Close panel"
            onClick={() => useEditor.getState().closeSheet()}
            className="tap-smooth inline-flex size-11 items-center justify-center rounded-full bg-fill text-ink hover:bg-line-soft transition-colors"
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
          <SheetBody kind={sheet} />
        </div>
      </div>
    </div>
  );
}

function SheetBody({ kind }: { kind: SheetKind }) {
  const section = useEditor((s) => selectedSection(s));
  switch (kind) {
    case "themes":
      return <Themes />;
    case "add":
      return <AddList />;
    case "page-color":
    case "section-color":
      return <ColorList target={kind} />;
    case "hero-width":
      return section?.type === "hero" ? <HeroWidthSheet hero={section} /> : null;
    case "hero-background":
      return section?.type === "hero" ? <HeroBackgroundSheet hero={section} /> : null;
    case "hero-ratio":
      return section?.type === "hero" ? <HeroRatioSheet hero={section} /> : null;
    case "hero-padding":
      return section?.type === "hero" ? <HeroPaddingSheet hero={section} /> : null;
    case "hero-radius":
      return section?.type === "hero" ? <HeroRadiusSheet hero={section} /> : null;
    case "hero-animation":
      return section?.type === "hero" ? <HeroAnimationSheet hero={section} /> : null;
    case "hero-media":
      return section?.type === "hero" ? <HeroMediaSheet /> : null;
    case "hero-layout":
      return section?.type === "hero" ? <HeroLayouts hero={section} /> : null;
    case "hero-photo":
      return section?.type === "hero" ? <HeroPhotos hero={section} /> : null;
    case "hero-text":
      return section?.type === "hero" ? <HeroText hero={section} /> : null;
    case "intro-template":
      return section?.type === "intro" ? <IntroTemplate current={section.template} /> : null;
    case "intro-text":
      return section?.type === "intro" ? <IntroText intro={section} /> : null;
    case "kicker-color":
      return <KickerColors />;
    case "grid-layout":
      return section?.type === "grid" ? <GridLayouts current={section.template} /> : null;
    case "catalog-template":
      return section?.type === "catalog" ? <CatalogTemplate current={section.template} /> : null;
    case "product-template":
      return section?.type === "product" ? <ProductTemplate current={section.template} /> : null;
    case "product-card-style":
      return <ProductCardStyle />;
    case "product-card-badges":
      return <ProductCardBadges />;
    case "categories-template":
      return section?.type === "categories" ? <CategoriesTemplate current={section.template} /> : null;
    case "brands-template":
      return section?.type === "brands" ? <BrandsTemplate current={section.template} /> : null;
    case "brands-style":
      return section?.type === "brands" ? <BrandsStyle section={section} /> : null;
    case "brands-items":
      return section?.type === "brands" ? <BrandsItems section={section} /> : null;
    case "banner-template":
      return section?.type === "banner" ? <BannerTemplate current={section.template} /> : null;
    case "about-template":
      return section?.type === "about" ? <AboutTemplate current={section.template} /> : null;
    case "featured-template":
      return section?.type === "featured" ? <FeaturedTemplate current={section.template} /> : null;
    case "footer-style":
      return section?.type === "footer" ? (
        <FooterStyles current={section.template} text={section.text} />
      ) : null;
    case "block-template":
      return section?.type === "block" ? <BlockTemplate current={section.template} /> : null;
    case "block-text":
      return section?.type === "block" ? (
        <BlockText kicker={section.kicker} title={section.title} body={section.body} text={section.text} />
      ) : null;
    default:
      return null;
  }
}

function TemplateCard({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "tap-smooth flex w-full items-center gap-3.5 rounded-2xl border p-3 text-left transition-all duration-200 active:scale-[0.99]",
        active
          ? "border-[#53389E] bg-[#EEF2FF]/60 shadow-xs ring-2 ring-[#53389E]/25"
          : "border-line-soft bg-surface hover:bg-fill/70 hover:border-line"
      )}
    >
      <div className="flex-1 min-w-0">{children}</div>
      <div className="pr-1.5 shrink-0">
        {active ? (
          <div className="flex size-6 items-center justify-center rounded-full bg-[#53389E] text-white shadow-xs">
            <Check className="size-3.5 stroke-[2.5]" />
          </div>
        ) : (
          <div className="size-6 rounded-full border-2 border-slate-300/80" />
        )}
      </div>
    </button>
  );
}

function Themes() {
  const currentTheme = useEditor((s) => (s.pages.home.background === "#0b0b0d" ? "ink" : "light"));
  return (
    <div className="flex flex-col gap-3">
      <TemplateCard
        active={currentTheme === "light"}
        onClick={() => useEditor.getState().applyTheme("light")}
      >
        <div className="overflow-hidden rounded-xl border border-line-soft bg-surface p-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold tracking-widest text-slate-800">
            ZITEO
          </div>
          <div className="mt-1.5 h-10 rounded-md bg-slate-100" />
          <div className="mt-2 h-2 w-2/3 rounded-full bg-slate-200" />
        </div>
      </TemplateCard>
      <TemplateCard
        active={currentTheme === "ink"}
        onClick={() => useEditor.getState().applyTheme("ink")}
      >
        <div className="overflow-hidden rounded-xl bg-ink p-2 text-on-ink shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold tracking-widest text-white">
            ZITEO
          </div>
          <div className="mt-1.5 h-10 rounded-md bg-white/10" />
          <div className="mt-2 h-2 w-2/3 rounded-full bg-white/20" />
        </div>
      </TemplateCard>
    </div>
  );
}

function AddList() {
  const items: {
    kind: "hero" | "featured" | "categories" | "brands" | "banner" | "about" | "reviews" | "newsletter";
    title: string;
    desc: string;
    badge?: string;
  }[] = [
    { kind: "hero", title: "Hero Banner", desc: "High-impact visual banner with photo & headline." },
    { kind: "featured", title: "Featured Products", desc: "Curated drops with direct WhatsApp checkout.", badge: "POPULAR" },
    { kind: "categories", title: "Categories", desc: "Visual navigation tiles for product categories." },
    { kind: "brands", title: "Brands", desc: "Authorized partner brands and logos." },
    { kind: "banner", title: "Promo Banner", desc: "Promotional sale callout with WhatsApp action." },
    { kind: "about", title: "About Us", desc: "Brand philosophy and authentic trust guarantees." },
    { kind: "reviews", title: "Customer Reviews", desc: "Three quotes of social proof." },
    { kind: "newsletter", title: "Newsletter", desc: "Email capture box for new drops." },
  ];

  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item) => (
        <button
          key={item.kind}
          type="button"
          onClick={() => {
            useEditor.getState().insertSection(item.kind);
            useEditor.getState().closeSheet();
          }}
          className="tap-smooth flex w-full items-center justify-between rounded-2xl border border-line-soft bg-surface p-3.5 text-left hover:bg-fill/70 transition-all hover:border-line group"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-ink group-hover:text-accent transition-colors">{item.title}</span>
              {item.badge && (
                <span className="rounded-md bg-purple-500/15 px-1.5 py-0.5 text-[9px] font-bold text-purple-700 uppercase">
                  {item.badge}
                </span>
              )}
            </div>
            <div className="text-xs text-muted mt-0.5">{item.desc}</div>
          </div>
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-fill text-ink group-hover:bg-accent group-hover:text-white transition-all">
            +
          </div>
        </button>
      ))}
    </div>
  );
}

function ColorList({ target }: { target: "page-color" | "section-color" }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {PAGE_COLORS.map((color) => (
        <button
          key={color.value}
          type="button"
          onClick={() => {
            if (target === "page-color") useEditor.getState().setPageColor(color.value);
            else useEditor.getState().patchSelected({ background: color.value });
          }}
          className="tap-smooth group flex flex-col items-center gap-2"
        >
          <span
            className="size-11 rounded-full border border-line shadow-xs transition-transform duration-200 group-hover:scale-110"
            style={{ background: color.value }}
          />
          <span className="text-xs text-muted group-hover:text-ink transition-colors">{color.name}</span>
        </button>
      ))}
    </div>
  );
}

function TextSwatches({ onPick }: { onPick: (value: string) => void }) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-medium text-muted">Text</p>
      <div className="flex gap-2">
        {TEXT_COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            aria-label={color.name}
            onClick={() => onPick(color.value)}
            className="size-11 rounded-full border border-line"
            style={{ background: color.value }}
          />
        ))}
      </div>
    </div>
  );
}

function IntroTemplate({ current }: { current?: "standard" | "centered" }) {
  const active = current ?? "standard";
  return (
    <div className="flex flex-col gap-3">
      <TemplateCard
        active={active === "standard"}
        onClick={() => useEditor.getState().patchSelected({ template: "standard" })}
      >
        <div className="flex flex-col gap-2 rounded-xl border border-line-soft bg-fill/40 p-3">
          <div className="h-3 w-1/3 rounded-full bg-slate-800" />
          <div className="h-2 w-2/3 rounded-full bg-slate-400" />
          <div className="mt-1 flex gap-1.5">
            <div className="h-5 w-12 rounded-full bg-slate-300" />
            <div className="h-5 w-12 rounded-full bg-slate-200" />
            <div className="h-5 w-12 rounded-full bg-slate-200" />
          </div>
        </div>
      </TemplateCard>
      <TemplateCard
        active={active === "centered"}
        onClick={() => useEditor.getState().patchSelected({ template: "centered" })}
      >
        <div className="flex flex-col items-center gap-2 rounded-xl border border-line-soft bg-fill/40 p-3 text-center">
          <div className="h-3 w-1/2 rounded-full bg-slate-800" />
          <div className="h-2 w-3/4 rounded-full bg-slate-400" />
          <div className="mt-1 flex justify-center gap-1.5">
            <div className="h-5 w-12 rounded-full bg-slate-300" />
            <div className="h-5 w-12 rounded-full bg-slate-200" />
          </div>
        </div>
      </TemplateCard>
    </div>
  );
}

function CatalogTemplate({ current }: { current?: "grid" | "list" }) {
  const active = current ?? "grid";
  return (
    <div className="flex flex-col gap-3">
      <TemplateCard
        active={active === "grid"}
        onClick={() => useEditor.getState().patchSelected({ template: "grid" })}
      >
        <div className="grid grid-cols-2 gap-2.5 rounded-xl border border-line-soft bg-fill/30 p-2.5">
          <div className="flex flex-col gap-1.5 rounded-lg border border-line-soft bg-surface p-2">
            <div className="aspect-square w-full rounded-md bg-slate-200" />
            <div className="h-2 w-3/4 rounded-full bg-slate-800" />
            <div className="h-2 w-1/2 rounded-full bg-slate-400" />
          </div>
          <div className="flex flex-col gap-1.5 rounded-lg border border-line-soft bg-surface p-2">
            <div className="aspect-square w-full rounded-md bg-slate-200" />
            <div className="h-2 w-3/4 rounded-full bg-slate-800" />
            <div className="h-2 w-1/2 rounded-full bg-slate-400" />
          </div>
        </div>
      </TemplateCard>
      <TemplateCard
        active={active === "list"}
        onClick={() => useEditor.getState().patchSelected({ template: "list" })}
      >
        <div className="flex flex-col gap-2 rounded-xl border border-line-soft bg-fill/30 p-2.5">
          <div className="flex items-center gap-2.5 rounded-lg border border-line-soft bg-surface p-2">
            <div className="size-9 rounded-md bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-2 w-2/3 rounded-full bg-slate-800" />
              <div className="h-1.5 w-1/3 rounded-full bg-slate-400" />
            </div>
            <div className="h-3 w-8 rounded-full bg-emerald-500/80 shrink-0" />
          </div>
          <div className="flex items-center gap-2.5 rounded-lg border border-line-soft bg-surface p-2">
            <div className="size-9 rounded-md bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-2 w-2/3 rounded-full bg-slate-800" />
              <div className="h-1.5 w-1/3 rounded-full bg-slate-400" />
            </div>
            <div className="h-3 w-8 rounded-full bg-emerald-500/80 shrink-0" />
          </div>
        </div>
      </TemplateCard>
    </div>
  );
}

function ProductTemplate({ current }: { current?: "stacked" | "split" }) {
  const active = current ?? "stacked";
  return (
    <div className="flex flex-col gap-3">
      <TemplateCard
        active={active === "stacked"}
        onClick={() => useEditor.getState().patchSelected({ template: "stacked" })}
      >
        <div className="flex flex-col gap-2 rounded-xl border border-line-soft bg-fill/40 p-2.5">
          <div className="h-16 w-full rounded-lg bg-slate-200" />
          <div className="space-y-1.5 px-1">
            <div className="h-2.5 w-1/2 rounded-full bg-slate-800" />
            <div className="h-2 w-1/3 rounded-full bg-slate-400" />
            <div className="h-5 w-full rounded-full bg-emerald-500" />
          </div>
        </div>
      </TemplateCard>
      <TemplateCard
        active={active === "split"}
        onClick={() => useEditor.getState().patchSelected({ template: "split" })}
      >
        <div className="grid grid-cols-2 gap-2.5 rounded-xl border border-line-soft bg-fill/40 p-2.5">
          <div className="aspect-square w-full rounded-lg bg-slate-200" />
          <div className="flex flex-col justify-center space-y-1.5">
            <div className="h-2.5 w-3/4 rounded-full bg-slate-800" />
            <div className="h-2 w-1/2 rounded-full bg-slate-400" />
            <div className="h-5 w-full rounded-full bg-emerald-500" />
          </div>
        </div>
      </TemplateCard>
    </div>
  );
}

function BlockTemplate({ current }: { current?: "card" | "minimal" }) {
  const active = current ?? "card";
  return (
    <div className="flex flex-col gap-3">
      <TemplateCard
        active={active === "card"}
        onClick={() => useEditor.getState().patchSelected({ template: "card" })}
      >
        <div className="rounded-xl border border-line-soft bg-surface p-3 shadow-2xs">
          <div className="h-2.5 w-1/3 rounded-full bg-slate-800" />
          <div className="mt-2 h-2 w-3/4 rounded-full bg-slate-400" />
        </div>
      </TemplateCard>
      <TemplateCard
        active={active === "minimal"}
        onClick={() => useEditor.getState().patchSelected({ template: "minimal" })}
      >
        <div className="p-3">
          <div className="h-2.5 w-1/3 rounded-full bg-slate-800" />
          <div className="mt-2 h-2 w-3/4 rounded-full bg-slate-400" />
        </div>
      </TemplateCard>
    </div>
  );
}

function ProductCardStyle() {
  const section = useEditor((s) => selectedSection(s));
  const imageRatio = (section && "imageRatio" in section && section.imageRatio) || "1:1";
  const typography = (section && "typography" in section && section.typography) || "base";

  const ratios: { id: ProductImageRatio; label: string; aspect: string }[] = [
    { id: "1:1", label: "1:1 Square", aspect: "aspect-square" },
    { id: "3:4", label: "3:4 Portrait", aspect: "aspect-[3/4]" },
    { id: "16:9", label: "16:9 Wide", aspect: "aspect-video" },
  ];

  const scales: { id: ProductTypography; label: string; sample: string }[] = [
    { id: "sm", label: "Compact", sample: "text-xs" },
    { id: "base", label: "Standard", sample: "text-sm font-medium" },
    { id: "lg", label: "Editorial", sample: "text-base font-semibold" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2.5 text-xs font-semibold tracking-wider text-muted uppercase">Image Aspect Ratio</p>
        <div className="grid grid-cols-3 gap-2.5">
          {ratios.map((r) => {
            const active = imageRatio === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => useEditor.getState().patchSelected({ imageRatio: r.id })}
                className={cn(
                  "tap-smooth flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all",
                  active
                    ? "border-[#53389E] bg-[#EEF2FF]/60 shadow-xs ring-2 ring-[#53389E]/25"
                    : "border-line-soft bg-surface hover:bg-fill/70"
                )}
              >
                <div className="flex h-16 w-full items-center justify-center rounded-lg bg-fill/80 p-1">
                  <div className={cn("max-h-full max-w-full rounded-sm bg-slate-400/80 shadow-2xs", r.aspect, r.id === "16:9" ? "w-full" : "h-14")} />
                </div>
                <span className="text-xs font-medium text-ink">{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-xs font-semibold tracking-wider text-muted uppercase">Typography Scale</p>
        <div className="grid grid-cols-3 gap-2.5">
          {scales.map((s) => {
            const active = typography === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => useEditor.getState().patchSelected({ typography: s.id })}
                className={cn(
                  "tap-smooth flex flex-col items-center justify-between gap-2 rounded-2xl border p-3 text-center transition-all",
                  active
                    ? "border-[#53389E] bg-[#EEF2FF]/60 shadow-xs ring-2 ring-[#53389E]/25"
                    : "border-line-soft bg-surface hover:bg-fill/70"
                )}
              >
                <div className="flex h-12 w-full items-center justify-center">
                  <span className={cn("truncate text-ink", s.sample)}>Air Retro</span>
                </div>
                <span className="text-xs font-medium text-muted">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ProductCardBadges() {
  const section = useEditor((s) => selectedSection(s));
  const showBadge = section && "showBadge" in section ? section.showBadge !== false : true;
  const showRating = section && "showRating" in section ? section.showRating !== false : true;
  const showPrice = section && "showPrice" in section ? section.showPrice !== false : true;
  const rawNumber =
    (section && "whatsappNumber" in section && section.whatsappNumber) || "919876543210";
  const [phone, setPhone] = useState(rawNumber);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2.5 text-xs font-semibold tracking-wider text-muted uppercase">Element Visibility</p>
        <div className="divide-y divide-line-soft overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-2xs">
          {/* Badge toggle */}
          <div className="flex items-center justify-between p-3.5">
            <div>
              <div className="text-sm font-medium">Product Badges</div>
              <div className="text-xs text-muted">Show 'SALE', 'NEW', 'HOT' tags on card</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={showBadge}
              onClick={() => useEditor.getState().patchSelected({ showBadge: !showBadge })}
              className={cn(
                "tap-smooth relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                showBadge ? "bg-accent" : "bg-slate-200"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out",
                  showBadge ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>

          {/* Rating toggle */}
          <div className="flex items-center justify-between p-3.5">
            <div>
              <div className="text-sm font-medium">Rating & Reviews</div>
              <div className="text-xs text-muted">Show customer stars and review count</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={showRating}
              onClick={() => useEditor.getState().patchSelected({ showRating: !showRating })}
              className={cn(
                "tap-smooth relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                showRating ? "bg-accent" : "bg-slate-200"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out",
                  showRating ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>

          {/* Price toggle */}
          <div className="flex items-center justify-between p-3.5">
            <div>
              <div className="text-sm font-medium">Price Display</div>
              <div className="text-xs text-muted">Show pricing on product cards</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={showPrice}
              onClick={() => useEditor.getState().patchSelected({ showPrice: !showPrice })}
              className={cn(
                "tap-smooth relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                showPrice ? "bg-accent" : "bg-slate-200"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out",
                  showPrice ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-xs font-semibold tracking-wider text-muted uppercase">WhatsApp Direct Ordering</p>
        <div className="rounded-2xl border border-line-soft bg-surface p-4 shadow-2xs">
          <Field label="Seller WhatsApp Number (with country code)">
            <TextInput
              value={phone}
              placeholder="919876543210"
              onChange={(e) => setPhone(e.target.value)}
            />
          </Field>
          <div className="mt-3 flex gap-2">
            <PrimaryButton
              onClick={() => {
                useEditor.getState().patchSelected({ whatsappNumber: phone });
                useEditor.getState().showToast("WhatsApp number updated.");
              }}
            >
              Save WhatsApp Number
            </PrimaryButton>
          </div>
          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-50/60 p-3 text-xs leading-relaxed text-emerald-950">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Direct Customer Ordering</span>
            </div>
            <p className="mt-1 text-emerald-800/80">
              When visitors click "Buy on WhatsApp", an order message will open directly in their WhatsApp with product name, selected variant, and link.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const RATIOS: { id: HeroRatio; title: string; detail: string; aspect: string }[] = [
  { id: "16:9", title: "16:9 Widescreen", detail: "Standard modern widescreen banner.", aspect: "16 / 9" },
  { id: "21:9", title: "21:9 Cinematic", detail: "Ultra-wide panoramic showcase.", aspect: "21 / 9" },
  { id: "4:3", title: "4:3 Classic", detail: "Taller classic photo format.", aspect: "4 / 3" },
  { id: "3:2", title: "3:2 Standard", detail: "Classic 35mm landscape format.", aspect: "3 / 2" },
  { id: "1:1", title: "1:1 Square", detail: "Compact square product showcase.", aspect: "1 / 1" },
  { id: "auto", title: "Auto Responsive", detail: "Natural height adapting to content.", aspect: "auto" },
];

function HeroWidthSheet({ hero }: { hero: HeroSection }) {
  const current = hero.widthMode ?? "full";
  const options: { id: HeroWidth; title: string; subtitle: string; visual: string }[] = [
    { id: "full", title: "Full Width", subtitle: "Edge-to-edge bleed, 0 side gap", visual: "w-full" },
    { id: "gap-sm", title: "Small Gap", subtitle: "Sleek inset with subtle side margin", visual: "w-11/12 mx-auto" },
    { id: "gap-md", title: "Medium Gap", subtitle: "Centered container with balanced gap", visual: "w-4/5 mx-auto" },
    { id: "gap-lg", title: "Large Gap", subtitle: "Compact card layout with spacious margins", visual: "w-3/5 mx-auto" },
  ];

  return (
    <div className="flex flex-col gap-3">
      {options.map((opt) => (
        <TemplateCard
          key={opt.id}
          active={current === opt.id}
          onClick={() => useEditor.getState().patchSelected({ widthMode: opt.id })}
        >
          <div className="flex items-center gap-3">
            <div className="w-20 h-10 rounded-xl bg-fill/80 border border-line-soft flex items-center justify-center p-1.5 shrink-0">
              <div className={cn("h-full rounded-md bg-accent/70 transition-all", opt.visual)} />
            </div>
            <div>
              <div className="text-sm font-semibold text-ink">{opt.title}</div>
              <div className="text-xs text-muted">{opt.subtitle}</div>
            </div>
          </div>
        </TemplateCard>
      ))}
    </div>
  );
}

function HeroBackgroundSheet({ hero }: { hero: HeroSection }) {
  const current = hero.background || "transparent";
  const isTransparent = current === "transparent";

  const palettes = [
    { name: "Clean White", value: "#ffffff" },
    { name: "Soft Cream", value: "#fbfbfd" },
    { name: "Warm Linen", value: "#f7f4ed" },
    { name: "Pure Ink", value: "#0b0b0d" },
    { name: "Midnight", value: "#0f172a" },
    { name: "Deep Slate", value: "#1e293b" },
    { name: "Royal Violet", value: "#2e1065" },
    { name: "Deep Navy", value: "#0a192f" },
    { name: "Forest", value: "#064e3b" },
    { name: "Warm Amber", value: "#d97706" },
  ];

  const setColor = (val: string) => {
    useEditor.getState().patchSelected({ background: val });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Quick Transparent Button (Default) */}
      <button
        type="button"
        onClick={() => setColor("transparent")}
        className={cn(
          "tap-smooth flex items-center justify-between p-3.5 rounded-2xl border transition-all",
          isTransparent
            ? "border-accent bg-accent/10 text-accent font-semibold ring-2 ring-accent/20"
            : "border-line-soft bg-surface text-ink hover:bg-fill"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full border border-dashed border-slate-400 bg-linear-to-tr from-slate-200 to-transparent flex items-center justify-center">
            <span className="text-[10px] font-bold text-muted">∅</span>
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold">Transparent (Default)</div>
            <div className="text-xs text-muted">Shows underlying store canvas</div>
          </div>
        </div>
        {isTransparent && <Check className="size-4 text-accent" strokeWidth={2.5} />}
      </button>

      {/* Interactive Custom Color Picker */}
      <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-line-soft bg-surface shadow-2xs">
        <label className="relative flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-2xl border-2 border-line shadow-xs overflow-hidden transition-transform active:scale-95">
          <input
            type="color"
            value={current.startsWith("#") && current.length === 7 ? current : "#ffffff"}
            onChange={(e) => setColor(e.target.value)}
            className="absolute inset-0 size-full opacity-0 cursor-pointer"
          />
          <span
            className="size-full"
            style={{ background: isTransparent ? "transparent" : current }}
          />
        </label>
        <div className="flex-1 min-w-0">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Custom Background Color
          </label>
          <div className="relative mt-1 flex items-center">
            <span className="absolute left-3 text-xs font-mono text-muted">#</span>
            <input
              type="text"
              value={isTransparent ? "" : current.replace(/^#/, "")}
              onChange={(e) => {
                const hex = `#${e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 8)}`;
                setColor(hex);
              }}
              placeholder="transparent"
              className="w-full rounded-xl border border-line-soft bg-fill/50 pl-7 pr-3 py-1.5 text-xs font-mono uppercase tracking-wider text-ink focus:border-accent focus:bg-surface focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Preset Swatches Palette */}
      <div>
        <p className="mb-2 text-xs font-semibold text-muted uppercase tracking-wider">
          Curated Palettes
        </p>
        <div className="grid grid-cols-5 gap-2">
          {palettes.map((c) => {
            const active = !isTransparent && current.toLowerCase() === c.value.toLowerCase();
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                className="tap-smooth group flex flex-col items-center gap-1.5 p-2 rounded-2xl border border-line-soft hover:bg-fill/70 transition-all"
              >
                <span
                  className={cn(
                    "size-8 rounded-full border border-line shadow-xs transition-transform group-hover:scale-105 flex items-center justify-center",
                    active && "ring-2 ring-accent ring-offset-2"
                  )}
                  style={{ background: c.value }}
                >
                  {active && (
                    <Check
                      className={cn(
                        "size-3.5 stroke-[2.5]",
                        c.value === "#ffffff" || c.value === "#fbfbfd" || c.value === "#f7f4ed"
                          ? "text-slate-900"
                          : "text-white"
                      )}
                    />
                  )}
                </span>
                <span className="text-[10px] font-medium text-muted truncate max-w-full group-hover:text-ink">
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HeroRatioSheet({ hero }: { hero: HeroSection }) {
  const current = hero.ratio ?? "16:9";
  const ratios: { id: HeroRatio; title: string; subtitle: string; aspectBox: string }[] = [
    { id: "16:9", title: "16:9 Widescreen", subtitle: "Standard modern widescreen banner", aspectBox: "aspect-video" },
    { id: "21:9", title: "21:9 Cinematic", subtitle: "Ultra-wide panoramic showcase", aspectBox: "aspect-[21/9]" },
    { id: "4:3", title: "4:3 Classic", subtitle: "Taller classic photo format", aspectBox: "aspect-[4/3]" },
    { id: "3:2", title: "3:2 Standard", subtitle: "Classic 35mm landscape format", aspectBox: "aspect-[3/2]" },
    { id: "1:1", title: "1:1 Square", subtitle: "Compact square product showcase", aspectBox: "aspect-square" },
    { id: "auto", title: "Auto Responsive", subtitle: "Natural height adapting to content", aspectBox: "aspect-auto" },
  ];

  return (
    <div className="flex flex-col gap-3">
      {ratios.map((item) => (
        <TemplateCard
          key={item.id}
          active={current === item.id}
          onClick={() => useEditor.getState().patchSelected({ ratio: item.id })}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-10 rounded-xl bg-fill/80 border border-line-soft flex items-center justify-center p-1 shrink-0">
              <div className={cn("w-full max-h-full bg-accent/70 rounded-md", item.aspectBox)} />
            </div>
            <div>
              <div className="text-sm font-semibold text-ink">{item.title}</div>
              <div className="text-xs text-muted">{item.subtitle}</div>
            </div>
          </div>
        </TemplateCard>
      ))}
    </div>
  );
}

function HeroPaddingSheet({ hero }: { hero: HeroSection }) {
  const paddingY = hero.paddingY ?? "none";
  const paddingX = hero.paddingX ?? "none";

  const pyOptions: { id: HeroPadding; label: string; desc: string }[] = [
    { id: "none", label: "None (0px)", desc: "Flush border" },
    { id: "sm", label: "Compact (12px)", desc: "Subtle breathing room" },
    { id: "md", label: "Standard (24px)", desc: "Balanced spacing" },
    { id: "lg", label: "Spacious (40px)", desc: "Roomy luxury layout" },
  ];

  const pxOptions: { id: HeroPadding; label: string; desc: string }[] = [
    { id: "none", label: "None (0px)", desc: "Edge-to-edge" },
    { id: "sm", label: "Compact (8px)", desc: "Subtle inset" },
    { id: "md", label: "Standard (16px)", desc: "Balanced side margin" },
    { id: "lg", label: "Roomy (32px)", desc: "Framed card" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">
          Vertical Spacing (Top & Bottom)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {pyOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => useEditor.getState().patchSelected({ paddingY: opt.id })}
              className={cn(
                "p-3 rounded-2xl border text-left transition-all",
                paddingY === opt.id
                  ? "border-accent bg-accent/10 ring-2 ring-accent/20"
                  : "border-line-soft bg-surface hover:bg-fill"
              )}
            >
              <div className="text-xs font-semibold text-ink">{opt.label}</div>
              <div className="text-[11px] text-muted">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">
          Side Spacing (Left & Right)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {pxOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => useEditor.getState().patchSelected({ paddingX: opt.id })}
              className={cn(
                "p-3 rounded-2xl border text-left transition-all",
                paddingX === opt.id
                  ? "border-accent bg-accent/10 ring-2 ring-accent/20"
                  : "border-line-soft bg-surface hover:bg-fill"
              )}
            >
              <div className="text-xs font-semibold text-ink">{opt.label}</div>
              <div className="text-[11px] text-muted">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroRadiusSheet({ hero }: { hero: HeroSection }) {
  const current = hero.borderRadius ?? 0;
  const presets = [
    { label: "Sharp", value: 0 },
    { label: "Subtle", value: 8 },
    { label: "Rounded", value: 16 },
    { label: "Curved", value: 24 },
    { label: "Extra", value: 36 },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-line-soft bg-surface p-4 shadow-2xs">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">Corner Curvature</span>
          <span className="text-xs font-bold text-accent font-mono bg-accent/10 px-2.5 py-1 rounded-lg">
            {current}px
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={48}
          step={2}
          value={current}
          onChange={(e) => useEditor.getState().patchSelected({ borderRadius: Number(e.target.value) })}
          className="accent-accent w-full cursor-pointer h-2 bg-slate-200 dark:bg-zinc-700 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-muted font-mono">
          <span>0px (Sharp)</span>
          <span>24px (Medium)</span>
          <span>48px (Pill)</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Quick Presets</label>
        <div className="grid grid-cols-5 gap-2">
          {presets.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => useEditor.getState().patchSelected({ borderRadius: p.value })}
              className={cn(
                "py-2.5 text-xs font-semibold rounded-xl border text-center transition-all",
                current === p.value
                  ? "border-accent bg-accent text-white"
                  : "border-line-soft bg-surface hover:bg-fill text-ink"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroAnimationSheet({ hero }: { hero: HeroSection }) {
  const currentEffect = hero.animationEffect ?? "slide";
  const autoplay = hero.autoplay !== false;
  const speed = hero.autoplaySpeed ?? 4500;

  const effects: { id: HeroAnimation; label: string; desc: string }[] = [
    { id: "slide", label: "Slide Transition", desc: "Classic smooth horizontal slide" },
    { id: "fade", label: "Gentle Fade", desc: "Soft crossfade between banner slides" },
    { id: "zoom", label: "Ken Burns Zoom", desc: "Subtle elegant zoom animation" },
    { id: "none", label: "Static / None", desc: "Instant banner image switch" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Autoplay Toggle */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl border border-line-soft bg-surface shadow-2xs">
        <div>
          <div className="text-sm font-semibold text-ink">Autoplay Slideshow</div>
          <div className="text-xs text-muted">Automatically cycle through hero images</div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={autoplay}
          onClick={() => useEditor.getState().patchSelected({ autoplay: !autoplay })}
          className={cn(
            "tap-smooth relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
            autoplay ? "bg-accent" : "bg-slate-200 dark:bg-zinc-700"
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200",
              autoplay ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
      </div>

      {/* Slide Speed */}
      {autoplay && (
        <div className="flex flex-col gap-2 rounded-2xl border border-line-soft bg-surface p-3.5 shadow-2xs">
          <label className="text-xs font-semibold text-muted uppercase tracking-wider">
            Slide Interval Speed
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Fast (2.5s)", val: 2500 },
              { label: "Normal (4.5s)", val: 4500 },
              { label: "Relaxed (7s)", val: 7000 },
            ].map((s) => (
              <button
                key={s.val}
                type="button"
                onClick={() => useEditor.getState().patchSelected({ autoplaySpeed: s.val })}
                className={cn(
                  "py-2 text-xs font-semibold rounded-xl border text-center transition-all",
                  speed === s.val
                    ? "border-accent bg-accent/10 text-accent font-bold ring-2 ring-accent/20"
                    : "border-line-soft bg-surface hover:bg-fill text-ink"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Transition Style */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">
          Transition Style
        </label>
        <div className="flex flex-col gap-2">
          {effects.map((eff) => (
            <TemplateCard
              key={eff.id}
              active={currentEffect === eff.id}
              onClick={() => useEditor.getState().patchSelected({ animationEffect: eff.id })}
            >
              <div>
                <div className="text-sm font-semibold text-ink">{eff.label}</div>
                <div className="text-xs text-muted">{eff.desc}</div>
              </div>
            </TemplateCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroMediaSheet() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="flex flex-col gap-4 text-center py-2">
      <div className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-accent/10 text-accent">
        <Image className="size-7" />
      </div>

      <div>
        <h3 className="text-base font-bold text-ink">Manage Banner Images</h3>
        <p className="mt-1 text-xs text-muted leading-relaxed max-w-sm mx-auto">
          Hero banner images and slides are managed in the <strong>Dashboard</strong>. Would you like to switch to the Dashboard to update and arrange your banner media?
        </p>
      </div>

      {confirmed ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          ✓ Dashboard redirection ready. You will be able to upload, crop, and reorder hero banners in the Media Dashboard.
        </div>
      ) : (
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={() => setConfirmed(true)}
            className="w-full py-3 rounded-2xl bg-accent text-white text-sm font-semibold shadow-xs hover:bg-accent/90 transition-all active:scale-[0.99]"
          >
            Yes, Go to Dashboard
          </button>
          <button
            type="button"
            onClick={() => useEditor.getState().closeSheet()}
            className="w-full py-2.5 rounded-2xl border border-line-soft bg-surface text-ink text-xs font-medium hover:bg-fill transition-all"
          >
            Stay in Designer
          </button>
        </div>
      )}
    </div>
  );
}

function HeroLayouts({ hero }: { hero: HeroSection }) {
  const currentRatio = hero.ratio ?? "16:9";
  const currentImg = hero.slides[hero.active] ?? hero.slides[0];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        {RATIOS.map((item) => (
          <TemplateCard
            key={item.id}
            active={currentRatio === item.id}
            onClick={() => useEditor.getState().patchSelected({ ratio: item.id })}
          >
            <div className="flex items-center gap-3">
              <div className="w-24 overflow-hidden rounded-lg border border-line-soft bg-fill/40 shrink-0">
                <div
                  className="w-full bg-cover bg-center"
                  style={{
                    aspectRatio: item.aspect,
                    backgroundImage: `url(${currentImg})`,
                  }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-800">{item.title}</span>
            </div>
          </TemplateCard>
        ))}
      </div>

      <div>
        <p className="mb-2.5 text-xs font-medium text-muted">Slide Photos</p>
        <div className="grid grid-cols-4 gap-2">
          {hero.slides.map((url, idx) => (
            <button
              key={url + idx}
              type="button"
              onClick={() => useEditor.getState().setHeroSlide(idx)}
              className={cn(
                "tap-smooth relative aspect-video overflow-hidden rounded-xl border-2 transition-all",
                idx === hero.active ? "border-accent ring-2 ring-accent/30 scale-102" : "border-line opacity-75 hover:opacity-100"
              )}
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroPhotos({ hero }: { hero: HeroSection }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {HERO_PHOTOS.map((photo) => (
        <button
          key={photo.url}
          type="button"
          onClick={() => {
            const slides = [...hero.slides];
            slides[hero.active] = photo.url;
            useEditor.getState().patchSelected({ slides });
          }}
          className="tap-smooth group overflow-hidden rounded-2xl text-left"
        >
          <div className="overflow-hidden rounded-xl">
            <img src={photo.url} alt={photo.name} className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          </div>
          <span className="mt-2 block text-xs font-medium text-ink transition-colors group-hover:text-accent">{photo.name}</span>
        </button>
      ))}
    </div>
  );
}

function HeroText({ hero }: { hero: HeroSection }) {
  const [kicker, setKicker] = useState(hero.kicker);
  const [title, setTitle] = useState(hero.title);
  const [body, setBody] = useState(hero.body);
  return (
    <div className="flex flex-col gap-3">
      <Field label="Label">
        <TextInput value={kicker} onChange={(event) => setKicker(event.target.value)} />
      </Field>
      <Field label="Headline">
        <TextInput value={title} onChange={(event) => setTitle(event.target.value)} />
      </Field>
      <Field label="Supporting line">
        <TextArea rows={3} value={body} onChange={(event) => setBody(event.target.value)} />
      </Field>
      <PrimaryButton
        onClick={() => {
          useEditor.getState().patchSelected({ kicker, title, body });
          useEditor.getState().closeSheet();
        }}
      >
        Save
      </PrimaryButton>
    </div>
  );
}

function IntroText({ intro }: { intro: IntroSection }) {
  const [kicker, setKicker] = useState(intro.kicker);
  const [title, setTitle] = useState(intro.title);
  const [body, setBody] = useState(intro.body);
  return (
    <div className="flex flex-col gap-3">
      <Field label="Label">
        <TextInput value={kicker} onChange={(event) => setKicker(event.target.value)} />
      </Field>
      <Field label="Headline">
        <TextInput value={title} onChange={(event) => setTitle(event.target.value)} />
      </Field>
      <Field label="Supporting line">
        <TextArea rows={3} value={body} onChange={(event) => setBody(event.target.value)} />
      </Field>
      <PrimaryButton
        onClick={() => {
          useEditor.getState().patchSelected({ kicker, title, body });
          useEditor.getState().closeSheet();
        }}
      >
        Save
      </PrimaryButton>
      <TextSwatches onPick={(text) => useEditor.getState().patchSelected({ text })} />
    </div>
  );
}

function KickerColors() {
  return (
    <div className="flex gap-2">
      {TEXT_COLORS.map((color) => (
        <button
          key={color.value}
          type="button"
          onClick={() => useEditor.getState().patchSelected({ kickerColor: color.value })}
          className="flex flex-col items-center gap-2"
        >
          <span className="size-11 rounded-full border border-line" style={{ background: color.value }} />
          <span className="text-xs text-muted">{color.name}</span>
        </button>
      ))}
    </div>
  );
}

function GridLayouts({ current }: { current: "mosaic" | "editorial" }) {
  return (
    <div className="flex flex-col gap-3">
      <TemplateCard
        active={current === "mosaic"}
        onClick={() => useEditor.getState().patchSelected({ template: "mosaic" })}
      >
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-line-soft bg-fill/30 p-2.5">
          <div className="aspect-square rounded-md bg-slate-300" />
          <div className="aspect-square rounded-md bg-slate-300" />
          <div className="aspect-square rounded-md bg-slate-300" />
          <div className="aspect-square rounded-md bg-slate-300" />
        </div>
      </TemplateCard>
      <TemplateCard
        active={current === "editorial"}
        onClick={() => useEditor.getState().patchSelected({ template: "editorial" })}
      >
        <div className="flex flex-col gap-2 rounded-xl border border-line-soft bg-fill/30 p-2.5">
          <div className="h-10 w-full rounded-md bg-slate-300" />
          <div className="h-10 w-full rounded-md bg-slate-300" />
        </div>
      </TemplateCard>
    </div>
  );
}

function FooterStyles({
  current,
  text,
}: {
  current: "minimal" | "columns";
  text: string;
}) {
  return (
    <div>
      <div className="flex flex-col gap-3">
        <TemplateCard
          active={current === "minimal"}
          onClick={() => useEditor.getState().patchSelected({ template: "minimal" })}
        >
          <div className="flex items-center justify-between rounded-xl border border-line-soft bg-fill/40 p-3">
            <div className="h-2 w-16 rounded-full bg-slate-800" />
            <div className="h-2 w-24 rounded-full bg-slate-400" />
          </div>
        </TemplateCard>
        <TemplateCard
          active={current === "columns"}
          onClick={() => useEditor.getState().patchSelected({ template: "columns" })}
        >
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-line-soft bg-fill/40 p-3">
            <div className="space-y-1">
              <div className="h-2 w-3/4 rounded-full bg-slate-800" />
              <div className="h-1.5 w-1/2 rounded-full bg-slate-400" />
            </div>
            <div className="space-y-1">
              <div className="h-2 w-3/4 rounded-full bg-slate-800" />
              <div className="h-1.5 w-1/2 rounded-full bg-slate-400" />
            </div>
            <div className="space-y-1">
              <div className="h-2 w-3/4 rounded-full bg-slate-800" />
              <div className="h-1.5 w-1/2 rounded-full bg-slate-400" />
            </div>
          </div>
        </TemplateCard>
      </div>
      <TextSwatches
        onPick={(color) => {
          if (color !== text) useEditor.getState().patchSelected({ text: color });
        }}
      />
    </div>
  );
}

function BlockText({
  kicker,
  title,
  body,
  text,
}: {
  kicker: string;
  title: string;
  body: string;
  text: string;
}) {
  const [nextKicker, setKicker] = useState(kicker);
  const [nextTitle, setTitle] = useState(title);
  const [nextBody, setBody] = useState(body);
  return (
    <div className="flex flex-col gap-3">
      <Field label="Label">
        <TextInput value={nextKicker} onChange={(event) => setKicker(event.target.value)} />
      </Field>
      <Field label="Headline">
        <TextInput value={nextTitle} onChange={(event) => setTitle(event.target.value)} />
      </Field>
      <Field label="Supporting line">
        <TextArea rows={3} value={nextBody} onChange={(event) => setBody(event.target.value)} />
      </Field>
      <PrimaryButton
        onClick={() => {
          useEditor.getState().patchSelected({ kicker: nextKicker, title: nextTitle, body: nextBody });
          useEditor.getState().closeSheet();
        }}
      >
        Save
      </PrimaryButton>
      <TextSwatches
        onPick={(color) => {
          if (color !== text) useEditor.getState().patchSelected({ text: color });
        }}
      />
    </div>
  );
}

function CategoriesTemplate({ current }: { current?: "cards" | "pills" | "grid" | "story" }) {
  const active = current ?? "cards";
  return (
    <div className="flex flex-col gap-3">
      <TemplateCard
        active={active === "cards"}
        onClick={() => useEditor.getState().patchSelected({ template: "cards" })}
      >
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-line-soft bg-fill/30 p-2.5">
          <div className="aspect-[4/3] rounded-lg bg-slate-300 relative overflow-hidden flex items-end p-1.5">
            <div className="h-2 w-10 rounded-full bg-slate-800" />
          </div>
          <div className="aspect-[4/3] rounded-lg bg-slate-300 relative overflow-hidden flex items-end p-1.5">
            <div className="h-2 w-10 rounded-full bg-slate-800" />
          </div>
        </div>
      </TemplateCard>
      <TemplateCard
        active={active === "story"}
        onClick={() => useEditor.getState().patchSelected({ template: "story" })}
      >
        <div className="flex items-center gap-2 rounded-xl border border-line-soft bg-fill/30 p-2.5">
          <div className="flex flex-col items-center gap-1">
            <div className="size-8 rounded-full border-2 border-accent p-0.5">
              <div className="size-full rounded-full bg-slate-400" />
            </div>
            <div className="h-1.5 w-6 rounded-full bg-slate-700" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="size-8 rounded-full border-2 border-purple-500 p-0.5">
              <div className="size-full rounded-full bg-slate-400" />
            </div>
            <div className="h-1.5 w-6 rounded-full bg-slate-700" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="size-8 rounded-full border-2 border-line p-0.5">
              <div className="size-full rounded-full bg-slate-300" />
            </div>
            <div className="h-1.5 w-6 rounded-full bg-slate-500" />
          </div>
        </div>
      </TemplateCard>
      <TemplateCard
        active={active === "pills"}
        onClick={() => useEditor.getState().patchSelected({ template: "pills" })}
      >
        <div className="flex gap-2 rounded-xl border border-line-soft bg-fill/30 p-2.5">
          <div className="h-7 w-20 rounded-full bg-slate-300 flex items-center px-1.5 gap-1">
            <div className="size-4 rounded-full bg-slate-400" />
            <div className="h-1.5 w-8 rounded-full bg-slate-700" />
          </div>
          <div className="h-7 w-20 rounded-full bg-slate-200 flex items-center px-1.5 gap-1">
            <div className="size-4 rounded-full bg-slate-300" />
            <div className="h-1.5 w-8 rounded-full bg-slate-500" />
          </div>
        </div>
      </TemplateCard>
      <TemplateCard
        active={active === "grid"}
        onClick={() => useEditor.getState().patchSelected({ template: "grid" })}
      >
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-line-soft bg-fill/30 p-2.5">
          <div className="flex flex-col items-center gap-1.5 rounded-lg bg-surface p-2">
            <div className="size-8 rounded-full bg-slate-300" />
            <div className="h-1.5 w-10 rounded-full bg-slate-700" />
          </div>
          <div className="flex flex-col items-center gap-1.5 rounded-lg bg-surface p-2">
            <div className="size-8 rounded-full bg-slate-300" />
            <div className="h-1.5 w-10 rounded-full bg-slate-700" />
          </div>
        </div>
      </TemplateCard>
    </div>
  );
}

function BrandsTemplate({ current }: { current?: BrandTemplate }) {
  const active = current ?? "marquee";
  return (
    <div className="flex flex-col gap-3">
      <TemplateCard
        active={active === "marquee"}
        onClick={() => useEditor.getState().patchSelected({ template: "marquee" })}
      >
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between text-xs font-bold text-ink">
            <span>Infinite Marquee Ticker</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-semibold">POPULAR</span>
          </div>
          <p className="text-[11px] text-muted">Continuous smooth auto-scrolling brand logos.</p>
          <div className="mt-1 flex items-center gap-2 rounded-xl border border-line-soft bg-fill/30 p-2.5 overflow-hidden">
            <div className="h-6 px-3 rounded-lg bg-surface border border-line-soft flex items-center justify-center text-[10px] font-bold">NIKE</div>
            <div className="h-6 px-3 rounded-lg bg-surface border border-line-soft flex items-center justify-center text-[10px] font-bold">ADIDAS</div>
            <div className="h-6 px-3 rounded-lg bg-surface border border-line-soft flex items-center justify-center text-[10px] font-bold">SALOMON</div>
          </div>
        </div>
      </TemplateCard>

      <TemplateCard
        active={active === "editorial"}
        onClick={() => useEditor.getState().patchSelected({ template: "editorial" })}
      >
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between text-xs font-bold text-ink">
            <span>Editorial Lookbook Cards</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold">CONVERSION</span>
          </div>
          <p className="text-[11px] text-muted">Lifestyle visual cards with logo overlay and direct shop link.</p>
          <div className="mt-1 grid grid-cols-2 gap-2 rounded-xl border border-line-soft bg-fill/30 p-2.5">
            <div className="aspect-[4/3] rounded-lg bg-slate-800 p-2 flex flex-col justify-end text-white">
              <span className="text-[10px] font-black">NIKE</span>
              <span className="text-[8px] text-white/70">Shop →</span>
            </div>
            <div className="aspect-[4/3] rounded-lg bg-slate-700 p-2 flex flex-col justify-end text-white">
              <span className="text-[10px] font-black">ADIDAS</span>
              <span className="text-[8px] text-white/70">Shop →</span>
            </div>
          </div>
        </div>
      </TemplateCard>

      <TemplateCard
        active={active === "story"}
        onClick={() => useEditor.getState().patchSelected({ template: "story" })}
      >
        <div className="flex flex-col gap-1 w-full">
          <div className="text-xs font-bold text-ink">Mobile Story Badges</div>
          <p className="text-[11px] text-muted">Instagram-style circular avatars with active gradient ring.</p>
          <div className="mt-1 flex items-center gap-2 rounded-xl border border-line-soft bg-fill/30 p-2.5">
            <div className="size-8 rounded-full border-2 border-accent p-0.5 flex items-center justify-center text-[9px] font-bold bg-surface">NK</div>
            <div className="size-8 rounded-full border-2 border-purple-500 p-0.5 flex items-center justify-center text-[9px] font-bold bg-surface">AD</div>
            <div className="size-8 rounded-full border-2 border-emerald-500 p-0.5 flex items-center justify-center text-[9px] font-bold bg-surface">NB</div>
          </div>
        </div>
      </TemplateCard>

      <TemplateCard
        active={active === "grid"}
        onClick={() => useEditor.getState().patchSelected({ template: "grid" })}
      >
        <div className="flex flex-col gap-1 w-full">
          <div className="text-xs font-bold text-ink">Minimalist Trust Grid</div>
          <p className="text-[11px] text-muted">Clean structured boxes with brand names and taglines.</p>
          <div className="mt-1 grid grid-cols-3 gap-1.5 rounded-xl border border-line-soft bg-fill/30 p-2">
            <div className="h-6 rounded-md bg-surface border border-line-soft flex items-center justify-center text-[9px] font-bold">NIKE</div>
            <div className="h-6 rounded-md bg-surface border border-line-soft flex items-center justify-center text-[9px] font-bold">ADIDAS</div>
            <div className="h-6 rounded-md bg-surface border border-line-soft flex items-center justify-center text-[9px] font-bold">PUMA</div>
          </div>
        </div>
      </TemplateCard>

      <TemplateCard
        active={active === "row"}
        onClick={() => useEditor.getState().patchSelected({ template: "row" })}
      >
        <div className="flex flex-col gap-1 w-full">
          <div className="text-xs font-bold text-ink">Classic Horizontal Row</div>
          <p className="text-[11px] text-muted">Static swipeable row of brands.</p>
          <div className="mt-1 flex items-center justify-center gap-2 rounded-xl border border-line-soft bg-fill/30 p-2.5">
            <div className="h-6 w-14 rounded-md bg-slate-300" />
            <div className="h-6 w-14 rounded-md bg-slate-300" />
          </div>
        </div>
      </TemplateCard>
    </div>
  );
}

function BrandsStyle({ section }: { section: BrandsSection }) {
  const [badge, setBadge] = useState(section.trustBadge || "");
  const [title, setTitle] = useState(section.title || "");
  const [subtitle, setSubtitle] = useState(section.subtitle || "");

  const speed = section.marqueeSpeed || "normal";
  const direction = section.marqueeDirection || "left";
  const pauseOnHover = section.pauseOnHover !== false;
  const colorFilter = section.colorFilter || "monochrome";
  const edgeFade = section.edgeFade !== false;
  const columns = section.columns || 3;

  return (
    <div className="flex flex-col gap-4">
      <Field label="Trust Badge Tag">
        <TextInput
          value={badge}
          placeholder="e.g. 100% Authorized Stockist"
          onChange={(e) => {
            setBadge(e.target.value);
            useEditor.getState().patchSelected({ trustBadge: e.target.value });
          }}
        />
      </Field>

      <Field label="Section Title">
        <TextInput
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            useEditor.getState().patchSelected({ title: e.target.value });
          }}
        />
      </Field>

      <Field label="Supporting Subtitle">
        <TextInput
          value={subtitle}
          onChange={(e) => {
            setSubtitle(e.target.value);
            useEditor.getState().patchSelected({ subtitle: e.target.value });
          }}
        />
      </Field>

      {section.template === "marquee" && (
        <div className="space-y-2">
          <span className="block text-xs font-medium text-muted">Marquee Animation Settings</span>
          <Group>
            <div className="p-3 flex flex-col gap-3">
              <div>
                <span className="text-xs font-semibold text-ink">Scroll Speed</span>
                <div className="mt-1.5 grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-fill/60 border border-line-soft text-xs">
                  {(["slow", "normal", "fast"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => useEditor.getState().patchSelected({ marqueeSpeed: s })}
                      className={cn(
                        "py-1.5 rounded-lg font-medium capitalize tap-smooth",
                        speed === s ? "bg-surface text-ink shadow-2xs font-bold" : "text-muted hover:text-ink"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-ink">Scroll Direction</span>
                <div className="mt-1.5 grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-fill/60 border border-line-soft text-xs">
                  {(["left", "right"] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => useEditor.getState().patchSelected({ marqueeDirection: d })}
                      className={cn(
                        "py-1.5 rounded-lg font-medium capitalize tap-smooth",
                        direction === d ? "bg-surface text-ink shadow-2xs font-bold" : "text-muted hover:text-ink"
                      )}
                    >
                      {d === "left" ? "← Leftward" : "Rightward →"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-xs font-semibold text-ink">Pause on Hover</span>
                  <p className="text-[10px] text-muted">Stops scrolling when cursor hovers</p>
                </div>
                <button
                  type="button"
                  onClick={() => useEditor.getState().patchSelected({ pauseOnHover: !pauseOnHover })}
                  className={cn(
                    "h-6 w-11 rounded-full p-0.5 transition-colors tap-smooth",
                    pauseOnHover ? "bg-accent" : "bg-line"
                  )}
                >
                  <div
                    className={cn(
                      "size-5 rounded-full bg-white transition-transform shadow-xs",
                      pauseOnHover ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-xs font-semibold text-ink">Edge Gradient Fade</span>
                  <p className="text-[10px] text-muted">Smooth left and right fade mask</p>
                </div>
                <button
                  type="button"
                  onClick={() => useEditor.getState().patchSelected({ edgeFade: !edgeFade })}
                  className={cn(
                    "h-6 w-11 rounded-full p-0.5 transition-colors tap-smooth",
                    edgeFade ? "bg-accent" : "bg-line"
                  )}
                >
                  <div
                    className={cn(
                      "size-5 rounded-full bg-white transition-transform shadow-xs",
                      edgeFade ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </div>
          </Group>
        </div>
      )}

      <div className="space-y-2">
        <span className="block text-xs font-medium text-muted">Visual Style & Colors</span>
        <Group>
          <div className="p-3 flex flex-col gap-3">
            <div>
              <span className="text-xs font-semibold text-ink">Logo Filter</span>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-fill/60 border border-line-soft text-xs">
                {(["monochrome", "original", "inverted"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => useEditor.getState().patchSelected({ colorFilter: f })}
                    className={cn(
                      "py-1.5 rounded-lg font-medium capitalize tap-smooth",
                      colorFilter === f ? "bg-surface text-ink shadow-2xs font-bold" : "text-muted hover:text-ink"
                    )}
                  >
                    {f === "monochrome" ? "Muted" : f === "original" ? "Original" : "Invert"}
                  </button>
                ))}
              </div>
            </div>

            {section.template === "grid" && (
              <div>
                <span className="text-xs font-semibold text-ink">Columns on Desktop</span>
                <div className="mt-1.5 grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-fill/60 border border-line-soft text-xs">
                  {([2, 3, 4, 6] as const).map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => useEditor.getState().patchSelected({ columns: col })}
                      className={cn(
                        "py-1.5 rounded-lg font-medium tap-smooth",
                        columns === col ? "bg-surface text-ink shadow-2xs font-bold" : "text-muted hover:text-ink"
                      )}
                    >
                      {col} Cols
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Group>
      </div>
    </div>
  );
}

function BrandsItems({ section }: { section: BrandsSection }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const items = section.items;

  const updateItem = (id: string, patch: Partial<BrandItem>) => {
    const updated = items.map((b) => (b.id === id ? { ...b, ...patch } : b));
    useEditor.getState().patchSelected({ items: updated });
  };

  const deleteItem = (id: string) => {
    const updated = items.filter((b) => b.id !== id);
    useEditor.getState().patchSelected({ items: updated });
  };

  const addItem = () => {
    const newBrand: BrandItem = {
      id: `b-${Date.now()}`,
      name: "NEW BRAND",
      tagline: "Global Collection",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      buttonText: "Shop Brand",
    };
    useEditor.getState().patchSelected({ items: [...items, newBrand] });
    setEditingId(newBrand.id);
  };

  const activeItem = items.find((b) => b.id === editingId);

  if (activeItem) {
    return (
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setEditingId(null)}
          className="text-xs font-semibold text-accent hover:underline text-left"
        >
          ← Back to brand list
        </button>

        <Field label="Brand Name">
          <TextInput
            value={activeItem.name}
            onChange={(e) => updateItem(activeItem.id, { name: e.target.value })}
          />
        </Field>

        <Field label="Tagline / Subtext">
          <TextInput
            value={activeItem.tagline || ""}
            placeholder="e.g. Performance & Speed"
            onChange={(e) => updateItem(activeItem.id, { tagline: e.target.value })}
          />
        </Field>

        <Field label="Lifestyle Image URL (for Editorial Cards)">
          <TextInput
            value={activeItem.image || ""}
            placeholder="https://..."
            onChange={(e) => updateItem(activeItem.id, { image: e.target.value })}
          />
        </Field>

        <Field label="Action Button Label">
          <TextInput
            value={activeItem.buttonText || ""}
            placeholder="e.g. Shop Collection"
            onChange={(e) => updateItem(activeItem.id, { buttonText: e.target.value })}
          />
        </Field>

        <PrimaryButton onClick={() => setEditingId(null)}>Done Editing</PrimaryButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">{items.length} Brands in Section</span>
        <button
          type="button"
          onClick={addItem}
          className="tap-smooth inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-white text-xs font-semibold hover:opacity-90 shadow-2xs"
        >
          <Plus className="size-3.5" />
          <span>Add Brand</span>
        </button>
      </div>

      <div className="flex flex-col gap-2 max-h-[50dvh] overflow-y-auto no-scrollbar">
        {items.map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-line-soft bg-surface shadow-2xs"
          >
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-black text-ink truncate">{b.name}</h4>
              {b.tagline && <p className="text-[11px] text-muted truncate">{b.tagline}</p>}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setEditingId(b.id)}
                className="tap-smooth px-2.5 py-1 text-xs font-semibold text-accent hover:bg-accent/10 rounded-lg"
              >
                Edit
              </button>
              <button
                type="button"
                aria-label={`Delete ${b.name}`}
                onClick={() => deleteItem(b.id)}
                className="tap-smooth p-1.5 text-muted hover:text-red-500 rounded-lg hover:bg-red-500/10"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BannerTemplate({ current }: { current?: "split" | "card" | "full" }) {
  const active = current ?? "split";
  return (
    <div className="flex flex-col gap-3">
      <TemplateCard
        active={active === "split"}
        onClick={() => useEditor.getState().patchSelected({ template: "split" })}
      >
        <div className="grid grid-cols-2 gap-2.5 rounded-xl border border-line-soft bg-fill/40 p-2.5">
          <div className="h-14 rounded-lg bg-slate-300" />
          <div className="flex flex-col justify-center space-y-1.5">
            <div className="h-2 w-10 rounded-full bg-emerald-500" />
            <div className="h-2.5 w-16 rounded-full bg-slate-800" />
            <div className="h-4 w-14 rounded-full bg-emerald-500" />
          </div>
        </div>
      </TemplateCard>
      <TemplateCard
        active={active === "card"}
        onClick={() => useEditor.getState().patchSelected({ template: "card" })}
      >
        <div className="rounded-xl border border-line-soft bg-slate-900 p-3 text-white">
          <div className="h-2 w-10 rounded-full bg-emerald-400" />
          <div className="mt-1.5 h-2.5 w-24 rounded-full bg-white" />
          <div className="mt-2 h-4 w-16 rounded-full bg-emerald-500" />
        </div>
      </TemplateCard>
      <TemplateCard
        active={active === "full"}
        onClick={() => useEditor.getState().patchSelected({ template: "full" })}
      >
        <div className="h-16 rounded-xl bg-slate-800 p-2.5 flex flex-col justify-end">
          <div className="h-2.5 w-24 rounded-full bg-white" />
          <div className="mt-1.5 h-2 w-16 rounded-full bg-white/70" />
        </div>
      </TemplateCard>
    </div>
  );
}

function AboutTemplate({ current }: { current?: "split" | "story" | "cards" }) {
  const active = current ?? "split";
  return (
    <div className="flex flex-col gap-3">
      <TemplateCard
        active={active === "split"}
        onClick={() => useEditor.getState().patchSelected({ template: "split" })}
      >
        <div className="grid grid-cols-2 gap-2.5 rounded-xl border border-line-soft bg-fill/40 p-2.5">
          <div className="h-16 rounded-lg bg-slate-300" />
          <div className="flex flex-col justify-center space-y-1.5">
            <div className="h-2 w-10 rounded-full bg-slate-400" />
            <div className="h-2.5 w-20 rounded-full bg-slate-800" />
            <div className="h-1.5 w-16 rounded-full bg-slate-400" />
          </div>
        </div>
      </TemplateCard>
      <TemplateCard
        active={active === "story"}
        onClick={() => useEditor.getState().patchSelected({ template: "story" })}
      >
        <div className="rounded-xl border border-line-soft bg-fill/40 p-3 flex flex-col items-center gap-1.5 text-center">
          <div className="h-2 w-12 rounded-full bg-slate-400" />
          <div className="h-2.5 w-32 rounded-full bg-slate-800" />
          <div className="h-1.5 w-24 rounded-full bg-slate-400" />
        </div>
      </TemplateCard>
      <TemplateCard
        active={active === "cards"}
        onClick={() => useEditor.getState().patchSelected({ template: "cards" })}
      >
        <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-line-soft bg-fill/40 p-2.5">
          <div className="rounded-lg bg-surface p-1.5 border border-line-soft space-y-1">
            <div className="size-3 rounded-full bg-emerald-500" />
            <div className="h-1.5 w-8 rounded-full bg-slate-800" />
          </div>
          <div className="rounded-lg bg-surface p-1.5 border border-line-soft space-y-1">
            <div className="size-3 rounded-full bg-emerald-500" />
            <div className="h-1.5 w-8 rounded-full bg-slate-800" />
          </div>
          <div className="rounded-lg bg-surface p-1.5 border border-line-soft space-y-1">
            <div className="size-3 rounded-full bg-emerald-500" />
            <div className="h-1.5 w-8 rounded-full bg-slate-800" />
          </div>
        </div>
      </TemplateCard>
    </div>
  );
}

function FeaturedTemplate({ current }: { current?: "grid" | "carousel" }) {
  const active = current ?? "grid";
  return (
    <div className="flex flex-col gap-3">
      <TemplateCard
        active={active === "grid"}
        onClick={() => useEditor.getState().patchSelected({ template: "grid" })}
      >
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-line-soft bg-fill/30 p-2.5">
          <div className="flex flex-col gap-1 rounded-lg border border-line-soft bg-surface p-1.5">
            <div className="aspect-square w-full rounded-md bg-slate-200" />
            <div className="h-2 w-10 rounded-full bg-slate-800" />
          </div>
          <div className="flex flex-col gap-1 rounded-lg border border-line-soft bg-surface p-1.5">
            <div className="aspect-square w-full rounded-md bg-slate-200" />
            <div className="h-2 w-10 rounded-full bg-slate-800" />
          </div>
        </div>
      </TemplateCard>
      <TemplateCard
        active={active === "carousel"}
        onClick={() => useEditor.getState().patchSelected({ template: "carousel" })}
      >
        <div className="flex gap-2 rounded-xl border border-line-soft bg-fill/30 p-2.5 overflow-hidden">
          <div className="w-16 shrink-0 flex flex-col gap-1 rounded-lg border border-line-soft bg-surface p-1.5">
            <div className="aspect-square w-full rounded-md bg-slate-200" />
            <div className="h-2 w-10 rounded-full bg-slate-800" />
          </div>
          <div className="w-16 shrink-0 flex flex-col gap-1 rounded-lg border border-line-soft bg-surface p-1.5">
            <div className="aspect-square w-full rounded-md bg-slate-200" />
            <div className="h-2 w-10 rounded-full bg-slate-800" />
          </div>
          <div className="w-16 shrink-0 flex flex-col gap-1 rounded-lg border border-line-soft bg-surface p-1.5">
            <div className="aspect-square w-full rounded-md bg-slate-200" />
            <div className="h-2 w-10 rounded-full bg-slate-800" />
          </div>
        </div>
      </TemplateCard>
    </div>
  );
}
