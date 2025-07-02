import axios from "./api";

export const login = async (username: string, password: string) => {
    const response = await axios.post("auth/login",{
        username,
        password
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    const token = response.data.access_token;
    localStorage.setItem("token", token);
};
