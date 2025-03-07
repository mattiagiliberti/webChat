import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", 
});


export default {
  async login (credentials) {    
    const response = await api.post("/auth/login", credentials);
    return response;
  },

  async register (credentials) {    
    const response = await api.post("/auth/register", credentials);
    return response;
  }

}
