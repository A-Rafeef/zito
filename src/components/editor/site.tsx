import { useEffect, useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Menu,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { isDark, money, QUOTES } from "@/lib/editor/defaults";
import { useEditor } from "@/lib/editor/store";
import type {
  CatalogFilter,
  Device,
  NavbarLink,
  NavbarSection,
  PageId,
  Section,
} from "@/lib/editor/types";
import { cn } from "@/lib/cn";

const FILTERS: CatalogFilter[] = ["All", "Footwear", "Apparel", "Accessories"];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="0"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

function solid(dark: boolean) {
  return cn(
    "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium",
    dark ? "bg-on-ink text-ink" : "bg-ink text-on-ink",
  );
}

function quiet(dark: boolean) {
  return cn(
    "inline-flex h-9 items-center justify-center rounded-full px-4 text-sm",
    dark ? "bg-on-ink/10 text-on-ink" : "bg-fill text-ink",
  );
}

function titleSize(device: Device) {
  if (device === "desktop") return "text-5xl";
  if (device === "tablet") return "text-4xl";
  return "text-3xl";
}

function gutter(device: Device) {
  return device === "mobile" ? "px-5" : "px-10";
}

function priceNumber(price: string) {
  const value = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : 0;
}

function SelectionChip({ id }: { id: string }) {
  const sections = useEditor((s) => s.pages[s.pageId].sections);
  const index = sections.findIndex((sec) => sec.id === id);
  const sec = sections[index];
  const [placement, setPlacement] = useState<"below" | "above">(
    sec?.type === "navbar" ? "below" : "below",
  );

  useEffect(() => {
    if (!sec) return;
    if (sec.type === "navbar") {
      setPlacement("below");
      return;
    }

    const updatePlacement = () => {
      const sectionEl = document.querySelector(`[data-section-id="${id}"]`) as HTMLElement | null;
      if (!sectionEl) return;
      const container = (sectionEl.closest(".overflow-y-auto") as HTMLElement | null) || document.documentElement;
      const containerRect = container.getBoundingClientRect();
      const sectionRect = sectionEl.getBoundingClientRect();

      const spaceAbove = sectionRect.top - containerRect.top;
      const spaceBelow = containerRect.bottom - sectionRect.bottom;

      // If space above is at least 48px and greater than below, or space below is too tight:
      if (spaceAbove >= 48 && (spaceAbove >= spaceBelow || spaceBelow < 44)) {
        setPlacement("above");
      } else {
        setPlacement("below");
      }
    };

    updatePlacement();
    window.addEventListener("scroll", updatePlacement, true);
    window.addEventListener("resize", updatePlacement);
    return () => {
      window.removeEventListener("scroll", updatePlacement, true);
      window.removeEventListener("resize", updatePlacement);
    };
  }, [id, sec]);

  if (!sec) return null;

  const isFixed = sec.type === "navbar" || sec.type === "footer";
  const isGlobal = isFixed || sec.type === "catalog" || sec.type === "grid" || sec.type === "featured";

  const displayName =
    sec.type === "navbar"
      ? "Header"
      : sec.type === "footer"
        ? "Footer"
        : sec.type === "catalog" || sec.type === "grid" || sec.type === "featured"
          ? "Product Card"
          : sec.name;

  const positionClass =
    placement === "below"
      ? "top-full mt-2.5 left-4"
      : "-top-10 left-4";

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "animate-scale-in absolute z-30 flex h-8 items-center gap-1 rounded-full border border-slate-800/80 bg-slate-900/95 px-2.5 py-1 text-xs text-white shadow-xl shadow-black/25 backdrop-blur-md select-none transition-all duration-200",
        positionClass,
      )}
    >
      <span className="flex items-center gap-1.5 pr-1.5 text-[10px] font-bold tracking-wider text-purple-300 uppercase">
        <span className="size-1.5 rounded-full bg-purple-400" />
        <span>{displayName}</span>
        {isFixed && (
          <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[8px] font-extrabold tracking-normal text-emerald-300">
            FIXED
          </span>
        )}
        {!isFixed && isGlobal && (
          <span className="rounded-full bg-purple-500/30 px-1.5 py-0.2 text-[8px] font-extrabold tracking-normal text-purple-200">
            GLOBAL
          </span>
        )}
      </span>

      {!isFixed && (
        <>
          <div className="h-3 w-[1px] bg-slate-700/80" />

          <button
            type="button"
            title="Move up"
            aria-label="Move up"
            disabled={index <= 1}
            onClick={(event) => {
              event.stopPropagation();
              useEditor.getState().moveSection(id, -1);
            }}
            className="tap-smooth flex size-6 items-center justify-center rounded-full text-slate-300 hover:bg-white/15 hover:text-white disabled:opacity-20 transition-all active:scale-90"
          >
            <ChevronUp className="size-3.5 stroke-[2.5]" />
          </button>

          <button
            type="button"
            title="Move down"
            aria-label="Move down"
            disabled={index >= sections.length - 2}
            onClick={(event) => {
              event.stopPropagation();
              useEditor.getState().moveSection(id, 1);
            }}
            className="tap-smooth flex size-6 items-center justify-center rounded-full text-slate-300 hover:bg-white/15 hover:text-white disabled:opacity-20 transition-all active:scale-90"
          >
            <ChevronDown className="size-3.5 stroke-[2.5]" />
          </button>

          <div className="h-3 w-[1px] bg-slate-700/80" />

          <button
            type="button"
            title="Delete section"
            aria-label="Delete section"
            onClick={(event) => {
              event.stopPropagation();
              useEditor.getState().deleteSection(id);
            }}
            className="tap-smooth flex size-6 items-center justify-center rounded-full text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all active:scale-90"
          >
            <Trash2 className="size-3.5 stroke-[2]" />
          </button>
        </>
      )}

      <div className="h-3 w-[1px] bg-slate-700/80" />

      <button
        type="button"
        title="Deselect"
        aria-label="Deselect"
        onClick={(event) => {
          event.stopPropagation();
          useEditor.getState().deselect();
        }}
        className="tap-smooth flex size-6 items-center justify-center rounded-full text-slate-400 hover:bg-white/15 hover:text-white transition-all active:scale-90"
      >
        <X className="size-3.5 stroke-[2]" />
      </button>
    </div>
  );
}

function SectionShell({
  section,
  background,
  color,
  className,
  children,
}: {
  section: Section;
  background?: string;
  color?: string;
  className?: string;
  children: ReactNode;
}) {
  const preview = useEditor((s) => s.preview);
  const selected = useEditor((s) => !s.preview && s.selectedId === section.id);

  return (
    <section
      data-section-id={section.id}
      style={{ background, color }}
      onClick={(event) => {
        if (preview) return;
        event.stopPropagation();
        if (selected) {
          useEditor.getState().deselect();
        } else {
          useEditor.getState().select(section.id);
        }
      }}
      className={cn(
        "relative transition-[box-shadow,background-color] duration-200",
        selected && "ring-2 ring-accent ring-inset z-20",
        !preview && !selected && "hover:ring-1 hover:ring-line hover:ring-inset",
        className,
      )}
    >
      {selected && <SelectionChip id={section.id} />}
      {children}
    </section>
  );
}

