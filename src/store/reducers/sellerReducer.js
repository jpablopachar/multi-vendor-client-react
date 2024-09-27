import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/api'

export const getSellersRequest = createAsyncThunk(
  'seller/getSellerRequest',
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/request-seller-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
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

export const getSeller = createAsyncThunk(
  'seller/getSeller',
  async (sellerId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/get-seller/${sellerId}`, {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const sellerStatusUpdate = createAsyncThunk(
  'seller/sellerStatusUpdate',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(`/seller-status-update`, info, {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getActiveSellers = createAsyncThunk(
  'seller/getActiveSellers',
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/get-sellers?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
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

export const getDeactiveSellers = createAsyncThunk(
  'seller/getDeactiveSellers',
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/get-deactive-sellers?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
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

export const createStripeConnectAccount = createAsyncThunk(
  'seller/createStripeConnectAccount',
  async () => {
    try {
      const {
        data: { url },
      } = await api.get(`/payment/create-stripe-connect-account`, {
        withCredentials: true,
      })

      window.location.href = url
    } catch (error) {
      console.error(error.response.data)
    }
  }
)

export const activeStripeConnectAccount = createAsyncThunk(
  'seller/activeStripeConnectAccount',
  async (activeCode, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(
        `/payment/active-stripe-connect-account/${activeCode}`,
        {},
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

export const sellerReducer = createSlice({
  name: 'seller',
  initialState: {
    successMessage: '',
    errorMessage: '',
    loader: false,
    sellers: [],
    seller: '',
    totalSellers: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = ''
      state.successMessage = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSellersRequest.fulfilled, (state, { payload }) => {
        state.sellers = payload.sellers
        state.totalSellers = payload.totalSellers
      })
      .addCase(getSeller.fulfilled, (state, { payload }) => {
        state.seller = payload.seller
      })
      .addCase(sellerStatusUpdate.fulfilled, (state, { payload }) => {
        state.seller = payload.seller
        state.successMessage = payload.message
      })
      .addCase(getActiveSellers.fulfilled, (state, { payload }) => {
        state.sellers = payload.sellers
        state.totalSellers = payload.totalSellers
      })
      .addCase(getDeactiveSellers.fulfilled, (state, { payload }) => {
        state.sellers = payload.sellers
        state.totalSellers = payload.totalSellers
      })
      .addCase(activeStripeConnectAccount.pending, (state) => {
        state.loader = true
      })
      .addCase(activeStripeConnectAccount.rejected, (state, { payload }) => {
        state.loader = false
        state.errorMessage = payload.message
      })
      .addCase(activeStripeConnectAccount.fulfilled, (state, { payload }) => {
        state.loader = false
        state.successMessage = payload.message
      })
  },
})

export const { messageClear } = sellerReducer.actions
export default sellerReducer.reducer
