import axios from "./api";

export const login = async (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  await axios.post("auth/login", formData.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

export const signup = async (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  await axios.post("auth/signup", formData.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

export const logout = async () => {
  await axios.post("/auth/logout");
};
