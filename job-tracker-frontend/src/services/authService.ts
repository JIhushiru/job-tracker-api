import axios from "./api";

export const login = async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const response = await axios.post("auth/login", formData.toString(), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    const token = response.data.access_token;
    localStorage.setItem("token", token);
};

export const signup = async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    await axios.post("auth/signup", formData.toString(), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
};
