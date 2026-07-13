import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Customers = ({ token }) => {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/admin/users', { headers: { token } })
      if (response.data.success) {
        setUsers(response.data.users)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const removeUser = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this user? This cannot be undone.")) return;
    try {
      const response = await axios.post(
        backendUrl + '/api/admin/user/remove',
        { userId },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        fetchUsers() // refresh list
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to remove user')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='w-full max-w-5xl flex flex-col gap-5'>
      <div className='flex justify-between items-end'>
        <div>
          <h2 className='text-2xl font-semibold mb-1'>Customer Management</h2>
          <p className='text-gray-600'>View and manage registered customers.</p>
        </div>
        <div className='w-64'>
          <input 
            type="text" 
            placeholder='Search by name or email...' 
            className='w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className='bg-white border rounded-lg shadow-sm overflow-hidden mt-4'>
        {loading ? (
          <p className='p-8 text-center text-gray-500'>Loading customers...</p>
        ) : filteredUsers.length === 0 ? (
          <p className='p-8 text-center text-gray-500'>No customers found.</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-gray-50 border-b text-sm text-gray-600'>
                  <th className='p-4 font-medium'>Name</th>
                  <th className='p-4 font-medium'>Email</th>
                  <th className='p-4 font-medium'>Actions</th>
                </tr>
              </thead>
              <tbody className='text-sm'>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className='border-b hover:bg-gray-50 transition-colors'>
                    <td className='p-4'>{user.name}</td>
                    <td className='p-4 text-gray-600'>{user.email}</td>
                    <td className='p-4'>
                      <button 
                        onClick={() => removeUser(user._id)}
                        className='text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors'
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Customers
