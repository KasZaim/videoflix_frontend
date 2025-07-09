# Privacy Policy Component - Responsive Design Implementation

## Goal
Make the privacy policy component responsive with a hamburger menu for mobile devices (< 768px) while keeping the sidenav visible on desktop.

## Todo Items

- [x] Add MatIconModule import to privacy-policy.component.ts
- [x] Add responsive properties (isMobile, sidenavOpened) to component class
- [x] Add HostListener for window resize detection
- [x] Update HTML template for responsive sidenav behavior
- [x] Add hamburger menu button for mobile
- [x] Add responsive CSS for mobile (< 768px) and desktop (≥ 768px)
- [x] Add toggleSidenav() method for mobile menu control
- [ ] Test responsive behavior at different screen sizes

## Implementation Notes
- Keep changes minimal and focused
- Preserve all existing functionality (chapter navigation, back button)
- Follow Material Design responsive patterns
- Ensure content remains accessible on all screen sizes

## Review Section
*To be completed after implementation*