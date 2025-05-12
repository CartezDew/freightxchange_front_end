import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logOut } from '../../services/users.js'

function LogOut({setUser}) {
  const navigate = useNavigate()

  useEffect(() => {
    const logOutUser = async () => {
      await logOut()
      setUser(null)
      navigate('/')
    }
    logOutUser()
  }, [])

  return ''
}

export default LogOut