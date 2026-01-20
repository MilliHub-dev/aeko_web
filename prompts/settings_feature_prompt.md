# Settings Feature Development Prompt

## Overview
Build a comprehensive, responsive settings application for a web app that mirrors the mobile screens provided. The implementation should be production-ready with proper form handling, validation, state management, and security considerations.

## Core Features to Implement

### 1. Main Settings Hub
- Organized section grouping:
  - **Wallet Settings**: Link to wallet configuration with description and "Learn more" CTA
  - **Account & Profile**: Profile editing, password management, logout, and account deletion
  - **Privacy & Security**: Account visibility, follower restrictions, blocked users, 2FA, login activity
  - **Aeko Ads**: Ad preferences and promotion settings
- Consistent navigation with back button and section headers
- Hierarchical menu structure with chevron indicators

### 2. Account & Profile Section

#### Edit Profile Screen
- Editable profile information:
  - Profile picture with upload overlay and edit button
  - Cover/banner image with edit functionality
  - Name field (text input)
  - Username field (text input)
  - Email field (text input, read-only or editable)
  - Bio field (textarea with character counter, max 276 characters)
- Image upload menu with options:
  - Change Profile Image
  - Change Cover Picture
  - Upload photo
  - Add to story
- Update Changes button at bottom
- Real-time character counter for bio field

#### Change Password Screen
- Three password input fields:
  - Current Password (with validation)
  - New Password (with visibility toggle)
  - Confirm New Password (with visibility toggle)
- Form validation showing:
  - "Password Incorrect" error (red border, error message)
  - "Password do not match" error (red border, error message)
  - Forget password link
- Eye icon toggle to show/hide passwords
- Update Password button (disabled until form is valid)
- Real-time validation feedback

#### Contact Support Screen
- Introduction text: "Our team is here to help. We typically within 24 hours."
- Three contact method cards:
  - In-App messaging
  - Email Support
  - Report a Problem
- Direct message section with:
  - Subject input field (with placeholder)
  - Description textarea (with placeholder)
  - Add Screenshot functionality (optional upload)
- Submit Ticket button

### 3. Privacy & Security Section

#### Login Activity Screen
- "Where you've logged in" section showing:
  - Device name (e.g., "iPhone 14 Pro Max")
  - Location and status (e.g., "Lagos, Nigeria. Active Now")
  - Individual logout buttons for each session
  - Log out from all devices button
- Security recommendations section:
  - Review Login Activity Regularly (with description)
  - Enable Two-Factor Authentication (with description)
  - Use a strong, unique password (with description)
- Interactive card design with icons

#### Two-Factor Authentication (2FA)
- Toggle switch to enable/disable
- Setup instructions and benefits explanation
- Recovery codes display and download option
- Backup phone number configuration

#### Private Account Toggle
- Toggle switch for account privacy
- Settings visibility options when enabled

#### Who Can See My Post
- Radio button selection for visibility levels:
  - Everyone (default) - "Aeko users can see your posts"
  - Followers Only - "Only your followers can see your post"
  - Mutual Friends - "Only your mutuals can see your posts"
  - Custom - "Select specific people"
- Save button to confirm changes
- Selected option highlighted with teal border

#### Blocked Users
- List of blocked users
- Unblock buttons for each user
- Empty state messaging if no users blocked

### 4. Language & Localization

#### Language Selection
- Search input to filter languages
- Language list with globe icon:
  - English (selected by default, checkmark indicator)
  - العربية (Arabic)
  - Español
  - Français
  - 中国人 (Chinese)
  - Yoruba
  - Hausa
  - Igbo
- Search functionality for quick language finding
- Region selection (e.g., Nigeria)

#### Font Size Settings
- Slider or button-based size selection:
  - Small
  - Normal (default)
  - Large
  - Extra Large
- Live preview of selected size

### 5. Push Notifications

#### Notification Preferences
- Toggleable notification categories:
  - Likes & Reaction (enabled by default)
  - Comments (disabled)
  - New Followers (enabled)
  - Mention & Tags (disabled)
  - Messages (enabled)
  - Wallet & Updates (disabled)
  - Security Alerts (enabled)
  - System Announcement (enabled)
- Smart Control section:
  - Quiet Mode (pause notifications temporarily, enabled)
  - Priority Only Mode (only important alerts like security updates)
- Toggle switches with teal color for enabled state

### 6. Theme Selection

#### Theme Settings
- Visual theme preview cards:
  - Light theme (white background preview)
  - Dark theme (dark background preview)
  - Default/System theme (split preview showing both, selected by default)
- Radio button selection
- Selected theme highlighted with teal border
- Immediate application of theme change

### 7. Account Management

#### Log Out
- Confirmation modal with:
  - Title: "Are you sure you want to log out?"
  - Subtitle: "You'll be returned to the welcome screen"
  - Log out button (teal)
  - Login to Existing Account button
  - Cancel button
- Loading state during logout process

#### Delete Account
- Destructive action modal with:
  - Warning icon (red circle with exclamation)
  - Title: "Deleting your account is permanent"
  - Description: "Your profile, coins, and NFTs will be lost."
  - Deactivate Account button (secondary action)
  - Delete Account button (red/destructive)
  - Cancel button
