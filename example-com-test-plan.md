# Example.com Test Plan

## Application Overview

Example.com is a reference domain provided by IANA for use in documentation examples. The site contains a single page with informational content about the domain and a link to IANA's documentation. The test plan covers page load, content validation, navigation, accessibility, and edge cases.

## Test Scenarios

### 1. Page Load and Structure

**Seed:** `tests/seed.spec.ts`

#### 1.1. Page loads successfully with correct title

**File:** `tests/example-com/page-load.spec.ts`

**Steps:**
  1. Navigate to https://example.com
    - expect: Page loads successfully
    - expect: Page title is 'Example Domain'
    - expect: HTTP status code is 200
  2. Verify page is not blank
    - expect: Main heading is visible
    - expect: Content text is displayed

#### 1.2. Page displays semantic HTML structure

**File:** `tests/example-com/page-structure.spec.ts`

**Steps:**
  1. Navigate to https://example.com
    - expect: Page HTML is semantic and well-formed
  2. Verify main heading is h1 element
    - expect: H1 heading with text 'Example Domain' is present
  3. Verify content uses paragraph elements
    - expect: Multiple p elements for content paragraphs are present

### 2. Content Validation

**Seed:** `tests/seed.spec.ts`

#### 2.1. Page displays correct heading text

**File:** `tests/example-com/content-heading.spec.ts`

**Steps:**
  1. Navigate to https://example.com
    - expect: Page displays
  2. Locate the main heading
    - expect: Heading text is exactly 'Example Domain'
    - expect: Heading is visible and readable

#### 2.2. Page displays correct informational paragraphs

**File:** `tests/example-com/content-paragraphs.spec.ts`

**Steps:**
  1. Navigate to https://example.com
    - expect: Page displays
  2. Locate first paragraph
    - expect: First paragraph contains text 'This domain is for use in documentation examples without needing permission'
    - expect: Text is visible and readable
  3. Locate second paragraph
    - expect: Second paragraph contains the 'Learn more' link
    - expect: Paragraph text is visible

#### 2.3. Verify no typos or formatting issues in content

**File:** `tests/example-com/content-typos.spec.ts`

**Steps:**
  1. Navigate to https://example.com
    - expect: Page displays
  2. Read all visible text content
    - expect: Text is properly formatted with correct capitalization
    - expect: No obvious typos are present
    - expect: Text is properly spaced and aligned

### 3. Link Navigation

**Seed:** `tests/seed.spec.ts`

#### 3.1. Learn more link is clickable

**File:** `tests/example-com/link-clickable.spec.ts`

**Steps:**
  1. Navigate to https://example.com
    - expect: Page displays with Learn more link visible
  2. Verify link has proper cursor styling
    - expect: Link displays pointer cursor on hover
  3. Observe link appearance
    - expect: Link is styled as a hyperlink (underlined and colored)

#### 3.2. Learn more link navigates to correct URL

**File:** `tests/example-com/link-navigation.spec.ts`

**Steps:**
  1. Navigate to https://example.com
    - expect: Page displays
  2. Click the 'Learn more' link
    - expect: Navigation occurs to https://iana.org/domains/example
    - expect: New page loads in a reasonable time

#### 3.3. Link opens in same tab by default

**File:** `tests/example-com/link-target.spec.ts`

**Steps:**
  1. Navigate to https://example.com
    - expect: Page displays
  2. Inspect the Learn more link element
    - expect: Link does not have target='_blank' attribute
    - expect: Link opens in current window

### 4. Navigation and History

**Seed:** `tests/seed.spec.ts`

#### 4.1. Browser back button works after external navigation

**File:** `tests/example-com/browser-back.spec.ts`

**Steps:**
  1. Navigate to https://example.com
    - expect: Example.com page displays
  2. Click the Learn more link
    - expect: Navigates to IANA page
  3. Click browser back button
    - expect: Returns to https://example.com
    - expect: Page content is displayed

#### 4.2. Page can be refreshed

**File:** `tests/example-com/page-refresh.spec.ts`

**Steps:**
  1. Navigate to https://example.com
    - expect: Page displays with all content
  2. Refresh the page
    - expect: Page reloads successfully
    - expect: All content is displayed again
    - expect: Page title remains 'Example Domain'

#### 4.3. Direct URL navigation works

**File:** `tests/example-com/direct-navigation.spec.ts`

**Steps:**
  1. Navigate directly to https://example.com/ using full URL
    - expect: Page loads successfully
    - expect: Title is 'Example Domain'
  2. Navigate to https://example.com without trailing slash
    - expect: Page loads successfully
    - expect: Redirects to https://example.com/ or displays same content

### 5. Accessibility and Usability

**Seed:** `tests/seed.spec.ts`

#### 5.1. Page is keyboard navigable

**File:** `tests/example-com/keyboard-nav.spec.ts`

**Steps:**
  1. Navigate to https://example.com
    - expect: Page displays
  2. Press Tab key to navigate to the Learn more link
    - expect: Link becomes focused and receives visual focus indicator
  3. Press Enter key
    - expect: Link is activated and navigates to IANA page

#### 5.2. Content is readable and accessible

**File:** `tests/example-com/accessibility.spec.ts`

**Steps:**
  1. Navigate to https://example.com
    - expect: Page displays
  2. Verify text contrast and readability
    - expect: Text has sufficient contrast against background
    - expect: Text is readable at normal viewport size
    - expect: Font size is adequate
  3. Verify all interactive elements are labeled
    - expect: Link has descriptive text 'Learn more'

#### 5.3. Page is responsive on different viewport sizes

**File:** `tests/example-com/responsiveness.spec.ts`

**Steps:**
  1. Navigate to https://example.com
    - expect: Page displays on desktop viewport (1920x1080)
  2. Resize viewport to tablet size (768x1024)
    - expect: Content is readable and properly formatted
    - expect: No horizontal scrolling is required
  3. Resize viewport to mobile size (375x667)
    - expect: Content is readable and properly formatted
    - expect: No horizontal scrolling is required
    - expect: All interactive elements are accessible

### 6. Error Handling and Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 6.1. Page handles favicon.ico 404 gracefully

**File:** `tests/example-com/favicon-handling.spec.ts`

**Steps:**
  1. Navigate to https://example.com
    - expect: Page loads without errors or broken indicators
    - expect: Missing favicon does not prevent page from displaying
  2. Verify page console for errors
    - expect: No critical JavaScript errors are logged
    - expect: Favicon 404 is not blocking page functionality

#### 6.2. Page handles network latency

**File:** `tests/example-com/network-latency.spec.ts`

**Steps:**
  1. Navigate to https://example.com
    - expect: Page loads and displays content
  2. Simulate slow network conditions
    - expect: Page eventually loads all content
    - expect: Content is readable during load

#### 6.3. Clicking link multiple times doesn't cause issues

**File:** `tests/example-com/multiple-clicks.spec.ts`

**Steps:**
  1. Navigate to https://example.com
    - expect: Page displays
  2. Rapidly click the Learn more link multiple times
    - expect: Navigation occurs to IANA page
    - expect: No errors or unexpected behavior occurs
