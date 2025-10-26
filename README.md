# AgriShield - AI-Powered Agricultural Risk Management Platform

## Overview

AgriShield is a comprehensive web application designed to empower India's oilseed farmers through AI-driven yield optimization and price hedging capabilities. The platform provides intelligent forecasting, market insights, virtual forward contracts, and educational resources to help farmers make informed decisions and protect their income from market volatility.

Built as a single-page application (SPA) using React with TypeScript, the platform emphasizes accessibility through multilingual support, mobile-responsive design, and an intuitive user interface tailored for agricultural communities.

## Recent Changes

**October 23, 2025 - Migration to Replit & Enhanced Topbar**
- Successfully migrated project from Lovable to Replit environment
- Configured Vite to run on 0.0.0.0:5000 for Replit compatibility
- Enhanced AppLayout topbar with comprehensive feature set:
  - Live market ticker with real-time price updates and trend indicators
  - Advanced notification center with categorized alerts (weather, price, hedge, contracts, learning)
  - User profile dropdown with avatar, farmer info, and account management
  - Multi-language selector supporting 9 Indian languages
  - Quick search functionality with navigation to contracts, learning modules, and market data
  - Help & support center with FAQs, contact support, and video tutorials
  - Theme toggle for light/dark mode support
  - Fully responsive design with mobile-optimized components

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast hot module replacement
- **React Router DOM** for client-side routing and navigation
- Single-page application (SPA) architecture with lazy loading capabilities

**UI Component System**
- **shadcn/ui** components built on Radix UI primitives for accessible, composable UI elements
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Framer Motion** for smooth animations and transitions
- **@react-spring/web** for physics-based animations
- Custom theme system with light/dark mode support via `next-themes`

**State Management**
- **TanStack Query (React Query)** for server state management, caching, and data synchronization
- React Context API and hooks for local component state
- Form state managed through `react-hook-form` with Zod validation

**Routing Strategy**
- Protected routes wrapped in `AppLayout` component with sidebar navigation
- Public routes for landing, about, and onboarding pages
- Scroll restoration and 404 error handling
- Route-based code splitting (prepared for lazy loading)

### Application Structure

**Core Pages**
- **Landing Page** (`/`) - Marketing homepage with hero section and feature highlights
- **Onboarding** (`/onboarding`) - Multi-step registration flow for farmers and FPOs
- **Dashboard** (`/dashboard`) - Main hub with yield status, weather, prices, and recommendations
- **Yield Intelligence** (`/yield-intelligence`) - AI-powered crop yield predictions and farm monitoring
- **Market Forecast** (`/market-forecast`) - Price predictions and live mandi rates
- **Smart Hedging** (`/hedging`) - Virtual forward contract creation and management
- **Contracts** (`/contracts`) - Contract portfolio and transaction history
- **Learning Center** (`/learning`) - Educational modules with video tutorials and quizzes
- **Profile** (`/profile`) - User and farm information management

**Layout Components**
- `AppLayout` - Main application shell with enhanced topbar, sidebar, and content area
- `AppSidebar` - Collapsible navigation sidebar using shadcn sidebar components
- Enhanced topbar featuring:
  - Live market ticker (MarketTicker.tsx)
  - Quick search bar (SearchBar.tsx)
  - Language selector (LanguageSelector.tsx)
  - Theme toggle (ThemeToggle.tsx)
  - Help & support menu (HelpSupport.tsx)
  - Notification center (NotificationCenter.tsx)
  - User profile dropdown (UserProfileDropdown.tsx)

**Shared Components**
- **ThemeToggle** - Light/dark mode toggle with system preference detection and localStorage persistence
- **NotificationCenter** - Real-time notification system with:
  - Categorized alerts (weather warnings, price changes, hedge recommendations, contract updates, learning modules)
  - Unread badge counter
  - Mark as read functionality
  - Scrollable notification history
- **LanguageSelector** - Multi-language support for:
  - English, Hindi (हिंदी), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Tamil (தமிழ்)
  - Marathi (मराठी), Gujarati (ગુજરાતી), Bengali (বাংলা), Punjabi (ਪੰਜਾਬੀ)
- **SearchBar** - Quick search functionality with:
  - Real-time filtering across contracts, learning modules, and market data
  - Result categorization with icons
  - Click-to-navigate functionality
  - Mobile-responsive (icon button on small screens, full bar on larger screens)
  - Keyboard shortcut support (⌘K)
- **HelpSupport** - Support menu with quick access to:
  - FAQs
  - Contact support
  - Video tutorials
  - Emergency helpline
- **UserProfileDropdown** - User account management with:
  - Avatar with user initials or photo
  - Farmer name and FPO code display
  - Profile page link
  - Settings access
  - Logout functionality