- Confirmation step to prevent accidental deletion
- Requires password verification for security

### 8. Help Center

#### Help Center Screen
- Search functionality ("Search for help...")
- Collapsible FAQ Categories:
  - Account (expanded by default)
    - Description: "Find answers related to your profile setup, notification preferences, and account settings..."
  - Wallet
  - Posting
  - Security
  - Ads
- Contact Support link at bottom
- Accordion-style expandable sections

### 9. Privacy Policy & Terms

#### Privacy Policy Screen
- Full policy text with sections:
  - Welcome introduction
  - Jump to section dropdown menu
  - Numbered sections (Data Usage, Wallet Information, Cookies & Tracking, App Permissions)
- Terms of Service link at bottom
- Last updated timestamp and version number
- Scrollable content

## Technical Requirements

### Architecture
- React with TypeScript for type safety
- Proper component structure with separation of concerns
- Context API or state management (Redux, Zustand) for:
  - User settings and preferences
  - Form state management
  - Modal/dialog state
  - Theme and localization
- Custom hooks for form handling and validation

### Form Handling & Validation
- Real-time validation with error messaging
- Password strength indicator
- Character counters for text areas
- Field-level and form-level validation
- Debounced validation for better performance
- Clear error messages and success feedback
- Prevent submission of invalid forms

### Responsive Design
- Mobile-first approach
- Tablet and desktop breakpoints
- Settings reorganization for larger screens (sidebar navigation option)
- Full-width optimized layouts

### State Management
- Track user settings (language, theme, notifications)
- Form draft management (preserve unsaved changes)
- Modal/dialog states
- Loading and error states for async operations
- Success notifications after updates

### UI/UX Patterns
- Smooth page transitions and animations
- Loading spinners for async operations
- Toast notifications for confirmations and errors
- Confirmation modals for destructive actions
- Toggle switches with smooth animations
- Accordion components for FAQ sections
- Radio button groups for selections
- Modal overlays with proper backdrop
- Back navigation with state preservation

### Accessibility
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management in modals
- Semantic HTML structure
- Color contrast compliance (WCAG 2.1 AA)
- Screen reader friendly toggle switches and radio buttons

### Security Considerations
- Password fields with proper masking
- No sensitive data in browser history
- CSRF protection for form submissions
- Secure password validation requirements
- Session management for logout
- Account deletion confirmation

### Features

#### Password Management
- Show/hide toggle for password fields
- Password strength indicator
- Match validation between fields
- Prevent common weak passwords
- Clear error feedback

#### Image Upload
- File type validation (JPG, PNG, etc.)
- File size validation
- Image preview before upload
- Progress indicator during upload
- Error handling for failed uploads
- Drag-and-drop support (optional)

#### Notification System
- Toast notifications for success/error messages
- Dismissible alerts
- Auto-dismiss with timeout
- Stack multiple notifications

#### Search Functionality
- Real-time search filtering
- Debounced search input
- Search result highlighting
- Clear results button

#### Theme & Localization
- Persist user preferences to localStorage (or backend)
- Apply theme changes immediately
- Language translations for all UI text
- RTL support for Arabic and other right-to-left languages
- Regional date and number formatting

## Design System

### Colors
- Primary: Teal/Green (#1A9B7C or similar) for active states and CTAs
- Secondary: Light gray (#F5F5F5) for backgrounds
- Error: Red (#FF5252 or similar) for destructive actions and errors
- Success: Green for confirmations
- Text: Dark gray (#333333) for primary text
- Disabled: Light gray for disabled states

### Components
- Consistent card/section styling
- Rounded corners (8-12px)
- Proper spacing and padding
- Icon system for visual hierarchy
- Button variants (primary, secondary, tertiary, destructive)
- Input field styling with focus states
- Toggle switch styling

### Typography
- Clear hierarchy with varying font sizes
- Consistent font family throughout
- Readable line heights
- Monospace for technical values (wallet addresses, etc.)

## Deliverables

1. Complete settings dashboard with all sections
2. Edit profile functionality with image upload
3. Change password with validation
4. Contact support form with screenshot upload
5. Privacy and security settings (login activity, 2FA, account visibility)
6. Language and theme selection
7. Notification preferences with smart controls
8. Help center with FAQ accordion
9. Account deletion and logout flows
10. Privacy policy and terms of service pages
11. Responsive design across all breakpoints
12. Form validation and error handling
13. Confirmation modals for destructive actions
14. Toast notifications for user feedback
15. TypeScript typing throughout
16. Proper accessibility implementation
17. Component documentation

## Success Criteria
- All settings screens are fully interactive and functional
- Form validation prevents invalid submissions
- Password changes are secure with proper confirmation
- Theme and language changes apply immediately
- Destructive actions require confirmation
- User preferences persist across sessions
- Responsive behavior matches design across breakpoints
- No console errors or warnings
- Accessibility standards met (WCAG 2.1 AA minimum)
- Loading states show during async operations
- Error handling with clear user feedback
- Code is clean, maintainable, and well-documented