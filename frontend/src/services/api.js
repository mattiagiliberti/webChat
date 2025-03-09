import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", 
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

  // Chat API
  async createChat (chat) {    
    const response = await api.post("/chats", chat);
    return response;
  },
  async getChatById (id) {    
    const response = await api.get(`/chats/${id}`);
    return response;
  },  

}