function LogoButton({
  logo,
  showBrandName = true,
  showLogoImage = true,
  logoImage,
  className,
}: {
  logo: string;
  showBrandName?: boolean;
  showLogoImage?: boolean;
  logoImage?: string;
  className?: string;
}) {
  const preview = useEditor((s) => s.preview);
  return (
    <button
      type="button"
      onClick={(event) => {
        if (!preview) return;
        event.stopPropagation();
        useEditor.getState().switchPage("home");
      }}
      className={cn("tap-smooth inline-flex items-center gap-2 hover:opacity-80 transition-opacity", className)}
    >
      {showLogoImage && logoImage ? (
        <img src={logoImage} alt={logo} className="size-7 rounded-full object-cover" />
      ) : showLogoImage && !showBrandName ? (
        <span className="flex size-7 items-center justify-center rounded-lg bg-current/10 font-black text-xs">
          {logo.charAt(0) || "Z"}
        </span>
      ) : null}
      {showBrandName && <span>{logo}</span>}
    </button>
  );
}

function BagButton({ count, color }: { count: number; color?: string }) {
  const preview = useEditor((s) => s.preview);
  return (
    <button
      type="button"
      aria-label="Open bag"
      style={color ? { color } : undefined}
      onClick={(event) => {
        if (!preview) return;
        event.stopPropagation();
        useEditor.getState().openCart();
      }}
      className="tap-smooth inline-flex h-11 items-center gap-1 rounded-full px-2 hover:bg-fill/60 transition-colors"
    >
      <ShoppingBag className="size-5" strokeWidth={1.5} />
      <span className="text-xs tabular-nums font-medium">{count}</span>
    </button>
  );
}

function SearchButton({ roomy, color }: { roomy: boolean; color?: string }) {
  const preview = useEditor((s) => s.preview);
  return (
    <button
      type="button"
      aria-label="Search"
      style={color ? { color } : undefined}
      onClick={(event) => {
        if (!preview) return;
        event.stopPropagation();
        useEditor.getState().openSearch();
      }}
      className={cn(
        "tap-smooth inline-flex items-center gap-2 rounded-full transition-colors",
        roomy ? "h-9 bg-fill px-3 text-sm text-muted hover:bg-line-soft/80" : "size-11 justify-center hover:bg-fill/60",
      )}
    >
      <Search className="size-4" strokeWidth={1.75} />
      {roomy && <span>Search</span>}
    </button>
  );
}

function PageLinks({
  current,
  links,
  caseClass,
  color,
}: {
  current: PageId;
  links?: NavbarLink[];
  caseClass?: string;
  color?: string;
}) {
  const preview = useEditor((s) => s.preview);
  const defaultLinks: NavbarLink[] = [
    { id: "home", label: "Home", url: "home" },
    { id: "shop", label: "Shop", url: "shop" },
    { id: "product", label: "Product", url: "product" },
  ];
  const items = links && links.length > 0 ? links : defaultLinks;

  return (
    <nav className="flex items-center gap-6">
      {items.map((link) => {
        const isCurrent = link.url === current;
        return (
          <button
            key={link.id}
            type="button"
            onClick={(event) => {
              if (!preview) return;
              event.stopPropagation();
              if (link.url === "home" || link.url === "shop" || link.url === "product") {
                useEditor.getState().switchPage(link.url);
              }
            }}
            className={cn(
              "tap-smooth text-sm transition-opacity duration-150 hover:opacity-100",
              caseClass,
              isCurrent ? "font-semibold opacity-100" : "opacity-60"
            )}
            style={color ? { color } : undefined}
          >
            {link.label}
          </button>
        );
      })}
    </nav>
  );
}

