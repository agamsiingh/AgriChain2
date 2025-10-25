# Design Guidelines: Value Chain Integration System for Oilseed By-Products

## Design Approach
**System:** Custom design with agricultural/commodity trading focus, prioritizing data density, trust signals, and operational efficiency. The platform serves a specialized B2B marketplace requiring clear information hierarchy and professional credibility.

## Color System
- **Primary:** #0B6E4F (deep green) - represents agriculture, growth, sustainability
- **Accent:** #F6A800 (warm saffron) - energetic, draws attention to CTAs and important actions
- **Surface/Cards:** #FFFFFF (clean, professional)
- **Muted/Secondary:** #6B7280 (readable secondary text)
- **Danger/Alert:** #E11D48 (errors, urgent actions)
- **Success:** #10B981 (confirmations, positive states)

## Typography System
- **Font Families:** Inter for body/UI, Poppins for headlines
- **Headline:** Poppins, weight 700
- **Body Text:** Inter/system UI, weight 400
- **Scale:**
  - H1: 36px (hero headlines, page titles)
  - H2: 28px (section headers)
  - H3: 20px (card titles, subsections)
  - Body: 16px (standard text)
  - Small: 13px (metadata, captions)

## Layout & Spacing
- **Base Unit:** 8px (Tailwind default spacing scale)
- **Common Spacing:** Use Tailwind units 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- **Container Max-Width:** 1280px (max-w-7xl) for main content areas
- **Card Padding:** p-6 (24px) for standard cards, p-8 (32px) for feature cards
- **Section Spacing:** py-12 to py-20 for vertical section separation

## Component Library

### Core UI Elements
- **Button:** Rounded corners (rounded-lg), solid primary background, white text, hover lift effect (translateY -2px), disabled state with reduced opacity
- **IconButton:** Circular or square with icon centering, subtle background on hover
- **Input/Select:** Border with focus ring in primary color, clear error/success states
- **Modal:** Centered overlay with backdrop blur, slide-in animation from bottom, max-width constraint
- **Card:** White background, subtle shadow (shadow-md), hover depth increase (shadow-lg), rounded-xl corners
- **Table:** Striped rows, sticky header, hover highlight on rows
- **Tag/Badge:** Small rounded pills for categories, status indicators with semantic colors
- **Toast:** Slide in from top-right, auto-dismiss after 5s, success/error/info variants

### Composite Components
- **ListingCard:** Product image, title, key specs (grade, quantity, price), seller info with rating, location badge, CTA button
- **MarketplaceFilters:** Collapsible sidebar with multi-select chips, range sliders, location radius picker
- **MapView:** Full-width Leaflet map with custom markers for listings, cluster groups for density
- **PriceChart:** Recharts line/area chart with tooltips, brush selector for zoom, toggle between timeframes
- **IoTFeedCard:** Real-time data display with animated value updates, status indicators (green/yellow/red), timestamp
- **OrderTimeline:** Vertical stepper showing negotiation → escrow → payment → delivery stages with progress indicators
- **EscrowWidget:** Two-panel interface showing escrow creation and blockchain confirmation progress with animated states

## Page-Specific Layouts

### Landing Page
- **Hero Section:** Full viewport height with background gradient (green tones), large headline (H1), compelling tagline, three animated CTA tiles floating upward on load
- **Value Proposition:** Three-column grid showcasing platform benefits with icons and short descriptions
- **How It Works:** Step-by-step visual flow with numbered stages
- **Trust Signals:** Logos/statistics row showing user count, transactions, verified partners
- **Footer:** Comprehensive with links, contact info, social media

### Dashboard (Role-Specific)
- **Header Bar:** Real-time ticker marquee showing price updates, notification bell, profile menu
- **Metrics Grid:** 4-column layout on desktop (2 on tablet, 1 on mobile) with KPI cards showing total listings, active orders, revenue, pending actions
- **Charts Section:** Price trends, volume charts side-by-side
- **Recent Activity:** Table or card list of latest transactions/listings
- **Quick Actions:** Floating action button for "Create Listing" or role-specific primary action

### Marketplace
- **Filter Sidebar:** Left-aligned, 280px width, collapsible on mobile, sticky on scroll
- **View Toggles:** Card/List/Map view switcher in header
- **Grid Layout:** 3 columns on desktop, 2 on tablet, 1 on mobile for card view
- **Empty States:** Centered illustration with helpful microcopy and CTA

### Product Detail
- **Image Gallery:** Large primary image with thumbnail strip, zoom capability
- **Specs Panel:** Right-aligned sidebar with quality metrics, IoT data widget, seller profile
- **Action Zone:** Sticky footer bar on mobile with "Propose Offer" and "Start Escrow" buttons
- **Negotiation Chat:** Embedded chat widget that expands from bottom-right

### Analytics Dashboard
- **Chart Canvas:** Full-width forecast chart with confidence bands as shaded area
- **Controls:** Top bar with date range picker, product selector, export buttons (CSV/PDF)
- **Volatility Heatmap:** Grid-based visualization with color intensity for risk levels
- **Recommendation Card:** Prominent card with AI-generated suggestion (Hold/Sell/Export)

## Animations & Micro-Interactions
- **Page Load:** Stagger entrance for hero CTAs (0.1s delay between each), fade-in for cards
- **Card Hover:** Lift effect (translateY -6px), shadow increase, scale 1.02
- **Transaction Confirmation:** Animated progress bar through 3 confirmations, confetti burst on final confirmation
- **Real-time Ticker:** Smooth horizontal scroll with pause on hover
- **Loading States:** Skeleton loaders matching card layouts, shimmer effect
- **Toast Notifications:** Slide in from top-right with spring animation
- **Modal Entry:** Backdrop fade-in, content slide-up with ease-out

## Data Visualization
- **Charts:** Recharts with custom tooltips, smooth curve interpolation, grid lines for readability
- **Maps:** Leaflet with OpenStreetMap tiles, custom green markers, cluster groups, radius circle overlay for location filters
- **Progress Indicators:** Circular for percentages, linear bars for multi-step processes

## Accessibility Requirements
- **Color Contrast:** Minimum 4.5:1 for body text, 3:1 for large text
- **Keyboard Navigation:** Visible focus outlines (2px ring in primary color), logical tab order
- **ARIA Labels:** All icons have aria-label, buttons have aria-pressed states, modals have aria-modal
- **Alt Text:** Descriptive alt text for all images, especially product photos
- **Focus Management:** Trap focus in modals, return focus on close

## Responsive Breakpoints
- **Mobile:** < 768px - single column, bottom navigation, collapsible filters
- **Tablet:** 768px - 1024px - two columns, sidebar toggles
- **Desktop:** > 1024px - full multi-column layouts, persistent sidebars

## Microcopy Examples
- Landing tagline: "Monetize every seed: connect, trade, forecast."
- CTA: "Propose Offer" / "Start Escrow" / "Attach Sensor"
- Empty state: "No listings yet — create your first listing in 60 seconds."
- Error toast: "Unable to connect to market feed — simulated feed offline."
- Success: "Listing published! Your soymeal is now visible to 2,400+ buyers."

## Images
**Hero Section:** Large agricultural imagery showing oilseed processing or farming (golden grain fields, processing facilities), with dark overlay for text contrast
**Product Listings:** Actual product photos showing soymeal, sunflower cake, husk samples in bulk
**Empty States:** Simple SVG illustrations of clipboard, checkmark, or relevant agricultural icons
**Seller Profiles:** Professional headshots or company logos