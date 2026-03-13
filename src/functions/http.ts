import axios from "axios"


const http = axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_URL as string,
    withCredentials: true,
    timeout: 10000 // 10 seconds
})

export default http