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
    <div className='w-full max-w-6xl flex flex-col gap-6 font-sans'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-slate-900'>Customer Management</h2>
          <p className='text-slate-500 mt-1 text-sm'>View and manage your registered customers.</p>
        </div>
        <div className='w-full sm:w-72 relative'>
          <input 
            type="text" 
            placeholder='Search name or email...' 
            className='w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all text-sm bg-white shadow-sm'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className='bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden'>
        {loading ? (
          <div className='p-12 flex flex-col items-center justify-center text-slate-500'>
             <div className="w-8 h-8 border-4 border-gray-200 border-t-slate-800 rounded-full animate-spin mb-4"></div>
             <p>Loading customers...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className='p-12 text-center text-slate-500'>
            <p>No customers found matching your criteria.</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse whitespace-nowrap'>
              <thead>
                <tr className='bg-gray-50/50 border-b border-gray-200 text-xs text-slate-500 uppercase tracking-wider'>
                  <th className='px-6 py-4 font-semibold'>Name</th>
                  <th className='px-6 py-4 font-semibold'>Email</th>
                  <th className='px-6 py-4 font-semibold text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='text-sm divide-y divide-gray-100'>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className='hover:bg-gray-50/80 transition-colors group'>
                    <td className='px-6 py-4 font-medium text-slate-900'>{user.name}</td>
                    <td className='px-6 py-4 text-slate-600'>{user.email}</td>
                    <td className='px-6 py-4 text-right'>
                      <button 
                        onClick={() => removeUser(user._id)}
                        className='text-red-500 hover:text-red-700 bg-white border border-transparent hover:border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-md transition-all font-medium text-xs opacity-0 group-hover:opacity-100 focus:opacity-100'
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
