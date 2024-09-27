import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/api'

export const addBanner = createAsyncThunk(
  'banner/addBanner',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/banner/add', info, {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getBanner = createAsyncThunk(
  'banner/getBanner',
  async (productId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/banner/get/${productId}`, {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateBanner = createAsyncThunk(
  'banner/updateBanner',
  async ({ bannerId, info }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(`/banner/update/${bannerId}`, info, {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const bannerReducer = createSlice({
  name: 'banner',
  initialState: {
    successMessage: '',
    errorMessage: '',
    loader: false,
    banners: [],
    banner: '',
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = ''
      state.successMessage = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBanner.pending, (state) => {
        state.loader = true
      })
      .addCase(addBanner.rejected, (state, { payload }) => {
        state.loader = false
        state.errorMessage = payload.error
      })
      .addCase(addBanner.fulfilled, (state, { payload }) => {
        state.loader = false
        state.successMessage = payload.message
        state.banner = payload.banner
      })
      .addCase(getBanner.fulfilled, (state, { payload }) => {
        state.banner = payload.banner
      })
      .addCase(updateBanner.pending, (state) => {
        state.loader = true
      })
      .addCase(updateBanner.rejected, (state, { payload }) => {
        state.loader = false
        state.errorMessage = payload.error
      })
      .addCase(updateBanner.fulfilled, (state, { payload }) => {
        state.loader = false
        state.successMessage = payload.message
        state.banner = payload.banner
      })
  },
})

export const { messageClear } = bannerReducer.actions
export default bannerReducer.reducer
