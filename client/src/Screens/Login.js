import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import * as commonAction from "../Actions/Common/CommonAction";
import LocalStorage from "../Utils/LocalStorage";
import CommonService from "../Services/Common/CommonService";

const Login = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setrememberMe] = useState(false);

  const handleOnClickLogin = async () => {
    if (userName === "") {
      toast.error("Please Enter Your User Name");
    } else if (password === "") {
      toast.error("Please Enter Your Password");
    } else {
      var payload = {
        UserName: userName,
        Password: password,
      };
      var response = await CommonService.Login(payload);
      if (response.success) {
        if (rememberMe) {
          const credentials = { userName, password };
          LocalStorage.SetData(
            "rememberedCredentials",
            JSON.stringify(credentials)
          );
        } else {
          LocalStorage.RemoveData("rememberedCredentials");
        }
        toast.success(response.message);
        setUserName("");
        setPassword("");
        LocalStorage.SetData("UserId", response.userId);
        dispatch(commonAction.saveUserId(response.userId));
        dispatch(commonAction.fetchUserById(response.userId));
        if (response.isAdmin) {
          dispatch(commonAction.saveIsAdmin());
          LocalStorage.SetData("IsAdmin", true);
        } else {
          dispatch(commonAction.removeIsAdmin());
          LocalStorage.SetData("IsAdmin", false);
        }
      } else {
        toast.error(response.message);
      }
    }
  };

  const handleOnChangeRememberMe = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    setrememberMe(newValue);
  };

  useEffect(() => {
    const storedCredentials = LocalStorage.GetData("rememberedCredentials");
    if (storedCredentials) {
      const { userName, password } = JSON.parse(storedCredentials);
      setUserName(userName);
      setPassword(password);
      setrememberMe(true);
    }
  }, []);

  return (
    <div className="inner-layout">
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <form>
              <h3>Denoiser Study Login</h3>
              <div className="mb-3">
                <label>User Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="form-control"
                  placeholder="Enter User name"
                />
              </div>
              <div className="mb-3">
                <label>Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                />
              </div>
              <div className="mb-3">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckChecked"
                    checked={rememberMe}
                    onChange={handleOnChangeRememberMe}
                  />
                  <label
                    className="form-check-label"
                    for="flexSwitchCheckChecked"
                  >
                    Remember me
                  </label>
                </div>
              </div>
              <div className="d-grid">
                <button
                  type="button"
                  onClick={handleOnClickLogin}
                  className="btn btn-primary"
                >
                  Login
                </button>
              </div>
              <p className="forgot-password text-right">
                <Link to="/register">Register a New Account?</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
