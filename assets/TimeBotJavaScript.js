// DOM Elements
const currentTimeElement = document.getElementById('current-time');
const eventForm = document.getElementById('event-form');
const eventTitleInput = document.getElementById('event-title');
const eventDateInput = document.getElementById('event-date');
const eventDescriptionInput = document.getElementById('event-description');
const eventsListElement = document.getElementById('events-list');
const notificationElement = document.getElementById('notification');
const notificationTitleElement = document.getElementById('notification-title');
const notificationMessageElement = document.getElementById('notification-message');

// Events array
let events = [];

// Initialize the app
function init() {
    // Load events from local storage
    loadEvents();
    
    // Update the clock every second
    updateClock();
    setInterval(updateClock, 1000);
    
    // Check for events every minute
    setInterval(checkEvents, 60000);
    
    // Set up event listeners
    eventForm.addEventListener('submit', addEvent);
    document.addEventListener('keydown', dismissNotification);
    
    // Set min date-time to now for the input
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    eventDateInput.min = `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Update the clock with Central Time
function updateClock() {
    const now = new Date();
    
    // Convert to Central Time
    const centralTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
    
    const hours = String(centralTime.getHours()).padStart(2, '0');
    const minutes = String(centralTime.getMinutes()).padStart(2, '0');
    const seconds = String(centralTime.getSeconds()).padStart(2, '0');
    
    const month = String(centralTime.getMonth() + 1).padStart(2, '0');
    const day = String(centralTime.getDate()).padStart(2, '0');
    const year = centralTime.getFullYear();
    
    // Format: MM/DD/YYYY HH:MM:SS (Central Time)
    currentTimeElement.textContent = `${month}/${day}/${year} ${hours}:${minutes}:${seconds} (Central Time)`;
    
    // Also check for events on each clock update
    checkEvents();
}

// Add a new event
function addEvent(e) {
    e.preventDefault();
    
    const title = eventTitleInput.value.trim();
    const dateTime = new Date(eventDateInput.value);
    const description = eventDescriptionInput.value.trim();
    
    if (!title || !dateTime) {
        alert('Please enter both title and date/time for the event.');
        return;
    }
    
    const newEvent = {
        id: Date.now().toString(),
        title,
        dateTime: dateTime.toISOString(),
        description,
        notified: false
    };
    
    events.push(newEvent);
    saveEvents();
    renderEvents();
    
    // Reset form
    eventForm.reset();
}

// Save events to local storage
function saveEvents() {
    localStorage.setItem('timebot-events', JSON.stringify(events));
}

// Load events from local storage
function loadEvents() {
    const storedEvents = localStorage.getItem('timebot-events');
    if (storedEvents) {
        events = JSON.parse(storedEvents);
        renderEvents();
    }
}

// Render events in the UI
function renderEvents() {
    eventsListElement.innerHTML = '';
    
    // Sort events by date (earliest first)
    const sortedEvents = [...events].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    
    if (sortedEvents.length === 0) {
        eventsListElement.innerHTML = '<p>No upcoming events. Add one above!</p>';
        return;
    }
    
    sortedEvents.forEach(event => {
        const eventDate = new Date(event.dateTime);
        
        // Format the date and time
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        const formattedTime = eventDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const eventElement = document.createElement('div');
        eventElement.classList.add('event-card');
        
        eventElement.innerHTML = `
            <div class="event-title">${event.title}</div>
            <div class="event-time">${formattedDate} at ${formattedTime}</div>
            ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
            <button class="delete-btn" data-id="${event.id}">Delete</button>
        `;
        
        // Add delete event listener
        const deleteBtn = eventElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteEvent(event.id));
        
        eventsListElement.appendChild(eventElement);
    });
}

// Delete an event
function deleteEvent(id) {
    events = events.filter(event => event.id !== id);
    saveEvents();
    renderEvents();
}

// Check for events that need notification
function checkEvents() {
    const now = new Date();
    let eventsChanged = false;
    
    // Filter out events that have been notified (auto-delete)
    events = events.filter(event => {
        const eventTime = new Date(event.dateTime);
        
        // If the event time has passed and notification hasn't been shown
        if (eventTime <= now && !event.notified) {
            showNotification(event);
            
            // Mark as notified and remove it after notification
            event.notified = true;
            eventsChanged = true;
            
            // Return false to remove this event from the array
            return false;
        }
        
        // Keep events that haven't occurred yet
        return eventTime > now;
    });
    
    // Save events if any changes were made
    if (eventsChanged) {
        saveEvents();
        renderEvents(); // Re-render the events list
    }
}

// Show notification for an event
function showNotification(event) {
    notificationTitleElement.textContent = event.title;
    notificationMessageElement.textContent = event.description || "It's time for your event!";
    notificationElement.style.display = 'flex';
}

// Dismiss notification on key press
function dismissNotification() {
    if (notificationElement.style.display === 'flex') {
        notificationElement.style.display = 'none';
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);