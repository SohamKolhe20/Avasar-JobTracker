import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load this job.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setApplying(true);
    setError("");

    try {
      await api.post("/applications", {
        jobId: Number(id),
      });

      window.open(job.jobUrl, "_blank", "noopener,noreferrer");

      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Unable to apply for this job."
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="job-details-page">
        <p>Loading job...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-details-page">
        <h2>{error || "Job not found"}</h2>
        <Link to="/jobs">← Back to jobs</Link>
      </div>
    );
  }

  return (
    <div className="job-details-page">

      <Link to="/jobs" className="job-back">
        ← Back to jobs
      </Link>

      <div className="job-details-card">

        <span className="job-type">
          FULL TIME
        </span>

        <h1>{job.title}</h1>

        <p className="job-company">
          {job.company}
          {job.location && (
            <>
              <span> • </span>
              {job.location}
            </>
          )}
        </p>

        <div className="job-detail-section">
          <h2>About the role</h2>
          <p>
            {job.description || "No description provided."}
          </p>
        </div>

        <div className="job-detail-section">
          <h2>Requirements</h2>

          {job.requirements ? (
            <div className="job-requirements">
              {job.requirements
                .split(",")
                .map((requirement, index) => (
                  <span key={index}>
                    {requirement.trim()}
                  </span>
                ))}
            </div>
          ) : (
            <p>No requirements provided.</p>
          )}
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <button
          className="apply-btn job-detail-apply"
          onClick={handleApply}
          disabled={applying}
        >
          {applying ? "Applying..." : "Apply Now →"}
        </button>

      </div>
    </div>
  );
}

export default JobDetails;