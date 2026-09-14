import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/applications/my");
            setApplications(response.data);
        } catch (err) {
            console.error("Failed to load applications:", err);
            setError("Unable to load your applications.");
        } finally {
            setLoading(false);
        }
    };

    const removeApplication = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to remove this application?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/applications/${id}`);

            setApplications((current) =>
                current.filter((application) => application.id !== id)
            );
        } catch (err) {
            console.error("Failed to remove application:", err);
            alert("Could not remove the application.");
        }
    };

    const getStatusClass = (status) => {
        return status?.toLowerCase() || "applied";
    };

    const appliedCount = applications.length;

    const interviewCount = applications.filter(
        (application) => application.status === "INTERVIEW"
    ).length;

    const offerCount = applications.filter(
        (application) => application.status === "OFFER"
    ).length;

    const rejectedCount = applications.filter(
        (application) => application.status === "REJECTED"
    ).length;
    const updateStatus = async (applicationId, newStatus) => {
    try {
        await api.put(
            `/applications/${applicationId}/status`,
            {
                status: newStatus
            }
        );

        // Update UI immediately
        setApplications((current) =>
            current.map((application) =>
                application.id === applicationId
                    ? {
                        ...application,
                        status: newStatus
                    }
                    : application
            )
        );

    } catch (error) {
        console.error(
            "Failed to update application status:",
            error
        );

        alert("Could not update application status.");
       }
   };

    return (
        <div className="dashboard-page">

            {/* Header */}
            <header className="dashboard-header">
                <div>
                    <span className="dashboard-label">YOUR JOURNEY</span>

                    <h1>
                        Welcome back{user?.name ? `, ${user.name}` : ""}.
                    </h1>

                    <p>
                        Track your applications and keep your job search organized.
                    </p>
                </div>

                <div className="dashboard-header-actions">

                    <Link
                        to="/jobs"
                        className="browse-jobs-btn"
                    >
                        Browse Jobs
                    </Link>

                    <button
                        className="dashboard-menu-btn"
                        onClick={() => navigate("/")}
                    >
                         Main Menu
                    </button>

                </div>
            </header>

            {/* Stats */}
            <section className="dashboard-stats">

                <div className="stat-card">
                    <span className="stat-icon">↗</span>
                    <div>
                        <strong>{appliedCount}</strong>
                        <span>Applications</span>
                    </div>
                </div>

                <div className="stat-card">
                    <span className="stat-icon">◷</span>
                    <div>
                        <strong>{interviewCount}</strong>
                        <span>Interviews</span>
                    </div>
                </div>

                <div className="stat-card">
                    <span className="stat-icon">✓</span>
                    <div>
                        <strong>{offerCount}</strong>
                        <span>Offers</span>
                    </div>
                </div>

                <div className="stat-card">
                    <span className="stat-icon">—</span>
                    <div>
                        <strong>{rejectedCount}</strong>
                        <span>Rejected</span>
                    </div>
                </div>

            </section>

            {/* Applications */}
            <section className="applications-section">

                <div className="applications-heading">

                    <div>
                        <span className="dashboard-label">
                            APPLICATIONS
                        </span>

                        <h2>Your applications</h2>
                    </div>

                    <div className="applications-heading-actions">

                        <button
                            className="refresh-btn"
                            onClick={loadApplications}
                        >
                            ↻ Refresh Status
                        </button>

                        <span className="application-count">
                            {applications.length} total
                        </span>

                    </div>

                </div>

                {loading && (
                    <div className="dashboard-message">
                        Loading your applications...
                    </div>
                )}

                {!loading && error && (
                    <div className="dashboard-message error">
                        {error}
                        <button onClick={loadApplications}>
                            Try again
                        </button>
                    </div>
                )}

                {!loading && !error && applications.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">↗</div>

                        <h3>No applications yet</h3>

                        <p>
                            Start exploring opportunities and apply to your first job.
                        </p>

                        <Link to="/jobs" className="empty-btn">
                            Explore Jobs →
                        </Link>
                    </div>
                )}

                {!loading && !error && applications.length > 0 && (
                    <div className="application-list">

                        {applications.map((application) => (

                            <article
                                className="application-card"
                                key={application.id}
                            >

                                <div className="application-main">

                                    <div className="company-avatar">
                                        {application.company
                                            ?.charAt(0)
                                            ?.toUpperCase() || "A"}
                                    </div>

                                    <div className="application-info">

                                        <span className="application-label">
                                            APPLICATION
                                        </span>

                                        <h3>
                                            {application.jobTitle}
                                        </h3>

                                        <p>
                                            {application.company}
                                        </p>

                                        <span className="applied-date">
                                            Applied on{" "}
                                            {application.appliedAt
                                                ? new Date(
                                                      application.appliedAt
                                                  ).toLocaleDateString()
                                                : "—"}
                                        </span>

                                    </div>

                                </div>

                                <div className="application-actions">

                                    <div className="status-wrapper">
                                        <select
                                            className={`status-select status-${application.status.toLowerCase()}`}
                                            value={application.status}
                                            onChange={(e) =>
                                                updateStatus(
                                                    application.id,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="APPLIED">Applied</option>
                                            <option value="SCREENING">Screening</option>
                                            <option value="INTERVIEW">Interview</option>
                                            <option value="OFFER">Offer</option>
                                            <option value="REJECTED">Rejected</option>
                                        </select>

                                        <span className="status-arrow">⌄</span>
                                    </div>

                                    <a
                                        href={application.jobUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="view-job-btn"
                                    >
                                        View Job
                                    </a>

                                    <button
                                        className="remove-btn"
                                        onClick={() =>
                                            removeApplication(application.id)
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            </article>

                        ))}

                    </div>
                )}

            </section>

        </div>
    );
}

export default Dashboard;