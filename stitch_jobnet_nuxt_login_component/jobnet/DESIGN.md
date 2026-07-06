---
name: JobNet
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#464555'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#3130c0'
  on-tertiary: '#ffffff'
  tertiary-container: '#4b4dd8'
  on-tertiary-container: '#d9d8ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  2xl: 3rem
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
---

## Brand & Style
The design system is built for a professional recruitment ecosystem, balancing high-performance utility with a welcoming, accessible atmosphere. The brand personality is **reliable, forward-thinking, and empowering**, designed to instill confidence in both job seekers and recruiters.

The visual style follows a **Modern Minimalist** approach. It prioritizes clarity and functional white space to reduce cognitive load during complex tasks like resume building or applicant tracking. This is augmented by a **Tactile Softness**—using subtle shadows and generous corner radii to make the interface feel approachable and human, rather than sterile or overly corporate.

## Colors
The palette is centered around **Indigo (Primary)** to signal trust and industry authority, and **Emerald (Secondary)** to highlight success states and growth-related actions (e.g., "Apply Now" or "Hired"). 

- **Primary (#4F46E5):** Used for main actions, navigation states, and brand-heavy elements.
- **Secondary (#10B981):** Reserved for positive reinforcement, "Success" messaging, and secondary conversion points.
- **Neutral/Text:** A slate-based hierarchy ensures high legibility. **#1E293B** provides deep contrast for headers, while **#64748B** softens metadata and supporting descriptions.
- **Backgrounds:** A cool-toned off-white (**#F8FAFC**) prevents screen glare, while pure white (**#FFFFFF**) is used exclusively for cards and containers to create a distinct visual "lift."

## Typography
This design system utilizes **Manrope** for its modern, geometric construction and exceptional legibility across digital interfaces. It strikes a balance between professional and friendly.

- **Headlines:** Use tighter letter-spacing and heavier weights (700-800) to create a strong visual anchor.
- **Body Text:** Standardized on 16px for optimal reading on desktop, with 14px for denser dashboard views.
- **Labels:** Used for buttons, tags, and small UI metadata. The `label-sm` utilizes uppercase styling to differentiate technical information from narrative content.
- **Mobile Scaling:** Large headlines scale down significantly to ensure content remains above the fold on smaller devices.

## Layout & Spacing
The design system employs a **12-column fluid grid** for desktop and a **single-column vertical stack** for mobile. 

- **Spacing Rhythm:** Based on a 4px baseline grid. All margins and paddings should be increments of 4 (4, 8, 16, 24, 32, 48).
- **Desktop:** 12 columns, 24px gutters, max-width of 1280px. Content is centered.
- **Tablet:** 8 columns, 16px gutters, 24px side margins.
- **Mobile:** 4 columns, 16px gutters, 16px side margins.
- **Philosophy:** Use generous padding (`2xl`) to separate major sections, while using tight spacing (`sm`) to group related inputs or metadata.

## Elevation & Depth
This design system uses **Tonal Layering** and **Ambient Shadows** to communicate hierarchy. 

1.  **Level 0 (Base):** The background color (#F8FAFC).
2.  **Level 1 (Cards):** Pure white (#FFFFFF) with a very soft, diffused shadow (0px 4px 6px -1px rgba(0, 0, 0, 0.05)). Used for job listings and profile cards.
3.  **Level 2 (Dropdowns/Modals):** Pure white with a deeper, more pronounced shadow (0px 10px 15px -3px rgba(0, 0, 0, 0.1)).
4.  **Interaction:** Buttons should appear to "lift" slightly on hover using a medium shadow, and "depress" (removing shadow) when clicked to mimic physical feedback.

## Shapes
The shape language is **Rounded**, favoring organic and soft forms to reduce the formality of the job-seeking process. 

- **Standard Elements:** Buttons, input fields, and small cards use a **0.5rem (8px)** radius.
- **Large Containers:** Large dashboard panels and modal windows use **1rem (16px)** to emphasize their containment.
- **Pills:** Status indicators (e.g., "Full-time", "Remote") use a fully rounded/pill-shaped radius to distinguish them from actionable buttons.

## Components
- **Buttons:** Primary buttons use the Indigo background with white text. Secondary buttons use a subtle Indigo tint background or an outline. Use "Large" (48px height) for CTAs and "Medium" (40px) for standard forms.
- **Input Fields:** Use #F1F5F9 for the background with a 1px border. On focus, the border transitions to Primary Indigo with a soft blue outer glow.
- **Chips/Badges:** Small, rounded-pill containers for job tags. Use Secondary Emerald for "Active" statuses and Neutral Slate for metadata like "Years of Experience."
- **Cards:** The core of the JobNet experience. Every card must have a white background, 8px radius, and a Level 1 shadow. Ensure 24px internal padding for a "breathable" look.
- **Checkboxes/Radios:** Use the Primary Indigo for the "checked" state. Ensure the hit area is at least 44x44px for mobile accessibility.
- **Progress Indicators:** Use the Secondary Emerald for "Profile Completion" bars to encourage a sense of positive momentum.