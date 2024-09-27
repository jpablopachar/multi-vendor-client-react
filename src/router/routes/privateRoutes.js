import { adminRoutes } from "./AdminRoutes"
import { sellerRoutes } from "./SellerRoutes"

export const privateRoutes = [
  ...adminRoutes,
  ...sellerRoutes
]