import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Peyda - De Bedrijvengids van Nederland';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #eff6ff, #dbeafe)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 40,
                    }}
                >
                    {/* Logo Icon Style */}
                    <div
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 20,
                            background: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 24,
                            boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)',
                        }}
                    >
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </div>
                    <div
                        style={{
                            fontSize: 64,
                            fontWeight: 800,
                            color: '#1e3a8a',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Peyda
                    </div>
                </div>
                <div
                    style={{
                        fontSize: 32,
                        fontWeight: 600,
                        color: '#3b82f6',
                        textAlign: 'center',
                        maxWidth: '80%',
                        lineHeight: 1.4,
                    }}
                >
                    De Meest Complete Bedrijvengids van Nederland
                </div>
                <div
                    style={{
                        display: 'flex',
                        marginTop: 40,
                        alignItems: 'center',
                        background: 'white',
                        padding: '12px 24px',
                        borderRadius: 50,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e', marginRight: 12 }}></div>
                    <div style={{ fontSize: 20, color: '#475569', fontWeight: 500 }}>
                        Vind lokale bedrijven in uw buurt
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
