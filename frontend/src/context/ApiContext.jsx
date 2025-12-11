import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'


const ApiContext = createContext(null)


const api = axios.create({
baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
timeout: 10000
})


export function ApiProvider({ children }) {
const [loading, setLoading] = useState(false)


const call = async (fn) => {
setLoading(true)
try {
const res = await fn(api)
setLoading(false)
return res
} catch (err) {
setLoading(false)
throw err
}
}


return (
<ApiContext.Provider value={{ api, call, loading }}>
{children}
</ApiContext.Provider>
)
}


export function useApi() {
return useContext(ApiContext)
}