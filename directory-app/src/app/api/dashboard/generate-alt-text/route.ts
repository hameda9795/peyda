import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
    try {
        const { imageUrl, businessName, imageType } = await request.json()

        if (!imageUrl) {
            return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
        }

        const businessContext = businessName ? `voor het bedrijf ${businessName}` : 'voor dit bedrijf'
        const typeContext = imageType || 'bedrijfsfoto'

        try {
            // First try real AI Vision if the URL is accessible (must be public)
            if (imageUrl.startsWith('http') && process.env.OPENAI_API_KEY) {
                const response = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: `Je bent een SEO expert. Schrijf een beknopte, beschrijvende SEO 'alt-tekst' (max 100 tekens) in het Nederlands voor deze afbeelding. Deze afbeelding is een ${typeContext} ${businessContext}. Gebruik geen introductie, geef alleen de alt-tekst zelf terug.`
                                },
                                {
                                    type: "image_url",
                                    image_url: { url: imageUrl }
                                }
                            ]
                        }
                    ],
                    max_tokens: 50
                })

                const aiGeneratedText = response.choices[0]?.message?.content?.trim() || ''

                if (aiGeneratedText) {
                    return NextResponse.json({
                        success: true,
                        altText: aiGeneratedText.replace(/['"]/g, ''), // Clean any quotes
                        isRealAi: true
                    })
                }
            }
        } catch (aiError) {
            console.warn('Real AI Vision failed or URL not acceptable, falling back to smart defaults:', aiError)
        }

        // Fallback to smart simulated alt-texts if AI fails
        const sampleAltTexts: Record<string, string[]> = {
            restaurant: [
                `Sfeerimpressie van ${businessContext}`,
                `Interieur van ${businessContext}`,
                `Onze gerechten worden met zorg bereid`,
            ],
            winkel: [
                `Ons assortiment ${businessContext}`,
                `Binnenwerk van ${businessContext}`,
            ],
            default: [
                `${typeContext} van ${businessContext}`,
                `Professionele presentatie van ${businessContext}`
            ],
            logo: [
                `Officiële logo van ${businessContext}`
            ],
            cover: [
                `Overzichtsfoto van ${businessContext}`
            ]
        }

        const category = imageType?.toLowerCase() || 'default'
        const altTexts = sampleAltTexts[category] || sampleAltTexts.default
        const suggestedAltText = altTexts[Math.floor(Math.random() * altTexts.length)]

        return NextResponse.json({
            success: true,
            altText: suggestedAltText,
            isRealAi: false
        })
    } catch (error) {
        console.error('Error generating alt-text:', error)
        return NextResponse.json({ error: 'Failed to generate alt-text' }, { status: 500 })
    }
}
