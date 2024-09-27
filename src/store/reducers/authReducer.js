import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'
import api from '../../api/api'

export const adminLogin = createAsyncThunk(
  'auth/adminLogin',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/auth/admin-login', info, {
        withCredentials: true,
      })

      localStorage.setItem('accessToken', data.token)

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getUserInfo = createAsyncThunk(
  'auth/getUserInfo',
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get('/auth/get-user', {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const profileImageUpload = createAsyncThunk(
  'auth/profileImageUpload',
  async (image, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/auth/profile-image-upload', image, {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const profileInfoAdd = createAsyncThunk(
  'auth/profileInfoAdd',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/auth/profile-info-add', info, {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const sellerLogin = createAsyncThunk(
  'auth/sellerLogin',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/auth/seller-login', info, {
        withCredentials: true,
      })

      localStorage.setItem('accessToken', data.token)

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const sellerRegister = createAsyncThunk(
  'auth/sellerRegister',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/auth/seller-register', info, {
        withCredentials: true,
      })

      localStorage.setItem('accessToken', data.token)

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async ({ navigate, role }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get('/auth/logout', {
        withCredentials: true,
      })

      localStorage.removeItem('accessToken')

      if (role === 'admin') {
        navigate('/admin/login')
      } else {
        navigate('/login')
      }

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const returnRole = (token) => {
  if (!token) return ''

  const decodeToken = jwtDecode(token)
  const expireTime = new Date(decodeToken.exp * 1000)

  if (new Date() > expireTime) {
    localStorage.removeItem('accessToken')

    return ''
  } else {
    return decodeToken.role
  }
}

export const authReducer = createSlice({
  name: 'auth',
  initialState: {
    successMessage: '',
    errorMessage: '',
    loader: false,
    userInfo: '',
    role: returnRole(localStorage.getItem('accessToken')),
    token: localStorage.getItem('accessToken'),
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loader = true
      })
      .addCase(adminLogin.rejected, (state, { payload }) => {
        state.loader = false
        state.errorMessage = payload.message
      })
      .addCase(adminLogin.fulfilled, (state, { payload }) => {
        state.loader = false
        state.successMessage = payload.message
        state.token = payload.token
        state.role = returnRole(payload.token)
      })
      .addCase(sellerLogin.pending, (state) => {
        state.loader = true
      })
      .addCase(sellerLogin.rejected, (state, { payload }) => {
        state.loader = false
        state.errorMessage = payload.error
      })
      .addCase(sellerLogin.fulfilled, (state, { payload }) => {
        state.loader = false
        state.successMessage = payload.message
        state.token = payload.token
        state.role = returnRole(payload.token)
      })
      .addCase(sellerRegister.pending, (state) => {
        state.loader = true
      })
      .addCase(sellerRegister.rejected, (state, { payload }) => {
        state.loader = false
        state.errorMessage = payload.error
      })
      .addCase(sellerRegister.fulfilled, (state, { payload }) => {
        state.loader = false
        state.successMessage = payload.message
        state.token = payload.token
        state.role = returnRole(payload.token)
      })
      .addCase(getUserInfo.fulfilled, (state, { payload }) => {
        state.loader = false
        state.userInfo = payload.userInfo
      })
      .addCase(profileImageUpload.pending, (state) => {
        state.loader = true
      })
      .addCase(profileImageUpload.fulfilled, (state, { payload }) => {
        state.loader = false
        state.userInfo = payload.userInfo
        state.successMessage = payload.message
      })
      .addCase(profileInfoAdd.pending, (state) => {
        state.loader = true
      })
      .addCase(profileInfoAdd.fulfilled, (state, { payload }) => {
        state.loader = false
        state.userInfo = payload.userInfo
        state.successMessage = payload.message
      })
  },
})

export const { messageClear } = authReducer.actions
export default authReducer.reducer
