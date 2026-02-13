# Test Plan: Rating Fallback & AI Sanitizer Fixes

## Overview
This document provides a step-by-step test plan to verify:
1. **Goal 1**: Rating fallback removal (no fake 4.5 ratings)
2. **Goal 2**: AI fabrication prevention in ALL content fields

## Security
Debug tools are **blocked in production** unless `DEBUG_TOOLS=true` is set:
- `/dev/ai-sanitizer` → Returns 404
- `/api/debug/*` → Returns 404

## Coverage (v2.0)
The sanitizer now covers **all text fields**:
- `highlights` (array) ✅
- `brand.trustSignals` (array) ✅
- `longDescription` (HTML text) ✅ NEW
- `seo.localSeoText` (text) ✅ NEW
- `brand.overviewSentence` (text) ✅ NEW
- `faq[].answer` (text array) ✅ NEW

## Dutch Number Words Detection
Now detects **word-based numbers** in Dutch:
```
een, twee, drie, vier, vijf, zes, zeven, acht, negen, tien,
honderd, honderden, duizend, duizenden, talloze, vele, ontelbare
```
Examples detected: "binnen twee uur", "honderden klanten", "talloze projecten"

---

## 🛠️ Debug Tools Available

### 1. Dev Page: AI Sanitizer Tester
**URL:** `http://localhost:3000/dev/ai-sanitizer`

Interactive page to test the sanitizer without creating a business:
- Pre-loaded test scenarios (click buttons to load)
- Paste custom AI JSON to test
- Shows raw vs sanitized comparison
- Shows exactly what was removed

### 2. Debug API: Test Any Submission
**URL:** `GET /api/debug/submission/{submissionId}`

Returns detailed comparison for an existing submission:
```json
{
  "comparison": {
    "highlights": { "raw": [...], "sanitized": [...], "removed": [...] },
    "trustSignals": { "raw": [...], "sanitized": [...], "removed": [...] }
  },
  "summary": { "highlightsRemoved": 2, "trustSignalsRemoved": 1 }
}
```

### 3. Console Logging
When `NODE_ENV=development`, the generate route logs:
- Raw highlights from AI
- Sanitized highlights
- Removed items
- Form data used for validation

Look for `========== SANITIZER DEBUG ==========` in terminal.

---

## 📋 Test Scenarios

---

### Scenario A: No Reviews (Rating Display)

**Goal:** Verify rating = null when reviewCount = 0

#### Test Data
Create or find a business with:
```
reviewCount: 0
rating: 0 (or any value - should be ignored)
```

#### Steps
1. Go to a business listing page with no reviews
2. Check these UI locations:
   - Homepage category scroll sections
   - Category page business cards
   - Search results
   - `/beste/{city}/{category}` page

#### Expected Results
| Location | Should Show | Should NOT Show |
|----------|-------------|-----------------|
| Business card rating | "Nieuw" badge | Star + number |
| Beste page | "Nog geen reviews" | "4.5" or any number |
| Structured data | No aggregateRating | ratingValue |

#### How to Verify
1. **UI**: Look for "Nieuw" badge or "Nog geen reviews"
2. **HTML Source**: Search for `"aggregateRating"` - should NOT exist if no reviews
3. **DevTools**: Check component props for `rating: null`

#### Common Failure Signs
- ⚠️ See "4.5" with star → Old fallback code still present
- ⚠️ See rating but reviewCount is 0 → Check `business.ts` actions

---

### Scenario B: AI Number Bait

**Goal:** Verify AI doesn't fabricate numeric claims

#### Test Data (Form Input)
```
name: "Test Loodgieter Utrecht"
street: "Voorstraat 123"
city: "Utrecht"
neighborhood: "Centrum"
certifications: []          ← EMPTY
amenities: []               ← EMPTY
foundedYear: null           ← NOT SET
services: [{ name: "Lekkage reparatie" }]
```

#### Steps
1. Submit business via `/bedrijf-aanmelden`
2. Wait for AI generation to complete
3. Check the debug endpoint: `GET /api/debug/submission/{id}`

#### Expected Results
Highlights should NOT contain:
- ❌ "Reactie binnen X uur/minuten"
- ❌ "X+ klanten geholpen"
- ❌ "X% tevreden/klanttevredenheid"
- ❌ "X jaar ervaring"
- ❌ Any number-based claims

Allowed:
- ✅ "Gelegen aan Voorstraat"
- ✅ "In het hart van Centrum"
- ✅ "Specialist in lekkage reparatie"

#### How to Verify
```bash
# Check submission
curl http://localhost:3000/api/debug/submission/{submissionId}
```

