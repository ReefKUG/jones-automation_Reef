Jones Automation Exercise
End-to-end tests for the contact form at test.netlify.app, built with Playwright Test.
Run
npm install
npx playwright install chromium

npm test              # headless
npm run test:headed   # watch the browser
npm run report        # HTML report
Screenshot before submit: screenshots/before-submit.png
Tests
All tests follow the Arrange, Act, Assert pattern.
Test	Verifies
Submit and reach the thank-you page	Main flow and bonus (51-500). Every submitted value arrives unchanged.
Empty name, email or phone	Each required field blocks submission
Invalid email or website format	Wrong formats are rejected
Optional fields empty	Company and Website are truly optional


Validation tests verify that invalid submissions are blocked using valueMissing or typeMismatch. For invalid email and website formats, they also verify that a browser validation message exists. The exact message text isn't asserted because it depends on the browser language.
Approach
- Locators: getByLabel and getByRole, based on what the user sees.
- No fixed waits: Uses Playwright's auto-waiting and assertions without hardcoded delays.
- Payload via URL: The form uses GET, so the query string contains the submitted values. For POST, I'd use waitForRequest() and postData().
- Runner: Playwright Test, with HTML reporting and failure traces.
Findings
Findings from exploratory testing. Some were checked with Playwright, while others require further verification. Severity reflects potential impact, not proof that a security issue is exploitable.

Main theme: the form relies mostly on basic browser validation, with limited input validation.
Severity	Finding	Why it matters
High	Personal data sent in the URL (GET)	Personal information may be exposed through browser history, server logs, or Referer headers. Use POST instead.
Medium	Website accepts javascript: URLs	Potential security risk if the URL is later used as a clickable link without validation. Only HTTP/HTTPS URLs should be accepted.
Medium	HTML-like input accepted	Tested with an XSS payload. No JavaScript execution was observed in the tested flow. Further testing is needed to check for XSS elsewhere.
Medium	Phone accepts invalid values (abc, 123)	Users can submit phone numbers that cannot be used for a callback.
Medium	Name accepts only spaces	The required attribute doesn't trim whitespace, allowing effectively empty names.
Medium	No input length limits	Very long inputs combined with GET requests may cause a 414 URI Too Long error.
Medium	No clear error handling for failed submissions	Users may not receive useful feedback when a submission fails. Requires verification.
Low	Email without TLD accepted (john@example)	Accepted by HTML email validation, but may indicate a typo.
Low	Name with no letters accepted (123!@#)	May be invalid depending on the product's name validation requirements.