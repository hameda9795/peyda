-- Update gallery with proper JSON format containing alt-texts
UPDATE businesses
SET gallery = '[
  {"url": "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800", "altText": "Barista maakt koffie achter de counter"},
  {"url": "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=800", "altText": "Gezellige inrichting met natuurlijk licht"},
  {"url": "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800", "altText": "Ambachtelijke gebakjes in de vitrine"},
  {"url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800", "altText": "Sfeerimpressie van het restaurant"}
]'::jsonb
WHERE slug = 'de-koffie-kamer-utrecht';