function NavbarView({ sec, device }: { sec: NavbarSection; device: Device }) {
  const pageId = useEditor((s) => s.pageId);
  const preview = useEditor((s) => s.preview);
  const count = useEditor((s) => s.cart.reduce((sum, item) => sum + item.qty, 0));
  const roomy = device !== "mobile";

  const showLogo = sec.showLogo ?? true;
  const showBrandName = sec.showBrandName ?? true;
  const showSearch = sec.showSearch ?? true;
  const showCart = sec.showCart ?? true;
  const showMenu = sec.showMenu ?? true;
  const showLinks = sec.showLinks ?? true;
  const isSticky = sec.sticky ?? true;
  const iconColor = sec.iconColor || sec.text;
  const isFloating = sec.isFloating ?? (sec.template === "float");

  const heightStyle = sec.height ? { minHeight: `${sec.height}px` } : { minHeight: "56px" };
  const radius =
    sec.borderRadius !== undefined
      ? sec.borderRadius === 9999
        ? "9999px"
        : `${sec.borderRadius}px`
      : isFloating
      ? "9999px"
      : undefined;

  const shadowClass =
    sec.shadow === "none"
      ? ""
      : sec.shadow === "subtle"
      ? "shadow-xs"
      : sec.shadow === "glass"
      ? "shadow-lg backdrop-blur-xl"
      : isFloating || sec.shadow === "float"
      ? "shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
      : "";

  const blurClass = sec.backdropBlur !== false ? "backdrop-blur-md" : "";

  const borderClass =
    sec.borderStyle === "none"
      ? "border-0"
      : sec.borderStyle === "solid"
      ? "border-2 border-current/20"
      : "border border-line-soft";

  // Typography styling
  const fontClass =
    sec.fontSize === "sm"
      ? "text-xs"
      : sec.fontSize === "lg"
      ? "text-base"
      : sec.fontSize === "xl"
      ? "text-lg"
      : "text-sm";

  const weightClass =
    sec.fontWeight === "normal"
      ? "font-normal"
      : sec.fontWeight === "medium"
      ? "font-medium"
      : sec.fontWeight === "bold"
      ? "font-bold"
      : "font-semibold";

  const trackingClass =
    sec.letterSpacing === "tight"
      ? "tracking-tight"
      : sec.letterSpacing === "wide"
      ? "tracking-wide"
      : sec.letterSpacing === "widest"
      ? "tracking-widest"
      : "tracking-widest";

  const caseClass = sec.uppercase !== false ? "uppercase" : "normal-case";

  const brandEl = (showLogo || showBrandName) ? (
    <LogoButton
      logo={sec.logo}
      showBrandName={showBrandName}
      showLogoImage={showLogo}
      logoImage={sec.logoImage}
      className={cn(fontClass, weightClass, trackingClass, caseClass)}
    />
  ) : <div />;

  const menuButton = showMenu ? (
    <button
      type="button"
      aria-label="Menu"
      style={{ color: iconColor }}
      onClick={(event) => {
        if (!preview) return;
        event.stopPropagation();
        useEditor.getState().setMenuOpen(true);
      }}
      className="inline-flex size-11 items-center justify-center tap-smooth hover:opacity-80 transition-opacity"
    >
      <Menu className="size-5" strokeWidth={1.5} />
    </button>
  ) : (
    <div className="size-11" />
  );

  const actionIcons = (
    <div className="flex items-center gap-0.5">
      {showSearch && <SearchButton roomy={false} color={iconColor} />}
      {showCart && <BagButton count={count} color={iconColor} />}
    </div>
  );

  let bar: React.ReactNode;

  if (sec.template === "minimal") {
    bar = (
      <div className={cn("flex items-center justify-between py-2", gutter(device))} style={heightStyle}>
        {brandEl}
        {actionIcons}
      </div>
    );
  } else if (sec.template === "expanded") {
    bar = (
      <div className={cn("flex items-center justify-between gap-4 py-2", gutter(device))} style={heightStyle}>
        <div className="shrink-0">{brandEl}</div>
        <div className="flex-1 max-w-sm hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-fill/70 border border-line-soft text-muted text-xs">
          <Search className="size-3.5 shrink-0" style={{ color: iconColor }} />
          <span className="truncate">Search products...</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {showSearch && <SearchButton roomy={false} color={iconColor} />}
          {showCart && <BagButton count={count} color={iconColor} />}
          {!roomy && showMenu && menuButton}
        </div>
      </div>
    );
  } else if (roomy) {
    if (sec.template === "left") {
      bar = (
        <div className="flex items-center justify-between gap-6 px-6 py-2" style={heightStyle}>
          <div className="flex items-center gap-8">
            {brandEl}
            {showLinks && (
              <PageLinks
                current={pageId}
                links={sec.links}
                caseClass={caseClass}
                color={sec.text}
              />
            )}
          </div>
          <div className="flex items-center gap-1">
            {showSearch && <SearchButton roomy color={iconColor} />}
            {showCart && <BagButton count={count} color={iconColor} />}
          </div>
        </div>
      );
    } else {
      // centered & float desktop
      bar = (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-2" style={heightStyle}>
          <div className="justify-self-start">
            {showLinks && (
              <PageLinks
                current={pageId}
                links={sec.links}
                caseClass={caseClass}
                color={sec.text}
              />
            )}
          </div>
          <div className="justify-self-center">{brandEl}</div>
          <div className="flex items-center justify-end gap-1">
            {showSearch && <SearchButton roomy color={iconColor} />}
            {showCart && <BagButton count={count} color={iconColor} />}
          </div>
        </div>
      );
    }
  } else {
    // Mobile layout
    bar = (
      <div className="relative flex items-center justify-between px-2 py-1" style={heightStyle}>
        {sec.template === "left" ? (
          <div className="flex items-center gap-2">
            {showMenu && menuButton}
            {brandEl}
          </div>
        ) : (
          <>
            {menuButton}
            <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2">
              {brandEl}
            </div>
          </>
        )}
        {actionIcons}
      </div>
    );
  }

  if (isFloating) {
    return (
      <SectionShell
        section={sec}
        background="transparent"
        color={sec.text}
        className={cn(isSticky && "sticky top-0 z-20")}
      >
        <div className="px-3 pt-3 pb-1">
          <div
            className={cn(
              "overflow-hidden transition-all duration-200",
              borderClass,
              shadowClass,
              blurClass
            )}
            style={{
              background: sec.background,
              color: sec.text,
              borderRadius: radius || "9999px",
              borderColor: sec.borderColor,
            }}
          >
            {bar}
          </div>
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell
      section={sec}
      background={sec.background}
      color={sec.text}
      className={cn(isSticky && "sticky top-0 z-20", blurClass)}
    >
      <div
        className={cn("transition-all duration-200 border-b", borderClass, shadowClass)}
        style={{
          borderRadius: radius,
          borderColor: sec.borderColor,
        }}
      >
        {bar}
      </div>
    </SectionShell>
  );
}

function HeroView({
  sec,
}: {
  sec: Extract<Section, { type: "hero" }>;
  device: Device;
}) {
  const image = sec.slides[sec.active] ?? sec.slides[0];
  const ratio = sec.ratio ?? "16:9";
  const aspect = ratio === "auto" ? undefined : ratio.replace(":", " / ");

  const autoplay = sec.autoplay !== false;
  const speed = sec.autoplaySpeed ?? 4500;

  useEffect(() => {
    if (!autoplay || sec.slides.length <= 1) return;
    const timer = setInterval(() => {
      useEditor.getState().setHeroSlide((sec.active + 1) % sec.slides.length);
    }, speed);
    return () => clearInterval(timer);
  }, [autoplay, sec.active, sec.slides.length, speed]);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (sec.active - 1 + sec.slides.length) % sec.slides.length;
    useEditor.getState().setHeroSlide(nextIdx);
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (sec.active + 1) % sec.slides.length;
    useEditor.getState().setHeroSlide(nextIdx);
  };

  // Width mode container
  const widthClass =
    sec.widthMode === "gap-sm"
      ? "max-w-7xl mx-auto px-3 sm:px-6"
      : sec.widthMode === "gap-md"
      ? "max-w-5xl mx-auto px-5 sm:px-10"
      : sec.widthMode === "gap-lg"
      ? "max-w-4xl mx-auto px-6 sm:px-16"
      : "w-full px-0";

  // Vertical padding
  const paddingYClass =
    sec.paddingY === "sm"
      ? "py-2 sm:py-3"
      : sec.paddingY === "md"
      ? "py-4 sm:py-6"
      : sec.paddingY === "lg"
      ? "py-6 sm:py-10"
      : "py-0";

  const paddingXClass =
    sec.paddingX === "sm"
      ? "px-2"
      : sec.paddingX === "md"
      ? "px-4"
      : sec.paddingX === "lg"
      ? "px-8"
      : "px-0";

  // Corner radius
  const radius = sec.borderRadius ?? 0;

  // Animation styling
  const animClass =
    sec.animationEffect === "fade"
      ? "animate-fade-in duration-500"
      : sec.animationEffect === "zoom"
      ? "scale-100 hover:scale-105 transition-transform duration-700 ease-out"
      : sec.animationEffect === "none"
      ? ""
      : "animate-fade-in transition-transform duration-700 ease-out";

  return (
    <SectionShell section={sec} background={sec.background || "transparent"}>
      <div className={cn("transition-all duration-300", widthClass, paddingYClass, paddingXClass)}>
        <div
          className="relative w-full overflow-hidden transition-all duration-300 shadow-xs"
          style={{
            aspectRatio: aspect,
            borderRadius: radius > 0 ? `${radius}px` : undefined,
          }}
        >
          {image && (
            <img
              key={image + sec.active}
              src={image}
              alt=""
              className={cn("h-full w-full object-cover", animClass)}
            />
          )}

          {/* Previous & Next Arrow Controls */}
          {sec.slides.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={prev}
                className="tap-smooth absolute left-3 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-all opacity-80 hover:opacity-100"
              >
                <ChevronLeft className="size-4" strokeWidth={2.25} />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={next}
                className="tap-smooth absolute right-3 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-all opacity-80 hover:opacity-100"
              >
                <ChevronRight className="size-4" strokeWidth={2.25} />
              </button>
            </>
          )}

          {/* Dynamic Pagination Dots */}
          {sec.slides.length > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-md shadow-xs">
              {sec.slides.map((slide, index) => (
                <button
                  key={slide + index}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    useEditor.getState().setHeroSlide(index);
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 ease-out",
                    index === sec.active
                      ? "w-5 bg-white opacity-100"
                      : "w-1.5 bg-white/60 opacity-60 hover:opacity-90",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </SectionShell>
  );
}

function IntroView({
  sec,
  device,
}: {
  sec: Extract<Section, { type: "intro" }>;
  device: Device;
}) {
  const dark = isDark(sec.background);
  const preview = useEditor((s) => s.preview);
  return (
    <SectionShell section={sec} background={sec.background} color={sec.text}>
      <div className={cn("flex flex-col gap-6 py-8", gutter(device), device === "desktop" && "flex-row items-end justify-between")}>
        <div className="max-w-xl">
          <p className="text-xs font-medium tracking-widest uppercase" style={{ color: sec.kickerColor }}>
            {sec.kicker}
          </p>
          <h2 className={cn("mt-2 font-semibold tracking-tight", device === "mobile" ? "text-2xl" : "text-3xl")}>
            {sec.title}
          </h2>
          <p className={cn("mt-3 text-sm leading-relaxed", dark ? "text-on-ink/70" : "text-muted")}>{sec.body}</p>
        </div>
        {device !== "mobile" && (
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={(event) => {
                  if (!preview) return;
                  event.stopPropagation();
                  useEditor.getState().setCatalogFilter(filter);
                  useEditor.getState().switchPage("shop");
                }}
                className={quiet(dark)}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>
    </SectionShell>
  );
}

function GridView({
  sec,
  device,
}: {
  sec: Extract<Section, { type: "grid" }>;
  device: Device;
}) {
  const dark = isDark(sec.background);
  const preview = useEditor((s) => s.preview);
  const cols =
    sec.template === "editorial"
      ? "grid-cols-1"
      : device === "desktop"
        ? "grid-cols-4"
        : "grid-cols-2";

  const ratioClass =
    sec.template === "editorial"
      ? "aspect-video"
      : sec.imageRatio === "3:4"
        ? "aspect-[3/4]"
        : sec.imageRatio === "16:9"
          ? "aspect-video"
          : "aspect-square";

  const titleClass =
    sec.typography === "sm"
      ? "text-xs"
      : sec.typography === "lg"
        ? "text-base font-semibold"
        : "text-sm font-medium";

  return (
    <SectionShell section={sec} background={sec.background}>
      <div className={cn("grid gap-x-4 gap-y-8 pb-10", gutter(device), cols)}>
        {sec.items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              const open = () =>
                useEditor.getState().openProduct({
                  name: item.title,
                  price: priceNumber(item.price),
                  img: item.image,
                });
              if (preview) open();
              else useEditor.getState().select(sec.id);
            }}
            className="group tap-smooth-sm relative text-left"
          >
            <div className="relative overflow-hidden rounded-2xl bg-fill/50">
              {sec.showBadge !== false && item.badge && (
                <span className="absolute top-2.5 left-2.5 z-10 rounded-md bg-ink/90 px-2 py-0.5 text-[10px] font-bold tracking-wider text-on-ink uppercase backdrop-blur-xs shadow-xs">
                  {item.badge}
                </span>
              )}
              <img
                src={item.image}
                alt=""
                className={cn(
                  "w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105",
                  ratioClass,
                )}
              />
            </div>
            {sec.template === "editorial" && (
              <p className={cn("mt-3 text-xs", dark ? "text-on-ink/60" : "text-muted")}>{item.tag}</p>
            )}
            <div className="mt-3 flex items-baseline justify-between gap-3">
              <span className={cn(titleClass, "transition-colors group-hover:text-accent truncate", dark ? "text-on-ink" : "text-ink")}>{item.title}</span>
              <span className={cn("text-sm font-medium shrink-0", dark ? "text-on-ink/70" : "text-muted")}>{item.price}</span>
            </div>
          </button>
        ))}
      </div>
    </SectionShell>
  );
}

function CatalogView({
  sec,
  device,
}: {
  sec: Extract<Section, { type: "catalog" }>;
  device: Device;
}) {
  const dark = isDark(sec.background);
  const preview = useEditor((s) => s.preview);
  const items = sec.products.filter((item) => sec.filter === "All" || item.category === sec.filter);
  const isList = sec.template === "list";
  const cols = isList
    ? "grid-cols-1 max-w-xl mx-auto"
    : device === "desktop"
      ? "grid-cols-3"
      : "grid-cols-2";

  const ratioClass =
    sec.imageRatio === "3:4"
      ? "aspect-[3/4]"
      : sec.imageRatio === "16:9"
        ? "aspect-video"
        : "aspect-square";

  const titleClass =
    sec.typography === "sm"
      ? "text-xs"
      : sec.typography === "lg"
        ? "text-base font-semibold"
        : "text-sm font-medium";

  const openItem = (item: (typeof items)[number]) => {
    if (preview) {
      useEditor.getState().openProduct({
        name: item.name,
        price: item.price,
        img: item.img,
        rating: `${item.rating} · ${item.reviews} reviews`,
      });
    } else {
      useEditor.getState().select(sec.id);
    }
  };

  return (
    <SectionShell section={sec} background={sec.background} color={dark ? "#f5f5f7" : "#1d1d1f"}>
      <div className={cn("pt-8 pb-10", gutter(device))}>
        <h2 className={cn("font-semibold tracking-tight", titleSize(device))}>{sec.title}</h2>
        <p className={cn("mt-2 max-w-lg text-sm leading-relaxed", dark ? "text-on-ink/70" : "text-muted")}>
          {sec.subtitle}
        </p>
        <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                useEditor.getState().setCatalogFilter(filter);
              }}
              className={cn("tap-smooth shrink-0 transition-all duration-200", filter === sec.filter ? solid(dark) : quiet(dark))}
            >
              {filter}
            </button>
          ))}
        </div>
        <div key={sec.filter} className={cn("animate-page-enter mt-6 grid gap-x-4", isList ? "gap-y-3" : "gap-y-8", cols)}>
          {items.map((item) => (
            <article
              key={item.id}
              className={cn(
                "group relative transition-all",
                isList
                  ? "flex items-center justify-between gap-4 p-3 rounded-2xl bg-fill/40 hover:bg-fill/70 border border-line-soft/60"
                  : ""
              )}
            >
              <button
                type="button"
                className={cn(
                  "tap-smooth-sm block text-left",
                  isList ? "flex items-center gap-3.5 flex-1 min-w-0" : "w-full"
                )}
                onClick={(event) => {
                  event.stopPropagation();
                  openItem(item);
                }}
              >
                <div
                  className={cn(
                    "relative overflow-hidden rounded-2xl bg-fill/50",
                    isList ? "size-20 sm:size-24 shrink-0 rounded-xl" : "w-full"
                  )}
                >
                  {sec.showBadge !== false && item.badge && (
                    <span className="absolute top-2 left-2 z-10 rounded-md bg-ink/90 px-2 py-0.5 text-[10px] font-bold tracking-wider text-on-ink uppercase backdrop-blur-xs shadow-xs">
                      {item.badge}
                    </span>
                  )}
                  <img
                    src={item.img}
                    alt=""
                    className={cn(
                      "object-cover transition-transform duration-500 ease-out group-hover:scale-105",
                      isList ? "size-full" : cn("w-full", ratioClass)
                    )}
                  />
                </div>
                <div className={cn(isList ? "min-w-0 flex-1" : "")}>
                  <h3 className={cn("mt-3 sm:mt-2 transition-colors group-hover:text-accent truncate", titleClass)}>
                    {item.name}
                  </h3>
                  {sec.showRating !== false && (
                    <p className={cn("mt-1 text-xs", dark ? "text-on-ink/60" : "text-muted")}>
                      {item.rating} · {item.reviews} reviews
                    </p>
                  )}
                  {isList && sec.showPrice !== false && (
                    <span className="mt-1 block text-sm font-semibold">{money(item.price)}</span>
                  )}
                </div>
              </button>
              <div className={cn(isList ? "shrink-0" : "mt-3 flex items-center justify-between")}>
                {!isList && (
                  <div>
                    {sec.showPrice !== false ? (
                      <span className="text-sm font-semibold">{money(item.price)}</span>
                    ) : (
                      <span />
                    )}
                  </div>
                )}
                <button
                  type="button"
                  title="Buy on WhatsApp"
                  aria-label={`Buy ${item.name} on WhatsApp`}
                  onClick={(event) => {
                    event.stopPropagation();
                    openItem(item);
                  }}
                  className="tap-smooth inline-flex size-10 items-center justify-center rounded-full bg-[#25D366] text-white hover:bg-[#20bd5a] hover:scale-105 transition-all shadow-xs"
                >
                  <WhatsAppIcon className="size-4.5 fill-white" />
                </button>
              </div>
            </article>
          ))}
        </div>
        {items.length === 0 && (
          <p className={cn("py-12 text-center text-sm", dark ? "text-on-ink/70" : "text-muted")}>
            Nothing in this category.
          </p>
        )}
      </div>
    </SectionShell>
  );
}