- **MarketTicker** - Live price updates featuring:
  - Auto-rotating commodity prices (Soybean, Mustard, Groundnut)
  - Real-time price change indicators (trending up/down)
  - Color-coded percentage changes (green for positive, red for negative)
  - Responsive visibility (hidden on mobile, shown on large screens)

### Design System

**Color Palette**
- Primary: Green shades (agricultural theme) - HSL(95, 55%, 35%)
- Accent: Warm earth tones - HSL(45, 80%, 55%)
- Semantic colors: Success (green), Warning (yellow), Destructive (red)
- Dark mode variants with adjusted lightness values

**Typography**
- Sans-serif: Inter (body text)
- Display: Playfair Display (headings and hero sections)
- Responsive font scaling with container queries

**Spacing & Layout**
- Container-based responsive design (sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1400px)
- Custom radius variable (0.75rem) for consistent rounded corners
- Grid and flexbox layouts with mobile-first responsive breakpoints

### Animation & Interaction Patterns

**Animation Libraries**
- Framer Motion for component-level animations and page transitions
- React Spring for physics-based micro-interactions
- Custom scroll-triggered animations via Intersection Observer API

**Interactive Elements**
- Hover effects with scale and color transitions
- Tilt card effect using 3D transforms and mouse tracking
- Parallax scrolling for hero sections
- Smooth scroll-to-top functionality
- Glass morphism effects for navigation elements

### Form Handling & Validation

**Form Management**
- `react-hook-form` for performant form state management
- Zod schemas for runtime type validation
- Custom form components with error states and accessibility attributes
- Multi-step forms with progress indication (booking, onboarding)

**Validation Strategy**
- Client-side validation before submission
- Type-safe schema validation with TypeScript inference
- Real-time field-level validation feedback
- Form persistence across navigation (where applicable)

### Code Quality & Development Tools

**TypeScript Configuration**
- Strict mode disabled for gradual adoption
- Path aliases configured (`@/*` maps to `src/*`)
- Separate configs for app and build tooling
- JSX transform for React 17+ automatic runtime

**Linting & Formatting**
- ESLint with TypeScript and React plugins
- React Hooks rules enforcement
- Unused variables warnings suppressed for development flexibility

**Build Optimization**
- Production builds with tree-shaking and minification
- Development mode with component tagging via `lovable-tagger`
- Asset optimization through Vite's built-in plugins
- SWC-based React plugin for faster builds

## External Dependencies

### UI Component Libraries
- **@radix-ui/react-*** - Headless UI primitives (accordion, dialog, dropdown, select, etc.)
- **lucide-react** - Icon library with consistent styling
- **cmdk** - Command menu component for search functionality
- **embla-carousel-react** - Touch-friendly carousel component
- **class-variance-authority** - Utility for managing component variants
- **clsx** & **tailwind-merge** - Conditional className utilities

### Animation & Graphics
- **framer-motion** - Declarative animation library
- **@react-spring/web** - Spring physics-based animations
- **@react-three/fiber** - React renderer for Three.js (prepared for 3D features)

### State Management & Data Fetching
- **@tanstack/react-query** - Server state management with caching and synchronization

### Form & Validation
- **react-hook-form** - Form state management
- **@hookform/resolvers** - Validation resolver adapters
- **zod** (implied via resolvers) - Schema validation
- **input-otp** - OTP input component for phone verification

### Utilities
- **date-fns** - Date manipulation and formatting
- **next-themes** - Theme management with system preference detection

### Styling
- **tailwindcss** - Utility-first CSS framework
- **autoprefixer** - PostCSS plugin for vendor prefixes

### Build & Development
- **vite** - Build tool and dev server
- **@vitejs/plugin-react-swc** - Fast React plugin using SWC
- **typescript** - Type system and compiler
- **eslint** - Linting and code quality
- **lovable-tagger** - Development helper for component tracking

### Third-Party Services (Prepared Integrations)
- **Payment Gateway** - Razorpay API endpoints configured (demo mode)
- **Email Service** - SendGrid-compatible email sending utility
- **SMS Service** - Phone number-based OTP verification system
- **Weather API** - Mock weather data (prepared for integration)
- **Market Data API** - Mock mandi prices (prepared for integration)
- **AI/ML Services** - Placeholder for yield prediction and price forecasting models

### Browser APIs Used
- **Intersection Observer** - Scroll-triggered animations
- **Media Queries** - Responsive breakpoint detection
- **Local Storage** - Theme preference persistence
- **Clipboard API** - Promo code copying functionality
- **Geolocation** (prepared) - User location for regional market data

### Asset Management
- Public assets served from `/lovable-uploads/` directory
- Background images and hero graphics
- Farm and agricultural imagery
- Logo and branding assets

### Development Workflow
- **Lovable** platform integration for AI-assisted development
- Git-based version control
- GitHub integration for deployment
- npm scripts for dev, build, preview, and start commands