import axios from "axios";
// https://tinder-mern-backend-practice.herokuapp.com/
const instance = axios.create({ baseURL: "http://localhost:8000" });

export default instance;
