# Implementation & Testing Plan: Table Reservation Platform

## Quick Reference
**PRP Status:** ✅ Approved  
**Total Tasks:** 8 tasks across 3 conversation batches
**Estimated Timeline:** 3 conversations over 1-2 sessions

## Conversation Batching Strategy
**CRITICAL: Keep batches small to manage context window**
- **Batch 1:** Foundation (3 micro-tasks: Project setup, database schema, mock data)
- **Batch 2:** Core Logic (3 micro-tasks: API routes, availability check, reservation creation)
- **Batch 3:** User Interface (2 micro-tasks: Booking form, table selector with confirmation)

**Each batch = One conversation session**

---

## BATCH 1: Foundation & Setup
**Status:** ✅ Complete  
**Goal:** Set up Next.js project with database schema and mock restaurant data
**Context Window Strategy:** Fresh conversation, 3 tasks maximum
**Completion Date:** 2025-08-26

### Task 1: Next.js Project Setup with Subdomain Routing
**Status:** ✅
**Implementation Checklist:**
- [x] Create Next.js 14 project with TypeScript
- [x] Install dependencies: Prisma, Tailwind CSS
- [x] Create `/app/[subdomain]/page.tsx` for dynamic routing
- [x] Add basic middleware for subdomain detection

**Manual Test Commands:**
```bash
# Test command 1
npm run dev
# Expected output: Next.js dev server starts on localhost:3001 (3000 was in use)

# Test command 2  
curl http://localhost:3001
# Expected output: Default Next.js page loads
```

**Visual Verification:**
- [x] Open http://localhost:3001 and see Next.js welcome page
- [x] Verify no console errors in browser
- [x] Check that Tailwind CSS is configured (inspect element classes)

**Success Criteria:** ✅ Next.js project runs with subdomain routing structure in place

---

### Task 2: Database Schema with Prisma
**Status:** ✅
**Implementation Checklist:**
- [x] Create `prisma/schema.prisma` with Restaurant, Table, Reservation models
- [x] Set up SQLite connection in `.env` (changed from PostgreSQL for simplicity)
- [x] Create `/lib/db.ts` for Prisma client
- [x] Run migrations to create database tables

**Manual Test Commands:**
```bash
# Test command 1
npx prisma migrate dev --name init
# Expected output: Migration created and applied ✅

# Test command 2
npx prisma studio --port 5560
# Expected output: Prisma Studio opens showing empty tables ✅
```

**Visual Verification:**
- [x] Open Prisma Studio and verify 3 tables exist: Restaurant, Table, Reservation
- [x] Check Restaurant table has columns: id, subdomain, name, email, maxCapacity
- [x] Check Table table has columns: id, restaurantId, number, capacity, photoUrl

**Success Criteria:** ✅ Database schema created with all required tables and relationships

---

### Task 3: Seed Mock Restaurant Data
**Status:** ✅
**Implementation Checklist:**
- [x] Create `prisma/seed.ts` with mock restaurant "storeA"
- [x] Add 5 mock tables with placeholder images
- [x] Create npm script for seeding
- [x] Run seed to populate database

**Manual Test Commands:**
```bash
# Test command 1
npm run seed
# Expected output: Seeding completed message ✅

# Test command 2
npx prisma studio --port 5560
# Expected output: Shows storeA restaurant with 5 tables ✅
```

**Visual Verification:**
- [x] Open Prisma Studio and verify storeA exists with subdomain "storea"
- [x] Verify 5 tables exist for storeA with different capacities (2, 4, 6 seats)
- [x] Each table has a photoUrl field populated

**Success Criteria:** ✅ Mock data loaded, ready for testing reservation flow

---

**Batch 1 Completion Checklist:**
- [x] All tasks marked as ✅ Complete
- [x] Database running with schema and mock data
- [x] Next.js project structure ready for API and UI development
- [x] Ready for Batch 2: Core reservation logic

