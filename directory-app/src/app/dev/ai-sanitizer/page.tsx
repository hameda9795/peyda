'use client';

import { useState, useEffect } from 'react';

// Test scenarios with pre-filled data - including Dutch number words
const TEST_SCENARIOS = {
    'scenario-b-ai-bait': {
        name: 'B: AI Number Bait',
        description: 'Tests numeric fabrication detection',
        rawContent: {
            highlights: [
                'Reactie binnen 2 uur',
                '500+ tevreden klanten',
                '98% klanttevredenheid',
                'Gelegen aan Voorstraat',
                '15 jaar ervaring',
                'Gratis parkeren'
            ],
            brand: {
                trustSignals: [
                    'Al 1000+ klanten geholpen',
                    'Binnen 30 minuten reactie',
                    'In het hart van Utrecht',
                    'ISO gecertificeerd'
                ],
                overviewSentence: 'Met meer dan 500 tevreden klanten en 98% tevredenheid is dit de beste keuze.'
            },
            longDescription: '<p>Wij hebben al 1000 klanten geholpen en reageren binnen 2 uur.</p>',
            seo: {
                localSeoText: 'Met 15 jaar ervaring en 500+ projecten zijn wij de specialist.'
            }
        },
        formData: {
            name: 'Test Bedrijf',
            street: 'Voorstraat 123',
            neighborhood: 'Centrum',
            city: 'Utrecht',
            certifications: [],
            amenities: [],
            foundedYear: null
        }
    },
    'scenario-dutch-words': {
        name: 'Dutch Words + Location',
        description: 'Tests Dutch numbers AND location validation (no location data)',
        rawContent: {
            highlights: [
                'Binnen twee uur reactie',
                'Honderden tevreden klanten',
                'Vijf jaar ervaring',
                'Duizenden projecten afgerond',
                'Gelegen aan Oudegracht',  // Should be REMOVED - no location in formData!
                'Talloze klanten geholpen',
                'In het hart van Amsterdam' // Should be REMOVED - no location in formData!
            ],
            brand: {
                trustSignals: [
                    'Meer dan tien jaar actief', // Should be REMOVED - no foundedYear!
                    'Honderd projecten per jaar',
                    'Vele tevreden klanten',
                    'Gevestigd in Utrecht',     // Should be REMOVED - no location!
                    'Specialist in diensten'    // Should be KEPT - no location claim
                ]
            },
            longDescription: '<p>Met honderden tevreden klanten en binnen twee uur reactie.</p><p>Gelegen in het centrum zijn wij goed bereikbaar.</p>',
        },
        formData: {
            name: 'Test Bedrijf',
            // NO location data at all!
            street: '',
            city: '',
            neighborhood: '',
            certifications: [],
            amenities: [],
            foundedYear: null  // NO year data!
        }
    },
    'scenario-c-amenities': {
        name: 'C: Amenities',
        description: 'Only selected amenities should pass',
        rawContent: {
            highlights: [
                'Gratis Wi-Fi beschikbaar',
                'Rolstoeltoegankelijk',
                'Ruime parkeerplaats',
                'Bezorgservice mogelijk',
                'Gelegen in Lombok'
            ],
            brand: {
                trustSignals: [
                    'Wi-Fi voor klanten',
                    'Parkeren bij de deur',
                    'Bezorging in heel Utrecht'
                ]
            }
        },
        formData: {
            name: 'Test Bedrijf',
            certifications: [],
            amenities: ['Wi-Fi'],
            foundedYear: null
        }
    },
    'scenario-d-certifications': {
        name: 'D: Certifications',
        description: 'Empty certifications = no cert claims',
        rawContent: {
            highlights: [
                'ISO 9001 gecertificeerd',
                'VCA gecertificeerd bedrijf',
                'Erkend leerbedrijf',
                'Specialist in renovatie',
                'Gelegen aan Oudegracht'
            ],
            brand: {
                trustSignals: [
                    'Gecertificeerd vakmanschap',
                    'VCA* gecertificeerd',
                    'Lokaal en betrouwbaar'
                ]
            }
        },
        formData: {
            name: 'Test Bedrijf',
            certifications: [],
            amenities: [],
            foundedYear: 2015
        }
    },
    'scenario-mixed': {
        name: 'Mixed Valid + Invalid',
        description: 'Some real data, some fabricated',
        rawContent: {
            highlights: [
                'Sinds 2010 actief in Utrecht',
                'Reactie binnen 1 uur gegarandeerd',
                'VCA gecertificeerd',
                'Gratis Wi-Fi',
                '2000+ projecten afgerond',
                'Gelegen aan Biltstraat'
            ],
            brand: {
                trustSignals: [
                    '16 jaar ervaring',
                    '99% tevreden klanten',
                    'VCA gecertificeerd team',
                    'Wi-Fi voor bezoekers'
                ],
                overviewSentence: 'Met VCA certificering en 16 jaar ervaring is dit bedrijf uw beste keuze voor Wi-Fi installatie.'
            },
            longDescription: '<p>Sinds 2010 actief met VCA certificering. Al honderden projecten afgerond.</p>',
            seo: {
                localSeoText: 'VCA gecertificeerd met 16 jaar ervaring in Utrecht.'
            },
            faq: [
                { question: 'Hoe snel reageren jullie?', answer: 'Wij reageren binnen 2 uur op alle aanvragen.' },
                { question: 'Zijn jullie gecertificeerd?', answer: 'Ja, wij zijn VCA gecertificeerd.' }
            ]
        },
        formData: {
            name: 'Bouwbedrijf Utrecht',
            street: 'Biltstraat 45',
            neighborhood: 'Oost',
            city: 'Utrecht',
            certifications: ['VCA'],
            amenities: ['Wi-Fi'],
            foundedYear: 2010
        }
    },
    'scenario-text-fields': {
        name: 'Sentence Sanitization',
        description: 'Tests clean sentence-level removal (no broken text)',
        rawContent: {
            highlights: ['Gelegen aan Mariaplaats'],
            brand: {
                trustSignals: ['Specialist in Utrecht'],
                overviewSentence: 'Met 500 tevreden klanten en binnen twee uur reactie is dit de beste loodgieter van Utrecht met 95% tevredenheid.'
            },
            longDescription: `<h3>Over ons</h3>
<p>Wij zijn een professioneel bedrijf in Utrecht. Al 1000+ klanten geholpen met onze diensten. Kwaliteit staat bij ons voorop.</p>
<p>Met 20 jaar ervaring zijn wij specialist. Onze medewerkers zijn goed opgeleid.</p>
<h3>Waarom ons kiezen</h3>
<ul>
<li>Binnen twee uur ter plaatse bij spoedgevallen</li>
<li>Wij gebruiken alleen hoogwaardige materialen</li>
<li>98% tevredenheidsgarantie op al onze projecten</li>
</ul>`,
            seo: {
                localSeoText: 'Professionele dienstverlening in Utrecht. Met 500 klanten en 15 jaar ervaring de beste keuze. Neem vandaag nog contact op.'
            },
            faq: [
                { question: 'Hoe snel?', answer: 'Binnen 2 uur ter plaatse met 98% tevredenheidsgarantie. Wij staan 24/7 voor u klaar.' },
                { question: 'Hoeveel klanten?', answer: 'Al meer dan 500 tevreden klanten geholpen. Onze service is persoonlijk en professioneel.' }
            ]
        },
        formData: {
            name: 'Test Loodgieter',
            street: 'Mariaplaats 10',
            city: 'Utrecht',
            neighborhood: 'Centrum',
            certifications: [],
            amenities: [],
            foundedYear: null
        }
    },
    'scenario-year-strict': {
        name: 'Year Claims (Strict)',
        description: 'Tests ALL year/experience patterns including decades',
        rawContent: {
            highlights: [
                // Numeric patterns
                'Meer dan tien jaar actief',
                '15 jaar ervaring',
                'Sinds 2015 actief',
                // Vague experience phrases (MUST BE REMOVED)
                'Al jaren ervaring',
                'Jarenlange ervaring',
                'Ruime ervaring in de sector',
                'Ervaren team van specialisten',
                // Decade patterns (MUST BE REMOVED)
                'Actief sinds de jaren 90',
                "Sinds de jaren '80 bezig",
                'Al sinds de jaren negentig',
                // Should be KEPT (no year claim)
                'Specialist in Utrecht',
                'Professionele dienstverlening'
            ],
            brand: {
                trustSignals: [
                    'Vijftien jaar ervaring',
                    'Al vele jaren actief',
                    'Sinds de jaren 90 bezig',
                    'Met jarenlange expertise',
                    'Lokale specialist'  // Should be KEPT
                ]
            },
            longDescription: '<p>Met jarenlange ervaring zijn wij specialist. Onze kwaliteit staat voorop.</p><p>Al sinds de jaren negentig actief in Utrecht.</p>'
        },
        formData: {
            name: 'Test Bedrijf',
            street: 'Oudegracht 100',
            city: 'Utrecht',
            neighborhood: 'Centrum',
            certifications: [],
            amenities: [],
            foundedYear: null  // NO year - ALL year claims should be removed!
        }
    },
    'scenario-decade-patterns': {
        name: 'Decade Patterns',
        description: 'Tests all decade format variations',
        rawContent: {
            highlights: [
                // All these should be REMOVED when foundedYear=null
                "Sinds de jaren '90",
                "Sinds de jaren '90",  // curly quote
                'Sinds de jaren 90',
                'Actief in de jaren tachtig',
                'Begonnen in de jaren zeventig',
                'De jaren negentig waren onze start',
                // Different phrasings
                'Al jarenlang actief',
                'Met veel jaren ervaring',
                'Onze ruime ervaring',
                'Een ervaren specialist',
                // Should be KEPT
                'Specialist in loodgieten'
            ],
            brand: {
                trustSignals: [
                    'Jarenlange expertise',
                    'Ervaren in alle technieken',
                    'Betrouwbare partner'  // Should be KEPT
                ]
            }
        },
        formData: {
            name: 'Test Bedrijf',
            street: 'Teststraat 1',
            city: 'Utrecht',
            certifications: [],
            amenities: [],
            foundedYear: null
        }
    },
    'scenario-location-strict': {
        name: 'Location Claims (Strict)',
        description: 'Tests strict location validation',
        rawContent: {
            highlights: [
                'Gelegen aan de Oudegracht',
                'In het hart van Amsterdam',
                'Gevestigd in Rotterdam',
                'Centraal gelegen',
                'Specialist in loodgieten'
            ],
            brand: {
                trustSignals: [
                    'Bereikbaar in heel Nederland',
                    'Gelegen nabij het station',
                    'Goed bereikbaar'
                ]
            }
        },
        formData: {
            name: 'Test Bedrijf',
            street: 'Teststraat 1',
            city: 'Utrecht',
            neighborhood: 'Centrum',
            certifications: [],
            amenities: [],
            foundedYear: 2020
        }
    },
    'scenario-generic-phrases': {
        name: 'Generic Phrases',
        description: 'Tests removal of generic/low-value phrases (requires SANITIZER_REMOVE_GENERIC=true)',
        rawContent: {
            highlights: [
                // Generic phrases - should be REMOVED with flag
                'Betrouwbare partner',
                'Professionele dienstverlening',
                'Kwaliteit staat voorop',
                'Persoonlijke aanpak',
                'Klant staat centraal',
                'Altijd bereikbaar',
                'Snelle service',
                'Beste service in de regio',
                'Top kwaliteit',
                // Should be KEPT - contains real location
                'Specialist in Utrecht',
                'Gelegen in Centrum',
                // Should be KEPT - contains real amenity
                'Gratis Wi-Fi beschikbaar',
                // Should be KEPT - contains real certification
                'VCA gecertificeerd bedrijf',
                // Should be KEPT - not generic
                'Gespecialiseerd in renovatie'
            ],
            brand: {
                trustSignals: [
                    // Generic - should be REMOVED
                    'U kunt op ons rekenen',
                    'Wij staan voor u klaar',
                    'Eerlijke prijzen',
                    'Professioneel bedrijf',
                    // Should be KEPT - contains real data
                    'Actief in Utrecht',
                    'VCA gecertificeerd',
                    'Wi-Fi voor klanten'
                ]
            }
        },
        formData: {
            name: 'Test Bedrijf',
            street: 'Voorstraat 123',
            city: 'Utrecht',
            neighborhood: 'Centrum',
            certifications: ['VCA'],
            amenities: ['Wi-Fi'],
            services: [{ name: 'Renovatie' }],
            foundedYear: 2015
        }
    }
};