Look at `removed.highlights` - should contain the fabricated items.

#### Or Use Dev Page
1. Go to `http://localhost:3000/dev/ai-sanitizer`
2. Click "Scenario B: AI Number Bait" button
3. Click "Run Sanitizer Test"
4. Verify removed items are shown in red

---

### Scenario C: Amenities Validation

**Goal:** Only selected amenities should appear in highlights

#### Test Data
```
amenities: ["Wi-Fi"]        ← ONLY Wi-Fi selected
certifications: []
foundedYear: null
```

#### Test in Dev Page
1. Go to `http://localhost:3000/dev/ai-sanitizer`
2. Click "Scenario C: Amenities Validation"
3. Run test

#### Expected Results
| AI Output | Action |
|-----------|--------|
| "Gratis Wi-Fi beschikbaar" | ✅ KEEP |
| "Rolstoeltoegankelijk" | ❌ REMOVE |
| "Ruime parkeerplaats" | ❌ REMOVE |
| "Bezorgservice mogelijk" | ❌ REMOVE |

---

### Scenario D: Empty Certifications

**Goal:** No certification claims when certifications = []

#### Test Data
```
certifications: []          ← EMPTY
amenities: []
foundedYear: 2015          ← HAS year (allowed)
```

#### Test in Dev Page
1. Go to `http://localhost:3000/dev/ai-sanitizer`
2. Click "Scenario D: Empty Certifications"
3. Run test

#### Expected Results
| AI Output | Action |
|-----------|--------|
| "ISO 9001 gecertificeerd" | ❌ REMOVE |
| "VCA gecertificeerd" | ❌ REMOVE |
| "Erkend leerbedrijf" | ❌ REMOVE |
| "Sinds 2015 actief" | ✅ KEEP (year is valid) |
| "Specialist in renovatie" | ✅ KEEP |

---

### Scenario E: Mixed Real + Fake Data

**Goal:** Keep valid claims, remove invalid ones

#### Test Data
```
certifications: ["VCA"]     ← HAS VCA
amenities: ["Wi-Fi"]        ← HAS Wi-Fi
foundedYear: 2010           ← HAS year
```

#### Expected Results
| AI Output | Action | Reason |
|-----------|--------|--------|
| "Sinds 2010 actief" | ✅ KEEP | Year matches |
| "VCA gecertificeerd" | ✅ KEEP | Cert in list |
| "Gratis Wi-Fi" | ✅ KEEP | Amenity in list |
| "ISO gecertificeerd" | ❌ REMOVE | Not in certs |
| "Parkeerplaats" | ❌ REMOVE | Not in amenities |
| "500+ klanten" | ❌ REMOVE | Fabricated number |

---

## 🔍 Full Integration Test

### Create Real Business Submission

1. **Navigate to:** `http://localhost:3000/bedrijf-aanmelden`

2. **Fill form with TEST data:**
```
Naam: TEST - Sanitizer Check
Categorie: [Any]
Straat: Teststraat 123
Postcode: 3511 AB
Stad: Utrecht
Wijk: Centrum

Services: Schoonmaakdienst
Certificeringen: [LEAVE EMPTY]
Faciliteiten: [SELECT ONLY: Wi-Fi]
Opgericht: [LEAVE EMPTY]

Email: test@test.nl
```

3. **Submit and wait for AI generation**

4. **Check debug endpoint:**
```
GET /api/debug/submission/{submissionId}
```

5. **Verify in response:**
- `removed.highlights` should contain fabricated items
- `sanitized.highlights` should only have valid items

6. **Check preview page:** `/bedrijf-aanmelden/preview/{submissionId}`
- Look at Highlights section
- Should NOT show:
  - "X klanten"
  - "binnen X uur"
  - "X jaar ervaring"
  - Any certification claims
  - Amenities other than Wi-Fi

---

## 📊 Summary Table

| Test | Steps | Expected | Verify How | Failure Signs |
|------|-------|----------|------------|---------------|
| **A: No Reviews** | View business with reviewCount=0 | "Nieuw" badge, no rating number | UI inspection | Shows "4.5" or stars |
| **B: AI Numbers** | Create business, empty form | No numeric claims in highlights | Debug endpoint | "X klanten", "binnen X uur" |
| **C: Amenities** | Only Wi-Fi selected | Only Wi-Fi in highlights | Dev page test | "Parkeren", "Bezorging" shown |
| **D: Certs Empty** | No certifications | No "gecertificeerd" | Dev page test | "ISO", "VCA" shown |
| **E: Mixed** | Some real, some fake | Keep real, remove fake | Debug endpoint | Fake items kept |

