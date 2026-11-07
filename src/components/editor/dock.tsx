import {
  Droplet,
  Eye,
  LayoutTemplate,
  MessageCircle,
  Palette,
  Pencil,
  Pin,
  PlusCircle,
  Settings2,
  SlidersHorizontal,
  Tag,
} from "lucide-react";
import { selectedSection, useEditor } from "@/lib/editor/store";
import { cn } from "@/lib/cn";
import type { SheetKind } from "@/lib/editor/types";

export function Dock() {
  const section = useEditor((s) => selectedSection(s));

  const items = (() => {
    const open = (sheet: SheetKind) => () => useEditor.getState().openSheet(sheet);
    if (!section) {
      return [
        { id: "themes", label: "Template", icon: LayoutTemplate, action: open("themes") },
        { id: "add", label: "Add", icon: PlusCircle, action: open("add") },
        { id: "color", label: "Background", icon: Palette, action: open("page-color") },
        {
          id: "preview",
          label: "Preview",
          icon: Eye,
          action: () => useEditor.getState().togglePreview(),
        },
      ];
    }
    switch (section.type) {
      case "navbar":
        return [
          { id: "template", label: "Template", icon: LayoutTemplate, action: open("navbar-style") },
          { id: "colors", label: "Colors", icon: Palette, action: open("navbar-color") },
          { id: "elements", label: "Elements", icon: SlidersHorizontal, action: open("navbar-elements") },
          { id: "more", label: "Edit More", icon: Settings2, action: open("navbar-more") },
        ];
      case "hero":
        return [
          { id: "template", label: "Template", icon: LayoutTemplate, action: open("hero-layout") },
          { id: "color", label: "Color", icon: Palette, action: open("section-color") },
        ];
      case "intro":
        return [
          { id: "template", label: "Template", icon: LayoutTemplate, action: open("intro-template") },
          { id: "edit", label: "Edit", icon: Pencil, action: open("intro-text") },
          { id: "accent", label: "Accent", icon: Palette, action: open("kicker-color") },
          { id: "color", label: "Color", icon: Palette, action: open("section-color") },
        ];
      case "grid":
        return [
          { id: "template", label: "Template", icon: LayoutTemplate, action: open("grid-layout") },
          { id: "style", label: "Style", icon: SlidersHorizontal, action: open("product-card-style") },
          { id: "badges", label: "Badges", icon: Tag, action: open("product-card-badges") },
          { id: "color", label: "Color", icon: Palette, action: open("section-color") },
        ];
      case "featured":
        return [
          { id: "template", label: "Template", icon: LayoutTemplate, action: open("featured-template") },
          { id: "style", label: "Style", icon: SlidersHorizontal, action: open("product-card-style") },
          { id: "badges", label: "WhatsApp", icon: MessageCircle, action: open("product-card-badges") },
          { id: "color", label: "Color", icon: Palette, action: open("section-color") },
        ];
      case "categories":
        return [
          { id: "template", label: "Template", icon: LayoutTemplate, action: open("categories-template") },
          { id: "color", label: "Color", icon: Palette, action: open("section-color") },
        ];
      case "brands":
        return [
          { id: "template", label: "Template", icon: LayoutTemplate, action: open("brands-template") },
          { id: "color", label: "Color", icon: Palette, action: open("section-color") },
        ];
      case "banner":
        return [
          { id: "template", label: "Template", icon: LayoutTemplate, action: open("banner-template") },
          { id: "color", label: "Color", icon: Palette, action: open("section-color") },
        ];
      case "about":
        return [
          { id: "template", label: "Template", icon: LayoutTemplate, action: open("about-template") },
          { id: "color", label: "Color", icon: Palette, action: open("section-color") },
        ];
      case "catalog":
        return [
          { id: "template", label: "Template", icon: LayoutTemplate, action: open("catalog-template") },
          { id: "style", label: "Style", icon: SlidersHorizontal, action: open("product-card-style") },
          { id: "badges", label: "Badges", icon: Tag, action: open("product-card-badges") },
          { id: "color", label: "Color", icon: Palette, action: open("section-color") },
        ];
      case "product":
        return [
          { id: "template", label: "Template", icon: LayoutTemplate, action: open("product-template") },
          { id: "style", label: "Style", icon: SlidersHorizontal, action: open("product-card-style") },
          { id: "badges", label: "WhatsApp", icon: MessageCircle, action: open("product-card-badges") },
          { id: "color", label: "Color", icon: Palette, action: open("section-color") },
        ];
      case "footer":
        return [
          { id: "template", label: "Template", icon: LayoutTemplate, action: open("footer-style") },
          { id: "color", label: "Color", icon: Palette, action: open("section-color") },
        ];
      case "block":
        return [
          { id: "template", label: "Template", icon: LayoutTemplate, action: open("block-template") },
          { id: "edit", label: "Edit", icon: Pencil, action: open("block-text") },
          { id: "color", label: "Color", icon: Palette, action: open("section-color") },
        ];
      default:
        return [];
    }
  })();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none p-3 pb-safe">
      <div className="pointer-events-auto flex items-center justify-center max-w-full">
        <div className="flex items-center gap-1 sm:gap-1.5 rounded-3xl border border-slate-200/90 bg-surface/95 px-2 py-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                className={cn(
                  "tap-smooth flex h-14 min-w-12 sm:min-w-16 px-1 flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-ink transition-all duration-150 hover:bg-fill hover:-translate-y-0.5 active:translate-y-0",
                )}
              >
                <Icon className="size-5 stroke-[1.75]" />
                <span className="text-[11px] font-medium leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