export default function AISanitizerTestPage() {
    const [rawJson, setRawJson] = useState('');
    const [formDataJson, setFormDataJson] = useState('{}');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

    // Check if debug tools are allowed
    useEffect(() => {
        fetch('/api/debug/sanitizer')
            .then(res => {
                setIsAllowed(res.ok);
            })
            .catch(() => setIsAllowed(false));
    }, []);

    const loadScenario = (scenarioKey: string) => {
        const scenario = TEST_SCENARIOS[scenarioKey as keyof typeof TEST_SCENARIOS];
        if (scenario) {
            setRawJson(JSON.stringify(scenario.rawContent, null, 2));
            setFormDataJson(JSON.stringify(scenario.formData, null, 2));
            setResult(null);
            setError('');
        }
    };

    const runTest = async () => {
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const rawContent = JSON.parse(rawJson);
            const formData = JSON.parse(formDataJson);

            const response = await fetch('/api/debug/sanitizer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rawContent, formData })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message || 'Invalid JSON or request failed');
        } finally {
            setLoading(false);
        }
    };

    // Security gate
    if (isAllowed === null) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <p>Checking access...</p>
            </div>
        );
    }

    if (isAllowed === false) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">404 - Not Found</h1>
                    <p className="text-gray-400">Debug tools are not available in this environment.</p>
                    <p className="text-gray-500 text-sm mt-2">Set NODE_ENV=development or DEBUG_TOOLS=true</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">AI Sanitizer Test Tool</h1>
                <p className="text-gray-400 mb-2">
                    Test the content sanitizer with custom or pre-defined scenarios
                </p>
                <p className="text-yellow-500 text-sm mb-8">
                    ⚠️ Now covers: highlights, trustSignals, longDescription, seo.localSeoText, brand.overviewSentence, FAQ answers
                </p>

                {/* Scenario Buttons */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-3">Load Test Scenario:</h2>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(TEST_SCENARIOS).map(([key, scenario]) => (
                            <button
                                key={key}
                                onClick={() => loadScenario(key)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
                                title={scenario.description}
                            >
                                {scenario.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Raw AI Content */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Raw AI Content
                        </label>
                        <textarea
                            value={rawJson}
                            onChange={(e) => setRawJson(e.target.value)}
                            className="w-full h-80 p-3 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm"
                            placeholder='{"highlights": [...], "brand": {...}, "longDescription": "...", ...}'
                        />
                    </div>

                    {/* Form Data */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Form Data (validation source)
                        </label>
                        <textarea
                            value={formDataJson}
                            onChange={(e) => setFormDataJson(e.target.value)}
                            className="w-full h-80 p-3 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm"
                            placeholder='{"certifications": [], "amenities": [], "foundedYear": null}'
                        />
                    </div>
                </div>

                <button
                    onClick={runTest}
                    disabled={loading}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
                >
                    {loading ? 'Testing...' : 'Run Sanitizer Test'}
                </button>

                {error && (
                    <div className="mt-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {result && (
                    <div className="mt-8 space-y-6">
                        {/* Summary */}
                        <div className={`p-4 rounded-lg ${result.summary.totalChanges > 0 ? 'bg-green-900/50 border border-green-500' : 'bg-yellow-900/50 border border-yellow-500'}`}>
                            <h3 className="text-xl font-bold mb-2">
                                {result.summary.totalChanges > 0 ? '✅ Sanitizer Active!' : '⚠️ No Changes Made'}
                            </h3>
                            <p>
                                Removed <strong>{result.summary.highlightsRemoved}</strong> highlights,{' '}
                                <strong>{result.summary.trustSignalsRemoved}</strong> trust signals,{' '}
                                modified <strong>{result.summary.textFieldsModified}</strong> text fields
                            </p>
                        </div>

                        {/* Removed Items */}
                        {result.removed.highlights.length > 0 && (
                            <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
                                <h3 className="font-bold mb-2 text-red-400">❌ Removed Highlights:</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    {result.removed.highlights.map((h: string, i: number) => (
                                        <li key={i} className="text-red-300">{h}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {result.removed.trustSignals.length > 0 && (
                            <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
                                <h3 className="font-bold mb-2 text-red-400">❌ Removed Trust Signals:</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    {result.removed.trustSignals.map((t: string, i: number) => (
                                        <li key={i} className="text-red-300">{t}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Text Field Changes */}
                        {Object.keys(result.textFieldChanges || {}).length > 0 && (
                            <div className="p-4 bg-orange-900/30 border border-orange-700 rounded-lg">
                                <h3 className="font-bold mb-3 text-orange-400">📝 Text Fields Modified:</h3>
                                {Object.entries(result.textFieldChanges).map(([field, changes]: [string, any]) => (
                                    <div key={field} className="mb-4">
                                        <h4 className="font-semibold text-orange-300">{field}:</h4>
                                        <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                                            <div>
                                                <span className="text-red-400">Original:</span>
                                                <pre className="mt-1 p-2 bg-gray-800 rounded overflow-x-auto whitespace-pre-wrap">
                                                    {changes.original?.substring(0, 300)}...
                                                </pre>
                                            </div>
                                            <div>
                                                <span className="text-green-400">Sanitized:</span>
                                                <pre className="mt-1 p-2 bg-gray-800 rounded overflow-x-auto whitespace-pre-wrap">
                                                    {changes.sanitized?.substring(0, 300)}...
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Kept Items */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
                                <h3 className="font-bold mb-2 text-green-400">✅ Kept Highlights:</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    {result.sanitized.highlights.length > 0 ? (
                                        result.sanitized.highlights.map((h: string, i: number) => (
                                            <li key={i}>{h}</li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500">None</li>
                                    )}
                                </ul>
                            </div>

                            <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
                                <h3 className="font-bold mb-2 text-green-400">✅ Kept Trust Signals:</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    {result.sanitized.trustSignals.length > 0 ? (
                                        result.sanitized.trustSignals.map((t: string, i: number) => (
                                            <li key={i}>{t}</li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500">None</li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Form Data Used */}
                        <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
                            <h3 className="font-bold mb-2">Form Data Used for Validation:</h3>
                            <pre className="text-sm overflow-x-auto">
                                {JSON.stringify(result.formDataUsed, null, 2)}
                            </pre>
                        </div>

                        {/* Feature Flags */}
                        {result.featureFlags && (
                            <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
                                <h3 className="font-bold mb-2">Feature Flags:</h3>
                                <div className="flex gap-4 text-sm">
                                    <span className={result.featureFlags.SANITIZER_REMOVE_GENERIC ? 'text-green-400' : 'text-gray-500'}>
                                        SANITIZER_REMOVE_GENERIC: {result.featureFlags.SANITIZER_REMOVE_GENERIC ? '✅ ON' : '❌ OFF'}
                                    </span>
                                </div>
                                {!result.featureFlags.SANITIZER_REMOVE_GENERIC && (
                                    <p className="text-yellow-500 text-xs mt-2">
                                        ⚠️ Generic phrase removal is disabled. Set SANITIZER_REMOVE_GENERIC=true to enable.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Dutch Number Words Reference */}
                <div className="mt-12 p-4 bg-gray-800 border border-gray-700 rounded-lg">
                    <h3 className="font-bold mb-2">🇳🇱 Dutch Number Words Detected:</h3>
                    <p className="text-gray-400 text-sm">
                        een, twee, drie, vier, vijf, zes, zeven, acht, negen, tien, elf, twaalf,
                        dertien, veertien, vijftien, zestien, zeventien, achttien, negentien,
                        twintig, dertig, veertig, vijftig, zestig, zeventig, tachtig, negentig,
                        honderd, <span className="text-yellow-400">honderden</span>, duizend,{' '}
                        <span className="text-yellow-400">duizenden</span>,{' '}
                        <span className="text-yellow-400">talloze</span>,{' '}
                        <span className="text-yellow-400">vele</span>, ontelbare, tientallen
                    </p>
                </div>
            </div>
        </div>
    );
}
