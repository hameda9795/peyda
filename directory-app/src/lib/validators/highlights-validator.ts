/**
 * Highlights Validator v3.2
 *
 * Validates and filters AI-generated content to remove fabricated claims.
 * Features:
 * - Dutch number word detection (twee, honderden, etc.)
 * - Strict year/experience validation (requires foundedYear)
 * - Decade detection (jaren '90, jaren negentig, etc.)
 * - Location claim validation (requires actual location data)
 * - Sentence-level sanitization (no broken sentences)
 * - Generic phrase removal (feature flag: SANITIZER_REMOVE_GENERIC=true)
 */

interface FormData {
    name?: string;
    street?: string;
    postalCode?: string;
    city?: string;
    neighborhood?: string;
    serviceArea?: string;
    foundedYear?: number | string;
    certifications?: string[];
    amenities?: string[];
    services?: { name: string; description?: string; price?: string }[];
    [key: string]: any;
}

interface ValidationResult {
    original: string[];
    validated: string[];
    removed: { highlight: string; reason: string }[];
}

interface TextSanitizeResult {
    original: string;
    sanitized: string;
    removedSentences: string[];
}

// Dutch number words (een tot duizend)
const DUTCH_NUMBER_WORDS = [
    'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien',
    'elf', 'twaalf', 'dertien', 'veertien', 'vijftien', 'zestien', 'zeventien', 'achttien', 'negentien',
    'twintig', 'dertig', 'veertig', 'vijftig', 'zestig', 'zeventig', 'tachtig', 'negentig',
    'honderd', 'honderden', 'duizend', 'duizenden', 'talloze', 'vele', 'ontelbare', 'tientallen',
    'enkele', 'meerdere', 'diverse', 'verschillende'
];

const DUTCH_NUM_PATTERN = `(?:\\d+|${DUTCH_NUMBER_WORDS.join('|')})`;

// Location-related keywords that require validation
const LOCATION_KEYWORDS = [
    'gelegen', 'gevestigd', 'adres', 'straat', 'wijk', 'buurt',
    'centrum', 'hart van', 'midden van', 'nabij', 'dichtbij',
    'bereikbaar', 'postcode', 'locatie'
];

// Year/experience keywords that require foundedYear
const YEAR_EXPERIENCE_KEYWORDS = [
    'jaar', 'jaren', 'actief', 'ervaring', 'experience',
    'opgericht', 'gestart', 'begonnen', 'sinds', 'established'
];

// Patterns for certification claims
const CERTIFICATION_PATTERNS = [
    /gecertificeerd/i, /certificering/i, /certified/i, /erkend/i,
    /gediplomeerd/i, /ISO\s*\d+/i, /VCA/i, /keurmerk/i,
];

// Patterns for amenity claims
const AMENITY_KEYWORDS = [
    'parkeren', 'parking', 'parkeergelegenheid', 'wifi', 'wi-fi',
    'rolstoel', 'wheelchair', 'toegankelijk', 'mindervalide',
    'airco', 'airconditioning', 'klimaatbeheersing',
    'bezorg', 'delivery', 'thuisbezorg', 'afhaal', 'pickup', 'take away',
    'terras', 'tuin', 'speeltuin', 'speelhoek', 'kinderhoek'
];

// Dutch decade words for pattern matching
const DUTCH_DECADE_WORDS = [
    'vijftig', 'zestig', 'zeventig', 'tachtig', 'negentig'
];

// Decade numeric patterns (50, 60, 70, 80, 90, '50, '60, etc.)
const DECADE_NUMBERS = ['50', '60', '70', '80', '90', "'50", "'60", "'70", "'80", "'90",
                        "'50", "'60", "'70", "'80", "'90"];

/**
 * Check if text contains a year/experience claim
 * Comprehensive detection including decades and vague experience claims
 */
