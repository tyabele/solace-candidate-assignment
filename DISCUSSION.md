# Solace Advocates Page Implementation

## What I Built

I tried to update the advocates listing page with improved search and pagination capabilities. It seemed like that was the area that was more "poorly" implemented, with the biggest impact and share of bugs. Here's what was implemented:

### Backend API Enhancements

- Server-side pagination: Added `page`, `limit`, and `search` query parameters to the `/api/advocates` endpoint
- Better search functionality: search across multiple fields including names, city, degree, specialties, years of experience, and phone numbers
- Phone number search optimization: Added digit-only matching to handle formatted phone number searches
- Robust pagination metadata: Returns total count, page info, and navigation flags

### Frontend UI/UX Improvements

- Improved Design: Updated the ui with Tailwind CSS to clean up styling, allow for a lot of flexibility in the future.
- Search interface: Real-time search with visual feedback and clear button
- Optimized table layout: Fixed-width columns with proper truncation and some tooltips
- Limited Specialty display: Shows first 2 specialties with expandable tooltip for additional ones
- Phone number formatting: Displays numbers in standard (XXX) XXX-XXXX format with a link using `tel:` to allow click / dial.
- Comprehensive pagination controls: First/Previous/Next/Last buttons with page number display and configurable page sizes

### Performance Optimizations

- React.memo: Implemented memoized AdvocateRow component to prevent unnecessary re-renders
- Callback: Used useCallback for fetch function to prevent infinite re-render loops
- TypeScript: Added a type for Advocate
- Unique key generation: Used a unique key on advocate data for efficient React usage
- Eliminated DOM anti-patterns: Replaced direct `document.getElementById` manipulation with proper React state management

### Additional Features

- Brand: Added the Solace logo (from the website) in a react component. used it in the app header.
- Accessibility: Tried to include proper ARIA labels, keyboard navigation, and proper html structure.
- Tooltip system: Interactive specialty tooltip with proper z-indexing and toggle functionality
- URL parameter: Search and pagination could easily be used to work with URL parameters to bookmarkable results

## What would I do with more time

1. I should've just abandoned the table from the get-go and pivoted to something like a card. I feel like that paradigm would've worked better to display Advocate data, and allow for better ux overall.
2. I'd liked to of implemented a modal to present all of the Advocate details in better format, things like tags would be simpler to display, not to mention I could've used "next", and "prev" buttons or swipes to move through the advocate list.
3. I noticed that there wasn't a caching strategy for advocate data. Some caching via Redis caching with an added `revalidate` or `cache` header to API responses could reduce database load and improve response times significantly (with larger data sets).
4. Implementing connection pooling would ensure better resource usage and reduce connection overhead.
5. While I added basic parameter validation (pages, limits), there's no comprehensive input validation or structured error handling. Something like zod for schema validation on the API and structured error responses would really set the stage for a better API.
