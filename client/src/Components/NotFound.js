import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    });
  }, []);

  return (
    <div>
      <h1>Page Not Found</h1>
      <p>Redirecting to the Home page...</p>
    </div>
  );
};

export default NotFound;
