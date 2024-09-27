import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/api'

export const getAdminOrders = createAsyncThunk(
  'orders/getAdminOrders',
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/admin/orders?page=${page}&searchValue=${searchValue}&parPage=${parPage}`,
        {
          withCredentials: true,
        }
      )

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getAdminOrder = createAsyncThunk(
  'orders/getAdminOrder',
  async (orderId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/admin/order/${orderId}`, {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const adminOrderStatusUpdate = createAsyncThunk(
  'orders/adminOrderStatusUpdate',
  async ({ orderId, info }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(
        `/admin/order-status/update/${orderId}`,
        info,
        { withCredentials: true }
      )

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getSellerOrders = createAsyncThunk(
  'orders/getSellerOrders',
  async (
    { parPage, page, searchValue, sellerId },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/seller/orders/${sellerId}?page=${page}&searchValue=${searchValue}&parPage=${parPage}`,
        {
          withCredentials: true,
        }
      )

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getSellerOrder = createAsyncThunk(
  'orders/getSellerOrder',
  async (orderId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/seller/order/${orderId}`, {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const sellerOrderStatusUpdate = createAsyncThunk(
  'orders/sellerOrderStatusUpdate',
  async ({ orderId, info }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(
        `/seller/order-status/update/${orderId}`,
        info,
        { withCredentials: true }
      )

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const OrderReducer = createSlice({
  name: 'Orders',
  initialState: {
    successMessage: '',
    errorMessage: '',
    totalOrders: 0,
    orders: [],
    order: {},
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = ''
      state.successMessage = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminOrders.fulfilled, (state, { payload }) => {
        state.totalOrders = payload.totalOrders
        state.orders = payload.orders
      })
      .addCase(getAdminOrder.fulfilled, (state, { payload }) => {
        state.order = payload.order
      })
      .addCase(adminOrderStatusUpdate.rejected, (state, { payload }) => {
        state.errorMessage = payload.message
      })
      .addCase(adminOrderStatusUpdate.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message
      })
      .addCase(getSellerOrders.fulfilled, (state, { payload }) => {
        state.totalOrders = payload.totalOrders
        state.orders = payload.orders
      })
      .addCase(getSellerOrder.fulfilled, (state, { payload }) => {
        state.order = payload.order
      })
      .addCase(sellerOrderStatusUpdate.rejected, (state, { payload }) => {
        state.errorMessage = payload.message
      })
      .addCase(sellerOrderStatusUpdate.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message
      })
  },
})

export const { messageClear } = OrderReducer.actions
export default OrderReducer.reducer
