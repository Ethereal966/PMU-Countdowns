"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = require("cheerio");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    let currentYear = new Date().getFullYear();
    let lastYear = currentYear - 1;
    let pmuResponse = yield fetch(`https://www.pmu.edu.sa/admission/academic_calendar_${lastYear}_${currentYear}_ro`);
    if (!pmuResponse.ok)
        throw new Error(`HTTP error! Status: ${pmuResponse.status}`);
    let html = yield pmuResponse.text();
    const $ = (0, cheerio_1.load)(html);
    const events = [];
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
}));
function filterDates(events) {
    const today = new Date();
    return events.filter(({ date }) => {
        const dateParts = date.split('-').map(d => d.trim());
        const lastDateStr = dateParts.length > 1 ? dateParts[1] : dateParts[0];
        const eventDate = new Date(lastDateStr);
        return eventDate >= today;
    });
}
exports.default = router;