function containsYearExperienceClaim(text: string): boolean {
    const lowerText = text.toLowerCase();

    // === NUMERIC PATTERNS ===
    // X jaar (any number + jaar)
    if (/\d+\s*jaar/i.test(text)) return true;
    // sinds YYYY
    if (/sinds\s*\d{4}/i.test(text)) return true;

    // === DUTCH NUMBER WORD + JAAR/JAREN ===
    const yearWordPattern = new RegExp(`(${DUTCH_NUMBER_WORDS.join('|')})\\s*(jaar|jaren)`, 'i');
    if (yearWordPattern.test(text)) return true;

    // === DECADE PATTERNS ===
    // "jaren 90", "jaren '90", "jaren negentig", etc.
    const decadePatterns = [
        /jaren\s*['']?\d{2}/i,                          // jaren 90, jaren '90, jaren '90
        /jaren\s*['']?\s*\d{2}/i,                       // jaren ' 90 (with space)
        new RegExp(`jaren\\s*(${DUTCH_DECADE_WORDS.join('|')})`, 'i'),  // jaren negentig
        /de\s*jaren\s*['']?\d{2}/i,                     // de jaren 90
        new RegExp(`de\\s*jaren\\s*(${DUTCH_DECADE_WORDS.join('|')})`, 'i'),  // de jaren negentig
        /sinds\s*de\s*jaren/i,                          // sinds de jaren
    ];
    for (const pattern of decadePatterns) {
        if (pattern.test(text)) return true;
    }

    // === VAGUE EXPERIENCE PHRASES ===
    const vagueExperiencePatterns = [
        /al\s+jaren/i,                    // "al jaren"
        /jarenlang/i,                     // "jarenlang", "jarenlange"
        /jaren\s*ervaring/i,              // "jaren ervaring"
        /veel\s+jaren/i,                  // "veel jaren"
        /vele\s+jaren/i,                  // "vele jaren"
        /ruime\s+ervaring/i,              // "ruime ervaring"
        /lange\s+ervaring/i,              // "lange ervaring"
        /brede\s+ervaring/i,              // "brede ervaring"
        /uitgebreide\s+ervaring/i,        // "uitgebreide ervaring"
        /meer\s+dan.*jaar/i,              // "meer dan X jaar"
        /ruim.*jaar/i,                    // "ruim X jaar"
        /al.*jaar.*actief/i,              // "al X jaar actief"
        /jaar\s*(ervaring|experience|actief|bezig)/i,  // "jaar ervaring/actief"
        /ervaren\s+in/i,                  // "ervaren in" (implies experience)
        /ervaren\s+team/i,                // "ervaren team"
        /ervaren\s+specialist/i,          // "ervaren specialist"
        /met\s+ervaring/i,                // "met ervaring"
        /onze\s+ervaring/i,               // "onze ervaring"
    ];
    for (const pattern of vagueExperiencePatterns) {
        if (pattern.test(text)) return true;
    }

    return false;
}

/**
 * Check if text contains a location claim
 */