**Actual Implementation Details:**
- **Files Created:**
  - `package.json` - Next.js project configuration with dependencies
  - `next.config.js` - Next.js configuration
  - `tsconfig.json` - TypeScript configuration
  - `tailwind.config.ts` - Tailwind CSS configuration
  - `postcss.config.js` - PostCSS configuration
  - `app/layout.tsx` - Root layout component
  - `app/page.tsx` - Home page component
  - `app/[subdomain]/page.tsx` - Dynamic subdomain routing
  - `app/globals.css` - Global CSS with Tailwind imports
  - `middleware.ts` - Subdomain detection middleware
  - `prisma/schema.prisma` - Database schema with Restaurant, Table, Reservation models
  - `lib/db.ts` - Prisma client configuration
  - `prisma/seed.ts` - Database seeding script
  - `.env` - Environment variables (SQLite database URL)

- **Deviations from Plan:**
  - Used SQLite instead of PostgreSQL for simplicity and local development
  - Next.js runs on port 3001 instead of 3000 (port conflict)
  - Prisma Studio runs on port 5560 instead of 5556 (port conflicts)

- **Issues Encountered & Resolved:**
  - Port conflicts resolved by using alternative ports
  - Prisma client generation issue resolved with `npx prisma generate`
  - Prisma Studio connectivity fixed after client regeneration

- **Completion Timestamp:** 2025-08-26 07:43:00 UTC

---

## BATCH 2: Core Logic
**Status:** ⬜ Not Started  
**Goal:** Build API routes for checking availability and creating reservations
**Conversation Management:** Fresh start with database already set up

### Task 4: Restaurant Loading by Subdomain
**Status:** ⬜
**Implementation Checklist:**
- [ ] Create `getRestaurantBySubdomain` function in `/lib/restaurant.ts`
- [ ] Add subdomain extraction logic (10 lines max)
- [ ] Return restaurant with tables from database

**Manual Test Commands:**
```bash
# Test in Next.js API route or console
node -e "
const { getRestaurantBySubdomain } = require('./lib/restaurant');
getRestaurantBySubdomain('storea').then(console.log);
"
# Expected output: Restaurant object with id, name, and tables array
```

**Visual Verification:**
- [ ] Function returns restaurant data for 'storea'
- [ ] Function returns null for non-existent subdomain
- [ ] Tables are included in response

**Success Criteria:** Can load restaurant configuration by subdomain

---

### Task 5: Availability Check API
**Status:** ⬜
**Implementation Checklist:**
- [ ] Create `/app/api/availability/route.ts`
- [ ] Implement `checkAvailability` function (12 lines max)
- [ ] Return available tables for given date/time/party size
- [ ] Filter out already booked tables

**Manual Test Commands:**
```bash
# Test command 1
curl "http://localhost:3000/api/availability?date=2024-12-25&time=19:00&partySize=4&restaurantId=1"
# Expected output: JSON array of available tables

# Test command 2 - Book a table then check again
curl "http://localhost:3000/api/availability?date=2024-12-25&time=19:00&partySize=8"
# Expected output: Empty array or limited tables
```

**Visual Verification:**
- [ ] Returns tables that fit party size
- [ ] Excludes tables with existing reservations
- [ ] Returns empty array when fully booked

**Success Criteria:** API correctly returns available tables based on parameters

---

### Task 6: Create Reservation API
**Status:** ⬜
**Implementation Checklist:**
- [ ] Create `/app/api/reservations/route.ts` with POST handler
- [ ] Implement `createReservation` function (12 lines max)
- [ ] Add `validateBookingTime` to ensure 24hr advance
- [ ] Return reservation confirmation with ID

**Manual Test Commands:**
```bash
# Test command 1 - Valid reservation
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{"restaurantId":1,"tableId":1,"date":"2024-12-25","time":"19:00","partySize":4,"guestName":"John Doe","guestEmail":"john@example.com"}'
# Expected output: Reservation created with confirmation ID

# Test command 2 - Invalid (too soon)
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{"date":"[today]","time":"19:00"}'
# Expected output: Error - must book 24hrs in advance
```

**Visual Verification:**
- [ ] Check database has new reservation record
- [ ] Verify reservation has unique ID
- [ ] Confirm validation rejects bookings < 24hrs

**Success Criteria:** Can create reservations with validation, stored in database

---

**Batch 2 Completion Checklist:**
- [ ] All API endpoints working
- [ ] Availability checking filters booked tables
- [ ] Reservations saved to database
- [ ] 24hr advance booking enforced
- [ ] Ready for Batch 3: User interface

