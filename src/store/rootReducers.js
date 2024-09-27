import authReducer from "./reducers/authReducer"
import bannerReducer from "./reducers/bannerReducer"
import categoryReducer from "./reducers/categoryReducer"
import chatReducer from "./reducers/chatReducer"
import dashboardReducer from "./reducers/dashboardReducer"
import orderReducer from "./reducers/orderReducer"
import paymentReducer from "./reducers/paymentReducer"
import productReducer from "./reducers/productReducer"
import sellerReducer from "./reducers/sellerReducer"

const rootReducer = {
  auth: authReducer,
  banner: bannerReducer,
  category: categoryReducer,
  chat: chatReducer,
  dashboard: dashboardReducer,
  order: orderReducer,
  payment: paymentReducer,
  product: productReducer,
  seller: sellerReducer,
}

export default rootReducer