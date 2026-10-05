import api from './api';

const eventService = {
  // Events
  getEvents: async (params) => {
    const response = await api.get('/events', { params });
    return response.data?.data;
  },

  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data?.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data?.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data?.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  // Items
  getEventItems: async (eventId, params) => {
    const response = await api.get(`/events/${eventId}/items`, { params });
    return response.data?.data;
  },

  createEventItem: async (eventId, itemData) => {
    const response = await api.post(`/events/${eventId}/items`, itemData);
    return response.data?.data;
  },

  updateEventItem: async (eventId, itemId, itemData) => {
    const response = await api.put(`/events/${eventId}/items/${itemId}`, itemData);
    return response.data?.data;
  },

  deleteEventItem: async (eventId, itemId) => {
    const response = await api.delete(`/events/${eventId}/items/${itemId}`);
    return response.data;
  },

  // Participants & Chest Numbers
  getParticipants: async (eventId, params) => {
    const response = await api.get(`/events/${eventId}/participants`, { params });
    return response.data?.data;
  },

  registerParticipant: async (eventId, participantData) => {
    const response = await api.post(`/events/${eventId}/participants/register`, participantData);
    return response.data?.data;
  },

  bulkRegisterParticipants: async (eventId, bulkData) => {
    const response = await api.post(`/events/${eventId}/participants/bulk-register`, bulkData);
    return response.data;
  },

  generateChestNumbers: async (eventId, config) => {
    const response = await api.post(`/events/${eventId}/generate-chest-numbers`, config);
    return response.data;
  },

  // Call sheet & Results
  getItemCallSheet: async (eventId, itemId) => {
    const response = await api.get(`/events/${eventId}/items/${itemId}/call-sheet`);
    return response.data?.data;
  },

  recordItemResult: async (eventId, itemId, resultData) => {
    const response = await api.post(`/events/${eventId}/items/${itemId}/results`, resultData);
    return response.data?.data;
  },

  getEventResults: async (eventId) => {
    const response = await api.get(`/events/${eventId}/results`);
    return response.data?.data;
  },

  // Live Leaderboard
  getLeaderboard: async (eventId) => {
    const response = await api.get(`/events/${eventId}/leaderboard`);
    return response.data?.data;
  },
};

export default eventService;
