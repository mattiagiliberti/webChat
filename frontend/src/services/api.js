import axios from "axios";
const serverUrl = import.meta.env.VITE_SERVER_HOSTNAME;
const api = axios.create({
  baseURL: serverUrl+"/api", 
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
    localStorage.removeItem("userId");
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
    const response = await api.put(`/user/${id}`, data,{
      headers:{
        "Content-Type": "multipart/form-data",
      }
    });
    return response;
  },

  async updatePasswordProfile (id, data) {
    const response = await api.put(`/user/${id}/password`, data);
    return response;
  },

  async deleteUserProfile (id) {
    const response = await api.delete(`/user/${id}`);
    return response;
  },

  // Chat API
  async getAllMessagesByChat (id) {
    const response = await api.get(`/messages/${id}`);
    return response;
  },

  async createMessage (message) {
    const response = await api.post("/messages", message);
    return response;
  },

  async updateMessage (id, message) {
    const response = await api.put(`/messages/${id}`, message);
    return response;
  },

  async deleteMessage (id) {  
    const response = await api.delete(`/messages/${id}`);
    return response;
  }
}
