import axios from "axios";
import { submitPackageDesign } from "./backendapi";


const API_URL = "";

export const submitPackageDesign = async (formData) => {
    return await axios.post(`${API_URL}/api/package-design`, formData, {
         headers: { "Content-Type": "application/json" },
    });
};