---

## 🐛 Troubleshooting

### Sanitizer Not Removing Items

1. Check if validator is imported in route:
   ```typescript
   import { sanitizeGeneratedContent } from '@/lib/validators/highlights-validator';
   ```

2. Check if sanitize is called:
   ```typescript
   const generatedContent = sanitizeGeneratedContent(rawGeneratedContent, formData);
   ```

3. Check regex patterns in `highlights-validator.ts`

### Rating Still Shows 4.5

Search codebase for:
```bash
grep -r "|| 4.5" src/
grep -r "rating || " src/
```

All should be replaced with:
```typescript
rating: b.reviewCount > 0 ? b.rating : null
```

### Debug Endpoint Returns 404

Ensure you're in development mode:
```bash
NODE_ENV=development npm run dev
```

---

## ✅ Test Completion Checklist

- [ ] Scenario A: No reviews shows "Nieuw" (not rating)
- [ ] Scenario B: No fabricated numbers in highlights
- [ ] Scenario C: Only selected amenities pass
- [ ] Scenario D: No certifications = no cert claims
- [ ] Scenario E: Mixed data filtered correctly
- [ ] Console logs show sanitizer debug output
- [ ] Dev page `/dev/ai-sanitizer` works
- [ ] Debug endpoint `/api/debug/submission/{id}` works

---

## 📁 Related Files

- `src/lib/validators/highlights-validator.ts` - Sanitizer logic
- `src/app/api/business/generate/route.ts` - AI generation + sanitize
- `src/app/api/business/approve/[id]/route.ts` - Approval + sanitize
- `src/app/dev/ai-sanitizer/page.tsx` - Test UI
- `src/app/api/debug/sanitizer/route.ts` - Test API
- `src/app/api/debug/submission/[id]/route.ts` - Submission debug

---

## 🔄 Before/After Examples (v3.0)

### Example 1: Year Claims Without foundedYear

**FormData:** `{ foundedYear: null }` (no year data)

| Field | Before (Raw AI) | After (Sanitized) | Reason |
|-------|-----------------|-------------------|--------|
| highlights | "Meer dan tien jaar actief" | ❌ REMOVED | Year claim without foundedYear |
| highlights | "Vijf jaar ervaring" | ❌ REMOVED | Year claim without foundedYear |
| highlights | "Al jaren bezig" | ❌ REMOVED | Year claim without foundedYear |
| trustSignals | "Sinds 2015 actief" | ❌ REMOVED | Year claim without foundedYear |
| trustSignals | "Specialist in Utrecht" | ✅ KEPT | No year claim |

### Example 2: Location Claims Without Location Data

**FormData:** `{ street: '', city: '', neighborhood: '' }` (no location data)

| Field | Before (Raw AI) | After (Sanitized) | Reason |
|-------|-----------------|-------------------|--------|
| highlights | "Gelegen aan Oudegracht" | ❌ REMOVED | Location claim, no data |
| highlights | "In het hart van Amsterdam" | ❌ REMOVED | Location claim, no data |
| highlights | "Gevestigd in Rotterdam" | ❌ REMOVED | Location claim, no data |
| highlights | "Specialist in loodgieten" | ✅ KEPT | Not a location claim |

### Example 3: Location Claims WITH Data (Strict Match)

**FormData:** `{ street: 'Teststraat 1', city: 'Utrecht', neighborhood: 'Centrum' }`

| Field | Before (Raw AI) | After (Sanitized) | Reason |
|-------|-----------------|-------------------|--------|
| highlights | "Gelegen in Utrecht" | ✅ KEPT | Matches city |
| highlights | "In het hart van Centrum" | ✅ KEPT | Matches neighborhood |
| highlights | "Gelegen aan de Oudegracht" | ❌ REMOVED | "Oudegracht" not in formData |
| highlights | "Gevestigd in Amsterdam" | ❌ REMOVED | "Amsterdam" not in formData |

### Example 2: Mixed Valid/Invalid

**FormData:** `{ certifications: ["VCA"], amenities: ["Wi-Fi"], foundedYear: 2010 }`

