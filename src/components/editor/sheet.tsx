import { useState, type ReactNode } from "react";
import { Check, Menu, Search, ShoppingBag, X } from "lucide-react";
import { HERO_PHOTOS, PAGE_COLORS, TEXT_COLORS } from "@/lib/editor/defaults";
import { selectedSection, useEditor } from "@/lib/editor/store";
import { cn } from "@/lib/cn";
import type {
  HeroRatio,
  HeroSection,
  IntroSection,
  NavbarSection,
  NavbarTemplate,
  ProductImageRatio,
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
  "navbar-color": { title: "Element color", subtitle: "Color of text, links, and icons." },
  "navbar-sticky": { title: "Sticky header", subtitle: "Pin header to top while scrolling." },
  "navbar-elements": { title: "Header elements", subtitle: "Choose what to display in the header." },
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
      return section?.type === "navbar" ? <NavbarColor text={section.text} /> : null;
    case "navbar-sticky":
      return section?.type === "navbar" ? <NavbarSticky current={section.sticky ?? true} /> : null;
    case "navbar-elements":
      return section?.type === "navbar" ? <NavbarElements sec={section} /> : null;
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
  return (
    <div className="flex flex-col gap-2.5">
      <button
        type="button"
        onClick={() => useEditor.getState().insertBlock("reviews")}
        className="tap-smooth flex w-full items-center justify-between rounded-2xl border border-line-soft bg-surface p-3.5 text-left hover:bg-fill/70 transition-all"
      >
        <div>
          <div className="text-sm font-medium">Reviews</div>
          <div className="text-xs text-muted">Three short lines of social proof.</div>
        </div>
        <div className="flex size-7 items-center justify-center rounded-full bg-fill text-ink">
          +
        </div>
      </button>
      <button
        type="button"
        onClick={() => useEditor.getState().insertBlock("newsletter")}
        className="tap-smooth flex w-full items-center justify-between rounded-2xl border border-line-soft bg-surface p-3.5 text-left hover:bg-fill/70 transition-all"
      >
        <div>
          <div className="text-sm font-medium">Newsletter</div>
          <div className="text-xs text-muted">Email capture banner.</div>
        </div>
        <div className="flex size-7 items-center justify-center rounded-full bg-fill text-ink">
          +
        </div>
      </button>
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

const NAV_STYLES: NavbarTemplate[] = ["centered", "left", "minimal", "float"];

function NavbarStyles({ sec }: { sec: NavbarSection }) {
  const current = sec.template;
  const count = useEditor((s) => s.cart.reduce((sum, item) => sum + item.qty, 0));
  const logo = sec.logo || "STORE";

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
          <div className="flex items-center gap-1 opacity-80 shrink-0">
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
            <Menu className="size-3.5 opacity-60 shrink-0" strokeWidth={1.75} />
            <div className="font-bold tracking-widest text-[11px] uppercase truncate px-2">
              {logo}
            </div>
            <div className="flex items-center gap-1.5 opacity-80 shrink-0">
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
            <Menu className="size-3.5 opacity-60 shrink-0" strokeWidth={1.75} />
            <div className="font-bold tracking-widest text-[11px] uppercase truncate">
              {logo}
            </div>
          </div>
          <div className="flex items-center gap-1.5 opacity-80 shrink-0">
            <Search className="size-3.5" strokeWidth={1.75} />
            <div className="flex items-center gap-0.5">
              <ShoppingBag className="size-3.5" strokeWidth={1.75} />
              <span className="text-[10px] font-semibold">{count}</span>
            </div>
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
        <Menu className="size-3.5 opacity-60 shrink-0" strokeWidth={1.75} />
        <div className="font-bold tracking-widest text-[11px] uppercase truncate px-2">
          {logo}
        </div>
        <div className="flex items-center gap-1.5 opacity-80 shrink-0">
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

function NavbarColor({ text }: { text: string }) {
  const colors = [
    { name: "Ink", value: "#1d1d1f" },
    { name: "Gray", value: "#6e6e73" },
    { name: "White", value: "#ffffff" },
    { name: "Purple", value: "#53389e" },
    { name: "Blue", value: "#0071e3" },
    { name: "Rose", value: "#e11d48" },
    { name: "Green", value: "#16a34a" },
    { name: "Amber", value: "#d97706" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2.5 text-xs font-medium text-muted">Element Color (Text, Links & Icons)</p>
        <div className="grid grid-cols-4 gap-2.5">
          {colors.map((color) => {
            const active = text.toLowerCase() === color.value.toLowerCase();
            return (
              <button
                key={color.value}
                type="button"
                onClick={() => useEditor.getState().patchSelected({ text: color.value })}
                className="tap-smooth group flex flex-col items-center gap-1.5 p-2 rounded-2xl border border-line-soft hover:bg-fill/70 transition-all"
              >
                <span
                  className={cn(
                    "size-9 rounded-full border border-line shadow-xs transition-transform group-hover:scale-105 flex items-center justify-center",
                    active && "ring-2 ring-accent ring-offset-2"
                  )}
                  style={{ background: color.value }}
                >
                  {active && (
                    <Check
                      className={cn("size-4", color.value === "#ffffff" ? "text-slate-900" : "text-white")}
                      strokeWidth={2.5}
                    />
                  )}
                </span>
                <span className="text-xs text-muted group-hover:text-ink">{color.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <Field label="Custom Hex Color">
          <TextInput
            value={text}
            placeholder="#1d1d1f"
            onChange={(e) => useEditor.getState().patchSelected({ text: e.target.value })}
          />
        </Field>
      </div>
    </div>
  );
}

function NavbarElements({ sec }: { sec: NavbarSection }) {
  const [logoVal, setLogoVal] = useState(sec.logo);

  const toggles = [
    {
      key: "showLogo",
      label: "Brand / Logo",
      detail: "Display brand name or logo",
      enabled: sec.showLogo ?? true,
    },
    {
      key: "showSearch",
      label: "Search Icon",
      detail: "Show search button",
      enabled: sec.showSearch ?? true,
    },
    {
      key: "showCart",
      label: "Bag / Cart Icon",
      detail: "Show shopping bag with item count",
      enabled: sec.showCart ?? true,
    },
    {
      key: "showMenu",
      label: "Mobile Menu Button",
      detail: "Show hamburger menu button on mobile",
      enabled: sec.showMenu ?? true,
    },
    {
      key: "showLinks",
      label: "Navigation Links",
      detail: "Show page navigation links on desktop",
      enabled: sec.showLinks ?? true,
    },
  ] as const;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-line-soft bg-surface p-3.5 shadow-2xs">
        <Field label="Brand / Logo Text">
          <TextInput value={logoVal} onChange={(e) => setLogoVal(e.target.value)} />
        </Field>
        <PrimaryButton onClick={() => useEditor.getState().setLogo(logoVal)}>
          Update Brand Name
        </PrimaryButton>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted">Visible Elements</p>
        <div className="divide-y divide-line-soft overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-2xs">
          {toggles.map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3.5">
              <div className="pr-3">
                <div className="text-sm font-medium">{item.label}</div>
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
                  item.enabled ? "bg-accent" : "bg-slate-200"
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

const RATIOS: { id: HeroRatio; title: string; detail: string; aspect: string }[] = [
  { id: "16:9", title: "16:9 Widescreen", detail: "Standard modern widescreen banner.", aspect: "16 / 9" },
  { id: "21:9", title: "21:9 Cinematic", detail: "Ultra-wide panoramic showcase.", aspect: "21 / 9" },
  { id: "4:3", title: "4:3 Classic", detail: "Taller classic photo format.", aspect: "4 / 3" },
  { id: "3:2", title: "3:2 Standard", detail: "Classic 35mm landscape format.", aspect: "3 / 2" },
  { id: "1:1", title: "1:1 Square", detail: "Compact square product showcase.", aspect: "1 / 1" },
];

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
