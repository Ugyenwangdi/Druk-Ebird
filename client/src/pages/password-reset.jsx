import { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/passwordreset.css";

const PasswordReset = () => {
  const [validUrl, setValidUrl] = useState(false);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const param = useParams();
  const url = `http://localhost:8080/api/v1/password-reset/${param.id}/${param.token}`;
  // const url = `${process.env.REACT_APP_API_URL}/api/v1/password-reset/${param.id}/${param.token}`;

  useEffect(() => {
    const verifyUrl = async () => {
      try {
        await axios.get(url);
        setValidUrl(true);
      } catch (error) {
        setValidUrl(false);
      } finally {
        setIsLoading(false); // Set loading state to false when verification is done
      }
    };
    verifyUrl();
  }, [param, url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(url, { password });
      setMsg(data.message);
      setError("");
      window.location = "/login";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
        setMsg("");
      }
    }
  };

  return (
    <Fragment>
      {isLoading ? ( // Display loading spinner while loading
        <div className="loading">Loading...</div>
      ) : validUrl ? (
        <div className="password_reset_container">
          <form className="form_contain" onSubmit={handleSubmit}>
            <h1>Add New Password</h1>
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              className="input"
            />
            {error && <div className="error_msg">{error}</div>}
            {msg && <div className="success_msg">{msg}</div>}
            <button type="submit" className="green_btn">
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div className="loading">Loading...</div>
      )}
    </Fragment>
  );
};

export default PasswordReset;
