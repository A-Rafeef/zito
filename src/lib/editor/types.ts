export type PageId = "home" | "shop" | "product";
export type Device = "mobile" | "tablet" | "desktop";
export type Tone = "light" | "dark";
export type Category = "Footwear" | "Apparel" | "Accessories";
export type CatalogFilter = "All" | Category;

export type NavbarTemplate = "centered" | "left" | "minimal" | "float" | "expanded";
export type HeroTemplate = "bleed" | "split";
export type HeroRatio = "16:9" | "21:9" | "4:3" | "3:2" | "1:1" | "auto";
export type HeroWidth = "full" | "gap-sm" | "gap-md" | "gap-lg";
export type HeroPadding = "none" | "sm" | "md" | "lg";
export type HeroAnimation = "slide" | "fade" | "zoom" | "none";
export type GridTemplate = "mosaic" | "editorial";
export type FooterTemplate = "minimal" | "columns";

export type ProductImageRatio = "1:1" | "3:4" | "16:9";
export type ProductTypography = "sm" | "base" | "lg";
export type ProductCardShadow = "none" | "soft" | "smooth" | "float" | "deep";
export type ProductCardDetailsLayout = "outer" | "inner";
export type ProductCardTextAlign = "left" | "center";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  img: string;
}

export interface GridItem {
  id: string;
  title: string;
  tag: string;
  price: string;
  image: string;
  badge?: "NEW" | "SALE" | "HOT";
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  badge?: "NEW" | "SALE" | "HOT";
  rating: number;
  reviews: number;
  img: string;
  category: Category;
}

export interface NavbarLink {
  id: string;
  label: string;
  url: string;
}

export interface NavbarSection {
  id: string;
  type: "navbar";
  name: string;
  template: NavbarTemplate;
  background: string;
  text: string;
  iconColor?: string;
  logo: string;
  logoImage?: string;
  sticky?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
  showMenu?: boolean;
  showLinks?: boolean;
  showLogo?: boolean;
  showBrandName?: boolean;
  isFloating?: boolean;
  height?: number;
  borderRadius?: number;
  borderStyle?: "none" | "solid" | "subtle";
  borderColor?: string;
  shadow?: "none" | "subtle" | "float" | "glass";
  backdropBlur?: boolean;
  fontSize?: "sm" | "base" | "lg" | "xl";
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  letterSpacing?: "tight" | "normal" | "wide" | "widest";
  uppercase?: boolean;
  links?: NavbarLink[];
}

export interface HeroSection {
  id: string;
  type: "hero";
  name: string;
  template: HeroTemplate;
  ratio?: HeroRatio;
  background: string;
  slides: string[];
  active: number;
  kicker: string;
  title: string;
  body: string;
  widthMode?: HeroWidth;
  paddingY?: HeroPadding;
  paddingX?: HeroPadding;
  borderRadius?: number;
  animationEffect?: HeroAnimation;
  autoplay?: boolean;
  autoplaySpeed?: number;
}

export interface IntroSection {
  id: string;
  type: "intro";
  name: string;
  kicker: string;
  title: string;
  body: string;
  kickerColor: string;
  background: string;
  text: string;
  template?: "standard" | "centered";
}

export interface GridSection {
  id: string;
  type: "grid";
  name: string;
  template: GridTemplate;
  background: string;
  items: GridItem[];
  imageRatio?: ProductImageRatio;
  borderRadius?: number;
  typography?: ProductTypography;
  borderEnabled?: boolean;
  borderWidth?: number;
  borderColor?: string;
  shadowEnabled?: boolean;
  shadowStyle?: ProductCardShadow;
  cardBackground?: string;
  imageInset?: boolean;
  imageRadius?: number;
  detailsLayout?: ProductCardDetailsLayout;
  textAlign?: ProductCardTextAlign;
  showBadge?: boolean;
  showRating?: boolean;
  showPrice?: boolean;
  showButton?: boolean;
  whatsappNumber?: string;
  currency?: string;
  priceColor?: string;
  buttonColor?: string;
}

export interface FeaturedSection {
  id: string;
  type: "featured";
  name: string;
  title: string;
  subtitle: string;
  background: string;
  template: "grid" | "carousel";
  imageRatio?: ProductImageRatio;
  borderRadius?: number;
  typography?: ProductTypography;
  borderEnabled?: boolean;
  borderWidth?: number;
  borderColor?: string;
  shadowEnabled?: boolean;
  shadowStyle?: ProductCardShadow;
  cardBackground?: string;
  imageInset?: boolean;
  imageRadius?: number;
  detailsLayout?: ProductCardDetailsLayout;
  textAlign?: ProductCardTextAlign;
  showBadge?: boolean;
  showRating?: boolean;
  showPrice?: boolean;
  showButton?: boolean;
  whatsappNumber?: string;
  currency?: string;
  priceColor?: string;
  buttonColor?: string;
  items: GridItem[];
}

export interface CategoryItem {
  id: string;
  name: string;
  image: string;
  count?: string;
}

export interface CategoriesSection {
  id: string;
  type: "categories";
  name: string;
  title: string;
  subtitle?: string;
  background: string;
  template: "cards" | "pills" | "grid";
  items: CategoryItem[];
}

export interface BrandItem {
  id: string;
  name: string;
  tagline?: string;
}

export interface BrandsSection {
  id: string;
  type: "brands";
  name: string;
  title: string;
  subtitle?: string;
  background: string;
  template: "row" | "grid";
  items: BrandItem[];
}

