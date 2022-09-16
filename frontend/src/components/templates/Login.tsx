import React from "react";
import { LogInForm } from "./Interfaces";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse, AxiosError } from "axios";

type Props = {
  email: string;
};

const Login: React.FC<Props> = ({ email }) => {
  const BASE_URL = process.env.REACT_APP_PUBLIC_URL || "http://localhost:8000";
  const navigate = useNavigate();
  const TEMPLATE_PATH = "/user/templates";

  const handleSubmit = () => {
    const form: LogInForm | null = document.getElementById("login-form");
    const email: string = form!["email"]!.value;
    const password: string = form!["password"]!.value;

    axios({
      method: "post",
      url: `${BASE_URL}/user/login`,
      data: {
        email: email,
        password: password,
      },
    })
      .then((res: AxiosResponse) => {
        sessionStorage.setItem("melbeeID", res.data.id);
        sessionStorage.setItem("isLoggedIn", "true");
        navigate(TEMPLATE_PATH);
      })
      .catch((err: AxiosError<{ error: string }>) => {
        window.confirm("メールアドレスとパスワードがマッチしません。");
        console.log(err.response!.data);
      });
  };

  return (
    <div className="bg-white p-5 shadow-xl z-50 ml-6">
      <h1 className="mb-5 ttl_top text-lg text-gray-700">ログイン</h1>
      <form id="login-form">
        <div className="lg:flex mb-4">
          <label htmlFor="email" className="lg:w-52 text-base text-gray-700">
            メールアドレス
          </label>
          <input
            type="email"
            className="border-solid border border-gray-300 p-1"
            name=""
            value={email}
            placeholder="youremail@example.com"
            id="email"
          />
        </div>
        <div className="lg:flex">
          <label htmlFor="password" className="lg:w-52 text-base text-gray-700">
            パスワード
          </label>
          <input
            type="password"
            className="border-solid border border-gray-300 p-1 bg-gray-100 focus:bg-white"
            name=""
            id="password"
          />
        </div>
        <input
          type="button"
          value="ログイン"
          className="mt-6 p-2 color-blue text-sm text-white"
          onClick={handleSubmit}
        />
      </form>
    </div>
  );
};

export default Login;
