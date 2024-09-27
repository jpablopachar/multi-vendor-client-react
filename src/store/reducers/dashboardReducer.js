import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/api'

export const getAdminDashboardData = createAsyncThunk(
  'dashboard/getAdminDashboardData',
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get('/admin/get-dashboard-data', {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getSellerDashboardData = createAsyncThunk(
  'dashboard/getSellerDashboardData',
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get('/seller/get-dashboard-data', {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const dashboardReducer = createSlice({
  name: 'dashboard',
  initialState: {
    totalSale: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalPendingOrders: 0,
    totalSellers: 0,
    recentOrders: [],
    recentMessages: [],
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminDashboardData.fulfilled, (state, { payload }) => {
        state.totalSale = payload.totalSale
        state.totalOrders = payload.totalOrders
        state.totalProducts = payload.totalProducts
        state.totalSellers = payload.totalSellers
        state.recentOrders = payload.recentOrders
        state.recentMessages = payload.messages
      })
      .addCase(getSellerDashboardData.fulfilled, (state, { payload }) => {
        state.totalSale = payload.totalSale
        state.totalOrders = payload.totalOrders
        state.totalProducts = payload.totalProducts
        state.totalPendingOrders = payload.totalPendingOrders
        state.recentOrders = payload.recentOrders
        state.recentMessages = payload.messages
      })
  },
})

export const { messageClear } = dashboardReducer.actions
export default dashboardReducer.reducer
