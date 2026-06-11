/* Events renderer and countdown utilities (shared) */
(function () {
    // helper: compute next occurrence (keeps existing semantics)
    function getNextOccurrence(day, hour, minute) {
        const now = new Date();
        const today = now.getDay();

        let daysAhead = (day - today + 7) % 7;

        const date = new Date(now);
        date.setDate(now.getDate() + daysAhead);
        date.setHours(hour, minute, 0, 0);

        if (daysAhead === 0 && date < now) {
            date.setDate(date.getDate() + 7);
        }

        return date;
    }

    function getOccurrence(day, hour, minute, endHour, endMinute) {
        const now = new Date();
        const today = now.getDay();

        let daysAhead = (day - today + 7) % 7;

        const date = new Date(now);
        date.setDate(now.getDate() + daysAhead);
        date.setHours(hour, minute, 0, 0);

        const eHour = (typeof endHour === 'number' && !isNaN(endHour)) ? endHour : (hour + 1) % 24;
        const eMinute = (typeof endMinute === 'number' && !isNaN(endMinute)) ? endMinute : minute;

        const endDate = new Date(date);
        endDate.setHours(eHour, eMinute, 0, 0);
        if (endDate <= date) {
            endDate.setDate(endDate.getDate() + 1);
        }

        if (daysAhead === 0) {
            if (now <= endDate) {
                return date;
            }
            date.setDate(date.getDate() + 7);
            return date;
        }

        return date;
    }

    function formatCountdown(startDate, endHour, endMinute) {
        const now = new Date();

        const eHour = (typeof endHour === 'number' && !isNaN(endHour)) ? endHour : (startDate.getHours() + 1) % 24;
        const eMinute = (typeof endMinute === 'number' && !isNaN(endMinute)) ? endMinute : startDate.getMinutes();

        const endDate = new Date(startDate);
        endDate.setHours(eHour, eMinute, 0, 0);
        if (endDate <= startDate) {
            endDate.setDate(endDate.getDate() + 1);
        }

        if (now < startDate) {
            const diff = startDate - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / 1000 / 60) % 60);

            if (days > 0) return `${days}d ${hours}h`;
            if (hours > 0) return `${hours}h ${minutes}m`;
            return `${minutes}m`;
        }

        if (now >= startDate && now <= endDate) {
            return "Event Ongoing";
        }

        const next = getNextOccurrence(startDate.getDay(), startDate.getHours(), startDate.getMinutes());
        const diff = next - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

        return `Next: ${days}d ${hours}h`;
    }

    // Public: render events into a container element and wire countdown updates
    window.renderEventsFromData = async function (containerSelector, eventsDataUrl, options = {}) {
        try {
            const resp = await fetch(eventsDataUrl);
            const events = await resp.json();

            const grid = document.querySelector(containerSelector);
            if (!grid) return;
            grid.innerHTML = '';

            const upcoming = events.map(ev => Object.assign({}, ev, { nextDate: getOccurrence(ev.day, ev.startHour, ev.startMinute, ev.endHour, ev.endMinute) }))
                                   .sort((a, b) => a.nextDate - b.nextDate);

            upcoming.forEach((event, index) => {
                const eventDate = event.nextDate;

                const card = document.createElement('div');
                card.className = 'event-detailed-card scroll-reveal';
                card.style.animationDelay = (index * 0.06) + 's';

                const dateStr = eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                const timeStr = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                const startDate = new Date(eventDate);
                const endDate = new Date(eventDate);
                endDate.setHours(event.endHour, event.endMinute, 0, 0);

                const gcalUrl = options.buildGoogleCalendarUrl ? options.buildGoogleCalendarUrl(event.title, startDate, endDate, event.description, event.location) : '#';

                card.innerHTML = `
                    <div class="event-card-header">
                        <div class="event-image">${event.image}</div>
                        <div class="event-meta">
                            <span class="event-category">${event.category}</span>
                            <div class="event-countdown"
                                data-day="${event.day}"
                                data-hour="${event.startHour}"
                                data-minute="${event.startMinute}"
                                data-endhour="${event.endHour}"
                                data-endminute="${event.endMinute}">
                                ${formatCountdown(eventDate, event.endHour, event.endMinute)}
                            </div>
                        </div>
                    </div>
                    <div class="event-card-body">
                        <h3>${event.title}</h3>
                        <div class="event-details">
                            <p><strong>📅</strong> ${dateStr}</p>
                            <p><strong>🕐</strong> ${timeStr} - ${event.endTime}</p>
                            <p><strong>📍</strong> ${event.location}</p>
                        </div>
                        <p class="event-description">${event.description}</p>
                        <div class="event-actions">
                            <a class="btn btn-secondary" href="${gcalUrl}" target="_blank" rel="noopener noreferrer">Add to Google Calendar</a>
                        </div>
                    </div>
                `;

                grid.appendChild(card);
            });

            function updateCountdowns() {
                const countdowns = document.querySelectorAll('.event-countdown');

                countdowns.forEach(el => {
                    const day = parseInt(el.dataset.day);
                    const hour = parseInt(el.dataset.hour);
                    const minute = parseInt(el.dataset.minute);
                    const endHour = parseInt(el.dataset.endhour);
                    const endMinute = parseInt(el.dataset.endminute);

                    const eventDate = getOccurrence(day, hour, minute, endHour, endMinute);
                    el.textContent = formatCountdown(eventDate, endHour, endMinute);
                });
            }

            updateCountdowns();
            setInterval(updateCountdowns, 60000);
            if (window.initScrollReveal) window.initScrollReveal();
        } catch (err) {
            console.error('renderEventsFromData error', err);
        }
    };

})();
