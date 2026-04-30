# Campus Nest - Web App Implementation Plan

We will build the "Campus Nest" web app using React and Vite, focusing heavily on the requested "Antigravity UI" theme. The app will feature a dark space-inspired aesthetic with glassmorphism, floating elements, and smooth animations.

## User Review Required

> [!IMPORTANT]
> Please review this plan. Are there any specific libraries you would prefer me to use (e.g., `framer-motion` for complex animations, or should I stick entirely to Vanilla CSS animations)? I plan to use Vanilla CSS for the core theme and animations as per the general guidelines, but React Router for navigation. 

## Open Questions

1. Do you want the Map View to integrate with a real mapping library like `leaflet` or `react-map-gl`, or should it be a visually stunning simulated map interface for the purpose of the UI design?
2. Should the listings data be mocked entirely, or do you have a specific JSON structure you'd like me to follow?

## Proposed Changes

### Core Setup & Architecture
- Initialize the project using Vite with the React template in the current directory (`c:\Users\rm427\Downloads\Roomly`).
- Install `react-router-dom` for handling multi-page routing.
- Install `lucide-react` for crisp, modern icons.

### Global Design System (Vanilla CSS)
#### [MODIFY] `src/index.css`
- Import **Space Grotesk** and **Inter** from Google Fonts.
- Define CSS custom properties for the Antigravity theme:
  - Backgrounds: `#0a0f1e` (navy), `#080c14` (black).
  - Accents: `#7c3aed` (violet), `#06b6d4` (cyan).
- Create utility classes for:
  - Glassmorphism (`.glass-panel`, `.glass-card`).
  - Floating animations (`@keyframes float`, `@keyframes pulse-glow`).
  - Glowing borders and layered box shadows.

### App Components
#### [NEW] `src/components/ParticleBackground.jsx`
- A background component rendering slow-drifting soft orbs and particles.
#### [NEW] `src/components/Navbar.jsx`
- Floating glass navigation bar with links to the different pages.
#### [NEW] `src/components/RoomCard.jsx`
- Reusable glass card for room listings, featuring floating animations, glowing hover states, and details (price, distance, amenities).

### Pages
#### [NEW] `src/pages/Landing.jsx`
- Hero section: "Find Your Space Near Campus" with 3D-style drifting cards.
- Floating search bar with college selector.
- Glowing CTA button.
#### [NEW] `src/pages/Listings.jsx`
- Grid layout of `RoomCard` components.
- Floating filter bar at the top.
#### [NEW] `src/pages/MapView.jsx`
- Dark-themed map interface with custom violet floating pins.
- Slide-in side panel for listing details.
#### [NEW] `src/pages/PostListing.jsx`
- Center-screen floating form card.
- 3-step wizard with glassmorphism input fields.
#### [NEW] `src/pages/RoomDetail.jsx`
- Full-width hero image with an overlapping floating info card.
- Reviews section and a pulsating "Contact Landlord" button.

#### [MODIFY] `src/App.jsx`
- Set up React Router and include all the created pages and the `ParticleBackground` so it persists across routes.

### Assets Generation
- Use the image generation tool to create premium, futuristic mock images for room interiors to populate the cards and detail pages, ensuring the app looks complete and "wow" worthy.

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure the project compiles successfully.
- Start the dev server using `npm run dev` and verify that the application renders without errors.

### Manual Verification
- Manually click through all routes (Landing -> Listings -> Map View -> Room Detail -> Post Listing) to ensure navigation works perfectly.
- Visually inspect the UI against the "Antigravity" theme requirements: confirm dark backgrounds, glassmorphism blur, floating animations, and the violet/cyan color scheme.