---

## BATCH 3: User Interface
**Status:** ⬜ Not Started  
**Goal:** Build mobile-responsive booking interface with table selection
**Conversation Management:** Fresh start with APIs ready

### Task 7: Booking Form Component
**Status:** ⬜
**Implementation Checklist:**
- [ ] Create `/components/BookingForm.tsx` with date/time/party inputs
- [ ] Add mobile-responsive Tailwind styling
- [ ] Connect to availability API on form change
- [ ] Display loading and error states

**Manual Test Commands:**
```bash
# Test command 1
npm run dev
# Navigate to http://storea.localhost:3000
# Expected: See booking form with date, time, party size fields

# Test command 2 - Mobile view
# Open Chrome DevTools, toggle device mode to iPhone
# Expected: Form adapts to mobile screen
```

**Visual Verification:**
- [ ] Date picker disables past dates
- [ ] Time selector shows restaurant hours only
- [ ] Party size dropdown shows 1-8 guests
- [ ] Form is touch-friendly on mobile

**Success Criteria:** Booking form renders, accepts input, calls availability API

---

### Task 8: Table Selector and Confirmation
**Status:** ⬜
**Implementation Checklist:**
- [ ] Create `/components/TableSelector.tsx` with photo grid
- [ ] Show available tables from API response
- [ ] Add guest info form after table selection
- [ ] Display confirmation with reservation ID

**Manual Test Commands:**
```bash
# Test flow
# 1. Select date/time/party size in form
# 2. View available tables with photos
# 3. Click a table
# 4. Enter name and email
# 5. Submit reservation
# Expected: Confirmation page with reservation ID

# Test command - Verify in database
npx prisma studio
# Expected: New reservation record exists
```

**Visual Verification:**
- [ ] Tables display with actual photos (or placeholders)
- [ ] Selected table highlights visually
- [ ] Confirmation shows all booking details
- [ ] Email validation works on guest form

**Success Criteria:** Complete booking flow works end-to-end on mobile and desktop

---

**Batch 3 Completion Checklist:**
- [ ] Full booking flow functional
- [ ] Mobile responsive design verified
- [ ] Confirmation page displays reservation details
- [ ] Ready for email integration (future enhancement)

---

## Conversation Briefing Templates

### Starting Fresh Conversation:
```
I'm implementing Table Reservation Platform from the PRP document. 

**Completed So Far:**
- [List completed batches/tasks]

**Current Focus - Batch [X]: [Batch Name]**
Tasks for this conversation:
1. [Task name and brief description]
2. [Task name and brief description]

**Key PRP Requirements:**
- Next.js with subdomain routing
- PostgreSQL with Prisma
- Mobile-responsive design
- 24hr advance booking validation

Please help me implement these tasks following the PRP specifications.
```

### Debugging/Reset Template:
```
I need to debug/fix Table Reservation Platform implementation.

**Issue:**
[Describe what's broken]

**Current State:**
- Database schema created
- Mock data seeded
- [Other completed items]

**PRP Reference:**
Single success scenario: User books table for 4 people tomorrow at 7 PM

Please help me fix this issue and get back on track.
```

## Progress Tracking System

### Status Indicators:
- ⬜ Not Started
- 🟦 In Progress  
- ✅ Complete
- ❌ Blocked
- 🔄 Needs Revision

### Regression Testing Checklist:
After each batch, verify:
- [ ] Database migrations still work
- [ ] Mock data loads correctly
- [ ] API endpoints respond
- [ ] No breaking changes to completed features

---

## Implementation Guidelines

### Task Breakdown Rules:
- **Maximum 10-15 lines of code per task**
- **2-3 tasks per batch maximum**
- Each task independently testable
- Clear file/function targets
- Every task must have specific manual test steps

### Testing Philosophy:
- **Test after EVERY task**
- Manual verification with curl or browser
- Focus on observable behavior
- If a test fails, STOP and fix

### Critical Reminders:
- Follow PRP specifications exactly
- Verbose, readable code (customerEmail not email)
- Test after EVERY task
- Document any deviations from plan

---

**Generated from:** `docs/prp.md`  
**Date:** 2025-08-25  
**Ready to implement:** Start with Batch 1, Task 1