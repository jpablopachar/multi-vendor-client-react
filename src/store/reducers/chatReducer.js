import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/api'

export const getCustomers = createAsyncThunk(
  'chat/getCustomers',
  async (sellerId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/chat/seller/get-customers/${sellerId}`, {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getCustomerMessage = createAsyncThunk(
  'chat/getCustomerMessage',
  async (customerId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/chat/seller/get-customer-message/${customerId}`,
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

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        '/chat/seller/send-message-to-customer',
        info,
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

export const getSellers = createAsyncThunk(
  'chat/getSellers',
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get('/chat/admin/get-sellers', {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const sendMessageSellerAdmin = createAsyncThunk(
  'chat/sendMessageSellerAdmin',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/chat/message-send-seller-admin', info, {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getAdminMessage = createAsyncThunk(
  'chat/getAdminMessage',
  async (receiverId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/chat/get-admin-messages/${receiverId}`, {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getSellerMessage = createAsyncThunk(
  'chat/getSellerMessage',
  async (receiverId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get('/chat/get-seller-messages', {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const chatReducer = createSlice({
  name: 'chat',
  initialState: {
    successMessage: '',
    errorMessage: '',
    customers: [],
    messages: [],
    activeCustomers: [],
    activeSellers: [],
    activeAdmin: '',
    friends: [],
    sellerAdminMessages: [],
    currentSeller: {},
    currentCustomer: {},
    sellers: [],
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = ''
      state.successMessage = ''
    },
    updateMessage: (state, { payload }) => {
      state.messages = [...state.messages, payload]
    },
    updateSellers: (state, { payload }) => {
      state.activeSellers = payload
    },
    updateCustomer: (state, { payload }) => {
      state.activeCustomers = payload
    },
    updateAdminMessage: (state, { payload }) => {
      state.sellerAdminMessages = [...state.sellerAdminMessages, payload]
    },
    updateSellerMessage: (state, { payload }) => {
      state.sellerAdminMessages = [...state.sellerAdminMessages, payload]
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.fulfilled, (state, { payload }) => {
        state.customers = payload.customers
      })
      .addCase(getCustomerMessage.fulfilled, (state, { payload }) => {
        state.messages = payload.messages
        state.currentCustomer = payload.customer
      })
      .addCase(sendMessage.fulfilled, (state, { payload }) => {
        let tempFriends = state.customers
        let index = tempFriends.findIndex(
          (friend) => friend.fdId === payload.message.receiverId
        )

        while (index > 0) {
          let temp = tempFriends[index]

          tempFriends[index] = tempFriends[index - 1]
          tempFriends[index - 1] = temp
          index--
        }

        state.customers = tempFriends
        state.messages = [...state.messages, payload.message]
        state.successMessage = 'Message send success'
      })
      .addCase(getSellers.fulfilled, (state, { payload }) => {
        state.sellers = payload.sellers
      })
      .addCase(sendMessageSellerAdmin.fulfilled, (state, { payload }) => {
        state.sellerAdminMessages = [
          ...state.sellerAdminMessages,
          payload.message,
        ]
        state.successMessage = 'Message send success'
      })
      .addCase(getAdminMessage.fulfilled, (state, { payload }) => {
        state.sellerAdminMessages = payload.messages
        state.currentSeller = payload.currentSeller
      })
      .addCase(getSellerMessage.fulfilled, (state, { payload }) => {
        state.sellerAdminMessages = payload.messages
      })
  },
})

export const {
  messageClear,
  updateMessage,
  updateSellers,
  updateCustomer,
  updateAdminMessage,
  updateSellerMessage,
} = chatReducer.actions
export default chatReducer.reducer
