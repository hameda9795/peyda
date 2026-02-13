import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const businesses = await db.business.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                city: true,
                status: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        // Return as HTML for easy viewing in browser
        const html = `
<!DOCTYPE html>
<html lang="nl" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business List - IDs</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f8fafc;
        }
        h1 {
            color: #1e293b;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 10px;
        }
        .business {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .business h2 {
            margin: 0 0 10px 0;
            color: #0f172a;
        }
        .business-id {
            font-family: 'Courier New', monospace;
            background: #f1f5f9;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            display: inline-block;
            margin: 5px 0;
        }
        .info {
            color: #64748b;
            font-size: 14px;
            margin: 5px 0;
        }
        .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        .status-approved { background: #d1fae5; color: #065f46; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-rejected { background: #fee2e2; color: #991b1b; }
        a {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 500;
        }
        a:hover {
            text-decoration: underline;
        }
        .empty {
            text-align: center;
            padding: 60px 20px;
            color: #64748b;
        }
        .copy-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            margin-left: 10px;
        }
        .copy-btn:hover {
            background: #2563eb;
        }
    </style>
</head>
<body>
    <h1>📋 Lijst van Bedrijven (${businesses.length})</h1>

    ${businesses.length === 0 ? `
        <div class="empty">
            <h2>❌ Geen bedrijven gevonden</h2>
            <p>Voeg eerst een bedrijf toe via:</p>
            <a href="/bedrijf-aanmelden">http://localhost:3000/bedrijf-aanmelden</a>
        </div>
    ` : businesses.map((b, i) => `
        <div class="business">
            <h2>${i + 1}. ${b.name}</h2>
            <div class="info">
                <strong>ID:</strong>
                <span class="business-id" id="id-${i}">${b.id}</span>
                <button class="copy-btn" onclick="copyId('${b.id}', ${i})">Kopieer</button>
            </div>
            <div class="info"><strong>Slug:</strong> ${b.slug}</div>
            <div class="info"><strong>Stad:</strong> ${b.city}</div>
            <div class="info">
                <strong>Status:</strong>
                <span class="status status-${b.status}">${b.status}</span>
            </div>
            <div class="info" style="margin-top: 15px;">
                <a href="/dashboard?businessId=${b.id}" target="_blank">
                    🎯 Open Dashboard
                </a>
                |
                <a href="/nederland/${b.slug}" target="_blank">
                    👁️ Bekijk Profiel
                </a>
            </div>
        </div>
    `).join('')}

    <script>
        function copyId(id, index) {
            navigator.clipboard.writeText(id);
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = '✓ Gekopieerd!';
            btn.style.background = '#10b981';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '#3b82f6';
            }, 2000);
        }
    </script>
</body>
</html>
        `;

        return new NextResponse(html, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
            },
        });
    } catch (error) {
        console.error('Error fetching businesses:', error);
        return NextResponse.json(
            { error: 'Failed to fetch businesses' },
            { status: 500 }
        );
    }
}
