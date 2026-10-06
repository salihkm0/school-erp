import api from './api';

export const schoolCalendarService = {
  getCalendarEvents: async (params) => {
    const res = await api.get('/calendar/events', { params });
    return res.data;
  },

  getCalendarEventById: async (id) => {
    const res = await api.get(`/calendar/events/${id}`);
    return res.data;
  },

  createCalendarEvent: async (data) => {
    const res = await api.post('/calendar/events', data);
    return res.data;
  },

  updateCalendarEvent: async (id, data) => {
    const res = await api.put(`/calendar/events/${id}`, data);
    return res.data;
  },

  deleteCalendarEvent: async (id) => {
    const res = await api.delete(`/calendar/events/${id}`);
    return res.data;
  },

  importStandardHolidays: async (data) => {
    const res = await api.post('/calendar/import-standard', data);
    return res.data;
  },

  getUpcomingHolidays: async () => {
    const res = await api.get('/calendar/upcoming');
    return res.data;
  }
};

export default schoolCalendarService;
