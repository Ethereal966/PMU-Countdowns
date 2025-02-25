async function fetchEvents() {
    return fetch("/dates")
        .then(res => res.json())
        .then(data => data);
}

function updateCountdowns(events) {
    const container = document.getElementById("events-container");
    container.innerHTML = "";
    
    events.forEach(event => {
        event.date = extractFirstDate(event.date);
        const eventDate = new Date(event.date);
        if (eventDate < new Date()) return;
        
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerHTML = `<h3>${event.event}</h3><p>${event.date}</p><p class="countdown" id="countdown-${event.date}"></p>`;
        container.appendChild(eventDiv);
    });

    function updateTimers() {
        events.forEach(event => {
            const eventDate = new Date(event.date);
            if (eventDate < new Date()) return;

            const now = new Date().getTime();
            const diff = eventDate - now;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const countdownElement = document.getElementById(`countdown-${event.date}`);
            if (countdownElement) countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        });
    }
    
    setInterval(updateTimers, 1000);
    updateTimers();
}

function extractFirstDate(dateStr) {
    const match = dateStr.match(/^([A-Za-z]+ \d{1,2})/);
    const yearMatch = dateStr.match(/\d{4}$/);
    if (match && yearMatch) {
        return `${match[1]}, ${yearMatch[0]}`; 
    }
    return dateStr;
}

fetchEvents().then(events => updateCountdowns(events));