function ProductView({
  sec,
  device,
}: {
  sec: Extract<Section, { type: "product" }>;
  device: Device;
}) {
  const dark = isDark(sec.background);
  const preview = useEditor((s) => s.preview);
  const wide = device === "desktop";
  const isSplit = sec.template === "split";

  const ratioClass =
    sec.imageRatio === "3:4"
      ? "aspect-[3/4]"
      : sec.imageRatio === "16:9"
        ? "aspect-video"
        : "aspect-square";

  const titleClass =
    sec.typography === "sm"
      ? "text-2xl sm:text-3xl"
      : sec.typography === "lg"
        ? "text-3xl sm:text-5xl font-bold"
        : "text-2xl sm:text-4xl font-semibold";

  const handleBuyOnWhatsApp = (event: React.MouseEvent) => {
    if (!preview) return;
    event.stopPropagation();
    const origin = typeof window !== "undefined" ? window.location.origin : "https://ziteo.site";
    const productUrl = `${origin}/product?name=${encodeURIComponent(sec.productName)}`;
    const phone = (sec.whatsappNumber || "919876543210").replace(/[^0-9]/g, "");
    const message =
      `Hi! I would like to order from Ziteo:

` +
      `📦 *Product:* ${sec.productName}
` +
      `💰 *Price:* ${money(sec.price)}
` +
      `🎨 *Color:* ${sec.color}
` +
      `📏 *Size:* ${sec.size}
` +
      `🔗 *Link:* ${productUrl}`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const gallery = (
    <div>
      <div className={cn("relative overflow-hidden bg-fill/40 rounded-3xl", wide ? "h-96" : "")}>
        {sec.showBadge !== false && (
          <span className="absolute top-4 left-4 z-10 rounded-md bg-ink/90 px-2.5 py-1 text-xs font-bold tracking-wider text-on-ink uppercase backdrop-blur-xs shadow-xs">
            POPULAR
          </span>
        )}
        <img
          key={sec.image}
          src={sec.image}
          alt={sec.productName}
          className={cn(
            "animate-fade-in w-full object-cover transition-transform duration-700 ease-out hover:scale-105",
            wide ? "h-full" : ratioClass
          )}
        />
      </div>
      <div className={cn("no-scrollbar mt-3 flex gap-2 overflow-x-auto", wide ? "" : "px-1")}>
        {sec.gallery.map((img) => (
          <button
            key={img}
            type="button"
            aria-label="Show photo"
            onClick={(event) => {
              event.stopPropagation();
              useEditor.getState().setProductField({ image: img });
            }}
            className={cn(
              "tap-smooth size-16 shrink-0 overflow-hidden rounded-xl transition-all duration-200",
              img === sec.image ? "ring-2 ring-accent scale-105" : "opacity-80 hover:opacity-100 hover:scale-102",
            )}
          >
            <img src={img} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );

  const info = (
    <div className={cn(wide || isSplit ? "flex flex-col justify-center" : "pt-6")}>
      {sec.showRating !== false && (
        <p className={cn("text-xs font-medium", dark ? "text-on-ink/70" : "text-muted")}>{sec.rating}</p>
      )}
      <h1 className={cn("mt-2 tracking-tight", titleClass)}>{sec.productName}</h1>
      <p className="mt-3 text-2xl font-bold text-emerald-600">{money(sec.price)}</p>
      <p className={cn("mt-4 max-w-md text-sm leading-relaxed", dark ? "text-on-ink/70" : "text-muted")}>
        {sec.description}
      </p>
      <div className="mt-6">
        <p className={cn("text-xs font-semibold uppercase tracking-wider", dark ? "text-on-ink/70" : "text-muted")}>Select Color</p>
        <div className="mt-2.5 flex gap-2.5">
          {sec.colors.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Color ${color}`}
              onClick={(event) => {
                event.stopPropagation();
                useEditor.getState().setProductField({ color });
              }}
              className={cn(
                "tap-smooth size-10 rounded-full border border-line transition-transform duration-200 hover:scale-110",
                color === sec.color && "ring-2 ring-emerald-500 ring-offset-2 scale-105",
              )}
              style={{ background: color }}
            />
          ))}
        </div>
      </div>
      <div className="mt-5">
        <p className={cn("text-xs font-semibold uppercase tracking-wider", dark ? "text-on-ink/70" : "text-muted")}>Select Size</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {sec.sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                useEditor.getState().setProductField({ size });
              }}
              className={cn(
                "tap-smooth h-10 rounded-full border px-4 text-xs font-semibold tracking-wide transition-all duration-200",
                size === sec.size
                  ? "border-[#25D366] bg-[#25D366] text-white shadow-xs"
                  : "border-line bg-transparent hover:border-ink",
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={handleBuyOnWhatsApp}
        className="tap-smooth-sm mt-6 flex h-13 w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] text-sm font-semibold text-white shadow-lg shadow-[#25D366]/25 transition-all hover:bg-[#20bd5a] hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
      >
        <WhatsAppIcon className="size-5 fill-white" />
        <span>Buy on WhatsApp · {money(sec.price)}</span>
      </button>
      <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-muted">
        <span className="size-1.5 rounded-full bg-[#25D366]" />
        <span>Instant WhatsApp confirmation & order tracking</span>
      </div>
    </div>
  );

  return (
    <SectionShell section={sec} background={sec.background} color={dark ? "#f5f5f7" : "#1d1d1f"}>
      <div className={cn(wide || isSplit ? "grid grid-cols-2 gap-10 px-8 py-10" : "px-5 pb-8")}>
        {gallery}
        {info}
      </div>
    </SectionShell>
  );
}

function JoinForm({ dark }: { dark: boolean }) {
  const [email, setEmail] = useState("");
  const preview = useEditor((s) => s.preview);
  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (!preview) return;
        event.stopPropagation();
        if (!email.trim()) return;
        setEmail("");
        useEditor.getState().showToast("You're on the list.");
      }}
    >
      <input
        type="email"
        required
        value={email}
        placeholder="Email"
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => setEmail(event.target.value)}
        className={cn(
          "h-11 min-w-0 flex-1 rounded-full px-4 text-sm outline-none",
          dark ? "bg-on-ink/10 text-on-ink placeholder:text-on-ink/50" : "bg-surface text-ink",
        )}
      />
      <button type="submit" className={cn(solid(dark), "shrink-0 px-5")}>
        Join
      </button>
    </form>
  );
}

function FooterView({
  sec,
  device,
}: {
  sec: Extract<Section, { type: "footer" }>;
  device: Device;
}) {
  const dark = isDark(sec.background);
  const preview = useEditor((s) => s.preview);
  const link = (label: string, page?: PageId) => (
    <button
      type="button"
      onClick={(event) => {
        if (!preview) return;
        event.stopPropagation();
        if (page) useEditor.getState().switchPage(page);
        else useEditor.getState().showToast(`${label} lives on the published site.`);
      }}
      className="text-left text-sm opacity-80 hover:opacity-100"
    >
      {label}
    </button>
  );

  if (sec.template === "columns") {
    return (
      <SectionShell section={sec} background={sec.background} color={sec.text}>
        <div className={cn("grid gap-8 py-12", gutter(device), device === "desktop" ? "grid-cols-4" : "grid-cols-2")}>
          <div className={device === "mobile" ? "col-span-2" : ""}>
            <p className="text-sm font-semibold tracking-widest text-ink" style={{ color: isDark(sec.background) ? "#f5f5f7" : "#1d1d1f" }}>
              {sec.brand}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed">Everyday footwear and modular layers.</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium tracking-widest uppercase opacity-60">Shop</p>
            {link("Footwear", "shop")}
            {link("Apparel", "shop")}
            {link("Featured", "product")}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium tracking-widest uppercase opacity-60">Company</p>
            {link("About")}
            {link("Stores")}
            {link("Care")}
          </div>
          <div className={device === "mobile" ? "col-span-2" : ""}>
            <p className="text-xs font-medium tracking-widest uppercase opacity-60">Notes</p>
            <div className="mt-3">
              <JoinForm dark={dark} />
            </div>
          </div>
        </div>
        <p className={cn("pb-8 text-xs opacity-70", gutter(device))}>{sec.copy}</p>
      </SectionShell>
    );
  }

  return (
    <SectionShell section={sec} background={sec.background} color={sec.text}>
      <div className="px-5 py-10 text-center">
        <p className="text-sm font-semibold tracking-widest" style={{ color: isDark(sec.background) ? "#f5f5f7" : "#1d1d1f" }}>
          {sec.brand}
        </p>
        <div className="mt-4 flex justify-center gap-5">
          {link("Privacy")}
          {link("Terms")}
          {link("Support")}
        </div>
        <p className="mt-4 text-xs opacity-70">{sec.copy}</p>
      </div>
    </SectionShell>
  );
}

function BlockView({
  sec,
  device,
}: {
  sec: Extract<Section, { type: "block" }>;
  device: Device;
}) {
  const dark = isDark(sec.background);
  return (
    <SectionShell section={sec} background={sec.background} color={sec.text}>
      <div className={cn("py-10", gutter(device))}>
        <p className={cn("text-xs font-medium tracking-widest uppercase", dark ? "text-on-ink/60" : "text-muted")}>
          {sec.kicker}
        </p>
        <h2 className={cn("mt-2 font-semibold tracking-tight", device === "mobile" ? "text-2xl" : "text-3xl")}>
          {sec.title}
        </h2>
        <p className={cn("mt-3 max-w-lg text-sm leading-relaxed", dark ? "text-on-ink/70" : "text-muted")}>{sec.body}</p>
        {sec.kind === "reviews" ? (
          <div className={cn("mt-6 grid gap-3", device === "desktop" ? "grid-cols-3" : "grid-cols-1")}>
            {QUOTES.map((quote) => (
              <figure key={quote.name} className={cn("rounded-2xl p-5", dark ? "bg-on-ink/10" : "bg-fill")}>
                <blockquote className="text-sm leading-relaxed">“{quote.text}”</blockquote>
                <figcaption className={cn("mt-4 text-xs", dark ? "text-on-ink/60" : "text-muted")}>
                  {quote.name}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="mt-6 max-w-md">
            <JoinForm dark={dark} />
          </div>
        )}
      </div>
    </SectionShell>
  );
}

function SiteMenu() {
  const open = useEditor((s) => s.menuOpen);
  const pageId = useEditor((s) => s.pageId);
  const preview = useEditor((s) => s.preview);
  if (!open) return null;
  const links: { id: PageId; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "shop", label: "Shop" },
    { id: "product", label: "Product" },
  ];
  return (
    <div className="absolute inset-0 z-30">
      <button
        type="button"
        aria-label="Close menu"
        className="animate-fade-in absolute inset-0 bg-ink/30 backdrop-blur-xs transition-opacity"
        onClick={() => useEditor.getState().setMenuOpen(false)}
      />
      <div className="animate-slide-in-left relative flex h-full w-4/5 max-w-xs flex-col bg-surface px-6 py-6 text-ink shadow-frame">
        <button
          type="button"
          aria-label="Close"
          onClick={() => useEditor.getState().setMenuOpen(false)}
          className="tap-smooth mb-8 inline-flex size-11 items-center justify-center self-end rounded-full bg-fill hover:bg-line-soft transition-colors"
        >
          <X className="size-5" strokeWidth={1.5} />
        </button>
        <div className="flex flex-col gap-2">
          {links.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => {
                if (!preview) return;
                useEditor.getState().switchPage(link.id);
              }}
              className={cn(
                "tap-smooth-sm py-2 text-left text-3xl font-semibold tracking-tight transition-colors duration-150",
                link.id === pageId ? "text-ink" : "text-muted hover:text-ink",
              )}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedView({
  sec,
  device,
}: {
  sec: Extract<Section, { type: "featured" }>;
  device: Device;
}) {
  const dark = isDark(sec.background);
  const preview = useEditor((s) => s.preview);
  const isCarousel = sec.template === "carousel";
  const cols =
    device === "desktop"
      ? "grid-cols-4"
      : device === "tablet"
        ? "grid-cols-3"
        : "grid-cols-2";

  const ratioClass =
    sec.imageRatio === "3:4"
      ? "aspect-[3/4]"
      : sec.imageRatio === "16:9"
        ? "aspect-video"
        : "aspect-square";

  const titleClass =
    sec.typography === "sm"
      ? "text-xs"
      : sec.typography === "lg"
        ? "text-base font-semibold"
        : "text-sm font-medium";

  const openItem = (item: (typeof sec.items)[number]) => {
    const num = Number(item.price.replace(/[^0-9.]/g, ""));
    const price = Number.isFinite(num) && num > 0 ? num : 149;
    if (preview) {
      useEditor.getState().openProduct({
        name: item.title,
        price,
        img: item.image,
      });
    } else {
      useEditor.getState().select(sec.id);
    }
  };

  const buyDirectOnWhatsApp = (event: React.MouseEvent, item: (typeof sec.items)[number]) => {
    if (!preview) return;
    event.stopPropagation();
    const origin = typeof window !== "undefined" ? window.location.origin : "https://ziteo.site";
    const productUrl = `${origin}/product?name=${encodeURIComponent(item.title)}`;
    const phone = (sec.whatsappNumber || "919876543210").replace(/[^0-9]/g, "");
    const message =
      `Hi! I'd like to order from Ziteo:

` +
      `📦 *Product:* ${item.title}
` +
      `💰 *Price:* ${item.price}
` +
      `🔗 *Link:* ${productUrl}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <SectionShell section={sec} background={sec.background} color={dark ? "#f5f5f7" : "#1d1d1f"}>
      <div className={cn("py-10", gutter(device))}>
        <div className="flex items-end justify-between">
          <div>
            <h2 className={cn("font-semibold tracking-tight", titleSize(device))}>{sec.title}</h2>
            {sec.subtitle && (
              <p className={cn("mt-1.5 text-sm", dark ? "text-on-ink/70" : "text-muted")}>
                {sec.subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (preview) useEditor.getState().switchPage("shop");
            }}
            className={cn("tap-smooth text-xs font-semibold hover:underline", dark ? "text-purple-300" : "text-accent")}
          >
            View all drops →
          </button>
        </div>

        <div
          className={cn(
            "mt-6",
            isCarousel
              ? "no-scrollbar flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory"
              : cn("grid gap-x-4 gap-y-8", cols)
          )}
        >
          {sec.items.map((item) => (
            <article
              key={item.id}
              className={cn(
                "group relative transition-all",
                isCarousel ? "w-44 sm:w-56 shrink-0 snap-start" : "w-full"
              )}
            >
              <button
                type="button"
                className="tap-smooth-sm block w-full text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  openItem(item);
                }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-fill/50">
                  {sec.showBadge !== false && item.badge && (
                    <span className="absolute top-2.5 left-2.5 z-10 rounded-md bg-ink/90 px-2 py-0.5 text-[10px] font-bold tracking-wider text-on-ink uppercase backdrop-blur-xs shadow-xs">
                      {item.badge}
                    </span>
                  )}
                  <img
                    src={item.image}
                    alt=""
                    className={cn(
                      "w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105",
                      ratioClass
                    )}
                  />
                </div>
                <h3 className={cn("mt-3 truncate transition-colors group-hover:text-accent", titleClass)}>
                  {item.title}
                </h3>
              </button>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  {sec.showPrice !== false ? (
                    <span className="text-sm font-semibold">{item.price}</span>
                  ) : null}
                </div>
                <button
                  type="button"
                  title="Buy on WhatsApp"
                  aria-label={`Buy ${item.title} on WhatsApp`}
                  onClick={(e) => buyDirectOnWhatsApp(e, item)}
                  className="tap-smooth inline-flex size-9 items-center justify-center rounded-full bg-[#25D366] text-white hover:bg-[#20bd5a] hover:scale-105 transition-all shadow-xs"
                >
                  <WhatsAppIcon className="size-4 fill-white" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function CategoriesView({
  sec,
  device,
}: {
  sec: Extract<Section, { type: "categories" }>;
  device: Device;
}) {
  const dark = isDark(sec.background);
  const preview = useEditor((s) => s.preview);

  const handleClick = (name: string) => {
    if (preview) {
      useEditor.getState().setCatalogFilter(name as any);
      useEditor.getState().switchPage("shop");
    }
  };

  const isCards = sec.template === "cards" || !sec.template;
  const isPills = sec.template === "pills";
  const isGrid = sec.template === "grid";

  return (
    <SectionShell section={sec} background={sec.background} color={dark ? "#f5f5f7" : "#1d1d1f"}>
      <div className={cn("py-8", gutter(device))}>
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <h2 className={cn("font-semibold tracking-tight", titleSize(device))}>{sec.title}</h2>
            {sec.subtitle && (
              <p className={cn("mt-1 text-sm", dark ? "text-on-ink/70" : "text-muted")}>
                {sec.subtitle}
              </p>
            )}
          </div>
        </div>

        {isPills ? (
          <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-1">
            {sec.items.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick(cat.name);
                }}
                className={cn(
                  "tap-smooth flex items-center gap-2.5 rounded-full border border-line-soft px-3 py-1.5 shrink-0 transition-all hover:scale-105 shadow-2xs",
                  dark ? "bg-white/10 text-white" : "bg-surface text-ink hover:bg-fill"
                )}
              >
                <img src={cat.image} alt="" className="size-6 rounded-full object-cover" />
                <span className="text-xs font-semibold">{cat.name}</span>
                {cat.count && <span className="text-[10px] text-muted">{cat.count}</span>}
              </button>
            ))}
          </div>
        ) : isGrid ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {sec.items.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick(cat.name);
                }}
                className="group tap-smooth-sm flex flex-col items-center gap-2 rounded-2xl border border-line-soft bg-surface p-3 text-center shadow-2xs hover:border-line transition-all"
              >
                <div className="size-16 sm:size-20 overflow-hidden rounded-full bg-fill/50">
                  <img
                    src={cat.image}
                    alt=""
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <span className="text-xs font-semibold text-ink group-hover:text-accent transition-colors">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {sec.items.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick(cat.name);
                }}
                className="group tap-smooth-sm relative aspect-[4/5] sm:aspect-square overflow-hidden rounded-3xl text-left shadow-xs transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={cat.image}
                  alt=""
                  className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-sm font-bold tracking-tight">{cat.name}</div>
                  {cat.count && (
                    <div className="text-[11px] font-medium text-white/70">{cat.count}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </SectionShell>
  );
}

function BrandsView({
  sec,
  device,
}: {
  sec: Extract<Section, { type: "brands" }>;
  device: Device;
}) {
  const dark = isDark(sec.background);
  const isGrid = sec.template === "grid";

  return (
    <SectionShell section={sec} background={sec.background} color={dark ? "#f5f5f7" : "#1d1d1f"}>
      <div className={cn("py-8 text-center", gutter(device))}>
        <h2 className="text-xs font-bold tracking-widest text-muted uppercase">{sec.title}</h2>
        {sec.subtitle && (
          <p className={cn("mt-1 text-xs", dark ? "text-on-ink/60" : "text-muted")}>
            {sec.subtitle}
          </p>
        )}

        <div
          className={cn(
            "mt-5",
            isGrid
              ? "grid grid-cols-2 sm:grid-cols-3 gap-2.5"
              : "no-scrollbar flex items-center justify-center gap-3 overflow-x-auto py-1"
          )}
        >
          {sec.items.map((b) => (
            <div
              key={b.id}
              className={cn(
                "tap-smooth flex flex-col items-center justify-center rounded-2xl border border-line-soft px-5 py-3 shadow-2xs transition-all hover:scale-105",
                dark ? "bg-white/5 border-white/10" : "bg-surface hover:bg-fill/60",
                isGrid ? "" : "shrink-0 min-w-28"
              )}
            >
              <span className="text-sm font-black tracking-widest text-ink">{b.name}</span>
              {b.tagline && (
                <span className="text-[9px] font-medium text-muted mt-0.5">{b.tagline}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function BannerView({
  sec,
  device,
}: {
  sec: Extract<Section, { type: "banner" }>;
  device: Device;
}) {
  const preview = useEditor((s) => s.preview);
  const isCard = sec.template === "card";
  const isFull = sec.template === "full";

  const handleAction = (e: React.MouseEvent) => {
    if (!preview) return;
    e.stopPropagation();
    if (sec.buttonAction === "whatsapp") {
      const origin = typeof window !== "undefined" ? window.location.origin : "https://ziteo.site";
      const message = `Hi! I want to claim the offer: *${sec.title}* from Ziteo.\n🔗 ${origin}`;
      window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, "_blank");
    } else {
      useEditor.getState().switchPage("shop");
    }
  };

  return (
    <SectionShell section={sec} background={sec.background} color={sec.textColor}>
      <div className={cn(gutter(device), isCard ? "py-6" : "py-10")}>
        <div
          className={cn(
            "relative overflow-hidden",
            isCard
              ? "rounded-3xl border border-white/15 bg-slate-900 p-6 sm:p-10 text-white shadow-xl"
              : isFull
                ? "rounded-none"
                : "grid grid-cols-1 sm:grid-cols-2 gap-6 items-center"
          )}
        >
          {sec.image && (
            <div
              className={cn(
                "overflow-hidden rounded-2xl",
                isCard ? "mb-4 sm:mb-0 sm:absolute sm:right-6 sm:top-6 sm:bottom-6 sm:w-64" : ""
              )}
            >
              <img
                src={sec.image}
                alt=""
                className={cn(
                  "size-full object-cover",
                  isCard ? "h-36 sm:h-full rounded-2xl" : "h-56 sm:h-72 rounded-3xl"
                )}
              />
            </div>
          )}

          <div className={cn(isCard ? "relative z-10 max-w-md" : "")}>
            <span className="inline-block rounded-full bg-[#25D366]/20 px-3 py-1 text-[10px] font-bold tracking-wider text-[#25D366] uppercase">
              {sec.tag}
            </span>
            <h2 className={cn("mt-2 font-bold tracking-tight", device === "mobile" ? "text-2xl" : "text-3xl")}>
              {sec.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/80 max-w-md">
              {sec.description}
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={handleAction}
                className="tap-smooth inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-5 text-xs font-bold text-white shadow-md shadow-[#25D366]/30 hover:bg-[#20bd5a] hover:scale-105 transition-all"
              >
                <WhatsAppIcon className="size-4 fill-white" />
                <span>{sec.buttonText}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function AboutView({
  sec,
  device,
}: {
  sec: Extract<Section, { type: "about" }>;
  device: Device;
}) {
  const dark = isDark(sec.background);
  const isSplit = sec.template === "split" || !sec.template;
  const isCards = sec.template === "cards";

  return (
    <SectionShell section={sec} background={sec.background} color={sec.text}>
      <div className={cn("py-12", gutter(device))}>
        <div className={cn(isSplit ? "grid grid-cols-1 sm:grid-cols-2 gap-8 items-center" : "")}>
          {sec.image && isSplit && (
            <div className="overflow-hidden rounded-3xl shadow-sm">
              <img
                src={sec.image}
                alt=""
                className="aspect-square sm:aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          )}
          <div>
            <span className="text-xs font-bold tracking-widest text-muted uppercase">
              {sec.kicker}
            </span>
            <h2 className={cn("mt-2 font-semibold tracking-tight", device === "mobile" ? "text-2xl" : "text-3xl")}>
              {sec.title}
            </h2>
            <p className={cn("mt-3 text-sm leading-relaxed", dark ? "text-on-ink/80" : "text-muted")}>
              {sec.story}
            </p>

            <div className={cn("mt-6 grid gap-3", isCards ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1")}>
              {sec.features.map((f) => (
                <div
                  key={f.id}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl p-3.5 border transition-all",
                    dark ? "border-white/10 bg-white/5" : "border-line-soft bg-surface shadow-2xs"
                  )}
                >
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-ink">{f.title}</h3>
                    <p className="mt-0.5 text-[11px] text-muted leading-snug">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function renderSection(sec: Section, device: Device) {
  switch (sec.type) {
    case "navbar":
      return <NavbarView key={sec.id} sec={sec} device={device} />;
    case "hero":
      return <HeroView key={sec.id} sec={sec} device={device} />;
    case "intro":
      return <IntroView key={sec.id} sec={sec} device={device} />;
    case "grid":
      return <GridView key={sec.id} sec={sec} device={device} />;
    case "featured":
      return <FeaturedView key={sec.id} sec={sec} device={device} />;
    case "categories":
      return <CategoriesView key={sec.id} sec={sec} device={device} />;
    case "brands":
      return <BrandsView key={sec.id} sec={sec} device={device} />;
    case "banner":
      return <BannerView key={sec.id} sec={sec} device={device} />;
    case "about":
      return <AboutView key={sec.id} sec={sec} device={device} />;
    case "catalog":
      return <CatalogView key={sec.id} sec={sec} device={device} />;
    case "product":
      return <ProductView key={sec.id} sec={sec} device={device} />;
    case "footer":
      return <FooterView key={sec.id} sec={sec} device={device} />;
    case "block":
      return <BlockView key={sec.id} sec={sec} device={device} />;
    default: {
      const never: never = sec;
      return never;
    }
  }
}

export function SiteFrame({ className }: { className?: string }) {
  const page = useEditor((s) => s.pages[s.pageId]);
  const pageId = useEditor((s) => s.pageId);
  const device = useEditor((s) => s.device);

  return (
    <div
      className={cn(
        "relative h-full overflow-hidden rounded-4xl border border-line-soft bg-surface shadow-frame transition-[background-color] duration-300",
        className,
      )}
      style={{ background: page.background }}
    >
      <div key={pageId} className="animate-page-enter no-scrollbar h-full overflow-y-auto overscroll-contain">
        {page.sections.map((sec) => renderSection(sec, device))}
      </div>
      <SiteMenu />
    </div>
  );
}
