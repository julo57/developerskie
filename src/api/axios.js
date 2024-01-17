import axios from "axios";

export default axios.create({
    baseURL:"https://api.techwave-shop.pl",
    withCredentials: true,
})