export interface BannerSection {
  id: string;
  type: "banner";
  name: string;
  tag: string;
  title: string;
  description: string;
  buttonText: string;
  buttonAction: "shop" | "whatsapp";
  background: string;
  textColor: string;
  image: string;
  template: "card" | "full" | "split";
}

export interface AboutFeature {
  id: string;
  title: string;
  description: string;
}

export interface AboutSection {
  id: string;
  type: "about";
  name: string;
  kicker: string;
  title: string;
  story: string;
  image: string;
  features: AboutFeature[];
  background: string;
  text: string;
  template: "split" | "story" | "cards";
}

export interface CatalogSection {
  id: string;
  type: "catalog";
  name: string;
  title: string;
  subtitle: string;
  filter: CatalogFilter;
  background: string;
  products: Product[];
  template?: "grid" | "list";
  imageRatio?: ProductImageRatio;
  borderRadius?: number;
  typography?: ProductTypography;
  borderEnabled?: boolean;
  borderWidth?: number;
  borderColor?: string;
  shadowEnabled?: boolean;
  shadowStyle?: ProductCardShadow;
  cardBackground?: string;
  imageInset?: boolean;
  imageRadius?: number;
  detailsLayout?: ProductCardDetailsLayout;
  textAlign?: ProductCardTextAlign;
  showBadge?: boolean;
  showRating?: boolean;
  showPrice?: boolean;
  showButton?: boolean;
  whatsappNumber?: string;
  currency?: string;
  priceColor?: string;
  buttonColor?: string;
}

export interface ProductSection {
  id: string;
  type: "product";
  name: string;
  productName: string;
  price: number;
  rating: string;
  description: string;
  colors: string[];
  color: string;
  sizes: string[];
  size: string;
  gallery: string[];
  image: string;
  background: string;
  template?: "stacked" | "split" | "grid";
  imageRatio?: ProductImageRatio;
  typography?: ProductTypography;
  borderRadius?: number;
  galleryStyle?: "strip" | "dots" | "grid";
  showBadge?: boolean;
  badgeText?: string;
  showRating?: boolean;
  showDescription?: boolean;
  showColors?: boolean;
  showSizes?: boolean;
  showTrustBadges?: boolean;
  whatsappNumber?: string;
  currency?: string;
  buttonText?: string;
  buttonColor?: string;
  stickyButton?: boolean;
  priceColor?: string;
  titleFontSize?: "sm" | "base" | "lg" | "xl";
  titleFontWeight?: "normal" | "medium" | "semibold" | "bold";
}

export interface FooterSection {
  id: string;
  type: "footer";
  name: string;
  template: FooterTemplate;
  brand: string;
  copy: string;
  background: string;
  text: string;
}

export interface BlockSection {
  id: string;
  type: "block";
  name: string;
  kind: "reviews" | "newsletter";
  kicker: string;
  title: string;
  body: string;
  background: string;
  text: string;
  template?: "card" | "minimal";
}

export interface ProductCardSection {
  id: "product-card";
  type: "product-card";
  name: "Product Card";
  imageRatio?: ProductImageRatio;
  borderRadius?: number;
  typography?: ProductTypography;
  borderEnabled?: boolean;
  borderWidth?: number;
  borderColor?: string;
  shadowEnabled?: boolean;
  shadowStyle?: ProductCardShadow;
  cardBackground?: string;
  imageInset?: boolean;
  imageRadius?: number;
  detailsLayout?: ProductCardDetailsLayout;
  textAlign?: ProductCardTextAlign;
  showBadge?: boolean;
  showRating?: boolean;
  showPrice?: boolean;
  showButton?: boolean;
  whatsappNumber?: string;
  currency?: string;
  priceColor?: string;
  buttonColor?: string;
}

export type Section =
  | NavbarSection
  | HeroSection
  | IntroSection
  | GridSection
  | FeaturedSection
  | CategoriesSection
  | BrandsSection
  | BannerSection
  | AboutSection
  | CatalogSection
  | ProductSection
  | FooterSection
  | BlockSection
  | ProductCardSection;

export interface PageModel {
  id: PageId;
  title: string;
  path: string;
  background: string;
  tone: Tone;
  sections: Section[];
}

export type Pages = Record<PageId, PageModel>;

export type SheetKind =
  | "arrange"
  | "themes"
  | "add"
  | "page-color"
  | "navbar-style"
  | "navbar-name"
  | "navbar-color"
  | "navbar-sticky"
  | "navbar-elements"
  | "navbar-layout"
  | "navbar-effects"
  | "navbar-typography"
  | "navbar-links"
  | "navbar-more"
  | "hero-layout"
  | "hero-width"
  | "hero-background"
  | "hero-ratio"
  | "hero-padding"
  | "hero-radius"
  | "hero-animation"
  | "hero-media"
  | "hero-photo"
  | "hero-text"
  | "intro-text"
  | "kicker-color"
  | "grid-layout"
  | "grid-items"
  | "catalog-text"
  | "product-text"
  | "footer-style"
  | "block-text"
  | "section-color"
  | "intro-template"
  | "catalog-template"
  | "product-template"
  | "product-gallery"
  | "product-elements"
  | "product-cta"
  | "product-color"
  | "product-typography"
  | "block-template"
  | "product-card-box"
  | "product-card-image"
  | "product-card-details"
  | "product-card-style"
  | "product-card-badges"
  | "product-card-color"
  | "product-card-cta"
  | "categories-template"
  | "brands-template"
  | "banner-template"
  | "about-template"
  | "featured-template";

export interface Snapshot {
  pages: Pages;
  pageId: PageId;
}
