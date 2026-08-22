# Playwright Project Conventions

## General
- Use JavaScript
- Use Playwright Test
- Prefer async/await
- Keep tests deterministic
- Group tests using test.describe

## Naming (STRICT)

### Page Objects
- Use PascalCase for file names
- Format: `<PageName>Page.js`
- ALWAYS suffix with `Page`
- NEVER use `.page.js` or kebab-case

Examples:
- BookingDetailsPage.js
- LoginPage.js

### Tests
- Use: `*.spec.js`

## Class Naming
- Class name MUST match file name
- Use PascalCase

Example:
File: BookingDetailsPage.js  
Class: BookingDetailsPage

## POM Rules
- One class per page
- Never use assertions inside POM
- Only expose user-facing actions
- Use data-testid selectors when possible

## Selectors
- Prefer: getByTestId
- Then: getByRole
- Avoid CSS/XPath unless necessary

## Tests
- Follow Arrange / Act / Assert
- No hard waits
- Use fixtures when possible
- Keep tests independent

## Assertions
- Use expect from @playwright/test
- Prefer visible/text assertions over DOM structure

## Anti-patterns
- No page.locator('div > nth-child(...)')
- No duplicated selectors