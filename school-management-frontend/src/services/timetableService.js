import api from './api';

export const timetableService = {
  // Structure & Settings
  getTimetableStructure: async (params) => {
    const res = await api.get('/timetable/structure', { params });
    return res.data;
  },

  updateTimetableStructure: async (data) => {
    const res = await api.put('/timetable/structure', data);
    return res.data;
  },

  // Master Timetable
  getMasterTimetable: async (params) => {
    const res = await api.get('/timetable/master', { params });
    return res.data;
  },

  // Class Timetable
  getClassTimetable: async (classId, params) => {
    const res = await api.get(`/timetable/class/${classId}`, { params });
    return res.data;
  },

  updateClassTimetable: async (classId, data) => {
    const res = await api.put(`/timetable/class/${classId}`, data);
    return res.data;
  },

  checkClashes: async (data) => {
    const res = await api.post('/timetable/check-clash', data);
    return res.data;
  },

  autoGenerateTimetable: async (data) => {
    const res = await api.post('/timetable/auto-generate', data);
    return res.data;
  },

  // Teacher Schedule & Workload
  getTeacherTimetable: async (teacherId, params) => {
    const res = await api.get(`/timetable/teacher/${teacherId}`, { params });
    return res.data;
  },

  getMySchedule: async () => {
    const res = await api.get('/timetable/my-schedule');
    return res.data;
  },

  // Room Schedule
  getRoomTimetable: async (roomName, params) => {
    const res = await api.get(`/timetable/room/${encodeURIComponent(roomName)}`, { params });
    return res.data;
  },

  // Substitutions & Daily Absence Manager
  getSubstitutions: async (params) => {
    const res = await api.get('/timetable/substitutions', { params });
    return res.data;
  },

  getFreeTeachersForPeriod: async (params) => {
    const res = await api.get('/timetable/substitutions/free-teachers', { params });
    return res.data;
  },

  createSubstitution: async (data) => {
    const res = await api.post('/timetable/substitutions', data);
    return res.data;
  },

  updateSubstitution: async (id, data) => {
    const res = await api.put(`/timetable/substitutions/${id}`, data);
    return res.data;
  },

  deleteSubstitution: async (id) => {
    const res = await api.delete(`/timetable/substitutions/${id}`);
    return res.data;
  }
};

export default timetableService;
