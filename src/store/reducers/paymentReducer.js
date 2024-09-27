import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/api'

export const getSellerPaymentDetails = createAsyncThunk(
  'payment/getSellerPaymentDetails',
  async (sellerId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/payment/seller-payment-details/${sellerId}`,
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

export const sendWithdrawRequest = createAsyncThunk(
  'payment/sendWithdrawRequest',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(`/payment/withdraw-request`, info, {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getPaymentRequest = createAsyncThunk(
  'payment/getPaymentRequest',
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get('payment/request', {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const confirmPaymentRequest = createAsyncThunk(
  'payment/confirmPaymentRequest',
  async (paymentId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        '/payment/request-confirm',
        { paymentId },
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

export const PaymentReducer = createSlice({
  name: 'payment',
  initialState: {
    successMessage: '',
    errorMessage: '',
    loader: false,
    pendingWithdraws: [],
    successWithdraws: [],
    totalAmount: 0,
    withdrawAmount: 0,
    pendingAmount: 0,
    availableAmount: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = ''
      state.successMessage = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSellerPaymentDetails.fulfilled, (state, { payload }) => {
        state.pendingWithdraws = payload.pendingWithdraws
        state.successWithdraws = payload.successWithdraws
        state.totalAmount = payload.totalAmount
        state.availableAmount = payload.availableAmount
        state.withdrawAmount = payload.withdrawAmount
        state.pendingAmount = payload.pendingAmount
      })
      .addCase(sendWithdrawRequest.pending, (state) => {
        state.loader = true
      })
      .addCase(sendWithdrawRequest.rejected, (state, { payload }) => {
        state.loader = false
        state.errorMessage = payload.message
      })
      .addCase(sendWithdrawRequest.fulfilled, (state, { payload }) => {
        state.loader = false
        state.successMessage = payload.message
        state.pendingWithdraws = [
          ...state.pendingWithdraws,
          payload.withdrawalRequest,
        ]
        state.availableAmount -= payload.withdrawalRequest.amount
        state.pendingAmount = payload.withdrawalRequest.amount
      })
      .addCase(getPaymentRequest.fulfilled, (state, { payload }) => {
        state.pendingWithdraws = payload.withdrawalRequest
      })
      .addCase(confirmPaymentRequest.pending, (state) => {
        state.loader = true
      })
      .addCase(confirmPaymentRequest.rejected, (state, { payload }) => {
        state.loader = false
        state.errorMessage = payload.message
      })
      .addCase(confirmPaymentRequest.fulfilled, (state, { payload }) => {
        state.loader = false
        state.successMessage = payload.message
        state.pendingWithdraws = state.pendingWithdraws.filter(
          (withdraw) => withdraw._id !== payload.withdrawalRequest._id
        )
      })
  },
})

export const { messageClear } = PaymentReducer.actions
export default PaymentReducer.reducer
