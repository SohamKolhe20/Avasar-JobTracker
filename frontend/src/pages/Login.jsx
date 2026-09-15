import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email,
                password
            });
        console.log("LOGIN RESPONSE:", response.data);
        console.log("JWT TOKEN:", response.data.token);
        console.log("USER:", response.data.user);

            // Save JWT
            localStorage.setItem("token", response.data.token);

            // Save logged-in user
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );
//             console.log("STORED TOKEN:", localStorage.getItem("token"));
//             console.log("STORED USER:", localStorage.getItem("user"));


            // Go to dashboard/home
            window.location.href = "/";
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            {/* Background decoration */}
            <div className="auth-glow"></div>

            <div className="auth-container">

                {/* Logo */}
                <Link to="/" className="auth-brand">
                    <img
                        src="/avasarLogo.png"
                        alt="Avasar"
                        className="auth-brand-logo"
                    />
                    <span>avasar</span>
                </Link>

                {/* Card */}
                <div className="auth-card">

                    <div className="auth-heading">
                        <span className="section-label">
                            WELCOME BACK
                        </span>

                        <h1>Sign in to Avasar</h1>

                        <p>
                            Manage your applications and continue
                            your job journey.
                        </p>
                    </div>

                    <form onSubmit={handleLogin}>

                        <div className="form-group">
                            <label>Email</label>

                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />
                        </div>

                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Login →"}
                        </button>

                    </form>

                    <div className="auth-footer">
                        Don't have an account?
                        <Link to="/register">
                            Create one
                        </Link>
                    </div>

                </div>

                <Link to="/" className="back-home">
                    ← Back to home
                </Link>

            </div>

        </div>
    );
}

export default Login;