| Field | Before (Raw AI) | After (Sanitized) | Reason |
|-------|-----------------|-------------------|--------|
| highlights | "VCA gecertificeerd" | ✅ KEPT | VCA in formData |
| highlights | "ISO 9001 gecertificeerd" | ❌ REMOVED | Not in certs |
| highlights | "Gratis Wi-Fi" | ✅ KEPT | Wi-Fi in amenities |
| highlights | "Parkeerplaats beschikbaar" | ❌ REMOVED | Not in amenities |
| highlights | "16 jaar ervaring" | ✅ KEPT | 2026-2010=16 ✓ |
| highlights | "500+ klanten" | ❌ REMOVED | No customer data |
| trustSignals | "Binnen 30 min reactie" | ❌ REMOVED | No response time data |
| brand.overviewSentence | "Met 500 klanten en VCA" | "Met VCA" | 500 klanten removed |
| faq.answer | "Reactie binnen 2 uur" | "" | Fabricated claim |

### Example 4: Sentence-Level Sanitization (Clean Output)

**FormData:** `{ city: 'Utrecht', foundedYear: null }`

**Before (longDescription):**
```html
<h3>Over ons</h3>
<p>Wij zijn een professioneel bedrijf in Utrecht. Al 1000+ klanten geholpen met onze diensten. Kwaliteit staat bij ons voorop.</p>
<p>Met 20 jaar ervaring zijn wij specialist. Onze medewerkers zijn goed opgeleid.</p>
```

**After (longDescription):**
```html
<h3>Over ons</h3>
<p>Wij zijn een professioneel bedrijf in Utrecht. Kwaliteit staat bij ons voorop.</p>
<p>Onze medewerkers zijn goed opgeleid.</p>
```

**Removed Sentences:**
- "Al 1000+ klanten geholpen met onze diensten." (customer count)
- "Met 20 jaar ervaring zijn wij specialist." (year claim without foundedYear)

### Example 5: FAQ Sanitization (Sentence-Level)

**FormData:** `{ foundedYear: null }`

**Before:**
```json
{
  "faq": [
    { "question": "Hoe snel?", "answer": "Binnen 2 uur ter plaatse met 98% tevredenheidsgarantie. Wij staan 24/7 voor u klaar." },
    { "question": "Ervaring?", "answer": "Al 15 jaar actief met 500+ tevreden klanten. Onze service is professioneel." }
  ]
}
```

**After:**
```json
{
  "faq": [
    { "question": "Hoe snel?", "answer": "Wij staan 24/7 voor u klaar." },
    { "question": "Ervaring?", "answer": "Onze service is professioneel." }
  ]
}
```

**Note:** Complete sentences are removed, not partial text. If all sentences are removed, the answer becomes: "Neem contact met ons op voor meer informatie."

---

## 🆕 Strict Validation Rules (v3.0)

### Rule 1: Year/Experience Claims (v3.1 - Comprehensive)
Any text matching these patterns is **ONLY allowed** if `foundedYear` exists in formData.

**Detected Patterns:**
- Numeric: `X jaar`, `sinds YYYY`
- Dutch words: `tien jaar`, `vijftien jaren`
- Vague phrases: `al jaren`, `jarenlange`, `ruime ervaring`, `ervaren team`
- Decades: `jaren 90`, `jaren '90`, `jaren negentig`, `de jaren tachtig`

| FormData | Input | Result |
|----------|-------|--------|
| `foundedYear: null` | "Meer dan tien jaar actief" | ❌ REMOVED |
| `foundedYear: null` | "Al jaren ervaring" | ❌ REMOVED |
| `foundedYear: null` | "Jarenlange ervaring" | ❌ REMOVED |
| `foundedYear: null` | "Ruime ervaring in de sector" | ❌ REMOVED |
| `foundedYear: null` | "Sinds de jaren 90 bezig" | ❌ REMOVED |
| `foundedYear: null` | "Sinds de jaren '90" | ❌ REMOVED |
| `foundedYear: null` | "De jaren negentig" | ❌ REMOVED |
| `foundedYear: null` | "Ervaren specialist" | ❌ REMOVED |
| `foundedYear: 2010` | "16 jaar ervaring" | ✅ KEPT (2026-2010=16) |
| `foundedYear: 2010` | "Sinds 2010 actief" | ✅ KEPT |

### Rule 2: Location Claims
Any text containing `gelegen`, `gevestigd`, `adres`, `straat`, `wijk`, `centrum`, `hart van` is **ONLY valid** if it contains a value from formData (street, city, neighborhood, serviceArea).

| FormData | Input | Result |
|----------|-------|--------|
| `city: ''` | "Gelegen aan Oudegracht" | ❌ REMOVED |
| `city: ''` | "In het hart van Utrecht" | ❌ REMOVED |
| `city: 'Utrecht'` | "Gelegen in Utrecht" | ✅ KEPT |
| `city: 'Utrecht'` | "In het hart van Amsterdam" | ❌ REMOVED |

