/**
 * Pure validation logic for the business registration form.
 * Extracted from the registration page so it can be unit-tested and reused.
 */
import type { BusinessFormData } from '@/lib/types/business-form';

export type ValidationResult = {
    isValid: boolean;
    error: string | null;
};

export function validateStep(step: number, formData: BusinessFormData): ValidationResult {
    let isValid = true;
    let error: string | null = null;

    switch (step) {
        case 1:
            if (!formData.name) {
                isValid = false; error = 'Bedrijfsnaam is verplicht.';
            } else if (!formData.category) {
                isValid = false; error = 'Selecteer een categorie.';
            } else if (!formData.subcategories || formData.subcategories.length === 0) {
                isValid = false; error = 'Selecteer minimaal één subcategorie.';
            } else if (!formData.shortDescription) {
                isValid = false; error = 'Korte omschrijving is verplicht.';
            }
            break;

        case 2:
            if (!formData.street) {
                isValid = false; error = 'Straat en huisnummer zijn verplicht.';
            } else if (!formData.postalCode) {
                isValid = false; error = 'Postcode is verplicht.';
            } else if (!formData.city) {
                isValid = false; error = 'Stad is verplicht.';
            } else if (!formData.province) {
                isValid = false; error = 'Provincie is verplicht.';
            } else if (!formData.phone) {
                isValid = false; error = 'Telefoonnummer is verplicht.';
            } else if (!formData.email) {
                isValid = false; error = 'E-mailadres is verplicht.';
            } else if (!formData.website) {
                isValid = false; error = 'Website is verplicht.';
            } else {
                try {
                    new URL(formData.website.startsWith('http') ? formData.website : `https://${formData.website}`);
                } catch {
                    isValid = false; error = 'Voer een geldige website URL in.';
                }
            }
            break;

        case 3: {
            const validServices = formData.services.filter(s => s.name.trim().length > 0);
            if (validServices.length < 3) {
                isValid = false; error = 'Voeg minimaal 3 diensten of producten toe.';
            }
            break;
        }

        case 4:
            if (!formData.coverImage) {
                isValid = false; error = 'Een omslagfoto is verplicht.';
            }
            break;

        case 5: {
            const answeredFaqs = (formData.faq || []).filter(
                item => item.question?.trim() && item.answer?.trim()
            );
            if (answeredFaqs.length < 5) {
                isValid = false; error = 'Beantwoord minimaal 5 SEO-vragen.';
            } else if (!formData.kvkNumber) {
                isValid = false; error = 'KVK-nummer is verplicht.';
            } else if (formData.ctaType === 'booking' && !formData.bookingUrl) {
                isValid = false; error = "Vul een reserveringslink in wanneer u 'Reserveren' als actieknop kiest.";
            }
            break;
        }
    }

    return { isValid, error };
}
