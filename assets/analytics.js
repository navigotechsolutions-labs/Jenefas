// Lightweight, privacy-friendly analytics and event dispatch interface
export const Analytics = {
  events: [],

  track(eventName, payload = {}) {
    // Sanitise payload: Strictly exclude any personal contact details (names, phone numbers, emails)
    const sanitisedPayload = { ...payload };
    delete sanitisedPayload.name;
    delete sanitisedPayload.phone;
    delete sanitisedPayload.email;
    delete sanitisedPayload.company;
    delete sanitisedPayload.city;

    const eventRecord = {
      event: eventName,
      timestamp: new Date().toISOString(),
      data: sanitisedPayload
    };

    this.events.push(eventRecord);

    // If an external analytics tracker exists on window (e.g. dataLayer, plausible, etc.), safely notify
    if (typeof window !== 'undefined') {
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({ event: eventName, ...sanitisedPayload });
      }
      // Custom event dispatch for local integrations
      window.dispatchEvent(new CustomEvent('jenefas:analytics', { detail: eventRecord }));
    }

    return eventRecord;
  },

  getHistory() {
    return [...this.events];
  }
};
