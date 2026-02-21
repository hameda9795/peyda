const https = require('https');
const topics = [
    'restaurant', 'bakery', 'pizza', 'cafe', 'bar', 'vegan', 'supermarket', 'butcher', 'clothes', 'shoes',
    'makeup', 'tech', 'furniture', 'toys', 'books', 'flowers', 'pets', 'bicycle', 'hair', 'nails',
    'spa', 'massage', 'doctor', 'dentist', 'gym', 'yoga', 'swim', 'tools', 'paint', 'plumber',
    'electrician', 'cleaning', 'car', 'taxi', 'repair', 'office', 'meeting', 'school', 'kids', 'house',
    'hotel', 'museum', 'party', 'wedding', 'music', 'boxes', 'law', 'finance', 'printing', 'factory',
    'solar', 'garden', 'community', 'drone', 'art', 'interior', 'city', 'transport', 'shipping', 'event', 'realestate'
];

async function fetchTopic(topic) {
    return new Promise((resolve) => {
        https.get('https://unsplash.com/s/photos/' + topic, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
            }
        }, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => {
                const s1 = '<script id="__NEXT_DATA__" type="application/json">';
                const s2 = '</script>';
                const index1 = data.indexOf(s1);
                if (index1 !== -1) {
                    const index2 = data.indexOf(s2, index1);
                    const jsonStr = data.substring(index1 + s1.length, index2);
                    let results = [];
                    const regex = /"id":"([a-zA-Z0-9_-]{10,13})"/g;
                    let m;
                    while ((m = regex.exec(jsonStr)) !== null) {
                        if (m[1].length < 15) {
                            results.push(m[1]);
                        }
                    }
                    results = [...new Set(results)].slice(0, 15);
                    resolve({ topic, ids: results });
                } else {
                    resolve({ topic, ids: [] });
                }
            });
        }).on('error', () => resolve({ topic, ids: [] }));
    });
}

(async () => {
    let all = {};
    for (let i = 0; i < topics.length; i += 5) {
        process.stdout.write(`Fetching chunk ${i / 5 + 1}... `);
        const chunk = topics.slice(i, i + 5);
        const results = await Promise.all(chunk.map(fetchTopic));
        results.forEach(r => { all[r.topic] = r.ids; });
        console.log('Done');
    }
    const fs = require('fs');
    fs.writeFileSync('unsplash_ids.json', JSON.stringify(all, null, 2));
    console.log('Saved unsplash_ids.json');
})();