### Rule 3: Sentence-Level Sanitization
Text fields are sanitized at the **sentence level** - complete sentences are removed, never partial text.

**Before:** "Wij helpen 500 klanten. Kwaliteit staat voorop."
**After:** "Kwaliteit staat voorop." (clean, no broken text)

---

## 🆕 Test Scenarios in Dev Page

**URL:** `/dev/ai-sanitizer`

| Button | Tests |
|--------|-------|
| "Dutch Words + Location" | Dutch numbers + location validation (no location data) |
| "Year Claims (Strict)" | ALL year/experience patterns including decades |
| "Decade Patterns" | Decade format variations ('90, negentig, etc.) |
| "Location Claims (Strict)" | Location claims with partial matches |
| "Sentence Sanitization" | Clean sentence-level removal |

---

## 🐛 Bug Fixes in v3.1

### Fixed: Year/Experience Leaks

**Before v3.1 (bug):** These were incorrectly KEPT with `foundedYear: null`:
```
"Sinds de jaren 90 bezig" → KEPT (bug!)
"Al jaren ervaring" → KEPT (bug!)
"Jarenlange ervaring" → KEPT (bug!)
```

**After v3.1 (fixed):** All are now correctly REMOVED:
```
"Sinds de jaren 90 bezig" → REMOVED ✅
"Al jaren ervaring" → REMOVED ✅
"Jarenlange ervaring" → REMOVED ✅
"Ruime ervaring" → REMOVED ✅
"Ervaren team" → REMOVED ✅
"De jaren negentig" → REMOVED ✅
```

### New Patterns Added in v3.1:
- `al jaren` - vague "years"
- `jarenlang(e)` - "years of"
- `ruime ervaring` - "extensive experience"
- `ervaren (team|specialist)` - "experienced"
- `jaren '90|jaren 90|jaren negentig` - decade patterns
- All decade words: vijftig, zestig, zeventig, tachtig, negentig

---

## 🆕 Generic Phrase Removal (v3.2 - Feature Flag)

### Enabling the Feature
```bash
SANITIZER_REMOVE_GENERIC=true npm run dev
```

When **disabled** (default): No change in behavior
When **enabled**: Generic phrases are removed from `highlights[]` and `brand.trustSignals[]`

### Generic Phrases List
| Pattern | Example |
|---------|---------|
| `betrouwbare partner` | "Betrouwbare partner" |
| `professionele dienstverlening` | "Professionele dienstverlening" |
| `kwaliteit staat voorop/centraal` | "Kwaliteit staat voorop" |
| `persoonlijke aanpak` | "Persoonlijke aanpak" |
| `klant staat centraal` | "Klant staat centraal" |
| `altijd bereikbaar` | "Altijd bereikbaar" |
| `snelle service` | "Snelle service" |
| `beste service/kwaliteit` | "Beste service" |
| `top kwaliteit/service` | "Top kwaliteit" |
| `u kunt op ons rekenen` | "U kunt op ons rekenen" |
| `eerlijke/transparante prijzen` | "Eerlijke prijzen" |

### Protection: Real Data Keeps Items
Items are **NOT removed** if they contain:
- Location data (city, neighborhood, street, serviceArea)
- Certifications
- Amenities
- Services

### Test Scenario
**URL:** `/dev/ai-sanitizer` → Click "Generic Phrases"

| Input | With Flag OFF | With Flag ON | Reason |
|-------|---------------|--------------|--------|
| "Betrouwbare partner" | ✅ KEPT | ❌ REMOVED | Generic |
| "Professionele dienstverlening" | ✅ KEPT | ❌ REMOVED | Generic |
| "Specialist in Utrecht" | ✅ KEPT | ✅ KEPT | Contains city |
| "VCA gecertificeerd" | ✅ KEPT | ✅ KEPT | Contains cert |
| "Gratis Wi-Fi" | ✅ KEPT | ✅ KEPT | Contains amenity |

### Before/After Example

**FormData:** `{ city: 'Utrecht', certifications: ['VCA'], amenities: ['Wi-Fi'] }`

**Flag OFF (default):**
```
highlights: [
  "Betrouwbare partner",           // kept
  "Specialist in Utrecht",          // kept
  "VCA gecertificeerd",             // kept
  "Persoonlijke aanpak"             // kept
]
```

**Flag ON (SANITIZER_REMOVE_GENERIC=true):**
```
highlights: [
  "Specialist in Utrecht",          // kept - contains city
  "VCA gecertificeerd",             // kept - contains cert
]
// Removed: "Betrouwbare partner", "Persoonlijke aanpak"
```
