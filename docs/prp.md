# Project Requirements Plan (PRP) - Table Reservation Platform

## 1. Core Identity
A white-label table reservation platform where each restaurant gets their own branded booking subdomain (storeA.revero.com), allowing customers to book tables with visual table selection and manage reservations.

## 2. Single Success Scenario
- User does: Visits storeA.revero.com and books a table for 4 people tomorrow at 7 PM
- System responds: Shows available tables with photos, confirms booking, sends email
- User verifies: Receives confirmation email with reservation details and can view booking on site

## 3. User Flows
**PRIMARY FLOW:**
1. User starts at restaurant-specific subdomain (storeA.revero.com)
2. User selects date/time/party size → system shows available tables with photos
3. User picks table and enters contact info → system confirms booking
4. Result: Reservation saved to database, confirmation email sent

**ERROR HANDLING:** 
- No tables available: Show "Fully booked" with alternative times
- Invalid email: Show inline validation error
- Past date selected: Disable past dates in calendar

## 4. Technical Stack & Architecture
**STACK:**
- Frontend: Next.js (mobile-responsive, SSR for SEO, subdomain routing built-in)
- Backend: Next.js API routes
- Data Storage: PostgreSQL with Prisma ORM
- Deployment: Vercel (automatic subdomain handling)

**FILE STRUCTURE:**
- `/app/[subdomain]/page.tsx` - Restaurant-specific booking page
- `/app/api/reservations/route.ts` - Booking API
- `/lib/db.ts` - Database connection
- `/components/BookingForm.tsx` - Main reservation form
- `/components/TableSelector.tsx` - Visual table picker

## 5. API Design & Data Models
**DATA MODELS:**
```
Restaurant: {id, subdomain, name, email, maxCapacity}
Reservation: {id, restaurantId, date, time, partySize, tableId, guestName, guestEmail, status}
Table: {id, restaurantId, number, capacity, photoUrl}
```

**ENDPOINTS:**
- `GET /api/availability` - Check available tables for date/time
- `POST /api/reservations` - Create booking
- `GET /api/reservations/[id]` - View booking details

**STORAGE:** PostgreSQL stores all data, Prisma handles queries

## 6. Core Functions & Data Flow
**FUNCTIONS:**
- `checkAvailability(date, time, partySize)` - Returns available tables
- `createReservation(data)` - Saves booking to database
- `sendConfirmationEmail(reservation)` - Sends email via SendGrid
- `getRestaurantBySubdomain(subdomain)` - Loads restaurant config
- `validateBookingTime(date, time)` - Ensures future date, operating hours

**FLOW:** User input → Validate → Check availability → Create reservation → Send email → Show confirmation

## 7. Dependencies & Constraints
**ALLOWED:** 
- Next.js 14, Prisma, SendGrid (email), Tailwind CSS

**FORBIDDEN FOR SKELETON:** 
- Payment processing, real membership system, POS integration

**LIMITS:** 
- Single restaurant per subdomain, mock data for tables, 24hr advance booking only

## 8. Code Quality Requirements
- Verbose, readable code over compact solutions
- Maximum 15 lines per function
- Descriptive variable names (customerEmail not email)
- Comments explaining business logic and WHY
- No nested ternary operators
- Separate components for each UI section
- Explicit error handling with try-catch
- One responsibility per function

## 9. Definition of Done
**SKELETON COMPLETE WHEN:**
- User can book table at storeA.revero.com
- Available tables show with photos
- Confirmation email sends
- Booking viewable with confirmation code
- Mobile responsive design works
- Database stores all reservations
- 24hr cancellation rule enforced