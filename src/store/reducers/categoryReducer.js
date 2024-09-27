import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/api'

export const categoryAdd = createAsyncThunk(
  'category/categoryAdd',
  async ({ name, image }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const formData = new FormData()

      formData.append('name', name)
      formData.append('image', image)

      const { data } = await api.post('/category-add', formData, {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getCategories = createAsyncThunk(
  'category/getCategories',
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/category-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
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

export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ id, name, image }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const formData = new FormData()

      formData.append('name', name)

      if (image) formData.append('image', image)

      const { data } = await api.put(`/category-update/${id}`, formData, {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/category/${id}`)

      return res.data
    } catch (error) {
      return rejectWithValue(error.response.data.message)
    }
  }
)

export const categoryReducer = createSlice({
  name: 'category',
  initialState: {
    successMessage: '',
    errorMessage: '',
    loader: false,
    categories: [],
    total: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(categoryAdd.pending, (state) => {
        state.loader = true
      })
      .addCase(categoryAdd.rejected, (state, { payload }) => {
        state.loader = false
        state.errorMessage = payload.error
      })
      .addCase(categoryAdd.fulfilled, (state, { payload }) => {
        state.loader = false
        state.successMessage = payload.message
        state.categories = [...state.categories, payload.category]
      })
      .addCase(getCategories.fulfilled, (state, { payload }) => {
        state.total = payload.total
        state.categories = payload.categories
      })
      .addCase(updateCategory.rejected, (state, { payload }) => {
        state.loader = false
        state.errorMessage = payload.error
      })
      .addCase(updateCategory.fulfilled, (state, { payload }) => {
        state.loader = false
        state.successMessage = payload.message

        const index = state.categories.findIndex(
          (category) => category._id === payload.category._id
        )

        if (index !== -1) state.categories[index] = payload.category
      })
      .addCase(deleteCategory.rejected, (state, { payload }) => {
        state.errorMessage = payload
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.successMessage = action.payload.message
        state.categories = state.categories.filter(
          (category) => category._id !== action.meta.arg
        )
      })
  },
})

export const { messageClear } = categoryReducer.actions
export default categoryReducer.reducer
