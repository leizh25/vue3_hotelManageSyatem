import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
export const getHotelEmpId = () => {
  return userStore.hotelEmpId
}
