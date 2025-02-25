import { load } from 'cheerio';
import { Router } from 'express';

const router = Router();

router.get('/', async (_, res) => {
    let currentYear = new Date().getFullYear();
    let lastYear = currentYear - 1;

    let pmuResponse = await fetch(`https://www.pmu.edu.sa/admission/academic_calendar_${lastYear}_${currentYear}_ro`);
    if (!pmuResponse.ok) throw new Error(`HTTP error! Status: ${pmuResponse.status}`);

    let html = await pmuResponse.text();
    const $ = load(html);
    const events: { event: string, date: string }[] = [];

    $('table tbody tr').each((_, row) => {
        const columns = $(row).find('td');
        if (columns.length >= 2) {
            const date = $(columns[2]).text().trim();
            const event = $(columns[3]).text().trim();
            events.push({ event, date });
        }
    });

    let filteredDates = filterDates(events);
    res.json(filteredDates);
});

function filterDates(events: { event: string, date: string }[]) {
    const today = new Date();
    return events.filter(({ date }) => {
        const dateParts = date.split('-').map(d => d.trim());
        const lastDateStr = dateParts.length > 1 ? dateParts[1] : dateParts[0];
        const eventDate = new Date(lastDateStr);

        return eventDate >= today;
    });
}

export default router;