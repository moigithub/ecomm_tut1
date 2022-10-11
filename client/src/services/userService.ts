import axios from 'axios'

export const userMe = async () => {
  let url = `http://localhost:4000/api/v1/me`
  const { data } = await axios.get(url, { withCredentials: true })

  return data
}

export const loginData = async (email: string, password: string) => {
  let url = `http://localhost:4000/api/v1/login`

  const { data } = await axios.post(
    url,
    { email, password },
    { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
  )
  return data.user
}

export const forgotPwd = async (email: string) => {
  let url = `http://localhost:4000/api/v1/forgotPassword`

  const { data } = await axios.post(
    url,
    { email },
    { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
  )
  return data
}

export const updatePwd = async (oldPassword: string, password: string) => {
  let url = `http://localhost:4000/api/v1/password/update`

  const { data } = await axios.post(
    url,
    { oldPassword, password },
    { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
  )
  return data
}

export const register = async (name: string, email: string, password: string, avatar: File) => {
  let url = `http://localhost:4000/api/v1/register`

  const formData = new FormData()
  formData.set('name', name)
  formData.set('email', email)
  formData.set('password', password)
  formData.set('avatar', avatar)
  const { data } = await axios.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true
  })
  return data.user
}

export const savePassword = async (oldPassword: string, password: string) => {
  let url = `http://localhost:4000/api/v1/password/update`

  const { data } = await axios.post(
    url,
    { oldPassword, password },
    { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
  )
  return data
}

export const updateUser = async (
  id: string,
  name: string,
  email: string,
  role: string,
  avatar?: File | null
) => {
  let url = `http://localhost:4000/api/v1/admin/user/${id}`

  const formData = new FormData()
  formData.set('name', name)
  formData.set('email', email)
  formData.set('role', role)

  if (avatar) {
    formData.set('avatar', avatar)
  }

  const { data } = await axios.put(url, formData, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
  })

  return data.user
}

export const getUsers = async () => {
  let url = `http://localhost:4000/api/v1/admin/users`

  const { data } = await axios.get(url, { withCredentials: true })
  return data.users
}

export const getUserDetail = async (id: string) => {
  let url = `http://localhost:4000/api/v1/admin/user/${id}`
  const { data } = await axios.get(url, { withCredentials: true })
  return data.user
}

export const deleteUser = async (id: string) => {
  let url = `http://localhost:4000/api/v1/admin/user/${id}`

  const { data } = await axios.delete(url, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
  })
  return id
}
