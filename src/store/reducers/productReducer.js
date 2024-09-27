import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/api'

export const addProduct = createAsyncThunk(
  'product/addProduct',
  async (product, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/product-add', product, {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getProducts = createAsyncThunk(
  'product/getProducts',
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/products-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        { withCredentials: true }
      )

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getProduct = createAsyncThunk(
  'product/getProduct',
  async (productId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/product-get/${productId}`, {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async (product, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/product-update', product, {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateProductImage = createAsyncThunk(
  'product/updateProductImage',
  async (
    { oldImage, newImage, productId },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const formData = new FormData()

      formData.append('oldImage', oldImage)
      formData.append('newImage', newImage)
      formData.append('productId', productId)

      const { data } = await api.post('/product-image-update', formData, {
        withCredentials: true,
      })

      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const productReducer = createSlice({
  name: 'product',
  initialState: {
    successMessage: '',
    errorMessage: '',
    loader: false,
    products: [],
    product: '',
    totalProducts: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.pending, (state) => {
        state.loader = true
      })
      .addCase(addProduct.rejected, (state, { payload }) => {
        state.loader = false
        state.errorMessage = payload.error
      })
      .addCase(addProduct.fulfilled, (state, { payload }) => {
        state.loader = false
        state.successMessage = payload.message
      })
      .addCase(getProducts.fulfilled, (state, { payload }) => {
        state.totalProducts = payload.totalProducts
        state.products = payload.products
      })
      .addCase(getProduct.fulfilled, (state, { payload }) => {
        state.product = payload.product
      })
      .addCase(updateProduct.pending, (state) => {
        state.loader = true
      })
      .addCase(updateProduct.rejected, (state, { payload }) => {
        state.loader = false
        state.errorMessage = payload.error
      })
      .addCase(updateProduct.fulfilled, (state, { payload }) => {
        state.loader = false
        state.product = payload.product
        state.successMessage = payload.message
      })
      .addCase(updateProductImage.fulfilled, (state, { payload }) => {
        state.product = payload.product
        state.successMessage = payload.message
      })
  },
})

export const { messageClear } = productReducer.actions
export default productReducer.reducer
