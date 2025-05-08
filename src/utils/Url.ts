import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const HOST_URL = 'https://eiehrapi.mssplonline.com/api/';
// export const HOST_URL = 'https://poletrackapi.mssplonline.com/api/';

export const Bot_URL = 'http://103.12.1.132:8171/';
export const Chat = axios.create({
    baseURL: Bot_URL,
});

const api = axios.create({
    baseURL: HOST_URL,
});

api.interceptors.request.use(
    (config) => {
        const tokenString = sessionStorage.getItem('token');
        if (tokenString) {
            try {
                const token = JSON.parse(tokenString);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error("Error parsing token from sessionStorage", error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            Logout();
        }
        return Promise.reject(error);
    }
);

function Logout() {
    localStorage.clear();
    sessionStorage.clear();
    toast.success("Token expired. Logging out...");
     // Use a hook only in react component
     // so use this navigation method instead of useNavigation();
     window.location.href = "/"

}

export default api;