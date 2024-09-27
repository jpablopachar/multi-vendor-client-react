/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react'
import { LuArrowDownSquare } from 'react-icons/lu'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getAdminOrders } from '../../store/reducers/orderReducer'
import Pagination from '../Pagination'

const Orders = () => {
  const dispatch = useDispatch()

  const { orders, totalOrders } = useSelector((state) => state.order)

  const [currentPage, setCurrentPage] = useState(1)
  const [searchValue, setSearchValue] = useState('')
  const [parPage, setParPage] = useState(5)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    }

    dispatch(getAdminOrders(obj))
  }, [searchValue, currentPage, parPage])

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#6a5fdf] rounded-md">
        <div className="flex justify-between items-center">
          <select
            onChange={(event) => setParPage(parseInt(event.target.value))}
            className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <input
            onChange={(event) => setSearchValue(event.target.value)}
            value={searchValue}
            className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]"
            type="text"
            placeholder="search"
          />
        </div>
        <div className="relative mt-5 overflow-x-auto">
          <div className="w-full text-sm text-left [#d0d2d6]">
            <div className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
              <div className=" flex justify-between items-center">
                <div className="py-3 w-[25%] font-bold">Order id</div>
                <div className="py-3 w-[13%] font-bold">Price</div>
                <div className="py-3 w-[18%] font-bold">Payment Status</div>
                <div className="py-3 w-[18%] font-bold">Order Status</div>
                <div className="py-3 w-[18%] font-bold">Action </div>
                <div className="py-3 w-[8%] font-bold">
                  <LuArrowDownSquare />
                </div>
              </div>
            </div>
            {orders.map((o, i) => (
              <div key={i} className="text-[#d0d2d6] ">
                <div className=" flex justify-between items-start border-b border-slate-700">
                  <div className="py-3 w-[25%] font-medium whitespace-nowrap">
                    #{o._id}
                  </div>
                  <div className="py-3 w-[13%] font-medium">${o.price}</div>
                  <div className="py-3 w-[18%] font-medium">
                    {o.paymentStatus}
                  </div>
                  <div className="py-3 w-[18%] font-medium">
                    {o.deliveryStatus}
                  </div>
                  <div className="py-3 w-[18%] font-medium">
                    <Link to={`/admin/dashboard/order/details/${o._id}`}>
                      View
                    </Link>
                  </div>
                  <div
                    onClick={() => setShow(o._id)}
                    className="py-3 w-[8%] font-medium"
                  >
                    <LuArrowDownSquare />
                  </div>
                </div>
                <div
                  className={
                    show === o._id
                      ? 'block border-b border-slate-700 bg-[#8288ed]'
                      : 'hidden'
                  }
                >
                  {o.suborder.map((so, i) => (
                    <div
                      key={i}
                      className=" flex justify-start items-start border-b border-slate-700"
                    >
                      <div className="py-3 w-[25%] font-medium whitespace-nowrap pl-3">
                        #{so._id}
                      </div>
                      <div className="py-3 w-[13%] font-medium">
                        ${so.price}
                      </div>
                      <div className="py-3 w-[18%] font-medium">
                        {so.paymentStatus}
                      </div>
                      <div className="py-3 w-[18%] font-medium">
                        {so.deliveryStatus}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {totalOrders <= parPage ? (
          ''
        ) : (
          <div className="w-full flex justify-end mt-4 bottom-4 right-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalOrders}
              parPage={parPage}
              showItem={4}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
