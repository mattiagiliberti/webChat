import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", 
});

// interceptors per aggiungere il token alle richieste
api.interceptors.request.use((config) => {

  const token = localStorage.getItem('token') || null;

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


export default {

  // Auth API
  async login (credentials) {    
    const response = await api.post("/auth/login", credentials);
    return response;
  },

  async register (credentials) {    
    const response = await api.post("/auth/register", credentials);
    return response;
  },

  async logout () {
    localStorage.removeItem("token");
  },

  // Chat API
  async createChat (chat) {    
    const response = await api.post("/chats", chat);
    return response;
  },
  async getChatById (id) {    
    const response = await api.get(`/chats/${id}`);
    return response;
  },  

  async searchUserbyUsername (query) {
    const response = await api.get(`/user/search/${query}`);
    return response;
  },

  //User API
  async getUserProfile (id) {
    const response = await api.get(`/user/${id}`);
    return response;
  },

  async updateUserProfile (id, data) {
    const response = await api.put(`/user/${id}`, data);
    return response;
  },

  async updatePasswordProfile (id, data) {
    const response = await api.put(`/user/${id}/password`, data);
    return response;
  },

  async deleteUserProfile (id) {
    const response = await api.delete(`/user/${id}`);
    return response;
  }
}
