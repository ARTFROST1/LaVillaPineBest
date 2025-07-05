# Guest House Website

## Overview

This is a static website for a guest house rental business, built with HTML, CSS, and JavaScript. The site is designed in Russian and provides information about a guest house rental service with modern design and interactive features. The website includes multiple pages showcasing the property, amenities, photo gallery, contact information, and booking functionality.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Pure HTML5, CSS3, and Vanilla JavaScript
- **Design Pattern**: Multi-page static website with modular CSS and JavaScript components
- **Responsive Design**: Mobile-first approach using CSS Grid and Flexbox
- **Font System**: Inter font family from Google Fonts
- **Icon System**: Font Awesome 6.4.0 for consistent iconography

### File Structure
- **HTML Pages**: 5 main pages (index, about, gallery, contacts, booking)
- **CSS Organization**: 
  - `style.css` - Main stylesheet with CSS custom properties
  - `carousel.css` - Carousel component styles
  - `gallery.css` - Gallery-specific styles
- **JavaScript Modules**:
  - `main.js` - Core functionality and navigation
  - `carousel.js` - Image carousel functionality
  - `gallery.js` - Photo gallery with filtering and lightbox
  - `contact-form.js` - Form handling and validation

## Key Components

### Navigation System
- Responsive navigation bar with mobile hamburger menu
- Scroll-based navbar styling changes
- Active page highlighting
- Mobile-friendly dropdown menu

### Image Management
- **Carousel Component**: Auto-playing image slider with manual controls
- **Gallery System**: Filterable photo gallery with grid/slider view toggle
- **Lightbox**: Full-screen image viewing with keyboard navigation
- **External Images**: Uses Pixabay CDN for placeholder images

### Form Handling
- Contact form with client-side validation
- Phone number masking and formatting
- Date validation for booking forms
- Privacy agreement checkbox handling

### Interactive Features
- Smooth scrolling navigation
- Scroll-to-top functionality
- Animated elements on scroll
- Touch/swipe navigation for mobile devices

## Data Flow

### Static Content Flow
1. HTML pages serve as content containers
2. CSS variables provide consistent theming
3. JavaScript modules enhance interactivity
4. External APIs (Google Fonts, Font Awesome, Yandex Maps) provide resources

### User Interaction Flow
1. User navigates between pages via main navigation
2. Interactive components (carousel, gallery, forms) respond to user input
3. Form submissions trigger validation and feedback
4. Mobile users get touch-optimized interactions

## External Dependencies

### CDN Resources
- **Google Fonts**: Inter font family for typography
- **Font Awesome**: Version 6.4.0 for icons
- **Pixabay**: Image hosting for property photos
- **Yandex Maps**: API integration for location display (requires API key)

### Browser APIs
- **DOM Manipulation**: Native JavaScript for component functionality
- **Local Storage**: Potential for form data persistence
- **Touch Events**: Mobile gesture support
- **Intersection Observer**: Scroll-based animations

## Deployment Strategy

### Static Hosting Ready
- Pure static files suitable for any web server
- No server-side processing required
- Can be deployed to:
  - GitHub Pages
  - Netlify
  - Vercel
  - Traditional web hosting
  - CDN services

### Performance Optimizations
- CSS custom properties for efficient theming
- Modular JavaScript for code splitting
- External image optimization via CDN
- Minimal dependencies for fast loading

### Configuration Requirements
- Yandex Maps API key needed for maps functionality
- Image URLs may need updating for production
- Contact form requires backend integration for actual submission

## Recent Changes

- ✓ Updated all page titles and navigation to "La Villa Pine" branding
- ✓ Incorporated specific property details: two loft-style houses, LED saunas, individual heated pools
- ✓ Added detailed amenities: forest with squirrels, stream, mineral springs, spa complex
- ✓ Created new services section highlighting nearby restaurant, coffee shop, reception desk
- ✓ Updated hero section with accurate distance information (20 min to city, 30 min to mountains)
- ✓ Enhanced footer descriptions across all pages
- ✓ Added CSS styling for new services grid section

## Changelog

```
Changelog:
- July 05, 2025. Initial setup
- July 05, 2025. Updated branding and content to match La Villa Pine property description
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```