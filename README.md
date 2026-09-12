# Tatawwu’ — Volunteering in Bahrain

Tatawwu’ brings charitable, volunteer, and humanitarian campaigns in Bahrain into one place. Volunteers can discover activities, reserve places, and track participation. Organizers can publish activities after admin review and manage their participants.

This README is the team’s **project design and development specification**. It contains all five planning deliverables, with the full text and downloadable diagrams. It describes the application to be built; this package does not contain working application code.

1. [AAU user stories](#1-aau-user-stories)
2. [Entity relationship diagrams](#2-entity-relationship-diagrams-erds)
3. [Wireframes](#3-wireframes)
4. [Routes](#4-routes)
5. [Component hierarchy](#5-component-hierarchy)

### Project scope and stack

| Item                | Specification                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| Region              | Organizations and campaign locations in Bahrain only; residents and visitors who can attend may volunteer. |
| Interface           | English, responsive desktop and mobile website.                                                            |
| Frontend repository | `tatawwu-frontend`: React, React Router, forms, dashboards, and API services.                              |
| Backend repository  | `tatawwu-backend`: Node.js, Express, Mongoose models, MongoDB, authorization, and workflow validation.     |
| Authentication      | JWT in an HttpOnly cookie; one-hour expiry; Secure in production, SameSite=Lax, and CSRF protection.       |
| Cloudinary          | Public organization logos and campaign covers; protected generated certificate PDFs.                       |
| PDF generation      | Backend PDFKit certificate template using a saved issuance snapshot.                                       |
| Roles               | Volunteer, organizer, and admin; each organizer owns at most one organization.                             |
| Core CRUD resource  | Campaigns: create, read, update, and delete eligible unpublished drafts.                                   |
| Package             | 24 user stories, 2 ERD sheets, 8 wireframe sheets, 4 route sheets, and 1 component hierarchy sheet.        |

Payments, messaging, multiple staff accounts per organization, profile photos, videos, QR attendance, and certificate revocation are outside this first version. Logo and cover uploads are optional; certificate issuance is an optional organizer action.

The 15 visual sheets are supplied as **PNG** for sharing and **SVG** with editable text. Keep the images beside this README so its relative links work when copied into a repository. SVGs use DejaVu Sans with sans-serif fallbacks.

## 1. AAU user stories

**AAU means “As a user.”** Each story follows: **As a [role], I want [action], so that [benefit].** The 24 stories below describe the agreed first version: six visitor/account stories, five volunteer stories, ten organizer stories, and three admin stories.

Tatawwu’ lists volunteering activities taking place in **Bahrain** and organizations based in Bahrain. Volunteers may be residents or visitors who can attend. The interface and certificate template are English. The country is fixed to `BH`; the governorate choices are Capital, Muharraq, Northern, and Southern. All activity times display in `Asia/Bahrain` (UTC+3), regardless of the viewer’s device timezone.

### Visitors and account holders

| ID  | User story                                                                                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| U01 | As a visitor, I want to browse approved volunteering activities in Bahrain so that I can find opportunities to participate.                      |
| U02 | As a visitor, I want to filter campaigns by governorate, area, category, and date so that I can find suitable activities.                        |
| U03 | As a visitor, I want to view campaign images, Bahrain time, venue, and organization information so that I understand an activity before joining. |
| U04 | As a visitor, I want to create a volunteer or organizer account so that I can use the platform.                                                  |
| U05 | As a user, I want to sign in and sign out so that I can securely access my account.                                                              |
| U06 | As a user, I want to edit my name and optional city so that my profile stays accurate.                                                           |

### Volunteers

| ID  | User story                                                                                                 |
| --- | ---------------------------------------------------------------------------------------------------------- |
| V01 | As a volunteer, I want to register for an available campaign so that I can immediately reserve a place.    |
| V02 | As a volunteer, I want to cancel before the activity starts so that another person can use my place.       |
| V03 | As a volunteer, I want to view upcoming and past registrations so that I can track my participation.       |
| V04 | As a volunteer, I want to see my attendance status so that I know whether my participation was recorded.   |
| V05 | As a volunteer, I want to preview and download my certificates so that I have a record of my contribution. |

### Organizers

| ID  | User story                                                                                                                              |
| --- | --------------------------------------------------------------------------------------------------------------------------------------- |
| O01 | As an organizer, I want to create and edit my Bahrain organization profile so that I can submit it for approval.                        |
| O02 | As an organizer, I want to upload, replace, or remove my organization’s logo so that volunteers can recognize it.                       |
| O03 | As an organizer, I want to create and view campaign drafts so that I can prepare activities in Bahrain.                                 |
| O04 | As an organizer, I want to edit campaign information and its cover image before the activity starts so that the listing stays accurate. |
| O05 | As an organizer, I want to delete unused unpublished campaigns so that I can remove unnecessary drafts.                                 |
| O06 | As an organizer, I want to submit campaigns for approval and read rejection feedback so that I can get them published.                  |
| O07 | As an organizer, I want to cancel a published campaign so that participants can see that it will not take place.                        |
| O08 | As an organizer, I want to view participants and record attendance after an activity so that participation is documented.               |
| O09 | As an organizer, I want to complete a campaign after recording attendance so that attendees become eligible for certificates.           |
| O10 | As an organizer, I want to grant certificates to eligible attendees so that the platform generates and stores their PDFs.               |

### Admins

| ID  | User story                                                                                                                       |
| --- | -------------------------------------------------------------------------------------------------------------------------------- |
| A01 | As an admin, I want to review organization information, location, and logo so that I can approve Bahrain-based organizations.    |
| A02 | As an admin, I want to review each campaign’s details, location, and image so that I can approve suitable activities in Bahrain. |
| A03 | As an admin, I want to reject or remove inappropriate content with feedback so that organizers understand my decision.           |

### Shared behavior and acceptance rules

- **Accounts and ownership:** JWT authentication protects signed-in actions. Roles are fixed after signup; admins are seeded and cannot be selected at signup. Each organizer owns at most one organization and can manage only that organization’s campaigns, participants, attendance, and certificates. Volunteers manage only their own registrations and certificates.
- **Two approval stages:** an admin approves the organization and separately approves every submitted campaign. Creating or changing an organization profile or logo returns it to `pending`. A pending organization can prepare drafts, but cannot submit campaigns or receive new registrations. Rejection requires feedback.
- **Campaign edits and publication:** an approved organization can submit a draft for review. Editing an approved campaign, including its image, returns it to `pending`; existing registrations remain and new registration pauses. Approval must match the revision the admin reviewed. Public discovery lists approved upcoming campaigns from approved organizations. Campaign content becomes read-only when the activity starts.
- **Full campaign CRUD:** organizers can create drafts, read their campaigns, update eligible campaigns, and permanently delete never-published draft/rejected campaigns with no registrations. Previously published campaigns are cancelled instead. Admin removal hides the campaign while preserving participation and certificate history.
- **Instant registration:** a volunteer can join before the start while the campaign and organization are approved and capacity remains. Duplicate requests cannot reserve another place. Cancellation before the start releases one place; rejoining reactivates the same registration if capacity remains. Registration and capacity changes commit together in a MongoDB transaction.
- **Attendance and completion:** only the owning organizer can mark active registrations `attended` or `absent` after the activity ends. All active registrations must be marked before the campaign can be completed. Cancelled registrations do not receive attendance or certificates.
- **Certificates:** granting is optional and requires a completed campaign and an active registration marked `attended`. The backend generates a PDF, stores it as an authenticated Cloudinary asset, and exposes recipient-only preview/download routes. Concurrent grants and retries share one certificate record per registration. Attendance is locked while generation is `processing` or the certificate is `issued`; a failed generation permits correction before retry.
- **Media:** an organization has one optional logo and a campaign has one optional cover. Accept JPEG, PNG, or WebP images up to 5 MB; validate and upload through the backend. Replacing a file preserves the old file until the replacement and database update succeed. Public images use Cloudinary image delivery; certificate PDFs are protected and their Cloudinary delivery URLs stay internal.
- **Bahrain details:** organizations and campaigns require governorate, area, and Bahrain address; campaigns also require a venue. The backend fixes country to `BH` and campaign timezone to `Asia/Bahrain`. Store timestamps in UTC and interpret date filters and form times in Bahrain time. A volunteer’s optional city does not restrict account eligibility.

## 2. Entity relationship diagrams (ERDs)

The diagrams are **conceptual MongoDB/Mongoose design specifications**. They describe intended collections, fields, references, and validation rules; this package does not contain an implemented database or application. `ObjectId` references represent logical relationships that the Express backend must validate, including role and ownership checks. They are not SQL foreign-key constraints.

Orange identifies the User model, green identifies the other collections, and cyan identifies embedded schemas. Crow’s-foot connectors show cardinalities: a bar means one, a circle permits zero, and a fork means many.

![Five MongoDB collections and their relationships](01-erd-collections.png)

[Open collection ERD as PNG](01-erd-collections.png) · [Edit collection ERD as SVG](01-erd-collections.svg)

![Embedded Cloudinary asset, review, and certificate snapshot schemas](02-erd-embedded-schemas.png)

[Open embedded-schema ERD as PNG](02-erd-embedded-schemas.png) · [Edit embedded-schema ERD as SVG](02-erd-embedded-schemas.svg)

### Collections and relationships

| Collection     | Purpose                                                                        |
| -------------- | ------------------------------------------------------------------------------ |
| `User`         | Volunteer, organizer, or admin account and authentication information.         |
| `Organization` | One organizer’s Bahrain organization, approval record, and optional logo.      |
| `Campaign`     | A volunteering activity, its Bahrain location, capacity, cover, and lifecycle. |
| `Registration` | One volunteer’s relationship to one campaign, including attendance.            |
| `Certificate`  | A certificate generation record and, once issued, its protected PDF.           |

| Parent → child                 | Cardinality                                 | Reference and restriction                                               |
| ------------------------------ | ------------------------------------------- | ----------------------------------------------------------------------- |
| `User` → `Organization`        | One user → zero or one organization         | `Organization.ownerId`; organizer only; unique.                         |
| `Organization` → `Campaign`    | One organization → zero or many campaigns   | `Campaign.organizationId`; every campaign has exactly one organization. |
| `User` → `Registration`        | One user → zero or many registrations       | `Registration.volunteerId`; volunteer only.                             |
| `Campaign` → `Registration`    | One campaign → zero or many registrations   | `Registration.campaignId`; every registration has exactly one campaign. |
| `Registration` → `Certificate` | One registration → zero or one certificate  | `Certificate.registrationId`; includes processing and failed records.   |
| `User` → `Certificate`         | One user → zero or many certificate records | `Certificate.issuedBy`; owning organizer only.                          |

`Registration.attendanceMarkedBy` also references the owning organizer’s `User`. Each embedded `ReviewEntry.adminId` references an admin’s `User`. These actor references appear in the field definitions rather than as additional collection boxes.

Every collection has an automatically generated `_id: ObjectId` and `createdAt: Date` / `updatedAt: Date` timestamps. The following fields are additional to those common fields.

### User fields

| Field          | Type   | Rule                                                           |
| -------------- | ------ | -------------------------------------------------------------- |
| `name`         | String | Required.                                                      |
| `email`        | String | Required; lowercase-normalized and unique.                     |
| `passwordHash` | String | Required; store a password hash, never the plaintext password. |
| `role`         | String | Required; `USER_ROLE`.                                         |
| `city`         | String | Optional participant location.                                 |

### Organization fields

| Field                 | Type            | Rule                                                           |
| --------------------- | --------------- | -------------------------------------------------------------- |
| `ownerId`             | ObjectId        | Required; unique reference to an organizer `User`.             |
| `name`, `description` | String          | Required.                                                      |
| `country`             | String          | Fixed to `BH`.                                                 |
| `governorate`         | String          | Required; `GOVERNORATE`.                                       |
| `area`, `address`     | String          | Required; Bahrain location.                                    |
| `contactEmail`        | String          | Required.                                                      |
| `website`             | String          | Optional.                                                      |
| `logo`                | CloudinaryAsset | Optional; public image.                                        |
| `status`              | String          | `ORG_STATUS`; initially `pending`.                             |
| `revision`            | Number          | Integer; initially `0`; increment on changes requiring review. |
| `reviews`             | ReviewEntry[]   | Initially empty; records moderation decisions.                 |

### Campaign fields

| Field                      | Type            | Rule                                                                     |
| -------------------------- | --------------- | ------------------------------------------------------------------------ |
| `organizationId`           | ObjectId        | Required reference to `Organization`.                                    |
| `title`, `description`     | String          | Required.                                                                |
| `category`                 | String          | Required; `CATEGORY`.                                                    |
| `country`                  | String          | Fixed to `BH`.                                                           |
| `governorate`              | String          | Required; `GOVERNORATE`.                                                 |
| `area`, `venue`, `address` | String          | Required; Bahrain location.                                              |
| `startsAt`                 | Date            | Required; stored in UTC.                                                 |
| `endsAt`                   | Date            | Required; later than `startsAt`.                                         |
| `timezone`                 | String          | Fixed to `Asia/Bahrain`.                                                 |
| `capacity`                 | Number          | Required positive integer; cannot be reduced below active registrations. |
| `registeredCount`          | Number          | Integer; initially `0`; kept consistent with active registrations.       |
| `coverImage`               | CloudinaryAsset | Optional; public image.                                                  |
| `status`                   | String          | `CAMPAIGN_STATUS`; initially `draft`.                                    |
| `revision`                 | Number          | Integer; initially `0`; increment on changes requiring review.           |
| `hasBeenPublished`         | Boolean         | Initially `false`; remains true after first publication.                 |
| `reviews`                  | ReviewEntry[]   | Initially empty; records moderation decisions.                           |
| `completedAt`              | Date            | Set when the campaign is completed.                                      |

### Registration fields

| Field                | Type     | Rule                                                             |
| -------------------- | -------- | ---------------------------------------------------------------- |
| `volunteerId`        | ObjectId | Required reference to a volunteer `User`.                        |
| `campaignId`         | ObjectId | Required reference to `Campaign`.                                |
| `status`             | String   | `registered` or `cancelled`; initially `registered`.             |
| `attendance`         | String   | `unmarked`, `attended`, or `absent`; initially `unmarked`.       |
| `attendanceMarkedBy` | ObjectId | Optional until marked; reference to the owning organizer `User`. |
| `attendanceMarkedAt` | Date     | Set when attendance is marked.                                   |
| `registeredAt`       | Date     | Required registration timestamp.                                 |
| `cancelledAt`        | Date     | Set when cancelled.                                              |

### Certificate fields

| Field               | Type                | Rule                                                                      |
| ------------------- | ------------------- | ------------------------------------------------------------------------- |
| `registrationId`    | ObjectId            | Required unique reference to `Registration`.                              |
| `issuedBy`          | ObjectId            | Required reference to the owning organizer `User`.                        |
| `certificateNumber` | String              | Required; unique; reused when generation is retried.                      |
| `snapshot`          | CertificateSnapshot | Required; captured for generation and frozen after issuance.              |
| `pdfAsset`          | CloudinaryAsset     | Absent until issuance; required for an issued certificate; protected PDF. |
| `status`            | String              | `processing`, `issued`, or `failed`.                                      |
| `attemptId`         | String              | Identifies the current generation attempt.                                |
| `processingUntil`   | Date                | Expiry of the generation lease; relevant while processing.                |
| `issuedAt`          | Date                | Set only after successful PDF upload and issuance.                        |

A failed upload does not create an issued certificate. Retry the existing record instead of creating a second certificate. Only the current processing attempt may commit its asset. Once issued, the snapshot and PDF retain the recorded names, location, and dates even when live profiles subsequently change.

### Embedded schema: CloudinaryAsset

This shared object is embedded in `Organization.logo`, `Campaign.coverImage`, and `Certificate.pdfAsset`. Cloudinary stores file bytes; MongoDB stores these identifiers and metadata.

| Field             | Type   | Rule                                                             |
| ----------------- | ------ | ---------------------------------------------------------------- |
| `assetId`         | String | Required.                                                        |
| `publicId`        | String | Required; generated by the backend.                              |
| `resourceType`    | String | `image` for logos/covers; `raw` for PDFs.                        |
| `deliveryType`    | String | `upload` for public images; `authenticated` for PDFs.            |
| `version`         | Number | Required.                                                        |
| `format`          | String | Required; normalized by the backend.                             |
| `bytes`           | Number | Required file size.                                              |
| `secureUrl`       | String | Public images only; protected PDF delivery URLs remain internal. |
| `width`, `height` | Number | Images only.                                                     |

The PDF `publicId` ends in `.pdf`. An absent optional image uses a UI placeholder. An absent `pdfAsset` means the certificate has not been issued. The API verifies the certificate recipient, fetches the protected PDF using server-side signed access, and streams it for preview or download.

### Embedded schema: ReviewEntry

This object is stored inside `Organization.reviews` and `Campaign.reviews`.

| Field              | Type     | Rule                                       |
| ------------------ | -------- | ------------------------------------------ |
| `adminId`          | ObjectId | Required reference to an admin `User`.     |
| `decision`         | String   | `approved`, `rejected`, or `removed`.      |
| `reason`           | String   | Required for rejection or removal.         |
| `reviewedRevision` | Number   | Required; the revision the admin reviewed. |
| `reviewedAt`       | Date     | Required decision timestamp.               |

Organizations use only `approved`/`rejected`. `removed` is a campaign audit decision. Approval endpoints accept only `approved`/`rejected`; campaign removal has its own endpoint. A stale revision cannot approve content that changed after review.

### Embedded schema: CertificateSnapshot

This object is stored inside `Certificate.snapshot`.

| Field                                                | Type   | Rule                                                             |
| ---------------------------------------------------- | ------ | ---------------------------------------------------------------- |
| `volunteerName`, `campaignTitle`, `organizationName` | String | Required values used on the PDF.                                 |
| `country`                                            | String | Fixed to `BH`.                                                   |
| `governorate`                                        | String | Required; `GOVERNORATE`.                                         |
| `area`                                               | String | Required.                                                        |
| `startsAt`, `endsAt`                                 | Date   | Required; stored in UTC.                                         |
| `timezone`                                           | String | Fixed to `Asia/Bahrain`; used to format certificate dates/times. |

Embedded schemas are stored inside their owning documents, not as separate collections. They do not need independent MongoDB identity; the Mongoose schemas can use `_id: false`.

### Enums and unique indexes

| Name                | Allowed values                                                                       |
| ------------------- | ------------------------------------------------------------------------------------ |
| `USER_ROLE`         | `volunteer`, `organizer`, `admin`                                                    |
| `GOVERNORATE`       | `capital`, `muharraq`, `northern`, `southern`                                        |
| `ORG_STATUS`        | `pending`, `approved`, `rejected`                                                    |
| `CAMPAIGN_STATUS`   | `draft`, `pending`, `approved`, `rejected`, `cancelled`, `completed`, `removed`      |
| `CATEGORY`          | Environment, Food Support, Community Support, Education, Humanitarian Support, Other |
| Registration status | `registered`, `cancelled`                                                            |
| Attendance          | `unmarked`, `attended`, `absent`                                                     |
| Certificate status  | `processing`, `issued`, `failed`                                                     |

| Unique index                               | Purpose                                                                                                    |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `User.email`                               | Prevent duplicate accounts for a normalized email.                                                         |
| `Organization.ownerId`                     | Allow at most one organization per organizer.                                                              |
| `Registration { volunteerId, campaignId }` | Allow at most one registration document per volunteer/campaign pair. Neither field is individually unique. |
| `Certificate.registrationId`               | Allow at most one certificate record per registration, including failed or processing attempts.            |
| `Certificate.certificateNumber`            | Give each certificate a unique reference number.                                                           |

The backend must also enforce country/timezone constants, date order, capacity limits, valid state transitions, and role/ownership checks. Use replica-set-capable MongoDB transactions for coordinated registration and capacity updates. Schemas and indexes alone do not enforce these complete workflows.

## 3. Wireframes

Eight wireframe sheets cover all **14 frontend URL patterns** and **13 page components**, including desktop and mobile examples. Creation and editing share one campaign form; the admin page has two review tabs. Rectangles with crossed lines represent images. Names, addresses, dates, and certificate numbers are illustrative.

These are low-fidelity layouts defining content, navigation, and actions. The notes beneath each screen describe behavior to implement, including permissions and important UI states.

| Sheet                            | Screens and routes                                                                                        | Files                                                                                               |
| -------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 08 — Discover and join           | Explore `/`; campaign details `/campaigns/:id`                                                            | [PNG](08-wireframes-discovery-details.png) · [SVG](08-wireframes-discovery-details.svg)             |
| 09 — Accounts                    | Signup `/signup`; login `/login`; profile `/profile`                                                      | [PNG](09-wireframes-accounts.png) · [SVG](09-wireframes-accounts.svg)                               |
| 10 — Organizations               | Public profile `/organizations/:id`; settings `/organizer/organization`                                   | [PNG](10-wireframes-organizations.png) · [SVG](10-wireframes-organizations.svg)                     |
| 11 — Manage campaigns            | Dashboard `/organizer/campaigns`; create `/organizer/campaigns/new`; edit `/organizer/campaigns/:id/edit` | [PNG](11-wireframes-campaign-management.png) · [SVG](11-wireframes-campaign-management.svg)         |
| 12 — Attendance and certificates | Participants `/organizer/campaigns/:id/participants`                                                      | [PNG](12-wireframes-attendance-certificates.png) · [SVG](12-wireframes-attendance-certificates.svg) |
| 13 — Volunteer dashboard         | My activities `/my/registrations`; my certificates `/my/certificates`                                     | [PNG](13-wireframes-volunteer.png) · [SVG](13-wireframes-volunteer.svg)                             |
| 14 — Admin moderation            | Organization and campaign tabs at `/admin`                                                                | [PNG](14-wireframes-admin.png) · [SVG](14-wireframes-admin.svg)                                     |
| 15 — Mobile layouts              | Responsive discovery `/` and campaign details `/campaigns/:id`                                            | [PNG](15-wireframes-mobile.png) · [SVG](15-wireframes-mobile.svg)                                   |

### Discover activities and view details

The home page has keyword search and governorate, area, category, and Bahrain-date filters. Cards show the campaign cover, organizer, location, time, and remaining capacity. A campaign detail page includes the description, volunteer responsibilities, organization link, venue, and registration action.

Guests who choose to register go to login. A volunteer can reserve a place immediately when eligible. Show a registered/cancel state after success; show full, closed, pending review, cancelled, or removed states where applicable. Volunteers already registered retain access to their participation record when publication status changes.

![Desktop discovery and campaign detail wireframes](08-wireframes-discovery-details.png)

### Signup, login, and profile

Signup asks for full name, email, password, optional city, and volunteer/organizer role. Volunteer signup leads to discovery; organizer signup leads to organization setup. Login shows a clear invalid-credentials error. The profile form edits name and city; email and role are read-only.

![Signup, login, and profile wireframes](09-wireframes-accounts.png)

### Organization profile and setup

The public organization page shows the approved logo, description, Bahrain address, contact information, and upcoming public campaigns. The organizer form creates or edits that information and allows an optional logo to be uploaded, replaced, or removed. Saving submits the organization for review; display pending status or rejection feedback beside the form.

![Organization profile and settings wireframes](10-wireframes-organizations.png)

### Organizer dashboard and campaign form

The dashboard lists the organizer’s campaigns with status, registration count, and eligible actions. The shared create/edit form contains title, category, description and responsibilities, Bahrain location, start/end times, capacity, and an optional cover image. Save the draft before submitting it for approval. Submission remains disabled until a saved draft and an approved organization exist.

Deletion requires confirmation and applies only to eligible never-published draft/rejected campaigns with no registrations. Cancellation preserves published campaign records. Editing a published campaign before its start triggers another review; existing registrations remain.

![Organizer dashboard and campaign editor wireframes](11-wireframes-campaign-management.png)

### Participants, attendance, and certificates

The owner views the participant list and records attendance after the campaign ends. Keep “Mark campaign completed” disabled until every active registration is marked attended or absent. The illustrated screen shows the completed state, with certificate actions for eligible attendees.

An attendee without a certificate has a “Grant certificate” action. During generation, show “Generating…” and disable duplicate actions. Failed generation exposes “Retry”; successful issuance shows “Granted.” Attendance becomes locked while a certificate is processing or issued. Cancelled registrations are excluded from attendance and certificate eligibility.

![Participant attendance and certificate action wireframes](12-wireframes-attendance-certificates.png)

### Volunteer activities and certificates

My activities separates upcoming and past participation. Upcoming registrations can be cancelled before the activity starts. Past records show campaign status, attendance, and certificate availability. My certificates lists issued certificates with preview and download controls. The PDF preview is embedded within this page and has no separate frontend route.

![Volunteer activities and certificate preview wireframes](13-wireframes-volunteer.png)

### Admin review

One admin page has organization and campaign tabs. A queue and status filter sit beside a detail panel containing the submitted content and image. The admin can approve or reject the current revision and must explain rejection. Removing a published campaign requires a reason and preserves historical records; removal is disabled for the pending example shown here.

![Organization and campaign admin review wireframes](14-wireframes-admin.png)

### Mobile behavior and shared states

Mobile navigation collapses into a menu. Campaign cards and form fields stack into one column; dashboard rows become labeled cards. A filter panel holds the discovery filters while keyword search stays visible. Keep the registration action easy to reach without covering content.

![Mobile discovery and campaign details wireframes](15-wireframes-mobile.png)

| Situation                     | Required UI behavior                                                                                |
| ----------------------------- | --------------------------------------------------------------------------------------------------- |
| Loading                       | Show a loading state and disable duplicate actions while a request runs.                            |
| Empty list                    | Explain that no results, registrations, or certificates exist and offer an appropriate next action. |
| Form validation failure       | Show field-level errors and preserve the user’s entered values.                                     |
| Upload/save failure           | Show retry feedback; retain the previous saved image until replacement succeeds.                    |
| Expired session               | Request login before continuing a protected action.                                                 |
| No remaining capacity         | Disable registration and show “Full.” Refresh capacity after a conflict.                            |
| Existing registration         | Show registration status; allow cancellation only before the start.                                 |
| Stale admin review            | Explain that the content changed and reload it before another decision.                             |
| Certificate generating/failed | Show progress or retry; expose preview/download only after issuance.                                |
| Different device timezone     | Continue displaying all activity times in Bahrain time.                                             |

Use visible field labels, keyboard-accessible controls, clear focus states, image alternative text, and text labels for status. Do not rely on color alone to distinguish approval or attendance states.

### Main user flows

1. **Volunteer:** discover → view activity → sign up/log in → register → attend → view attendance → preview/download a certificate if granted.
2. **Organizer:** sign up → create organization and optional logo → organization approval → create campaign and optional cover → campaign approval → manage participants → record attendance → complete → optionally grant certificates.
3. **Admin:** open review queue → inspect current content and image → approve or reject with feedback → remove a published campaign when needed.

## 4. Routes

The Express API has **33 endpoints**. The React frontend has **14 URL patterns** mapped to **13 page components**: `CampaignEditorPage` serves both creation and editing.

The backend runs in `tatawwu-backend`; React runs in `tatawwu-frontend`. In deployment, expose the website and `/api` through one origin. Use a frontend development proxy locally. JWT authentication uses an HttpOnly cookie, Secure in production, with SameSite=Lax and CSRF protection for mutations.

### Backend route charts

![Authentication, profile, and organization routes](03-backend-auth-organizations.png)

[Open PNG](03-backend-auth-organizations.png) · [Editable SVG](03-backend-auth-organizations.svg)

![Campaign, registration, and attendance routes](04-backend-campaigns-registration.png)

[Open PNG](04-backend-campaigns-registration.png) · [Editable SVG](04-backend-campaigns-registration.svg)

![Certificate and admin moderation routes](05-backend-certificates-admin.png)

[Open PNG](05-backend-certificates-admin.png) · [Editable SVG](05-backend-certificates-admin.svg)

### Backend route reference

Every URI below includes the `/api` prefix. The controller names identify the intended Express handlers; they are a design contract, not a claim that the application already exists.

#### Authentication & profile

| Method  | Controller       | Success status | URI                | Access    | Use case                              |
| ------- | ---------------- | -------------- | ------------------ | --------- | ------------------------------------- |
| `GET`   | `auth.csrf`      | 200            | `/api/auth/csrf`   | Public    | Get CSRF token                        |
| `POST`  | `auth.signup`    | 201            | `/api/auth/signup` | Public    | Create volunteer or organizer account |
| `POST`  | `auth.login`     | 200            | `/api/auth/login`  | Public    | Sign in and set JWT cookie            |
| `POST`  | `auth.logout`    | 204            | `/api/auth/logout` | Session   | Clear authentication cookie           |
| `GET`   | `auth.me`        | 200            | `/api/auth/me`     | Signed in | Get current account                   |
| `PATCH` | `users.updateMe` | 200            | `/api/users/me`    | Signed in | Update own name and optional city     |

#### Organizations

| Method  | Controller                      | Success status | URI                               | Access    | Use case                               |
| ------- | ------------------------------- | -------------- | --------------------------------- | --------- | -------------------------------------- |
| `GET`   | `organizations.showMine`        | 200            | `/api/organizations/me`           | Organizer | Get own organization                   |
| `POST`  | `organizations.create`          | 201            | `/api/organizations`              | Organizer | Create organization with optional logo |
| `PATCH` | `organizations.updateMine`      | 200            | `/api/organizations/me`           | Organizer | Edit profile/logo; submit for review   |
| `GET`   | `organizations.show`            | 200            | `/api/organizations/:id`          | Public    | Get approved organization              |
| `GET`   | `organizations.listMyCampaigns` | 200            | `/api/organizations/me/campaigns` | Organizer | List own campaigns in all states       |

#### Campaigns

| Method   | Controller              | Success status | URI                           | Access           | Use case                              |
| -------- | ----------------------- | -------------- | ----------------------------- | ---------------- | ------------------------------------- |
| `GET`    | `campaigns.index`       | 200            | `/api/campaigns`              | Public           | Search and filter Bahrain activities  |
| `GET`    | `campaigns.show`        | 200            | `/api/campaigns/:id`          | Visibility rules | Get visible campaign details          |
| `POST`   | `campaigns.create`      | 201            | `/api/campaigns`              | Organizer        | Create draft with optional cover      |
| `PATCH`  | `campaigns.update`      | 200            | `/api/campaigns/:id`          | Owner            | Edit campaign or cover before start   |
| `DELETE` | `campaigns.deleteDraft` | 204            | `/api/campaigns/:id`          | Owner            | Delete eligible unpublished campaign  |
| `POST`   | `campaigns.submit`      | 200            | `/api/campaigns/:id/submit`   | Owner            | Submit for admin approval             |
| `POST`   | `campaigns.cancel`      | 200            | `/api/campaigns/:id/cancel`   | Owner            | Cancel campaign; retain history       |
| `POST`   | `campaigns.complete`    | 200            | `/api/campaigns/:id/complete` | Owner            | Complete after attendance is recorded |

#### Registration & attendance

| Method  | Controller                      | Success status | URI                                 | Access     | Use case                                 |
| ------- | ------------------------------- | -------------- | ----------------------------------- | ---------- | ---------------------------------------- |
| `POST`  | `registrations.join`            | 201 / 200      | `/api/campaigns/:id/registrations`  | Volunteer  | Join or reactivate registration          |
| `GET`   | `registrations.listMine`        | 200            | `/api/registrations/me`             | Volunteer  | List own activities and attendance       |
| `PATCH` | `registrations.cancel`          | 200            | `/api/registrations/:id`            | Registrant | Cancel own registration before start     |
| `GET`   | `registrations.listForCampaign` | 200            | `/api/campaigns/:id/registrations`  | Owner      | List participants and certificate states |
| `PATCH` | `registrations.markAttendance`  | 200            | `/api/registrations/:id/attendance` | Owner      | Mark attended or absent after end        |

#### Certificates

| Method | Controller              | Success status  | URI                                  | Access    | Use case                               |
| ------ | ----------------------- | --------------- | ------------------------------------ | --------- | -------------------------------------- |
| `POST` | `certificates.issue`    | 201 / 200 / 202 | `/api/registrations/:id/certificate` | Owner     | Grant or retry an eligible certificate |
| `GET`  | `certificates.listMine` | 200             | `/api/certificates/me`               | Volunteer | List own issued certificates           |
| `GET`  | `certificates.preview`  | 200 PDF         | `/api/certificates/:id/preview`      | Recipient | Stream PDF for inline preview          |
| `GET`  | `certificates.download` | 200 PDF         | `/api/certificates/:id/download`     | Recipient | Download protected certificate PDF     |

#### Admin moderation

| Method  | Controller                 | Success status | URI                                   | Access | Use case                              |
| ------- | -------------------------- | -------------- | ------------------------------------- | ------ | ------------------------------------- |
| `GET`   | `admin.listOrganizations`  | 200            | `/api/admin/organizations`            | Admin  | List organization review records      |
| `PATCH` | `admin.reviewOrganization` | 200            | `/api/admin/organizations/:id/review` | Admin  | Approve/reject current revision       |
| `GET`   | `admin.listCampaigns`      | 200            | `/api/admin/campaigns`                | Admin  | List campaign review records          |
| `PATCH` | `admin.reviewCampaign`     | 200            | `/api/admin/campaigns/:id/review`     | Admin  | Approve/reject current revision       |
| `PATCH` | `admin.removeCampaign`     | 200            | `/api/admin/campaigns/:id/remove`     | Admin  | Remove published campaign with reason |

### Response and access notes

- **Owner:** the organizer who owns the campaign's organization. **Registrant:** the volunteer who owns the registration. **Recipient:** the volunteer to whom the certificate was issued.
- **Public organization access:** approved organizations only. **Campaign visibility rules:** public discovery lists upcoming approved campaigns from approved organizations; campaign details also allow appropriate access for the owner, admins, and previously registered volunteers. Historical participants retain access to campaign status and their records after cancellation, pending re-review, or removal.
- `200` returns a successful read or update. `201` indicates creation. `204` has no response body.
- Registration POST returns `201` for a new registration document and `200` for an existing active registration or a reactivated cancelled registration. An existing active registration must not reserve another place. Reactivation still requires eligibility and capacity.
- Certificate POST returns `201` when first successfully issued, `200` if already issued, or `202` while generation is processing. A generation failure is never reported as an issued certificate. Retrying reuses the certificate record and number.
- PDF preview and download return `application/pdf`, with `Cache-Control: private, no-store`. Preview uses inline content disposition; download uses attachment disposition. Both require recipient authorization and stream through Express; Cloudinary delivery URLs remain internal.
- JSON responses use `{ data }`; list responses add pagination metadata. Errors use `{ error: { code, message, fields? } }`.
- Errors use `400` for invalid input/files, `401` for missing or expired authentication, `403` for forbidden actions, `404` for missing or inaccessible records, `409` for state/capacity/revision conflicts, `413` for oversized files, and `503` for temporary media-service failure.
- React guards control navigation. Express verifies JWT signature/expiry, current role, ownership, and workflow eligibility on every protected request. Frontend role checks do not grant API access.

### Request conventions

- Discovery accepts `q`, `governorate`, `area`, `category`, `from`, `to`, and `page`; return 12 campaigns per page ordered by start time.
- Interpret campaign form dates and date filters in Bahrain time. Store timestamps in UTC and display them in `Asia/Bahrain`. The server assigns `country: BH` and `timezone: Asia/Bahrain`, rejecting conflicting submitted values.
- Organization and campaign saves accept multipart form data: JSON in `data` and an optional file in `image`. `removeImage: true` removes the saved image; it cannot accompany a replacement file. Cloudinary uploads use these resource endpoints, not separate public upload endpoints.
- Review requests carry `decision`, `reason`, and the reviewed `revision`; rejection and removal require a reason. A stale review cannot approve a newer revision.
- Attendance updates accept `attended` or `absent`; the registration cancellation endpoint accepts `status: cancelled`.
- The backend derives account, organization, owner, issuer, and stored asset identifiers. Clients cannot select arbitrary Cloudinary deletion targets.
- Campaign deletion is restricted to never-published draft/rejected campaigns without registrations. Published campaigns use cancellation or admin removal to preserve history.
- In Express, register the static `/organizations/me` path before `/organizations/:id` so that `me` is not treated as an identifier.

### Frontend route chart

![Frontend routes, page components, and access](06-frontend-routes.png)

[Open PNG](06-frontend-routes.png) · [Editable SVG](06-frontend-routes.svg)

### Frontend route reference

| URL pattern                             | Page component             | Access           | Page purpose                                                                  |
| --------------------------------------- | -------------------------- | ---------------- | ----------------------------------------------------------------------------- |
| `/`                                     | `ExplorePage`              | Public           | Discover activities; filter by governorate, area, category and Bahrain dates. |
| `/campaigns/:id`                        | `CampaignDetailsPage`      | Visibility rules | View activity details and register/cancel when allowed.                       |
| `/organizations/:id`                    | `OrganizationDetailsPage`  | Public           | View an approved organization and its public campaigns.                       |
| `/signup`                               | `SignupPage`               | Guest            | Create a volunteer or organizer account.                                      |
| `/login`                                | `LoginPage`                | Guest            | Sign in with email and password.                                              |
| `/profile`                              | `ProfilePage`              | Signed in        | Edit name and optional city.                                                  |
| `/my/registrations`                     | `MyActivitiesPage`         | Volunteer        | View upcoming/past activities and attendance.                                 |
| `/my/certificates`                      | `MyCertificatesPage`       | Volunteer        | Preview and download own issued certificates.                                 |
| `/organizer/organization`               | `OrganizationSettingsPage` | Organizer        | Create/edit organization information and logo.                                |
| `/organizer/campaigns`                  | `OrganizerDashboard`       | Organizer        | Manage own campaigns and view approval states.                                |
| `/organizer/campaigns/new`              | `CampaignEditorPage`       | Organizer        | Create a campaign draft and optional cover image.                             |
| `/organizer/campaigns/:id/edit`         | `CampaignEditorPage`       | Owner            | Edit an eligible campaign and its cover image.                                |
| `/organizer/campaigns/:id/participants` | `ParticipantsPage`         | Owner            | Record attendance, complete activity, grant certificates.                     |
| `/admin`                                | `AdminDashboard`           | Admin            | Review organizations/campaigns and remove inappropriate listings.             |

## 5. Component hierarchy

The image follows the example's conventions: **orange** is the `App` root, **green** is a page with a frontend route, and **yellow** is a wrapper or nested component without its own route. Arrows connect direct parents and children. Public, volunteer, organizer, and admin group labels organize the drawing; they do not add page routes.

![React component hierarchy](07-component-hierarchy.png)

[Open PNG](07-component-hierarchy.png) · [Editable SVG](07-component-hierarchy.svg)

### Readable hierarchy

```text
App
└── AuthProvider
    └── Router
        └── AppLayout
            ├── Navbar
            ├── PageOutlet
            │   ├── ExplorePage                          /
            │   │   ├── CampaignFilters
            │   │   │   ├── GovernorateSelect
            │   │   │   └── AreaFilter
            │   │   ├── CampaignGrid
            │   │   │   └── CampaignCard
            │   │   │       └── CloudinaryImage
            │   │   └── Pagination
            │   ├── CampaignDetailsPage                  /campaigns/:id
            │   │   ├── CloudinaryImage
            │   │   ├── OrganizationSummary
            │   │   ├── BahrainDateTime
            │   │   └── RegistrationAction
            │   ├── OrganizationDetailsPage              /organizations/:id
            │   │   ├── OrganizationSummary
            │   │   └── CampaignGrid
            │   │       └── CampaignCard
            │   │           └── CloudinaryImage
            │   ├── SignupPage                           /signup
            │   │   └── SignupForm
            │   ├── LoginPage                            /login
            │   │   └── LoginForm
            │   └── RequireAuth
            │       ├── ProfilePage                      /profile
            │       │   └── ProfileForm
            │       ├── RequireRole: volunteer
            │       │   ├── MyActivitiesPage             /my/registrations
            │       │   │   └── RegistrationCard
            │       │   └── MyCertificatesPage           /my/certificates
            │       │       ├── CertificateCard
            │       │       └── CertificatePreview
            │       ├── RequireRole: organizer
            │       │   ├── OrganizationSettingsPage     /organizer/organization
            │       │   │   └── OrganizationForm
            │       │   │       └── ImagePicker
            │       │   ├── OrganizerDashboard           /organizer/campaigns
            │       │   │   └── CampaignTable
            │       │   ├── CampaignEditorPage           /organizer/campaigns/new
            │       │   │                               /organizer/campaigns/:id/edit
            │       │   │   └── CampaignForm
            │       │   │       └── ImagePicker
            │       │   └── ParticipantsPage             /organizer/campaigns/:id/participants
            │       │       ├── AttendanceTable
            │       │       ├── CompleteCampaignButton
            │       │       └── CertificateGrantAction
            │       └── RequireRole: admin
            │           └── AdminDashboard              /admin
            │               ├── OrganizationReviewQueue
            │               ├── CampaignReviewQueue
            │               └── ReviewPanel
            │                   └── CloudinaryImage
            └── Footer
```

### Component responsibilities

| Component                     | Responsibility                                                                                                               |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `AuthProvider`                | Restore and expose current account state; support login and logout.                                                          |
| `RequireAuth` / `RequireRole` | Restrict frontend navigation based on session and role. Ownership remains enforced by the API.                               |
| `CampaignFilters`             | Collect category, governorate, area, keyword, and Bahrain date filters.                                                      |
| `BahrainDateTime`             | Render UTC timestamps consistently as Bahrain local time.                                                                    |
| `ImagePicker`                 | Select and preview a local logo/cover; request replacement or removal when the parent form saves.                            |
| `CloudinaryImage`             | Display a suitably sized public campaign image or organization logo, with accessible text and a placeholder when absent.     |
| `RegistrationAction`          | Display the correct join/cancel/full/closed state and invoke registration actions.                                           |
| `AttendanceTable`             | Display participants and record attended/absent states after the activity ends.                                              |
| `CompleteCampaignButton`      | Complete the campaign only after the end time and after all active registrations have attendance recorded.                   |
| `CertificateGrantAction`      | Grant/retry eligible certificates and display generating, failed, or issued state.                                           |
| `CertificatePreview`          | Preview the authorized PDF streamed from the backend; it has no separate frontend route.                                     |
| `ReviewPanel`                 | Show submitted content and image, collect feedback, and approve/reject the reviewed revision or remove a published campaign. |

Reusable controls include `Button`, `FormField`, `GovernorateSelect`, `AreaFilter`, `StatusBadge`, `ConfirmDialog`, `LoadingState`, `EmptyState`, and `ErrorState`. Repeated appearances in the tree represent reuse under different parents, not additional page components.

### Repository handoff

Keep a copy of this specification and the relevant images in each repository, or maintain one shared version linked from both repository READMEs. The frontend owns the page components and UI states; the backend owns all authorization, validation, capacity, approval, attendance, and media rules.

Suggested backend configuration includes `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. Cloudinary and JWT secrets stay on the backend. The frontend calls `/api` through the same-origin deployment proxy. Pin dependency versions and add actual installation, development, test, and deployment commands when each repository is scaffolded.

Before the application is accepted, verify complete volunteer, organizer, and admin flows; ownership denial; duplicate and simultaneous registration; capacity conflicts; review of edited content; image replacement failure; and certificate grant/retry and recipient-only access. These are implementation checks to run when the code exists.

### Technical references

- [Bahrain: location and governorates](https://www.bahrain.gov.bh/wps/portal/en/BNP/BahrainAtAGlance/AboutBahrain)
- [MongoDB transactions](https://www.mongodb.com/docs/manual/core/transactions/)
- [Cloudinary upload parameters and delivery types](https://cloudinary.com/documentation/upload_parameters)
- [Cloudinary Node.js uploads](https://cloudinary.com/documentation/node_image_and_video_upload)
- [Cloudinary asset deletion](https://cloudinary.com/documentation/delete_assets)
