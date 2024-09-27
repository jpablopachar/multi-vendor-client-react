import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { updateCustomer, updateSellers } from '../store/reducers/chatReducer'
import { socket } from '../utils/utils'
import Header from './Header'
import Sidebar from './Sidebar'

const MainLayout = () => {
  const dispatch = useDispatch()

  const { userInfo } = useSelector((state) => state.auth)

  const [showSidebar, setShowSidebar] = useState(false)

  useEffect(() => {
    if (userInfo && userInfo.role === 'seller') {
      socket.emit('addSeller', userInfo._id, userInfo)
    } else {
      socket.emit('addAdmin', userInfo)
    }
  }, [userInfo])

  useEffect(() => {
    socket.on('activeCustomer', (customers) => {
      dispatch(updateCustomer(customers))
    })

    socket.on('activeSellers', (sellers) => {
      dispatch(updateSellers(sellers))
    })
  })

  return (
    <div className="bg-[#cdcae9] w-full min-h-screen">
      <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="ml-0 lg:ml-[260px] pt-[95px] transition-all">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
