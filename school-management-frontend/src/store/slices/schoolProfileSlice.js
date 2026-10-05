// src/store/slices/schoolProfileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import schoolProfileService from '../../services/schoolProfileService';
import toast from 'react-hot-toast';

export const fetchSchoolProfile = createAsyncThunk(
  'schoolProfile/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const data = await schoolProfileService.getProfile();
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch school profile';
      return rejectWithValue(message);
    }
  }
);

export const updateSchoolProfile = createAsyncThunk(
  'schoolProfile/update',
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await schoolProfileService.updateProfile(profileData);
      toast.success('School profile updated successfully!');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update school profile';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const uploadSchoolBranding = createAsyncThunk(
  'schoolProfile/uploadBranding',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await schoolProfileService.uploadBranding(formData);
      toast.success('Branding asset uploaded successfully!');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to upload branding asset';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  profile: {
    name: 'School Management System',
    shortName: 'SMS',
    code: '',
    affiliation: '',
    tagline: '',
    address: {
      street: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
      country: 'India',
    },
    contact: {
      phone: '',
      alternatePhone: '',
      email: '',
      website: '',
    },
    branding: {
      logoUrl: '',
      faviconUrl: '',
      principalSignatureUrl: '',
      schoolSealUrl: '',
      primaryColor: '#059669',
      secondaryColor: '#1e293b',
    },
    keyPersonnel: {
      principalName: '',
      principalPhone: '',
      headmasterName: '',
      headmasterPhone: '',
      sitcName: '',
      sitcPhone: '',
      ptaPresidentName: '',
      ptaPresidentPhone: '',
    },
  },
  loading: false,
  error: null,
};

const schoolProfileSlice = createSlice({
  name: 'schoolProfile',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchSchoolProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchoolProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.profile = { ...state.profile, ...action.payload };
        }
      })
      .addCase(fetchSchoolProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateSchoolProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSchoolProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.profile = { ...state.profile, ...action.payload };
        }
      })
      .addCase(updateSchoolProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload Branding
      .addCase(uploadSchoolBranding.fulfilled, (state, action) => {
        if (action.payload?.profile) {
          state.profile = { ...state.profile, ...action.payload.profile };
        }
      });
  },
});

export const { setProfile } = schoolProfileSlice.actions;
export default schoolProfileSlice.reducer;
