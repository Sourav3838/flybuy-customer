import axios from "axios";
// https://tinder-mern-backend-practice.herokuapp.com/
const instance = axios.create({ baseURL: "https://flybuy-backend.herokuapp.com/" });

export default instance;
