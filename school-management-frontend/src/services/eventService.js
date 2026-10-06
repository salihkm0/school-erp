// src/services/eventService.js
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

  // Live Leaderboard & Detailed Point Table
  getLeaderboard: async (eventId) => {
    const response = await api.get(`/events/${eventId}/leaderboard`);
    return response.data?.data;
  },

  getDetailedPointTable: async (eventId) => {
    const response = await api.get(`/events/${eventId}/detailed-point-table`);
    return response.data?.data;
  },

  // Multi-Judge Rubric Scoring & Tabulation
  submitJudgeScore: async (eventId, itemId, scoreData) => {
    const response = await api.post(`/events/${eventId}/items/${itemId}/judge-scores`, scoreData);
    return response.data;
  },

  getItemScoreSheets: async (eventId, itemId) => {
    const response = await api.get(`/events/${eventId}/items/${itemId}/judge-scores`);
    return response.data?.data;
  },

  tabulateAndPublishItem: async (eventId, itemId) => {
    const response = await api.post(`/events/${eventId}/items/${itemId}/tabulate`);
    return response.data;
  },

  // Stage Manager & Live Stage Monitors
  getStageLiveStatus: async (eventId) => {
    const response = await api.get(`/events/${eventId}/stage-status`);
    return response.data?.data;
  },

  updateStageLiveStatus: async (eventId, itemId, stageData) => {
    const response = await api.put(`/events/${eventId}/items/${itemId}/stage-status`, stageData);
    return response.data?.data;
  },

  generateLotOrder: async (eventId, itemId) => {
    const response = await api.post(`/events/${eventId}/items/${itemId}/generate-lot-order`);
    return response.data?.data;
  },

  // Individual Champions & Titles
  getIndividualChampionships: async (eventId) => {
    const response = await api.get(`/events/${eventId}/championships`);
    return response.data?.data;
  },

  // Printables (Badges & Certificates)
  getPrintableBadges: async (eventId, params) => {
    const response = await api.get(`/events/${eventId}/badges`, { params });
    return response.data?.data;
  },

  getPrintableCertificates: async (eventId, params) => {
    const response = await api.get(`/events/${eventId}/certificates`, { params });
    return response.data?.data;
  },

  // Appeals & Grievances
  submitAppeal: async (eventId, appealData) => {
    const response = await api.post(`/events/${eventId}/appeals`, appealData);
    return response.data?.data;
  },

  getAppeals: async (eventId, params) => {
    const response = await api.get(`/events/${eventId}/appeals`, { params });
    return response.data?.data;
  },

  reviewAppeal: async (eventId, appealId, reviewData) => {
    const response = await api.put(`/events/${eventId}/appeals/${appealId}/review`, reviewData);
    return response.data?.data;
  },

  // Chest Number Templates (CRUD & Choose)
  getChestTemplates: async () => {
    const response = await api.get('/events/templates/chest');
    return response.data?.data;
  },

  createChestTemplate: async (templateData) => {
    const response = await api.post('/events/templates/chest', templateData);
    return response.data?.data;
  },

  updateChestTemplate: async (id, templateData) => {
    const response = await api.put(`/events/templates/chest/${id}`, templateData);
    return response.data?.data;
  },

  deleteChestTemplate: async (id) => {
    const response = await api.delete(`/events/templates/chest/${id}`);
    return response.data;
  },

  applyChestTemplate: async (eventId, templateId) => {
    const response = await api.put(`/events/${eventId}/apply-chest-template/${templateId}`);
    return response.data;
  },

  // Point Table Templates (CRUD & Choose)
  getPointTemplates: async () => {
    const response = await api.get('/events/templates/points');
    return response.data?.data;
  },

  createPointTemplate: async (templateData) => {
    const response = await api.post('/events/templates/points', templateData);
    return response.data?.data;
  },

  updatePointTemplate: async (id, templateData) => {
    const response = await api.put(`/events/templates/points/${id}`, templateData);
    return response.data?.data;
  },

  deletePointTemplate: async (id) => {
    const response = await api.delete(`/events/templates/points/${id}`);
    return response.data;
  },

  applyPointTemplate: async (eventId, templateId) => {
    const response = await api.put(`/events/${eventId}/apply-point-template/${templateId}`);
    return response.data;
  },
};

export default eventService;