function containsLocationClaim(text: string): boolean {
    const lowerText = text.toLowerCase();
    return LOCATION_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

/**
 * Validate location claim against actual form data
 */
function validateLocationClaim(text: string, formData: FormData): { isValid: boolean; reason?: string } {
    if (!containsLocationClaim(text)) {
        return { isValid: true }; // Not a location claim
    }

    const lowerText = text.toLowerCase();
    const locationValues = [
        formData.street,
        formData.neighborhood,
        formData.city,
        formData.serviceArea,
        formData.postalCode
    ].filter(Boolean).map(v => v!.toLowerCase());

    if (locationValues.length === 0) {
        return { isValid: false, reason: 'Locatie claim zonder locatiegegevens in formData' };
    }

    // Check if any location value is mentioned in the text
    const hasMatch = locationValues.some(location => {
        // Check for exact or partial match
        const words = location.split(/\s+/);
        return words.some(word => word.length > 3 && lowerText.includes(word));
    });

    if (!hasMatch) {
        return {
            isValid: false,
            reason: `Locatie claim bevat geen bekende locatie uit formData: ${locationValues.join(', ')}`
        };
    }

    return { isValid: true };
}

/**
 * Check if a highlight/text contains fabricated claims
 */
function containsFabricatedClaim(text: string, formData: FormData): { isFabricated: boolean; reason?: string } {
    const lowerText = text.toLowerCase();

    // === CUSTOMER COUNT CLAIMS (always fabricated) ===
    const customerPatterns = [
        /\d+\s*(tevreden\s+)?(klanten|cliënten)/i,
        new RegExp(`(${DUTCH_NUMBER_WORDS.join('|')})\\s*(tevreden\\s+)?(klanten|cliënten)`, 'i'),
        /honderden\s+(tevreden\s+)?(klanten|cliënten)/i,
        /duizenden\s+(tevreden\s+)?(klanten|cliënten)/i,
        /talloze\s+(tevreden\s+)?(klanten|cliënten)/i,
        /vele\s+(tevreden\s+)?(klanten|cliënten)/i,
        /klanten\s*(geholpen|bediend|tevreden)/i,
    ];

    for (const pattern of customerPatterns) {
        if (pattern.test(text)) {
            return { isFabricated: true, reason: 'Gefabriceerde klantenaantal claim - geen data beschikbaar' };
        }
    }

    // === RESPONSE TIME CLAIMS (always fabricated) ===
    const responseTimePatterns = [
        /binnen\s*\d+\s*(uur|minuut|minuten|uren|dag|dagen)/i,
        new RegExp(`binnen\\s*(${DUTCH_NUMBER_WORDS.join('|')})\\s*(uur|uren|minuut|minuten|dag|dagen)`, 'i'),
        /reactie(tijd)?\s*(binnen|in)\s*\d+/i,
        /respons(tijd)?\s*(binnen|in)\s*\d+/i,
    ];

    for (const pattern of responseTimePatterns) {
        if (pattern.test(text)) {
            return { isFabricated: true, reason: 'Gefabriceerde responstijd claim - geen data beschikbaar' };
        }
    }

    // === PERCENTAGE CLAIMS (always fabricated) ===
    if (/\d+\s*%/i.test(text) || new RegExp(`(${DUTCH_NUMBER_WORDS.join('|')})\\s*procent`, 'i').test(text)) {
        return { isFabricated: true, reason: 'Gefabriceerde percentage claim - geen data beschikbaar' };
    }

    // === YEAR/EXPERIENCE CLAIMS - STRICT VALIDATION ===
    if (containsYearExperienceClaim(text)) {
        if (!formData.foundedYear) {
            return { isFabricated: true, reason: 'Jaren/ervaring claim zonder foundedYear in formData' };
        }

        // Validate specific year numbers if present
        const yearNumMatch = text.match(/(\d+)\s*jaar/i);
        if (yearNumMatch) {
            const claimedYears = parseInt(yearNumMatch[1]);
            const actualYears = new Date().getFullYear() - parseInt(String(formData.foundedYear));
            if (Math.abs(claimedYears - actualYears) > 1) {
                return {
                    isFabricated: true,
                    reason: `Verkeerde jaren claim: ${claimedYears} genoemd, maar ${actualYears} berekend`
                };
            }
        }

        // Validate "sinds YYYY" claims
        const sinceMatch = text.match(/sinds\s*(\d{4})/i);
        if (sinceMatch) {
            const claimedYear = parseInt(sinceMatch[1]);
            const actualYear = parseInt(String(formData.foundedYear));
            if (claimedYear !== actualYear) {
                return {
                    isFabricated: true,
                    reason: `Verkeerd jaar: ${claimedYear} genoemd, maar ${actualYear} in data`
                };
            }
        }
    }

    // === PROJECT/JOB COUNT CLAIMS (always fabricated) ===
    const projectPatterns = [
        /\d+\s*(projecten|klussen|opdrachten|werkzaamheden)/i,
        new RegExp(`(${DUTCH_NUMBER_WORDS.join('|')})\\s*(projecten|klussen|opdrachten)`, 'i'),
        /honderden\s+projecten/i,
        /duizenden\s+projecten/i,
    ];

    for (const pattern of projectPatterns) {
        if (pattern.test(text)) {
            return { isFabricated: true, reason: 'Gefabriceerde projecten/klussen aantal - geen data beschikbaar' };
        }
    }

    // === LOCATION CLAIMS - STRICT VALIDATION ===
    const locationValidation = validateLocationClaim(text, formData);
    if (!locationValidation.isValid) {
        return { isFabricated: true, reason: locationValidation.reason };
    }

    return { isFabricated: false };
}

/**
 * Check if a certification claim matches actual certifications
 */
function validateCertificationClaim(highlight: string, formData: FormData): { isValid: boolean; reason?: string } {
    const certifications = formData.certifications || [];
    const hasCertClaim = CERTIFICATION_PATTERNS.some(pattern => pattern.test(highlight));

    if (!hasCertClaim) return { isValid: true };

    if (certifications.length === 0) {
        return { isValid: false, reason: 'Certificering claim zonder certificeringen in data' };
    }

    const highlightLower = highlight.toLowerCase();
    const matchesCert = certifications.some(cert => {
        const certLower = cert.toLowerCase();
        return highlightLower.includes(certLower) ||
               certLower.split(' ').some(word => word.length > 2 && highlightLower.includes(word));
    });

    if (!matchesCert) {
        return { isValid: false, reason: `Certificering niet in data: ${certifications.join(', ')}` };
    }

    return { isValid: true };
}

/**
 * Check if an amenity claim matches actual amenities
 */
function validateAmenityClaim(highlight: string, formData: FormData): { isValid: boolean; reason?: string } {
    const amenities = formData.amenities || [];
    const highlightLower = highlight.toLowerCase();

    const mentionedAmenity = AMENITY_KEYWORDS.find(keyword => highlightLower.includes(keyword));
    if (!mentionedAmenity) return { isValid: true };

    if (amenities.length === 0) {
        return { isValid: false, reason: 'Faciliteit claim zonder faciliteiten in data' };
    }

    const amenitiesLower = amenities.map(a => a.toLowerCase());
    const matchesAmenity = amenitiesLower.some(amenity => {
        // Map common variations
        if (highlightLower.includes('parkeren') || highlightLower.includes('parking')) {
            return amenity.includes('parkeren') || amenity.includes('parking');
        }
        if (highlightLower.includes('wifi') || highlightLower.includes('wi-fi')) {
            return amenity.includes('wifi') || amenity.includes('wi-fi') || amenity.includes('internet');
        }
        if (highlightLower.includes('rolstoel') || highlightLower.includes('toegankelijk')) {
            return amenity.includes('rolstoel') || amenity.includes('toegankelijk');
        }
        if (highlightLower.includes('bezorg')) {
            return amenity.includes('bezorg') || amenity.includes('delivery');
        }
        if (highlightLower.includes('terras')) {
            return amenity.includes('terras');
        }
        return highlightLower.includes(amenity);
    });

    if (!matchesAmenity) {
        return { isValid: false, reason: `Faciliteit niet in data: ${amenities.join(', ')}` };
    }

    return { isValid: true };
}

/**
 * Main validation function for array items (highlights, trustSignals)
 */
export function validateHighlights(highlights: string[], formData: FormData): ValidationResult {
    const result: ValidationResult = {
        original: [...highlights],
        validated: [],
        removed: [],
    };

    for (const highlight of highlights) {
        // Check fabricated claims (includes year/location validation)
        const fabricationCheck = containsFabricatedClaim(highlight, formData);
        if (fabricationCheck.isFabricated) {
            result.removed.push({ highlight, reason: fabricationCheck.reason || 'Gefabriceerde claim' });
            continue;
        }

        // Check certification claims
        const certCheck = validateCertificationClaim(highlight, formData);
        if (!certCheck.isValid) {
            result.removed.push({ highlight, reason: certCheck.reason || 'Ongeldige certificering' });
            continue;
        }

        // Check amenity claims
        const amenityCheck = validateAmenityClaim(highlight, formData);
        if (!amenityCheck.isValid) {
            result.removed.push({ highlight, reason: amenityCheck.reason || 'Ongeldige faciliteit' });
            continue;
        }

        result.validated.push(highlight);
    }

    return result;
}

/**
 * Check if a sentence contains forbidden patterns
 */
function sentenceContainsForbiddenPattern(sentence: string, formData: FormData): boolean {
    // Customer counts
    if (/\d+\s*(tevreden\s+)?(klanten|cliënten)/i.test(sentence)) return true;
    if (new RegExp(`(${DUTCH_NUMBER_WORDS.join('|')})\\s*(tevreden\\s+)?(klanten|cliënten)`, 'i').test(sentence)) return true;
    if (/klanten\s*(geholpen|bediend)/i.test(sentence)) return true;

    // Response times
    if (/binnen\s*(\d+|${DUTCH_NUMBER_WORDS.join('|')})\s*(uur|uren|minuut|minuten|dag|dagen)/i.test(sentence)) return true;
    if (/reactie(tijd)?\s*(binnen|in)/i.test(sentence)) return true;

    // Percentages
    if (/\d+\s*%/i.test(sentence)) return true;
    if (/procent\s*(tevreden|positief)/i.test(sentence)) return true;

    // Project counts
    if (/\d+\s*(projecten|klussen|opdrachten)/i.test(sentence)) return true;
    if (new RegExp(`(${DUTCH_NUMBER_WORDS.join('|')})\\s*(projecten|klussen)`, 'i').test(sentence)) return true;

    // Year/experience without foundedYear
    if (!formData.foundedYear) {
        if (containsYearExperienceClaim(sentence)) return true;
    }

    // Location claims without location data
    const hasLocationData = formData.street || formData.city || formData.neighborhood || formData.serviceArea;
    if (!hasLocationData && containsLocationClaim(sentence)) {
        return true;
    }

    return false;
}

/**
 * Split text into sentences (handles HTML and plain text)
 */
function splitIntoSentences(text: string): string[] {
    // First, protect HTML tags
    const tagPlaceholders: string[] = [];
    let protectedText = text.replace(/<[^>]+>/g, (match) => {
        tagPlaceholders.push(match);
        return `__TAG${tagPlaceholders.length - 1}__`;
    });

    // Split on sentence boundaries
    const sentences = protectedText.split(/(?<=[.!?])\s+/);

    // Restore HTML tags
    return sentences.map(s => {
        return s.replace(/__TAG(\d+)__/g, (_, index) => tagPlaceholders[parseInt(index)]);
    });
}

/**
 * Sanitize text using sentence-level removal (no broken sentences)
 */
export function sanitizeText(text: string, formData: FormData): TextSanitizeResult {
    if (!text || typeof text !== 'string') {
        return { original: text || '', sanitized: text || '', removedSentences: [] };
    }

    const removedSentences: string[] = [];

    // Handle HTML content: split by block-level tags
    const isHtml = /<[^>]+>/.test(text);

    if (isHtml) {
        // Process HTML paragraph by paragraph
        let sanitized = text;

        // Split by paragraph/block tags
        const blocks = text.split(/(<\/?(?:p|li|h[1-6]|div)[^>]*>)/i);
        let result = '';
        let currentBlock = '';

        for (const part of blocks) {
            if (/<\/?(?:p|li|h[1-6]|div)/i.test(part)) {
                // This is a tag
                if (currentBlock.trim()) {
                    // Process the accumulated text
                    if (sentenceContainsForbiddenPattern(currentBlock, formData)) {
                        removedSentences.push(currentBlock.trim());
                    } else {
                        result += currentBlock;
                    }
                    currentBlock = '';
                }
                result += part;
            } else {
                // This is text content - process sentence by sentence
                const sentences = splitIntoSentences(part);
                for (const sentence of sentences) {
                    if (sentence.trim()) {
                        if (sentenceContainsForbiddenPattern(sentence, formData)) {
                            removedSentences.push(sentence.trim());
                        } else {
                            currentBlock += sentence + ' ';
                        }
                    }
                }
            }
        }

        // Don't forget the last block
        if (currentBlock.trim()) {
            if (sentenceContainsForbiddenPattern(currentBlock, formData)) {
                removedSentences.push(currentBlock.trim());
            } else {
                result += currentBlock;
            }
        }

        // Clean up empty tags and excessive whitespace
        sanitized = result
            .replace(/<(p|li|div)[^>]*>\s*<\/\1>/gi, '') // Remove empty tags
            .replace(/<(p|li)[^>]*>\s+/gi, '<$1>') // Clean whitespace in tags
            .replace(/\s+<\/(p|li|div)>/gi, '</$1>') // Clean whitespace before closing
            .replace(/\s{2,}/g, ' ')
            .trim();

        return { original: text, sanitized, removedSentences };
    } else {
        // Plain text: process sentence by sentence
        const sentences = splitIntoSentences(text);
        const keptSentences: string[] = [];

        for (const sentence of sentences) {
            if (sentence.trim()) {
                if (sentenceContainsForbiddenPattern(sentence, formData)) {
                    removedSentences.push(sentence.trim());
                } else {
                    keptSentences.push(sentence.trim());
                }
            }
        }

        const sanitized = keptSentences.join(' ');
        return { original: text, sanitized, removedSentences };
    }
}

// ============================================================================
// GENERIC PHRASE REMOVAL (Feature Flag: SANITIZER_REMOVE_GENERIC=true)
// ============================================================================

/**
 * List of generic phrases that provide no E-E-A-T value
 * These are removed ONLY when SANITIZER_REMOVE_GENERIC=true
 * Case-insensitive matching with whitespace normalization
 */
const GENERIC_PHRASES: RegExp[] = [
    // Partner/service claims
    /\bbetrouwbare\s+partner\b/i,
    /\bbetrouwbaar\s+bedrijf\b/i,
    /\bprofessionele\s+dienstverlening\b/i,
    /\bprofessionele\s+service\b/i,
    /\bprofessioneel\s+bedrijf\b/i,

    // Quality claims without proof
    /\bkwaliteit\s+staat\s+(voorop|centraal)\b/i,
    /\bhoge\s+kwaliteit\b/i,
    /\btop\s+kwaliteit\b/i,
    /\bbeste\s+(service|kwaliteit|dienstverlening)\b/i,
    /\btop\s+service\b/i,

    // Customer-centric claims without proof
    /\bpersoonlijke\s+aanpak\b/i,
    /\bpersoonlijke\s+service\b/i,
    /\bpersoonlijke\s+aandacht\b/i,
    /\bklant\s+staat\s+centraal\b/i,
    /\bklantgericht\b/i,

    // Availability claims without data
    /\baltijd\s+bereikbaar\b/i,
    /\bsnelle\s+service\b/i,
    /\bsnel\s+en\s+vakkundig\b/i,

    // Vague trust claims
    /\bu\s+kunt\s+op\s+ons\s+rekenen\b/i,
    /\bwij\s+staan\s+voor\s+u\s+klaar\b/i,
    /\bgeen\s+verrassingen\b/i,
    /\btransparante\s+prijzen\b/i,
    /\beerlijke\s+prijzen\b/i,
];

/**
 * Check if text contains actual form data that makes it valuable
 * If true, don't remove even if it matches generic patterns
 */
function containsRealFormData(text: string, formData: FormData): boolean {
    const lowerText = text.toLowerCase();

    // Check location data
    const locationValues = [
        formData.street,
        formData.neighborhood,
        formData.city,
        formData.serviceArea,
    ].filter(Boolean).map(v => v!.toLowerCase());

    for (const location of locationValues) {
        const words = location.split(/\s+/);
        if (words.some(word => word.length > 3 && lowerText.includes(word))) {
            return true; // Contains real location
        }
    }

    // Check certifications
    const certifications = (formData.certifications || []).map(c => c.toLowerCase());
    for (const cert of certifications) {
        if (cert.length > 2 && lowerText.includes(cert)) {
            return true; // Contains real certification
        }
    }

    // Check amenities
    const amenities = (formData.amenities || []).map(a => a.toLowerCase());
    for (const amenity of amenities) {
        const words = amenity.split(/\s+/);
        if (words.some(word => word.length > 3 && lowerText.includes(word))) {
            return true; // Contains real amenity
        }
    }

    // Check services
    const services = (formData.services || []).map(s => s.name?.toLowerCase()).filter(Boolean);
    for (const service of services) {
        const words = service.split(/\s+/);
        if (words.some(word => word.length > 3 && lowerText.includes(word))) {
            return true; // Contains real service
        }
    }

    return false;
}

/**
 * Check if text is a generic phrase
 */
function isGenericPhrase(text: string): boolean {
    const normalizedText = text.trim().toLowerCase().replace(/\s+/g, ' ');
    return GENERIC_PHRASES.some(pattern => pattern.test(normalizedText));
}

/**
 * Remove generic phrases from highlights/trustSignals
 * ONLY runs when SANITIZER_REMOVE_GENERIC=true
 *
 * @returns Object with kept items and removed items with reasons
 */
export function removeGenericPhrases(
    items: string[],
    formData: FormData
): { kept: string[]; removed: { item: string; reason: string }[] } {
    const kept: string[] = [];
    const removed: { item: string; reason: string }[] = [];

    for (const item of items) {
        // First check if item contains real form data - if so, always keep
        if (containsRealFormData(item, formData)) {
            kept.push(item);
            continue;
        }

        // Check if item matches generic patterns
        if (isGenericPhrase(item)) {
            removed.push({ item, reason: 'Generieke claim zonder specifieke waarde' });
            continue;
        }

        // Item passed all checks
        kept.push(item);
    }

    return { kept, removed };
}

/**
 * Check if generic phrase removal feature is enabled
 */
function isGenericRemovalEnabled(): boolean {
    return process.env.SANITIZER_REMOVE_GENERIC === 'true';
}

// ============================================================================

/**
 * Sanitize FAQ answers
 */
export function sanitizeFaq(faq: { question: string; answer: string }[], formData: FormData): { question: string; answer: string }[] {
    if (!Array.isArray(faq)) return faq;

    return faq.map(item => {
        const result = sanitizeText(item.answer, formData);
        return {
            question: item.question,
            answer: result.sanitized || 'Neem contact met ons op voor meer informatie.'
        };
    });
}

/**
 * Main sanitization function - sanitizes all generated content
 */
export function sanitizeGeneratedContent(generatedContent: any, formData: FormData): any {
    if (!generatedContent) return generatedContent;

    const sanitized = { ...generatedContent };
    const log = process.env.NODE_ENV === 'development';

    // 1. Validate highlights (array)
    if (Array.isArray(sanitized.highlights)) {
        const validationResult = validateHighlights(sanitized.highlights, formData);
        sanitized.highlights = validationResult.validated;

        if (log && validationResult.removed.length > 0) {
            console.log('[Sanitizer] Removed highlights:');
            validationResult.removed.forEach(({ highlight, reason }) => {
                console.log(`  ❌ "${highlight}" → ${reason}`);
            });
        }

        // Generic phrase removal (only if feature flag is enabled)
        if (isGenericRemovalEnabled()) {
            const genericResult = removeGenericPhrases(sanitized.highlights, formData);
            sanitized.highlights = genericResult.kept;

            if (log && genericResult.removed.length > 0) {
                console.log('[Sanitizer] Removed generic highlights:');
                genericResult.removed.forEach(({ item, reason }) => {
                    console.log(`  🔸 "${item}" → ${reason}`);
                });
            }
        }
    }

    // 2. Validate trustSignals (array)
    if (sanitized.brand?.trustSignals && Array.isArray(sanitized.brand.trustSignals)) {
        const trustValidation = validateHighlights(sanitized.brand.trustSignals, formData);
        sanitized.brand = { ...sanitized.brand, trustSignals: trustValidation.validated };

        if (log && trustValidation.removed.length > 0) {
            console.log('[Sanitizer] Removed trustSignals:');
            trustValidation.removed.forEach(({ highlight, reason }) => {
                console.log(`  ❌ "${highlight}" → ${reason}`);
            });
        }

        // Generic phrase removal for trustSignals (only if feature flag is enabled)
        if (isGenericRemovalEnabled()) {
            const genericTrustResult = removeGenericPhrases(sanitized.brand.trustSignals, formData);
            sanitized.brand = { ...sanitized.brand, trustSignals: genericTrustResult.kept };

            if (log && genericTrustResult.removed.length > 0) {
                console.log('[Sanitizer] Removed generic trustSignals:');
                genericTrustResult.removed.forEach(({ item, reason }) => {
                    console.log(`  🔸 "${item}" → ${reason}`);
                });
            }
        }
    }

    // 3. Sanitize longDescription (HTML text) - sentence level
    if (sanitized.longDescription && typeof sanitized.longDescription === 'string') {
        const descResult = sanitizeText(sanitized.longDescription, formData);
        sanitized.longDescription = descResult.sanitized;

        if (log && descResult.removedSentences.length > 0) {
            console.log('[Sanitizer] Removed sentences from longDescription:');
            descResult.removedSentences.forEach(s => console.log(`  ❌ "${s}"`));
        }
    }

    // 4. Sanitize seo.localSeoText - sentence level
    if (sanitized.seo?.localSeoText && typeof sanitized.seo.localSeoText === 'string') {
        const seoResult = sanitizeText(sanitized.seo.localSeoText, formData);
        sanitized.seo = { ...sanitized.seo, localSeoText: seoResult.sanitized };

        if (log && seoResult.removedSentences.length > 0) {
            console.log('[Sanitizer] Removed sentences from seo.localSeoText:');
            seoResult.removedSentences.forEach(s => console.log(`  ❌ "${s}"`));
        }
    }

    // 5. Sanitize brand.overviewSentence - sentence level
    if (sanitized.brand?.overviewSentence && typeof sanitized.brand.overviewSentence === 'string') {
        const overviewResult = sanitizeText(sanitized.brand.overviewSentence, formData);
        sanitized.brand = { ...sanitized.brand, overviewSentence: overviewResult.sanitized };

        if (log && overviewResult.removedSentences.length > 0) {
            console.log('[Sanitizer] Removed sentences from brand.overviewSentence:');
            overviewResult.removedSentences.forEach(s => console.log(`  ❌ "${s}"`));
        }
    }

    // 6. Sanitize FAQ answers
    if (Array.isArray(sanitized.faq)) {
        const originalFaq = JSON.stringify(sanitized.faq);
        sanitized.faq = sanitizeFaq(sanitized.faq, formData);

        if (log && JSON.stringify(sanitized.faq) !== originalFaq) {
            console.log('[Sanitizer] FAQ answers sanitized');
        }
    }

    return sanitized;
}

export default validateHighlights;
