import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import bcrypt from "bcryptjs-react";
import CommonService from "../Services/Common/CommonService";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [isHearing, setIsHearing] = useState("No");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleOnClickRegister = async () => {
    if (fullName === "") {
      toast.error("Please Enter Your Full Name");
    } else if (userName === "") {
      toast.error("Please Enter Your User Name");
    } else if (age === "") {
      toast.error("Please Enter Your Age");
    } else if (gender === "") {
      toast.error("Please Select Your Gender");
    } else if (password === "") {
      toast.error("Please Enter Your Password");
    } else if (confirmPassword === "") {
      toast.error("Please Enter Confirm Password");
    } else if (confirmPassword !== password) {
      toast.error("Password not Match");
    } else {
      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(password, saltRounds);

      var payload = {
        FullName: fullName,
        UserName: userName,
        Age: age,
        Gender: gender,
        IsHearing: isHearing,
        PasswordHash: hashedPassword,
      };
      var response = await CommonService.Register(payload);
      if (response.success) {
        toast.success(response.message);
        setFullName("");
        setUserName("");
        setAge("");
        setGender("");
        setIsHearing("No");
        setPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response.message);
      }
    }
  };

  return (
    <div className="inner-layout">
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <form>
              <h3>Registration</h3>
              <div className="mb-3">
                <label>Full Name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  className="form-control"
                  placeholder="Your Full Name"
                />
              </div>
              <div className="mb-3">
                <label>User Name</label>
                <input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  type="text"
                  className="form-control"
                  placeholder="Your User Name"
                />
              </div>
              <div className="mb-3">
                <label>Age</label>
                <input
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  type="number"
                  className="form-control"
                  placeholder="Your Age"
                />
              </div>
              <div className="mb-3">
                <label>Gender</label>
                <br />
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio1"
                    value="Male"
                    checked={gender === "Male"}
                    onChange={() => setGender("Male")}
                  />
                  <label className="form-check-label" for="inlineRadio1">
                    Male
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio2"
                    value="Female"
                    checked={gender === "Female"}
                    onChange={() => setGender("Female")}
                  />
                  <label className="form-check-label" for="inlineRadio2">
                    Female
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio3"
                    value="Other"
                    checked={gender === "Other"}
                    onChange={() => setGender("Other")}
                  />
                  <label className="form-check-label" for="inlineRadio3">
                    Other
                  </label>
                </div>
              </div>
              <div className="mb-3">
                <label>Have hearing loss?</label>
                <br />
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="hearing"
                    id="hearing1"
                    value="Yes"
                    checked={isHearing === "Yes"}
                    onChange={() => setIsHearing("Yes")}
                  />
                  <label className="form-check-label" for="hearing1">
                    Yes
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="hearing"
                    id="hearing2"
                    value="No"
                    checked={isHearing === "No"}
                    onChange={() => setIsHearing("No")}
                  />
                  <label className="form-check-label" for="hearing2">
                    No
                  </label>
                </div>
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
                <label>Confirm Password</label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  className="form-control"
                  placeholder="Enter Confirm password"
                />
              </div>
              <div className="d-grid">
                <button
                  type="button"
                  onClick={handleOnClickRegister}
                  className="btn btn-primary"
                >
                  Register
                </button>
              </div>
              <p className="forgot-password text-right">
                Already registered <Link to="/">login?</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
