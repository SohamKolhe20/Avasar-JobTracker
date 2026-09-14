import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Jobs.css";

function Jobs() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [experienceFilter, setExperienceFilter] = useState("ALL");
    const [search, setSearch] = useState("");


    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            const response = await api.get("/jobs");

            const sortedJobs = [...response.data].sort(
                (a, b) =>
                    new Date(b.postedAt) - new Date(a.postedAt)
            );

            setJobs(sortedJobs);
        } catch (error) {
            console.error("Failed to load jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {

            const matchesExperience =
                experienceFilter === "ALL" ||
                job.experienceLevel === experienceFilter;

            const searchText = search.toLowerCase();

            const matchesSearch =
                job.title?.toLowerCase().includes(searchText) ||
                job.company?.toLowerCase().includes(searchText) ||
                job.location?.toLowerCase().includes(searchText);

            return matchesExperience && matchesSearch;
        });
    }, [jobs, experienceFilter, search]);
const handleApply = async (job) => {
    const token = localStorage.getItem("token");

    if (!token) {
        navigate("/login");
        return;
    }

    try {
        // Record the application in Avasar
        await api.post(
            "/applications",
            {
                jobId: job.id
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        // Open the company's actual application page
        window.open(
            job.jobUrl,
            "_blank",
            "noopener,noreferrer"
        );

        // Go to dashboard
        navigate("/dashboard");

    } catch (error) {
        console.error("Failed to apply:", error);

        if (error.response?.status === 409) {
            alert("You have already applied to this job.");
        } else if (error.response?.status === 401) {
            alert("Your session has expired. Please login again.");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        } else {
            alert("Could not submit application. Please try again.");
          }
        }
      };

    return (
        <div className="jobs-page">

            <header className="jobs-header">

                <div>
                    <span className="jobs-label">
                        OPPORTUNITIES
                    </span>

                    <h1>Find your next opportunity.</h1>

                    <p>
                        Explore jobs from companies looking for their next great hire.
                    </p>
                </div>

                <div className="jobs-header-actions">

                    <Link
                        to="/dashboard"
                        className="dashboard-link"
                    >
                        My Dashboard
                    </Link>

                    <button
                        className="main-menu-btn"
                        onClick={() => navigate("/")}
                    >
                        Main Menu
                    </button>

                </div>

            </header>

            {/* Filters */}

            <section className="job-filters">

                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search jobs, companies or locations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="experience-filter">

                    <span>Experience</span>

                    <button
                        className={experienceFilter === "ALL" ? "active" : ""}
                        onClick={() => setExperienceFilter("ALL")}
                    >
                        All
                    </button>

                    <button
                        className={
                            experienceFilter === "FRESHER"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setExperienceFilter("FRESHER")
                        }
                    >
                        Fresher
                    </button>

                    <button
                        className={
                            experienceFilter === "0-2 YEARS"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setExperienceFilter("0-2 YEARS")
                        }
                    >
                        0–2 Years
                    </button>

                    <button
                        className={
                            experienceFilter === "2-5 YEARS"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setExperienceFilter("2-5 YEARS")
                        }
                    >
                        2–5 Years
                    </button>

                    <button
                        className={
                            experienceFilter === "5+ YEARS"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setExperienceFilter("5+ YEARS")
                        }
                    >
                        5+ Years
                    </button>

                </div>

            </section>

            <div className="jobs-result-count">
                {filteredJobs.length} opportunities
            </div>

            {/* Jobs */}

            {loading ? (
                <div className="jobs-message">
                    Loading opportunities...
                </div>
            ) : filteredJobs.length === 0 ? (
                <div className="jobs-message">
                    No jobs match your filters.
                </div>
            ) : (

                <div className="all-jobs-grid">

                    {filteredJobs.map((job) => (

                        <article
                            className="all-job-card"
                            key={job.id}
                        >

                            <div className="job-card-top">

                                <div className="company-avatar">
                                    {job.company?.charAt(0)}
                                </div>

                                <span className="newest-label">
                                    {new Date(job.postedAt)
                                        .toLocaleDateString()}
                                </span>

                            </div>

                            <span className="job-type">
                                FULL TIME
                            </span>

                            <h2>{job.title}</h2>

                            <p className="job-company">
                                {job.company}
                                <span> • </span>
                                {job.location}
                            </p>

                            <div className="job-tags">

                                <span>
                                    {job.experienceLevel}
                                </span>

                                {job.requirements
                                    ?.split(",")
                                    .slice(0, 3)
                                    .map((tag) => (
                                        <span key={tag}>
                                            {tag.trim()}
                                        </span>
                                    ))}

                            </div>

                            <p className="job-description">
                                {job.description}
                            </p>

                            <button
                                className="job-apply-btn"
                                onClick={() => handleApply(job)}
                            >
                                Apply →
                            </button>

                        </article>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Jobs;