import { useState, type ReactNode } from "react";
import {
  Check,
  ChevronDown,
  Compass,
  Image,
  Layers,
  Menu,
  Plus,
  Search,
  Shield,
  ShoppingBag,
  Sliders,
  Trash2,
  Type,
  X,
} from "lucide-react";
import { HERO_PHOTOS, PAGE_COLORS, TEXT_COLORS, isDark } from "@/lib/editor/defaults";
import { selectedSection, useEditor } from "@/lib/editor/store";
import { cn } from "@/lib/cn";
import type {
  HeroAnimation,
  HeroPadding,
  HeroRatio,
  HeroSection,
  HeroWidth,
  IntroSection,
  NavbarLink,
  NavbarSection,
  NavbarTemplate,
  PageId,
  ProductImageRatio,
  ProductSection,
  ProductTypography,
  SheetKind,
} from "@/lib/editor/types";
import { Field, Group, PrimaryButton, TextArea, TextInput } from "@/components/editor/ui";

const TITLES: Record<SheetKind, { title: string; subtitle: string }> = {
  themes: { title: "Template", subtitle: "" },
  add: { title: "Add section", subtitle: "Place it above the footer." },
  "page-color": { title: "Background", subtitle: "The canvas behind every section." },
  "navbar-style": { title: "Template", subtitle: "" },
  "navbar-name": { title: "Name", subtitle: "Used in the bar and the footer." },
  "navbar-color": { title: "Colors", subtitle: "Background, text & icon colors." },
  "navbar-sticky": { title: "Sticky header", subtitle: "Pin header to top while scrolling." },
  "navbar-elements": { title: "Elements", subtitle: "Toggle brand, menu, search & icons." },
  "navbar-layout": { title: "Layout", subtitle: "Full-width or floating pill, height & radius." },
  "navbar-effects": { title: "Effects", subtitle: "Border styles, shadows & frosted blur." },
  "navbar-typography": { title: "Typography", subtitle: "Font size, weight, spacing & casing." },
  "navbar-links": { title: "Links", subtitle: "Manage store navigation menu items." },
  "navbar-more": { title: "Edit More", subtitle: "Layout, borders, typography & behavior." },
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
  "product-template": { title: "Product Layout", subtitle: "Stacked, split or editorial grid." },
  "product-gallery": { title: "Gallery & Ratio", subtitle: "Aspect ratio, radius & thumbnails." },
  "product-elements": { title: "Elements", subtitle: "Toggle badges, ratings, colors & sizes." },
  "product-cta": { title: "WhatsApp CTA", subtitle: "Phone number, button text & styling." },
  "product-color": { title: "Product Colors", subtitle: "Background & price styling." },
  "product-typography": { title: "Typography", subtitle: "Title sizing & font weights." },
  "product-text": { title: "Product", subtitle: "" },
  "footer-style": { title: "Template", subtitle: "" },
  "block-template": { title: "Template", subtitle: "" },
  "block-text": { title: "Section", subtitle: "Edit the words." },
  "section-color": { title: "Color", subtitle: "Background of this section." },
  "product-card-style": { title: "Card Style", subtitle: "Image aspect ratio, corner curve & typography." },
  "product-card-badges": { title: "Card Elements", subtitle: "Toggle badges, ratings, prices & WhatsApp button." },
  "product-card-color": { title: "Card Colors", subtitle: "Price color and WhatsApp button styling." },
  "product-card-cta": { title: "WhatsApp Direct Buy", subtitle: "Phone number and direct WhatsApp ordering." },
  "categories-template": { title: "Template", subtitle: "" },
  "brands-template": { title: "Template", subtitle: "" },
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
    case "navbar-style":
      return section?.type === "navbar" ? <NavbarStyles sec={section} /> : null;
    case "navbar-name":
      return section?.type === "navbar" ? <NameForm logo={section.logo} text={section.text} /> : null;
    case "navbar-color":
      return section?.type === "navbar" ? <NavbarColor sec={section} /> : null;
    case "navbar-sticky":
      return section?.type === "navbar" ? <NavbarSticky current={section.sticky ?? true} /> : null;
    case "navbar-elements":
      return section?.type === "navbar" ? <NavbarElements sec={section} /> : null;
    case "navbar-layout":
      return section?.type === "navbar" ? <NavbarLayout sec={section} /> : null;
    case "navbar-effects":
      return section?.type === "navbar" ? <NavbarEffects sec={section} /> : null;
    case "navbar-typography":
      return section?.type === "navbar" ? <NavbarTypography sec={section} /> : null;
    case "navbar-links":
      return section?.type === "navbar" ? <NavbarLinks sec={section} /> : null;
    case "navbar-more":
      return section?.type === "navbar" ? <NavbarMore sec={section} /> : null;
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
    case "product-gallery":
      return section?.type === "product" ? <ProductGallerySheet sec={section} /> : null;
    case "product-elements":
      return section?.type === "product" ? <ProductElementsSheet sec={section} /> : null;
    case "product-cta":
      return section?.type === "product" ? <ProductCtaSheet sec={section} /> : null;
    case "product-color":
      return section?.type === "product" ? <ProductColorSheet sec={section} /> : null;
    case "product-typography":
      return section?.type === "product" ? <ProductTypographySheet sec={section} /> : null;
    case "product-card-style":
      return <ProductCardStyle />;
    case "product-card-badges":
      return <ProductCardBadges />;
    case "product-card-color":
      return <ProductCardColor />;
    case "product-card-cta":
      return <ProductCardCta />;
    case "categories-template":
      return section?.type === "categories" ? <CategoriesTemplate current={section.template} /> : null;
    case "brands-template":
      return section?.type === "brands" ? <BrandsTemplate current={section.template} /> : null;
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
  const pageId = useEditor((s) => s.pageId);

  type AddItem = {
    kind: "hero" | "featured" | "categories" | "brands" | "banner" | "about" | "reviews" | "newsletter" | "catalog" | "product";
    title: string;
    desc: string;
    badge?: string;
  };

  const homeItems: AddItem[] = [
    { kind: "hero", title: "Hero Banner", desc: "High-impact visual banner with photo & headline." },
    { kind: "categories", title: "Categories", desc: "Visual navigation tiles for product categories." },
    { kind: "featured", title: "Featured Products", desc: "Curated drops with direct WhatsApp checkout.", badge: "POPULAR" },
    { kind: "banner", title: "Promo Banner", desc: "Promotional sale callout with WhatsApp action." },
    { kind: "brands", title: "Brands", desc: "Authorized partner brands and logos." },
    { kind: "about", title: "About Us", desc: "Brand philosophy and authentic trust guarantees." },
    { kind: "reviews", title: "Customer Reviews", desc: "Three quotes of social proof from happy buyers." },
    { kind: "newsletter", title: "Newsletter", desc: "Email capture box for new drops." },
  ];

  const shopItems: AddItem[] = [
    { kind: "catalog", title: "Catalog Grid", desc: "Full product catalog with category filter & search.", badge: "CORE" },
    { kind: "banner", title: "Promo Banner", desc: "Seasonal sale or discount offer callout." },
    { kind: "reviews", title: "Customer Reviews", desc: "Store ratings and buyer testimonials." },
    { kind: "newsletter", title: "Newsletter", desc: "Email capture box for new drops and VIP deals." },
  ];

  const productItems: AddItem[] = [
    { kind: "product", title: "Product Details", desc: "Main product view with gallery & WhatsApp checkout.", badge: "CORE" },
    { kind: "reviews", title: "Customer Reviews", desc: "Verified buyer ratings and reviews for this product.", badge: "POPULAR" },
    { kind: "featured", title: "Related Products", desc: "You May Also Like - curated recommendations." },
    { kind: "about", title: "Trust & Guarantees", desc: "100% authentic, fast delivery & warranty guarantees." },
    { kind: "banner", title: "Promo Banner", desc: "Limited-time bundle deal or product offer banner." },
    { kind: "newsletter", title: "Newsletter", desc: "Email capture box for restocks and new drops." },
  ];

  const items = pageId === "home" ? homeItems : pageId === "shop" ? shopItems : productItems;
  const pageLabel = pageId === "home" ? "Home Page" : pageId === "shop" ? "Shop Page" : "Product Page";

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between pb-1 px-1">
        <span className="text-xs font-semibold text-muted uppercase tracking-wider">
          Sections for {pageLabel}
        </span>
        <span className="text-[11px] font-medium text-accent">
          {items.length} available
        </span>
      </div>
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

const NAV_STYLES: NavbarTemplate[] = ["centered", "left", "minimal", "float", "expanded"];

function NavbarStyles({ sec }: { sec: NavbarSection }) {
  const current = sec.template;
  const count = useEditor((s) => s.cart.reduce((sum, item) => sum + item.qty, 0));
  const logo = sec.logo || "STORE";
  const iconColor = sec.iconColor || sec.text;

  const renderPreview = (id: NavbarTemplate) => {
    if (id === "minimal") {
      return (
        <div
          className="flex items-center justify-between rounded-xl border border-line-soft/80 px-3 py-2.5 text-xs shadow-2xs"
          style={{ background: sec.background, color: sec.text }}
        >
          <div className="font-bold tracking-widest text-[11px] uppercase truncate pr-2">
            {logo}
          </div>
          <div className="flex items-center gap-1 shrink-0" style={{ color: iconColor }}>
            <ShoppingBag className="size-3.5" strokeWidth={1.75} />
            <span className="text-[10px] font-semibold">{count}</span>
          </div>
        </div>
      );
    }

    if (id === "float") {
      return (
        <div className="rounded-xl border border-line-soft/50 bg-fill/40 p-1.5">
          <div
            className="relative flex items-center justify-between rounded-full border border-line-soft px-3 py-1.5 text-xs shadow-xs"
            style={{ background: sec.background, color: sec.text }}
          >
            <Menu className="size-3.5 shrink-0 opacity-80" strokeWidth={1.75} style={{ color: iconColor }} />
            <div className="font-bold tracking-widest text-[11px] uppercase truncate px-2">
              {logo}
            </div>
            <div className="flex items-center gap-1.5 shrink-0" style={{ color: iconColor }}>
              <Search className="size-3.5" strokeWidth={1.75} />
              <div className="flex items-center gap-0.5">
                <ShoppingBag className="size-3.5" strokeWidth={1.75} />
                <span className="text-[10px] font-semibold">{count}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (id === "left") {
      return (
        <div
          className="flex items-center justify-between rounded-xl border border-line-soft/80 px-3 py-2 text-xs shadow-2xs"
          style={{ background: sec.background, color: sec.text }}
        >
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <Menu className="size-3.5 shrink-0 opacity-80" strokeWidth={1.75} style={{ color: iconColor }} />
            <div className="font-bold tracking-widest text-[11px] uppercase truncate">
              {logo}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0" style={{ color: iconColor }}>
            <Search className="size-3.5" strokeWidth={1.75} />
            <div className="flex items-center gap-0.5">
              <ShoppingBag className="size-3.5" strokeWidth={1.75} />
              <span className="text-[10px] font-semibold">{count}</span>
            </div>
          </div>
        </div>
      );
    }

    if (id === "expanded") {
      return (
        <div
          className="flex items-center justify-between gap-2 rounded-xl border border-line-soft/80 px-3 py-2 text-xs shadow-2xs"
          style={{ background: sec.background, color: sec.text }}
        >
          <div className="font-bold tracking-widest text-[11px] uppercase truncate shrink-0">
            {logo}
          </div>
          <div className="flex-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200/50 dark:bg-white/10 text-[9px] text-muted truncate border border-line-soft/40">
            <Search className="size-2.5 shrink-0" strokeWidth={1.75} style={{ color: iconColor }} />
            <span className="truncate">Search...</span>
          </div>
          <div className="flex items-center gap-1 shrink-0" style={{ color: iconColor }}>
            <ShoppingBag className="size-3.5" strokeWidth={1.75} />
            <span className="text-[10px] font-semibold">{count}</span>
          </div>
        </div>
      );
    }

    // Centered
    return (
      <div
        className="relative flex items-center justify-between rounded-xl border border-line-soft/80 px-3 py-2 text-xs shadow-2xs"
        style={{ background: sec.background, color: sec.text }}
      >
        <Menu className="size-3.5 shrink-0 opacity-80" strokeWidth={1.75} style={{ color: iconColor }} />
        <div className="font-bold tracking-widest text-[11px] uppercase truncate px-2">
          {logo}
        </div>
        <div className="flex items-center gap-1.5 shrink-0" style={{ color: iconColor }}>
          <Search className="size-3.5" strokeWidth={1.75} />
          <div className="flex items-center gap-0.5">
            <ShoppingBag className="size-3.5" strokeWidth={1.75} />
            <span className="text-[10px] font-semibold">{count}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {NAV_STYLES.map((id) => (
        <TemplateCard
          key={id}
          active={current === id}
          onClick={() => useEditor.getState().patchSelected({ template: id })}
        >
          {renderPreview(id)}
        </TemplateCard>
      ))}
    </div>
  );
}

function NameForm({ logo, text }: { logo: string; text: string }) {
  const [value, setValue] = useState(logo);
  return (
    <div className="flex flex-col gap-3">
      <Field label="Brand">
        <TextInput value={value} onChange={(event) => setValue(event.target.value)} />
      </Field>
      <PrimaryButton onClick={() => useEditor.getState().setLogo(value)}>Save name</PrimaryButton>
      <TextSwatches
        onPick={(color) => {
          if (color !== text) useEditor.getState().patchSelected({ text: color });
        }}
      />
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

function ProductTemplate({ current }: { current?: "stacked" | "split" | "grid" }) {
  const active = current ?? "stacked";
  return (
    <div className="flex flex-col gap-3">
      <TemplateCard
        active={active === "stacked"}
        onClick={() => useEditor.getState().patchSelected({ template: "stacked" })}
      >
        <div className="flex items-center gap-3.5 w-full">
          <div className="w-24 shrink-0 flex flex-col gap-1.5 rounded-xl border border-line-soft bg-fill/40 p-2">
            <div className="h-10 w-full rounded-md bg-slate-300 dark:bg-zinc-600" />
            <div className="space-y-1">
              <div className="h-1.5 w-3/4 rounded-full bg-slate-800 dark:bg-zinc-200" />
              <div className="h-1.5 w-1/2 rounded-full bg-slate-400 dark:bg-zinc-400" />
              <div className="h-3 w-full rounded-full bg-emerald-500" />
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-ink">Stacked Classic</div>
            <div className="text-xs text-muted">Full-width photo gallery on top with details & CTA below. Best for mobile conversions.</div>
          </div>
        </div>
      </TemplateCard>

      <TemplateCard
        active={active === "split"}
        onClick={() => useEditor.getState().patchSelected({ template: "split" })}
      >
        <div className="flex items-center gap-3.5 w-full">
          <div className="w-24 shrink-0 grid grid-cols-2 gap-1 rounded-xl border border-line-soft bg-fill/40 p-1.5">
            <div className="aspect-square w-full rounded-md bg-slate-300 dark:bg-zinc-600" />
            <div className="flex flex-col justify-center space-y-1">
              <div className="h-1.5 w-full rounded-full bg-slate-800 dark:bg-zinc-200" />
              <div className="h-1.5 w-3/4 rounded-full bg-slate-400 dark:bg-zinc-400" />
              <div className="h-2.5 w-full rounded-full bg-emerald-500" />
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-ink">Split Balanced</div>
            <div className="text-xs text-muted">50/50 side-by-side gallery and product details. Balanced, desktop and tablet friendly.</div>
          </div>
        </div>
      </TemplateCard>

      <TemplateCard
        active={active === "grid"}
        onClick={() => useEditor.getState().patchSelected({ template: "grid" })}
      >
        <div className="flex items-center gap-3.5 w-full">
          <div className="w-24 shrink-0 grid grid-cols-2 gap-1 rounded-xl border border-line-soft bg-fill/40 p-1.5">
            <div className="aspect-square w-full rounded-md bg-slate-300 dark:bg-zinc-600" />
            <div className="aspect-square w-full rounded-md bg-slate-200 dark:bg-zinc-700" />
            <div className="aspect-square w-full rounded-md bg-slate-200 dark:bg-zinc-700" />
            <div className="aspect-square w-full rounded-md bg-slate-300 dark:bg-zinc-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-ink">Editorial Multi-Photo</div>
            <div className="text-xs text-muted">Multi-photo gallery with a sticky purchase column. Premium boutique catalog look.</div>
          </div>
        </div>
      </TemplateCard>
    </div>
  );
}

function ProductGallerySheet({ sec }: { sec: ProductSection }) {
  const currentRatio = sec.imageRatio ?? "1:1";
  const currentRadius = sec.borderRadius ?? 24;
  const currentStyle = sec.galleryStyle ?? "strip";

  const ratios: { label: string; ratio: ProductImageRatio; icon: string; desc: string }[] = [
    { label: "1:1 Square", ratio: "1:1", icon: "aspect-square", desc: "Balanced standard" },
    { label: "3:4 Portrait", ratio: "3:4", icon: "aspect-[3/4]", desc: "Fashion & clothing" },
    { label: "16:9 Wide", ratio: "16:9", icon: "aspect-video", desc: "Cinematic wide" },
  ];

  const presets = [
    { label: "Sharp", value: 0 },
    { label: "Subtle", value: 8 },
    { label: "Rounded", value: 16 },
    { label: "Curved", value: 24 },
    { label: "Extra", value: 32 },
  ];

  const galleryStyles: { id: "strip" | "dots" | "grid"; label: string; desc: string }[] = [
    { id: "strip", label: "Horizontal Strip", desc: "Scrollable thumbnail strip under photo" },
    { id: "dots", label: "Pagination Dots", desc: "Minimalist dot indicator" },
    { id: "grid", label: "Thumbnail Grid", desc: "4-column compact photo grid" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Aspect Ratio */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">
          Aspect Ratio
        </label>
        <div className="grid grid-cols-3 gap-2">
          {ratios.map((item) => (
            <button
              key={item.ratio}
              type="button"
              onClick={() => useEditor.getState().patchSelected({ imageRatio: item.ratio })}
              className={cn(
                "tap-smooth flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center",
                currentRatio === item.ratio
                  ? "border-[#53389E] bg-[#EEF2FF]/60 text-ink ring-2 ring-[#53389E]/25 shadow-xs"
                  : "border-line-soft bg-surface text-ink hover:bg-fill"
              )}
            >
              <div className={cn("w-8 rounded border border-line mb-2 bg-fill/80", item.icon)} />
              <span className="text-xs font-semibold">{item.label}</span>
              <span className="text-[10px] text-muted">{item.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Corner Curve / Radius */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line-soft bg-surface p-4 shadow-2xs">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            Corner Curve
          </span>
          <span className="text-xs font-bold text-accent font-mono bg-accent/10 px-2.5 py-1 rounded-lg">
            {currentRadius}px
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={32}
          step={2}
          value={currentRadius}
          onChange={(e) =>
            useEditor.getState().patchSelected({ borderRadius: Number(e.target.value) })
          }
          className="w-full accent-accent cursor-pointer"
        />
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {presets.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => useEditor.getState().patchSelected({ borderRadius: p.value })}
              className={cn(
                "tap-smooth py-1 px-1 rounded-xl text-center text-xs font-medium border transition-all",
                currentRadius === p.value
                  ? "border-accent bg-accent/10 text-accent font-semibold"
                  : "border-line-soft bg-fill/40 text-muted hover:text-ink"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Thumbnail Navigation Style */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">
          Thumbnail Style
        </label>
        <div className="divide-y divide-line-soft overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-2xs">
          {galleryStyles.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => useEditor.getState().patchSelected({ galleryStyle: item.id })}
              className={cn(
                "tap-smooth flex w-full items-center justify-between p-3.5 text-left transition-all",
                currentStyle === item.id
                  ? "bg-accent/10 text-accent font-semibold"
                  : "text-ink hover:bg-fill"
              )}
            >
              <div>
                <div className="text-sm font-semibold">{item.label}</div>
                <div className="text-xs text-muted">{item.desc}</div>
              </div>
              {currentStyle === item.id && <Check className="size-4 text-accent" strokeWidth={2.5} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductElementsSheet({ sec }: { sec: ProductSection }) {
  const [badgeVal, setBadgeVal] = useState(sec.badgeText || "POPULAR");

  const toggles = [
    {
      key: "showBadge",
      label: "Highlight Badge",
      detail: "Badge label on top corner of product photo",
      enabled: sec.showBadge !== false,
    },
    {
      key: "showRating",
      label: "Star Rating & Reviews",
      detail: "Product star rating score (e.g. ★ 4.9)",
      enabled: sec.showRating !== false,
    },
    {
      key: "showDescription",
      label: "Product Description",
      detail: "Product summary paragraph and details",
      enabled: sec.showDescription !== false,
    },
    {
      key: "showColors",
      label: "Color Swatches Selector",
      detail: "Color variant swatches selector",
      enabled: sec.showColors !== false,
    },
    {
      key: "showSizes",
      label: "Size Selector Pills",
      detail: "Size option selector buttons (S, M, L, XL)",
      enabled: sec.showSizes !== false,
    },
    {
      key: "showTrustBadges",
      label: "Trust & Delivery Guarantees",
      detail: "Instant confirmation & delivery guarantee badges",
      enabled: sec.showTrustBadges !== false,
    },
  ] as const;

  return (
    <div className="flex flex-col gap-4">
      {/* Badge Text Input */}
      {sec.showBadge !== false && (
        <div className="flex flex-col gap-2 rounded-2xl border border-line-soft bg-surface p-3.5 shadow-2xs">
          <label className="text-xs font-semibold text-muted uppercase tracking-wider">
            Badge Text
          </label>
          <input
            type="text"
            value={badgeVal}
            onChange={(e) => {
              setBadgeVal(e.target.value);
              useEditor.getState().patchSelected({ badgeText: e.target.value });
            }}
            placeholder="e.g. POPULAR, NEW, BESTSELLER, 20% OFF"
            className="rounded-xl border border-line-soft bg-fill/50 px-3 py-2 text-sm font-medium text-ink focus:border-accent focus:bg-surface focus:outline-hidden"
          />
        </div>
      )}

      {/* Elements Visibility Toggles */}
      <div>
        <p className="mb-2 text-xs font-semibold text-muted uppercase tracking-wider">
          Visible Elements
        </p>
        <div className="divide-y divide-line-soft overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-2xs">
          {toggles.map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3.5">
              <div className="pr-3">
                <div className="text-sm font-semibold text-ink">{item.label}</div>
                <div className="text-xs text-muted">{item.detail}</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={item.enabled}
                onClick={() =>
                  useEditor.getState().patchSelected({ [item.key]: !item.enabled })
                }
                className={cn(
                  "tap-smooth relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                  item.enabled ? "bg-accent" : "bg-slate-200 dark:bg-zinc-700"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                    item.enabled ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCtaSheet({ sec }: { sec: ProductSection }) {
  const [phone, setPhone] = useState(sec.whatsappNumber || "919876543210");
  const [btnText, setBtnText] = useState(sec.buttonText || "Buy on WhatsApp");
  const currentColor = sec.buttonColor || "#25D366";
  const sticky = sec.stickyButton ?? false;

  const colorPresets = [
    { name: "WhatsApp Green", value: "#25D366" },
    { name: "Luxe Black", value: "#111827" },
    { name: "Brand Purple", value: "#53389E" },
    { name: "Apple Blue", value: "#0071E3" },
    { name: "Crimson Red", value: "#DC2626" },
    { name: "Warm Amber", value: "#D97706" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* WhatsApp Phone Number */}
      <div className="flex flex-col gap-2 rounded-2xl border border-line-soft bg-surface p-3.5 shadow-2xs">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">
          WhatsApp Phone Number
        </label>
        <input
          type="text"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            useEditor.getState().patchSelected({ whatsappNumber: e.target.value });
          }}
          placeholder="e.g. 919876543210"
          className="rounded-xl border border-line-soft bg-fill/50 px-3 py-2 text-sm font-medium text-ink focus:border-accent focus:bg-surface focus:outline-hidden"
        />
        <p className="text-[11px] text-muted">Include country code without + or spaces (e.g. 919876543210).</p>
      </div>

      {/* Button Label */}
      <div className="flex flex-col gap-2 rounded-2xl border border-line-soft bg-surface p-3.5 shadow-2xs">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">
          Button Label
        </label>
        <input
          type="text"
          value={btnText}
          onChange={(e) => {
            setBtnText(e.target.value);
            useEditor.getState().patchSelected({ buttonText: e.target.value });
          }}
          placeholder="Buy on WhatsApp"
          className="rounded-xl border border-line-soft bg-fill/50 px-3 py-2 text-sm font-medium text-ink focus:border-accent focus:bg-surface focus:outline-hidden"
        />
      </div>

      {/* Button Color */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line-soft bg-surface p-3.5 shadow-2xs">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">
          Button Color
        </label>
        <div className="grid grid-cols-6 gap-2">
          {colorPresets.map((c) => (
            <button
              key={c.value}
              type="button"
              aria-label={c.name}
              onClick={() => useEditor.getState().patchSelected({ buttonColor: c.value })}
              className={cn(
                "tap-smooth size-10 rounded-xl border flex items-center justify-center transition-all",
                currentColor === c.value
                  ? "ring-2 ring-accent scale-105 border-white shadow-xs"
                  : "border-black/10 hover:scale-105"
              )}
              style={{ backgroundColor: c.value }}
            >
              {currentColor === c.value && <Check className="size-4 text-white" strokeWidth={2.5} />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-1">
          <label className="relative flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-line overflow-hidden">
            <input
              type="color"
              value={currentColor.startsWith("#") ? currentColor : "#25D366"}
              onChange={(e) => useEditor.getState().patchSelected({ buttonColor: e.target.value })}
              className="absolute inset-0 size-full opacity-0 cursor-pointer"
            />
            <span className="size-full" style={{ background: currentColor }} />
          </label>
          <span className="text-xs font-mono text-muted uppercase">{currentColor}</span>
        </div>
      </div>

      {/* Sticky Mobile CTA Bar Toggle */}
      <div className="flex items-center justify-between rounded-2xl border border-line-soft bg-surface p-3.5 shadow-2xs">
        <div className="pr-3">
          <div className="text-sm font-semibold text-ink">Sticky Mobile CTA Bar</div>
          <div className="text-xs text-muted">Fixed WhatsApp quick-order bar at bottom of mobile screens while scrolling</div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={sticky}
          onClick={() => useEditor.getState().patchSelected({ stickyButton: !sticky })}
          className={cn(
            "tap-smooth relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
            sticky ? "bg-accent" : "bg-slate-200 dark:bg-zinc-700"
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
              sticky ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
      </div>
    </div>
  );
}

function ProductColorSheet({ sec }: { sec: ProductSection }) {
  const currentBg = sec.background || "transparent";
  const isTransparent = currentBg === "transparent";
  const currentPriceColor = sec.priceColor || "#059669";

  const bgPalettes = [
    { name: "Clean White", value: "#ffffff" },
    { name: "Soft Gray", value: "#f8fafc" },
    { name: "Warm Linen", value: "#fbfbfd" },
    { name: "Dark Ink", value: "#0b0b0d" },
    { name: "Midnight", value: "#0f172a" },
    { name: "Deep Cream", value: "#fdfbf7" },
  ];

  const pricePalettes = [
    { name: "Emerald", value: "#059669" },
    { name: "Pure Ink", value: "#111827" },
    { name: "Indigo", value: "#4f46e5" },
    { name: "Rose", value: "#e11d48" },
    { name: "Amber", value: "#d97706" },
    { name: "Royal Blue", value: "#2563eb" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Background Color */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">
          Section Background
        </label>

        {/* Transparent Toggle */}
        <button
          type="button"
          onClick={() => useEditor.getState().patchSelected({ background: "transparent" })}
          className={cn(
            "tap-smooth flex items-center justify-between p-3 rounded-2xl border transition-all",
            isTransparent
              ? "border-accent bg-accent/10 text-accent font-semibold ring-2 ring-accent/20"
              : "border-line-soft bg-surface text-ink hover:bg-fill"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="size-7 rounded-full border border-dashed border-slate-400 bg-linear-to-tr from-slate-200 to-transparent flex items-center justify-center">
              <span className="text-[10px] font-bold text-muted">∅</span>
            </div>
            <div className="text-sm font-semibold">Transparent (Default Store Canvas)</div>
          </div>
          {isTransparent && <Check className="size-4 text-accent" strokeWidth={2.5} />}
        </button>

        {/* Preset Palette */}
        <div className="grid grid-cols-6 gap-2">
          {bgPalettes.map((c) => (
            <button
              key={c.value}
              type="button"
              aria-label={c.name}
              onClick={() => useEditor.getState().patchSelected({ background: c.value })}
              className={cn(
                "tap-smooth size-10 rounded-xl border flex items-center justify-center transition-all",
                currentBg === c.value
                  ? "ring-2 ring-accent scale-105 border-slate-900 shadow-xs"
                  : "border-black/10 hover:scale-105"
              )}
              style={{ backgroundColor: c.value }}
            >
              {currentBg === c.value && (
                <Check
                  className={cn("size-4", isDark(c.value) ? "text-white" : "text-slate-900")}
                  strokeWidth={2.5}
                />
              )}
            </button>
          ))}
        </div>

        {/* Custom Color Input */}
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-line-soft bg-surface shadow-2xs">
          <label className="relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-line overflow-hidden">
            <input
              type="color"
              value={currentBg.startsWith("#") ? currentBg : "#ffffff"}
              onChange={(e) => useEditor.getState().patchSelected({ background: e.target.value })}
              className="absolute inset-0 size-full opacity-0 cursor-pointer"
            />
            <span className="size-full" style={{ background: isTransparent ? "transparent" : currentBg }} />
          </label>
          <div className="flex-1">
            <span className="text-xs font-semibold text-ink">Custom Background Color</span>
            <div className="text-[11px] text-muted font-mono">{isTransparent ? "transparent" : currentBg}</div>
          </div>
        </div>
      </div>

      {/* Price Color */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">
          Price Text Color
        </label>
        <div className="grid grid-cols-6 gap-2">
          {pricePalettes.map((c) => (
            <button
              key={c.value}
              type="button"
              aria-label={c.name}
              onClick={() => useEditor.getState().patchSelected({ priceColor: c.value })}
              className={cn(
                "tap-smooth size-10 rounded-xl border flex items-center justify-center transition-all",
                currentPriceColor === c.value
                  ? "ring-2 ring-accent scale-105 border-slate-900 shadow-xs"
                  : "border-black/10 hover:scale-105"
              )}
              style={{ backgroundColor: c.value }}
            >
              {currentPriceColor === c.value && (
                <Check className="size-4 text-white" strokeWidth={2.5} />
              )}
            </button>
          ))}
        </div>

        {/* Custom Price Color Input */}
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-line-soft bg-surface shadow-2xs">
          <label className="relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-line overflow-hidden">
            <input
              type="color"
              value={currentPriceColor.startsWith("#") ? currentPriceColor : "#059669"}
              onChange={(e) => useEditor.getState().patchSelected({ priceColor: e.target.value })}
              className="absolute inset-0 size-full opacity-0 cursor-pointer"
            />
            <span className="size-full" style={{ background: currentPriceColor }} />
          </label>
          <div className="flex-1">
            <span className="text-xs font-semibold text-ink">Custom Price Color</span>
            <div className="text-[11px] text-muted font-mono">{currentPriceColor}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductTypographySheet({ sec }: { sec: ProductSection }) {
  const currentSize =
    sec.titleFontSize ?? (sec.typography === "sm" ? "sm" : sec.typography === "lg" ? "xl" : "base");
  const currentWeight = sec.titleFontWeight ?? "semibold";

  const sizes: { id: "sm" | "base" | "lg" | "xl"; label: string; desc: string }[] = [
    { id: "sm", label: "Compact", desc: "20px - 24px tight title" },
    { id: "base", label: "Regular", desc: "24px - 28px standard title" },
    { id: "lg", label: "Large", desc: "28px - 34px prominent title" },
    { id: "xl", label: "Display", desc: "32px - 44px bold hero title" },
  ];

  const weights: { id: "normal" | "medium" | "semibold" | "bold"; label: string; desc: string }[] = [
    { id: "normal", label: "Regular", desc: "400 normal weight" },
    { id: "medium", label: "Medium", desc: "500 balanced weight" },
    { id: "semibold", label: "Semi-Bold", desc: "600 refined emphasis" },
    { id: "bold", label: "Bold", desc: "700 high impact" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Title Font Size */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">
          Product Title Size
        </label>
        <div className="grid grid-cols-2 gap-2">
          {sizes.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() =>
                useEditor.getState().patchSelected({ titleFontSize: s.id })
              }
              className={cn(
                "tap-smooth flex flex-col p-3 rounded-2xl border text-left transition-all",
                currentSize === s.id
                  ? "border-accent bg-accent/10 text-accent font-semibold ring-2 ring-accent/20"
                  : "border-line-soft bg-surface text-ink hover:bg-fill"
              )}
            >
              <span className="text-sm font-semibold">{s.label}</span>
              <span className="text-xs text-muted mt-0.5">{s.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Title Font Weight */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">
          Title Font Weight
        </label>
        <div className="grid grid-cols-2 gap-2">
          {weights.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() =>
                useEditor.getState().patchSelected({ titleFontWeight: w.id })
              }
              className={cn(
                "tap-smooth flex flex-col p-3 rounded-2xl border text-left transition-all",
                currentWeight === w.id
                  ? "border-accent bg-accent/10 text-accent font-semibold ring-2 ring-accent/20"
                  : "border-line-soft bg-surface text-ink hover:bg-fill"
              )}
            >
              <span className="text-sm font-semibold">{w.label}</span>
              <span className="text-xs text-muted mt-0.5">{w.desc}</span>
            </button>
          ))}
        </div>
      </div>
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
  const borderRadius = (section && "borderRadius" in section && section.borderRadius !== undefined) ? section.borderRadius : 16;

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

  const radiusPresets = [
    { label: "Sharp", value: 0 },
    { label: "Subtle", value: 8 },
    { label: "Rounded", value: 16 },
    { label: "Curved", value: 24 },
    { label: "Extra", value: 32 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Corner Curve */}
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-xs font-semibold tracking-wider text-muted uppercase">Corner Radius</p>
          <span className="text-xs font-semibold tabular-nums text-slate-700">{borderRadius}px</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5 mb-3">
          {radiusPresets.map((preset) => {
            const active = borderRadius === preset.value;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => useEditor.getState().patchSelected({ borderRadius: preset.value })}
                className={cn(
                  "tap-smooth flex flex-col items-center gap-1 rounded-xl border p-2 text-center transition-all",
                  active
                    ? "border-[#53389E] bg-[#EEF2FF]/60 shadow-xs ring-2 ring-[#53389E]/25"
                    : "border-line-soft bg-surface hover:bg-fill/70"
                )}
              >
                <div
                  className="size-6 border-2 border-slate-400 bg-slate-200/60"
                  style={{ borderRadius: `${preset.value / 2}px` }}
                />
                <span className="text-[10px] font-medium text-ink">{preset.label}</span>
              </button>
            );
          })}
        </div>
        <input
          type="range"
          min="0"
          max="32"
          step="2"
          value={borderRadius}
          onChange={(e) => useEditor.getState().patchSelected({ borderRadius: Number(e.target.value) })}
          className="w-full accent-[#53389E] cursor-pointer"
        />
      </div>

      {/* Image Ratio */}
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

      {/* Typography */}
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
  const showButton = section && "showButton" in section ? section.showButton !== false : true;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2.5 text-xs font-semibold tracking-wider text-muted uppercase">Card Elements Visibility</p>
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

          {/* Quick Buy Button toggle */}
          <div className="flex items-center justify-between p-3.5">
            <div>
              <div className="text-sm font-medium">Quick WhatsApp Button</div>
              <div className="text-xs text-muted">Show direct WhatsApp Buy button on card</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={showButton}
              onClick={() => useEditor.getState().patchSelected({ showButton: !showButton })}
              className={cn(
                "tap-smooth relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                showButton ? "bg-accent" : "bg-slate-200"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out",
                  showButton ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCardColor() {
  const section = useEditor((s) => selectedSection(s));
  const priceColor = (section && "priceColor" in section && section.priceColor) || "#059669";
  const buttonColor = (section && "buttonColor" in section && section.buttonColor) || "#25D366";

  const pricePresets = [
    { label: "Emerald", value: "#059669" },
    { label: "Slate", value: "#0F172A" },
    { label: "Purple", value: "#7C3AED" },
    { label: "Blue", value: "#2563EB" },
    { label: "Red", value: "#DC2626" },
    { label: "Amber", value: "#D97706" },
    { label: "Rose", value: "#E11D48" },
    { label: "Black", value: "#000000" },
  ];

  const buttonPresets = [
    { label: "WhatsApp", value: "#25D366" },
    { label: "Emerald", value: "#059669" },
    { label: "Dark", value: "#111827" },
    { label: "Purple", value: "#53389E" },
    { label: "Royal", value: "#2563EB" },
    { label: "Orange", value: "#F97316" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Price Color */}
      <div>
        <p className="mb-2.5 text-xs font-semibold tracking-wider text-muted uppercase">Price Text Color</p>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {pricePresets.map((p) => {
            const active = priceColor.toLowerCase() === p.value.toLowerCase();
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => useEditor.getState().patchSelected({ priceColor: p.value })}
                className={cn(
                  "tap-smooth flex items-center gap-2 rounded-xl border p-2 text-left transition-all",
                  active
                    ? "border-[#53389E] bg-[#EEF2FF]/60 shadow-xs ring-2 ring-[#53389E]/25"
                    : "border-line-soft bg-surface hover:bg-fill/70"
                )}
              >
                <span className="size-4 shrink-0 rounded-full border border-black/10 shadow-2xs" style={{ backgroundColor: p.value }} />
                <span className="truncate text-xs font-medium text-ink">{p.label}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-line-soft bg-surface p-2 shadow-2xs">
          <input
            type="color"
            value={priceColor}
            onChange={(e) => useEditor.getState().patchSelected({ priceColor: e.target.value })}
            className="size-8 cursor-pointer rounded-lg border-0 bg-transparent p-0"
          />
          <input
            type="text"
            value={priceColor}
            onChange={(e) => useEditor.getState().patchSelected({ priceColor: e.target.value })}
            className="flex-1 bg-transparent text-xs font-mono font-medium text-ink focus:outline-none uppercase"
          />
        </div>
      </div>

      {/* Button Color */}
      <div>
        <p className="mb-2.5 text-xs font-semibold tracking-wider text-muted uppercase">WhatsApp Button Color</p>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {buttonPresets.map((b) => {
            const active = buttonColor.toLowerCase() === b.value.toLowerCase();
            return (
              <button
                key={b.value}
                type="button"
                onClick={() => useEditor.getState().patchSelected({ buttonColor: b.value })}
                className={cn(
                  "tap-smooth flex items-center gap-2 rounded-xl border p-2 text-left transition-all",
                  active
                    ? "border-[#53389E] bg-[#EEF2FF]/60 shadow-xs ring-2 ring-[#53389E]/25"
                    : "border-line-soft bg-surface hover:bg-fill/70"
                )}
              >
                <span className="size-4 shrink-0 rounded-full border border-black/10 shadow-2xs" style={{ backgroundColor: b.value }} />
                <span className="truncate text-xs font-medium text-ink">{b.label}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-line-soft bg-surface p-2 shadow-2xs">
          <input
            type="color"
            value={buttonColor}
            onChange={(e) => useEditor.getState().patchSelected({ buttonColor: e.target.value })}
            className="size-8 cursor-pointer rounded-lg border-0 bg-transparent p-0"
          />
          <input
            type="text"
            value={buttonColor}
            onChange={(e) => useEditor.getState().patchSelected({ buttonColor: e.target.value })}
            className="flex-1 bg-transparent text-xs font-mono font-medium text-ink focus:outline-none uppercase"
          />
        </div>
      </div>
    </div>
  );
}

function ProductCardCta() {
  const section = useEditor((s) => selectedSection(s));
  const rawNumber =
    (section && "whatsappNumber" in section && section.whatsappNumber) || "919876543210";
  const [phone, setPhone] = useState(rawNumber);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2.5 text-xs font-semibold tracking-wider text-muted uppercase">Seller WhatsApp Number</p>
        <div className="rounded-2xl border border-line-soft bg-surface p-4 shadow-2xs">
          <Field label="Phone number with country code (e.g. 919876543210)">
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
              When shoppers tap the WhatsApp button on any product card, an instant order message pre-fills in their WhatsApp with product name, price, and storefront link.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavbarSticky({ current }: { current: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      <TemplateCard
        active={current}
        onClick={() => useEditor.getState().patchSelected({ sticky: true })}
      >
        <div className="flex items-center justify-between rounded-xl border border-line-soft bg-fill/40 p-2.5">
          <div className="text-xs font-semibold text-slate-800">Sticky (Pinned to top)</div>
          <div className="h-1.5 w-12 rounded-full bg-accent" />
        </div>
      </TemplateCard>
      <TemplateCard
        active={!current}
        onClick={() => useEditor.getState().patchSelected({ sticky: false })}
      >
        <div className="flex items-center justify-between rounded-xl border border-line-soft bg-fill/40 p-2.5">
          <div className="text-xs font-semibold text-slate-800">Static (Scrollable)</div>
          <div className="h-1.5 w-12 rounded-full bg-slate-300" />
        </div>
      </TemplateCard>
    </div>
  );
}

function NavbarColor({ sec, text }: { sec?: NavbarSection; text?: string }) {
  const [tab, setTab] = useState<"background" | "text" | "iconColor">("background");
  const currentSec = sec || { background: "#ffffff", text: text || "#1d1d1f", iconColor: text || "#1d1d1f" };

  const currentColor =
    tab === "background"
      ? (currentSec.background || "#ffffff")
      : tab === "text"
      ? (currentSec.text || "#1d1d1f")
      : (currentSec.iconColor || currentSec.text || "#1d1d1f");

  const bgPalettes = [
    { name: "Clean White", value: "#ffffff" },
    { name: "Soft Cream", value: "#fbfbfd" },
    { name: "Warm Linen", value: "#f7f4ed" },
    { name: "Cool Mist", value: "#f1f5f9" },
    { name: "Pure Ink", value: "#0b0b0d" },
    { name: "Midnight", value: "#0f172a" },
    { name: "Deep Navy", value: "#0a192f" },
    { name: "Forest", value: "#064e3b" },
    { name: "Royal Violet", value: "#2e1065" },
    { name: "Wine Rose", value: "#4c0519" },
  ];

  const textPalettes = [
    { name: "Jet Black", value: "#111827" },
    { name: "Slate Dark", value: "#334155" },
    { name: "Muted Gray", value: "#64748b" },
    { name: "Pure White", value: "#ffffff" },
    { name: "Royal Purple", value: "#53389e" },
    { name: "Vibrant Blue", value: "#0071e3" },
    { name: "Emerald Green", value: "#16a34a" },
    { name: "Crimson Red", value: "#dc2626" },
    { name: "Warm Amber", value: "#d97706" },
    { name: "Rose Pink", value: "#e11d48" },
  ];

  const palettes = tab === "background" ? bgPalettes : textPalettes;

  const setColor = (val: string) => {
    useEditor.getState().patchSelected({ [tab]: val });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 3 Tabs: Background, Text, Icons */}
      <div className="flex rounded-2xl bg-fill p-1 border border-line-soft">
        {(["background", "text", "iconColor"] as const).map((t) => {
          const active = tab === t;
          const label = t === "background" ? "Background" : t === "text" ? "Text" : "Icons";
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-150",
                active ? "bg-surface text-ink shadow-xs border border-line/60" : "text-muted hover:text-ink"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Interactive Color Picker & Live Hex Input */}
      <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-line-soft bg-surface shadow-2xs">
        <label className="relative flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-2xl border-2 border-line shadow-xs overflow-hidden transition-transform active:scale-95">
          <input
            type="color"
            value={currentColor.startsWith("#") && currentColor.length === 7 ? currentColor : "#ffffff"}
            onChange={(e) => setColor(e.target.value)}
            className="absolute inset-0 size-full opacity-0 cursor-pointer"
          />
          <span
            className="size-full"
            style={{ background: currentColor }}
          />
        </label>
        <div className="flex-1 min-w-0">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            {tab === "background" ? "Background Color" : tab === "text" ? "Text Color" : "Icon Color"}
          </label>
          <div className="relative mt-1 flex items-center">
            <span className="absolute left-3 text-xs font-mono text-muted">#</span>
            <input
              type="text"
              value={currentColor.replace(/^#/, "")}
              onChange={(e) => {
                const hex = `#${e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 8)}`;
                setColor(hex);
              }}
              placeholder="1d1d1f"
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
            const active = currentColor.toLowerCase() === c.value.toLowerCase();
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
                        c.value === "#ffffff" || c.value === "#fbfbfd" || c.value === "#f7f4ed" || c.value === "#f1f5f9"
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

function NavbarElements({ sec }: { sec: NavbarSection }) {
  const [logoVal, setLogoVal] = useState(sec.logo);

  const toggles = [
    {
      key: "showLogo",
      label: "Brand Logo",
      detail: "Show logo image or monogram mark",
      enabled: sec.showLogo ?? true,
    },
    {
      key: "showBrandName",
      label: "Brand Name Text",
      detail: "Display store name in navbar",
      enabled: sec.showBrandName ?? true,
    },
    {
      key: "showMenu",
      label: "Mobile Menu Button",
      detail: "Display hamburger drawer button on mobile",
      enabled: sec.showMenu ?? true,
    },
    {
      key: "showSearch",
      label: "Search Action",
      detail: "Display search icon or search bar",
      enabled: sec.showSearch ?? true,
    },
    {
      key: "showCart",
      label: "WhatsApp / Bag Icon",
      detail: "Direct order action or cart icon",
      enabled: sec.showCart ?? true,
    },
    {
      key: "showLinks",
      label: "Page Navigation Links",
      detail: "Show Home, Shop & Product links",
      enabled: sec.showLinks ?? true,
    },
  ] as const;

  return (
    <div className="flex flex-col gap-4">
      {/* Brand Name Input */}
      <div className="flex flex-col gap-2 rounded-2xl border border-line-soft bg-surface p-3.5 shadow-2xs">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">
          Brand Name
        </label>
        <input
          type="text"
          value={logoVal}
          onChange={(e) => {
            setLogoVal(e.target.value);
            useEditor.getState().patchSelected({ logo: e.target.value });
          }}
          placeholder="Store Name"
          className="rounded-xl border border-line-soft bg-fill/50 px-3 py-2 text-sm font-medium text-ink focus:border-accent focus:bg-surface focus:outline-hidden"
        />
      </div>

      {/* Elements Visibility Toggles */}
      <div>
        <p className="mb-2 text-xs font-semibold text-muted uppercase tracking-wider">
          Header Elements
        </p>
        <div className="divide-y divide-line-soft overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-2xs">
          {toggles.map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3.5">
              <div className="pr-3">
                <div className="text-sm font-semibold text-ink">{item.label}</div>
                <div className="text-xs text-muted">{item.detail}</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={item.enabled}
                onClick={() =>
                  useEditor.getState().patchSelected({ [item.key]: !item.enabled })
                }
                className={cn(
                  "tap-smooth relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                  item.enabled ? "bg-accent" : "bg-slate-200 dark:bg-zinc-700"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                    item.enabled ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NavbarMore({ sec }: { sec: NavbarSection }) {
  const [openSection, setOpenSection] = useState<string | null>("layout");

  const toggle = (id: string) => {
    setOpenSection((cur) => (cur === id ? null : id));
  };

  const defaultLinks: NavbarLink[] = [
    { id: "1", label: "Home", url: "home" },
    { id: "2", label: "Shop", url: "shop" },
    { id: "3", label: "Product", url: "product" },
  ];

  const currentLinks = sec.links && sec.links.length > 0 ? sec.links : defaultLinks;

  return (
    <div className="flex flex-col gap-3">
      {/* 1. Layout & Shape */}
      <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-2xs">
        <button
          type="button"
          onClick={() => toggle("layout")}
          className="flex w-full items-center justify-between p-3.5 text-left transition-colors hover:bg-fill/60"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-xl bg-fill text-ink">
              <Sliders className="size-4" />
            </div>
            <span className="text-sm font-semibold text-ink">Layout & Shape</span>
          </div>
          <ChevronDown
            className={cn("size-4 text-muted transition-transform duration-200", openSection === "layout" && "rotate-180")}
          />
        </button>
        {openSection === "layout" && (
          <div className="border-t border-line-soft p-3.5 space-y-4">
            {/* Full-width vs Floating Pill */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">Layout Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => useEditor.getState().patchSelected({ isFloating: false })}
                  className={cn(
                    "py-2 text-xs font-semibold rounded-xl border text-center transition-all",
                    !sec.isFloating
                      ? "border-accent bg-accent/10 text-accent font-bold"
                      : "border-line-soft bg-surface text-ink hover:bg-fill"
                  )}
                >
                  Full Width
                </button>
                <button
                  type="button"
                  onClick={() => useEditor.getState().patchSelected({ isFloating: true })}
                  className={cn(
                    "py-2 text-xs font-semibold rounded-xl border text-center transition-all",
                    sec.isFloating
                      ? "border-accent bg-accent/10 text-accent font-bold"
                      : "border-line-soft bg-surface text-ink hover:bg-fill"
                  )}
                >
                  Floating Pill
                </button>
              </div>
            </div>

            {/* Height Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted">Bar Height</span>
                <span className="font-semibold text-ink">{sec.height || 56}px</span>
              </div>
              <input
                type="range"
                min={48}
                max={80}
                step={2}
                value={sec.height || 56}
                onChange={(e) => useEditor.getState().patchSelected({ height: Number(e.target.value) })}
                className="accent-accent w-full cursor-pointer"
              />
            </div>

            {/* Corner Radius Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted">Corner Radius</span>
                <span className="font-semibold text-ink">
                  {sec.borderRadius === 9999 ? "Full Pill" : `${sec.borderRadius ?? (sec.isFloating ? 9999 : 0)}px`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={2}
                  value={sec.borderRadius === 9999 ? 40 : (sec.borderRadius ?? (sec.isFloating ? 40 : 0))}
                  onChange={(e) => useEditor.getState().patchSelected({ borderRadius: Number(e.target.value) })}
                  className="accent-accent flex-1 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => useEditor.getState().patchSelected({ borderRadius: 9999 })}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-fill hover:bg-line-soft text-ink shrink-0"
                >
                  Pill
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Borders & Effects */}
      <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-2xs">
        <button
          type="button"
          onClick={() => toggle("borders")}
          className="flex w-full items-center justify-between p-3.5 text-left transition-colors hover:bg-fill/60"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-xl bg-fill text-ink">
              <Layers className="size-4" />
            </div>
            <span className="text-sm font-semibold text-ink">Borders & Effects</span>
          </div>
          <ChevronDown
            className={cn("size-4 text-muted transition-transform duration-200", openSection === "borders" && "rotate-180")}
          />
        </button>
        {openSection === "borders" && (
          <div className="border-t border-line-soft p-3.5 space-y-4">
            {/* Border Style */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">Border Style</label>
              <div className="grid grid-cols-3 gap-2">
                {(["none", "subtle", "solid"] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => useEditor.getState().patchSelected({ borderStyle: b })}
                    className={cn(
                      "py-1.5 text-xs font-semibold rounded-xl border capitalize transition-all",
                      (sec.borderStyle || "subtle") === b
                        ? "border-accent bg-accent/10 text-accent font-bold"
                        : "border-line-soft bg-surface text-ink hover:bg-fill"
                    )}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Shadow */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">Shadow Effect</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["none", "subtle", "float", "glass"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => useEditor.getState().patchSelected({ shadow: s })}
                    className={cn(
                      "py-1.5 text-xs font-semibold rounded-xl border capitalize transition-all",
                      (sec.shadow || "none") === s
                        ? "border-accent bg-accent/10 text-accent font-bold"
                        : "border-line-soft bg-surface text-ink hover:bg-fill"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Backdrop Blur toggle */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="text-xs font-semibold text-ink">Backdrop Blur</div>
                <div className="text-[11px] text-muted">Frosted glass behind navbar</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={sec.backdropBlur !== false}
                onClick={() => useEditor.getState().patchSelected({ backdropBlur: sec.backdropBlur === false ? true : false })}
                className={cn(
                  "tap-smooth relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
                  sec.backdropBlur !== false ? "bg-accent" : "bg-slate-200 dark:bg-zinc-700"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200",
                    sec.backdropBlur !== false ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Typography */}
      <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-2xs">
        <button
          type="button"
          onClick={() => toggle("typography")}
          className="flex w-full items-center justify-between p-3.5 text-left transition-colors hover:bg-fill/60"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-xl bg-fill text-ink">
              <Type className="size-4" />
            </div>
            <span className="text-sm font-semibold text-ink">Typography</span>
          </div>
          <ChevronDown
            className={cn("size-4 text-muted transition-transform duration-200", openSection === "typography" && "rotate-180")}
          />
        </button>
        {openSection === "typography" && (
          <div className="border-t border-line-soft p-3.5 space-y-4">
            {/* Font size */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">Brand & Link Size</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["sm", "base", "lg", "xl"] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => useEditor.getState().patchSelected({ fontSize: sz })}
                    className={cn(
                      "py-1.5 text-xs font-semibold rounded-xl border uppercase transition-all",
                      (sec.fontSize || "base") === sz
                        ? "border-accent bg-accent/10 text-accent font-bold"
                        : "border-line-soft bg-surface text-ink hover:bg-fill"
                    )}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Font weight */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">Font Weight</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["normal", "medium", "semibold", "bold"] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => useEditor.getState().patchSelected({ fontWeight: w })}
                    className={cn(
                      "py-1.5 text-xs font-semibold rounded-xl border capitalize transition-all",
                      (sec.fontWeight || "semibold") === w
                        ? "border-accent bg-accent/10 text-accent font-bold"
                        : "border-line-soft bg-surface text-ink hover:bg-fill"
                    )}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Letter spacing */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">Letter Spacing</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["tight", "normal", "wide", "widest"] as const).map((ls) => (
                  <button
                    key={ls}
                    type="button"
                    onClick={() => useEditor.getState().patchSelected({ letterSpacing: ls })}
                    className={cn(
                      "py-1.5 text-xs font-semibold rounded-xl border capitalize transition-all",
                      (sec.letterSpacing || "normal") === ls
                        ? "border-accent bg-accent/10 text-accent font-bold"
                        : "border-line-soft bg-surface text-ink hover:bg-fill"
                    )}
                  >
                    {ls}
                  </button>
                ))}
              </div>
            </div>

            {/* Uppercase toggle */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="text-xs font-semibold text-ink">Uppercase Brand & Links</div>
                <div className="text-[11px] text-muted">Display text in ALL CAPS</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={sec.uppercase !== false}
                onClick={() => useEditor.getState().patchSelected({ uppercase: sec.uppercase === false ? true : false })}
                className={cn(
                  "tap-smooth relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
                  sec.uppercase !== false ? "bg-accent" : "bg-slate-200 dark:bg-zinc-700"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200",
                    sec.uppercase !== false ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Menu Customization */}
      <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-2xs">
        <button
          type="button"
          onClick={() => toggle("menu")}
          className="flex w-full items-center justify-between p-3.5 text-left transition-colors hover:bg-fill/60"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-xl bg-fill text-ink">
              <Compass className="size-4" />
            </div>
            <span className="text-sm font-semibold text-ink">Menu Customization</span>
          </div>
          <ChevronDown
            className={cn("size-4 text-muted transition-transform duration-200", openSection === "menu" && "rotate-180")}
          />
        </button>
        {openSection === "menu" && (
          <div className="border-t border-line-soft p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider">Menu Links</label>
              <button
                type="button"
                onClick={() => {
                  const newLink: NavbarLink = {
                    id: Date.now().toString(),
                    label: "New Link",
                    url: "shop",
                  };
                  useEditor.getState().patchSelected({ links: [...currentLinks, newLink] });
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
              >
                <Plus className="size-3.5" />
                <span>Add Link</span>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {currentLinks.map((link, idx) => (
                <div key={link.id} className="flex items-center gap-2 p-2 rounded-xl border border-line-soft bg-fill/40">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => {
                      const updated = [...currentLinks];
                      updated[idx] = { ...link, label: e.target.value };
                      useEditor.getState().patchSelected({ links: updated });
                    }}
                    placeholder="Label"
                    className="flex-1 rounded-lg border border-line-soft bg-surface px-2.5 py-1 text-xs font-medium text-ink focus:border-accent focus:outline-hidden"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => {
                      const updated = [...currentLinks];
                      updated[idx] = { ...link, url: e.target.value };
                      useEditor.getState().patchSelected({ links: updated });
                    }}
                    placeholder="URL / Page"
                    className="w-24 rounded-lg border border-line-soft bg-surface px-2 py-1 text-xs font-mono text-muted focus:border-accent focus:outline-hidden"
                  />
                  <button
                    type="button"
                    aria-label="Remove link"
                    onClick={() => {
                      const updated = currentLinks.filter((_, i) => i !== idx);
                      useEditor.getState().patchSelected({ links: updated });
                    }}
                    className="p-1 text-muted hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. Behavior */}
      <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-2xs">
        <button
          type="button"
          onClick={() => toggle("behavior")}
          className="flex w-full items-center justify-between p-3.5 text-left transition-colors hover:bg-fill/60"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-xl bg-fill text-ink">
              <Shield className="size-4" />
            </div>
            <span className="text-sm font-semibold text-ink">Behavior</span>
          </div>
          <ChevronDown
            className={cn("size-4 text-muted transition-transform duration-200", openSection === "behavior" && "rotate-180")}
          />
        </button>
        {openSection === "behavior" && (
          <div className="border-t border-line-soft p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-ink">Sticky Navigation</div>
                <div className="text-xs text-muted">Keep header pinned to top when scrolling</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={sec.sticky ?? true}
                onClick={() => useEditor.getState().patchSelected({ sticky: !(sec.sticky ?? true) })}
                className={cn(
                  "tap-smooth relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
                  (sec.sticky ?? true) ? "bg-accent" : "bg-slate-200 dark:bg-zinc-700"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200",
                    (sec.sticky ?? true) ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NavbarLayout({ sec }: { sec: NavbarSection }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Full-width vs Floating Pill */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Layout Mode</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => useEditor.getState().patchSelected({ isFloating: false })}
            className={cn(
              "py-2.5 text-xs font-semibold rounded-xl border text-center transition-all",
              !sec.isFloating
                ? "border-accent bg-accent/10 text-accent font-bold ring-2 ring-accent/20"
                : "border-line-soft bg-surface text-ink hover:bg-fill"
            )}
          >
            Full Width
          </button>
          <button
            type="button"
            onClick={() => useEditor.getState().patchSelected({ isFloating: true })}
            className={cn(
              "py-2.5 text-xs font-semibold rounded-xl border text-center transition-all",
              sec.isFloating
                ? "border-accent bg-accent/10 text-accent font-bold ring-2 ring-accent/20"
                : "border-line-soft bg-surface text-ink hover:bg-fill"
            )}
          >
            Floating Pill
          </button>
        </div>
      </div>

      {/* Height Slider */}
      <div className="flex flex-col gap-2 rounded-2xl border border-line-soft bg-surface p-3.5 shadow-2xs">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">Bar Height</span>
          <span className="text-xs font-bold text-accent font-mono bg-accent/10 px-2 py-0.5 rounded-md">
            {sec.height || 56}px
          </span>
        </div>
        <input
          type="range"
          min={48}
          max={80}
          step={2}
          value={sec.height || 56}
          onChange={(e) => useEditor.getState().patchSelected({ height: Number(e.target.value) })}
          className="accent-accent w-full cursor-pointer h-2 bg-slate-200 dark:bg-zinc-700 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-muted font-mono">
          <span>Compact (48px)</span>
          <span>Standard (56px)</span>
          <span>Roomy (80px)</span>
        </div>
      </div>

      {/* Corner Radius Slider */}
      <div className="flex flex-col gap-2 rounded-2xl border border-line-soft bg-surface p-3.5 shadow-2xs">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">Corner Radius</span>
          <span className="text-xs font-bold text-accent font-mono bg-accent/10 px-2 py-0.5 rounded-md">
            {sec.borderRadius === 9999 ? "Full Pill (9999px)" : `${sec.borderRadius ?? (sec.isFloating ? 9999 : 0)}px`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={40}
            step={2}
            value={sec.borderRadius === 9999 ? 40 : (sec.borderRadius ?? (sec.isFloating ? 40 : 0))}
            onChange={(e) => useEditor.getState().patchSelected({ borderRadius: Number(e.target.value) })}
            className="accent-accent flex-1 cursor-pointer h-2 bg-slate-200 dark:bg-zinc-700 rounded-lg"
          />
          <button
            type="button"
            onClick={() => useEditor.getState().patchSelected({ borderRadius: 9999 })}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-xl border shrink-0 transition-all",
              sec.borderRadius === 9999
                ? "border-accent bg-accent text-white"
                : "border-line-soft bg-fill hover:bg-line-soft text-ink"
            )}
          >
            Pill
          </button>
        </div>
      </div>
    </div>
  );
}

function NavbarEffects({ sec }: { sec: NavbarSection }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Border Style */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Border Style</label>
        <div className="grid grid-cols-3 gap-2">
          {(["none", "subtle", "solid"] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => useEditor.getState().patchSelected({ borderStyle: b })}
              className={cn(
                "py-2 text-xs font-semibold rounded-xl border capitalize transition-all",
                (sec.borderStyle || "subtle") === b
                  ? "border-accent bg-accent/10 text-accent font-bold ring-2 ring-accent/20"
                  : "border-line-soft bg-surface text-ink hover:bg-fill"
              )}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Shadow Effect */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Shadow Effect</label>
        <div className="grid grid-cols-4 gap-1.5">
          {(["none", "subtle", "float", "glass"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => useEditor.getState().patchSelected({ shadow: s })}
              className={cn(
                "py-2 text-xs font-semibold rounded-xl border capitalize transition-all",
                (sec.shadow || "none") === s
                  ? "border-accent bg-accent/10 text-accent font-bold ring-2 ring-accent/20"
                  : "border-line-soft bg-surface text-ink hover:bg-fill"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Backdrop Blur toggle */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl border border-line-soft bg-surface shadow-2xs">
        <div>
          <div className="text-sm font-semibold text-ink">Backdrop Blur</div>
          <div className="text-xs text-muted">Frosted glass effect behind header</div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={sec.backdropBlur !== false}
          onClick={() => useEditor.getState().patchSelected({ backdropBlur: sec.backdropBlur === false ? true : false })}
          className={cn(
            "tap-smooth relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
            sec.backdropBlur !== false ? "bg-accent" : "bg-slate-200 dark:bg-zinc-700"
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200",
              sec.backdropBlur !== false ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
      </div>
    </div>
  );
}

function NavbarTypography({ sec }: { sec: NavbarSection }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Font size */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Brand & Link Size</label>
        <div className="grid grid-cols-4 gap-1.5">
          {(["sm", "base", "lg", "xl"] as const).map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => useEditor.getState().patchSelected({ fontSize: sz })}
              className={cn(
                "py-2 text-xs font-semibold rounded-xl border uppercase transition-all",
                (sec.fontSize || "base") === sz
                  ? "border-accent bg-accent/10 text-accent font-bold ring-2 ring-accent/20"
                  : "border-line-soft bg-surface text-ink hover:bg-fill"
              )}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Font weight */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Font Weight</label>
        <div className="grid grid-cols-4 gap-1.5">
          {(["normal", "medium", "semibold", "bold"] as const).map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => useEditor.getState().patchSelected({ fontWeight: w })}
              className={cn(
                "py-2 text-xs font-semibold rounded-xl border capitalize transition-all",
                (sec.fontWeight || "semibold") === w
                  ? "border-accent bg-accent/10 text-accent font-bold ring-2 ring-accent/20"
                  : "border-line-soft bg-surface text-ink hover:bg-fill"
              )}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Letter spacing */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Letter Spacing</label>
        <div className="grid grid-cols-4 gap-1.5">
          {(["tight", "normal", "wide", "widest"] as const).map((ls) => (
            <button
              key={ls}
              type="button"
              onClick={() => useEditor.getState().patchSelected({ letterSpacing: ls })}
              className={cn(
                "py-2 text-xs font-semibold rounded-xl border capitalize transition-all",
                (sec.letterSpacing || "normal") === ls
                  ? "border-accent bg-accent/10 text-accent font-bold ring-2 ring-accent/20"
                  : "border-line-soft bg-surface text-ink hover:bg-fill"
              )}
            >
              {ls}
            </button>
          ))}
        </div>
      </div>

      {/* Uppercase toggle */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl border border-line-soft bg-surface shadow-2xs">
        <div>
          <div className="text-sm font-semibold text-ink">Uppercase Brand & Links</div>
          <div className="text-xs text-muted">Display brand name & links in ALL CAPS</div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={sec.uppercase !== false}
          onClick={() => useEditor.getState().patchSelected({ uppercase: sec.uppercase === false ? true : false })}
          className={cn(
            "tap-smooth relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
            sec.uppercase !== false ? "bg-accent" : "bg-slate-200 dark:bg-zinc-700"
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200",
              sec.uppercase !== false ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
      </div>
    </div>
  );
}

function NavbarLinks({ sec }: { sec: NavbarSection }) {
  const defaultLinks: NavbarLink[] = [
    { id: "1", label: "Home", url: "home" },
    { id: "2", label: "Shop", url: "shop" },
    { id: "3", label: "Product", url: "product" },
  ];

  const currentLinks = sec.links && sec.links.length > 0 ? sec.links : defaultLinks;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">Navigation Links</label>
        <button
          type="button"
          onClick={() => {
            const newLink: NavbarLink = {
              id: Date.now().toString(),
              label: "New Link",
              url: "shop",
            };
            useEditor.getState().patchSelected({ links: [...currentLinks, newLink] });
          }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
        >
          <Plus className="size-3.5" />
          <span>Add Link</span>
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {currentLinks.map((link, idx) => (
          <div key={link.id} className="flex items-center gap-2 p-2.5 rounded-2xl border border-line-soft bg-surface shadow-2xs">
            <input
              type="text"
              value={link.label}
              onChange={(e) => {
                const updated = [...currentLinks];
                updated[idx] = { ...link, label: e.target.value };
                useEditor.getState().patchSelected({ links: updated });
              }}
              placeholder="Label"
              className="flex-1 rounded-xl border border-line-soft bg-fill/50 px-3 py-1.5 text-xs font-medium text-ink focus:border-accent focus:bg-surface focus:outline-hidden"
            />
            <input
              type="text"
              value={link.url}
              onChange={(e) => {
                const updated = [...currentLinks];
                updated[idx] = { ...link, url: e.target.value };
                useEditor.getState().patchSelected({ links: updated });
              }}
              placeholder="URL / Page"
              className="w-28 rounded-xl border border-line-soft bg-fill/50 px-3 py-1.5 text-xs font-mono text-muted focus:border-accent focus:bg-surface focus:outline-hidden"
            />
            <button
              type="button"
              aria-label="Remove link"
              onClick={() => {
                const updated = currentLinks.filter((_, i) => i !== idx);
                useEditor.getState().patchSelected({ links: updated });
              }}
              className="p-1.5 text-muted hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
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

function CategoriesTemplate({ current }: { current?: "cards" | "pills" | "grid" }) {
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

function BrandsTemplate({ current }: { current?: "row" | "grid" }) {
  const active = current ?? "row";
  return (
    <div className="flex flex-col gap-3">
      <TemplateCard
        active={active === "row"}
        onClick={() => useEditor.getState().patchSelected({ template: "row" })}
      >
        <div className="flex items-center justify-center gap-2 rounded-xl border border-line-soft bg-fill/30 p-3">
          <div className="h-6 w-14 rounded-lg bg-slate-300" />
          <div className="h-6 w-14 rounded-lg bg-slate-300" />
          <div className="h-6 w-14 rounded-lg bg-slate-300" />
        </div>
      </TemplateCard>
      <TemplateCard
        active={active === "grid"}
        onClick={() => useEditor.getState().patchSelected({ template: "grid" })}
      >
        <div className="grid grid-cols-3 gap-2 rounded-xl border border-line-soft bg-fill/30 p-3">
          <div className="h-7 rounded-lg bg-slate-300" />
          <div className="h-7 rounded-lg bg-slate-300" />
          <div className="h-7 rounded-lg bg-slate-300" />
          <div className="h-7 rounded-lg bg-slate-200" />
          <div className="h-7 rounded-lg bg-slate-200" />
          <div className="h-7 rounded-lg bg-slate-200" />
        </div>
      </TemplateCard>
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
