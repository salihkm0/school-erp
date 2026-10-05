// src/store/slices/eventSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import eventService from '../../services/eventService';
import toast from 'react-hot-toast';

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (params, { rejectWithValue }) => {
    try {
      return await eventService.getEvents(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id, { rejectWithValue }) => {
    try {
      return await eventService.getEventById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch event');
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const data = await eventService.createEvent(eventData);
      toast.success('Event created successfully!');
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create event';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      const data = await eventService.updateEvent(id, eventData);
      toast.success('Event updated successfully!');
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update event';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      await eventService.deleteEvent(id);
      toast.success('Event deleted successfully');
      return id;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete event';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const fetchLeaderboard = createAsyncThunk(
  'events/fetchLeaderboard',
  async (eventId, { rejectWithValue }) => {
    try {
      return await eventService.getLeaderboard(eventId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaderboard');
    }
  }
);

const initialState = {
  events: [],
  currentEvent: null,
  leaderboard: null,
  items: [],
  participants: [],
  loading: false,
  error: null,
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload;
    },
    updateLeaderboardFromSocket: (state, action) => {
      if (action.payload?.leaderboard) {
        state.leaderboard = action.payload.leaderboard;
      }
      if (state.currentEvent && action.payload?.eventId === state.currentEvent._id) {
        if (action.payload.leaderboard?.groups) {
          state.currentEvent.groups = action.payload.leaderboard.groups;
        }
      }
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
      state.leaderboard = null;
      state.items = [];
      state.participants = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchEvents
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload || [];
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchEventById
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createEvent
      .addCase(createEvent.fulfilled, (state, action) => {
        if (action.payload) {
          state.events.unshift(action.payload);
        }
      })
      // updateEvent
      .addCase(updateEvent.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state.events.findIndex((e) => e._id === action.payload._id);
          if (idx !== -1) state.events[idx] = action.payload;
          if (state.currentEvent?._id === action.payload._id) {
            state.currentEvent = action.payload;
          }
        }
      })
      // deleteEvent
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((e) => e._id !== action.payload);
        if (state.currentEvent?._id === action.payload) {
          state.currentEvent = null;
        }
      })
      // fetchLeaderboard
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload;
      });
  },
});

export const { setCurrentEvent, updateLeaderboardFromSocket, clearCurrentEvent } = eventSlice.actions;
export default eventSlice.reducer;
