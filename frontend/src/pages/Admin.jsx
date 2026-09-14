import { useEffect, useState } from "react";
import api from "../services/api";
import "./Admin.css";
import { Link } from "react-router-dom";

function Admin() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        title: "",
        company: "",
        location: "",
        experienceLevel: "FRESHER",
        description: "",
        requirements: "",
        jobUrl: ""
    });

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            const response = await api.get("/jobs");
            setJobs(response.data);
        } catch (error) {
            console.error("Failed to load jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const resetForm = () => {
        setForm({
            title: "",
            company: "",
            location: "",
            experienceLevel: "FRESHER",
            description: "",
            requirements: "",
            jobUrl: ""
        });

        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {

            if (editingId) {

                await api.put(
                    `/jobs/${editingId}`,
                    form
                );

                alert("Job updated successfully");

            } else {

                await api.post(
                    "/jobs",
                    form
                );

                alert("Job created successfully");
            }

            resetForm();
            loadJobs();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    const handleEdit = (job) => {

        setEditingId(job.id);

        setForm({
            title: job.title,
            company: job.company,
            location: job.location || "",
            experienceLevel: job.experienceLevel,
            description: job.description || "",
            requirements: job.requirements || "",
            jobUrl: job.jobUrl
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this job?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(`/jobs/${id}`);

            setJobs(
                jobs.filter(job => job.id !== id)
            );

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete job"
            );
        }
    };

    return (
        <div className="admin-page">

            <div className="admin-container">

                <div className="admin-header">

                    <div>
                        <span className="section-label">
                            ADMIN PANEL
                        </span>

                        <h1>
                            Manage opportunities
                        </h1>

                        <p>
                            Create, update and manage jobs on Avasar.
                        </p>
                    </div>
                     <Link
                          to="/"
                          className="return-home-btn">
                            ← Main Menu
                     </Link>

                </div>


                {/* JOB FORM */}

                <section className="admin-form-card">

                    <div className="form-heading">

                        <div>
                            <span className="section-label">
                                {editingId
                                    ? "EDIT JOB"
                                    : "NEW OPPORTUNITY"}
                            </span>

                            <h2>
                                {editingId
                                    ? "Update job"
                                    : "Create a job"}
                            </h2>
                        </div>

                        {editingId && (
                            <button
                                className="cancel-btn"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        )}

                    </div>


                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>Job Title</label>

                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Java Backend Developer"
                                    required
                                />
                            </div>


                            <div className="form-group">
                                <label>Company</label>

                                <input
                                    name="company"
                                    value={form.company}
                                    onChange={handleChange}
                                    placeholder="Infosys"
                                    required
                                />
                            </div>


                            <div className="form-group">
                                <label>Location</label>

                                <input
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    placeholder="Pune"
                                />
                            </div>


                            <div className="form-group">
                                <label>Experience</label>

                                <select
                                    name="experienceLevel"
                                    value={form.experienceLevel}
                                    onChange={handleChange}
                                >
                                    <option value="FRESHER">
                                        Fresher
                                    </option>

                                    <option value="0-2 YEARS">
                                        0-2 Years
                                    </option>

                                    <option value="2-5 YEARS">
                                        2-5 Years
                                    </option>

                                    <option value="5+ YEARS">
                                        5+ Years
                                    </option>
                                </select>
                            </div>


                            <div className="form-group full-width">
                                <label>Description</label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Describe the role..."
                                    rows="5"
                                    required
                                />
                            </div>


                            <div className="form-group full-width">
                                <label>Requirements</label>

                                <input
                                    name="requirements"
                                    value={form.requirements}
                                    onChange={handleChange}
                                    placeholder="Java, Spring Boot, SQL, REST APIs"
                                />
                            </div>


                            <div className="form-group full-width">
                                <label>Application URL</label>

                                <input
                                    name="jobUrl"
                                    value={form.jobUrl}
                                    onChange={handleChange}
                                    placeholder="https://company.com/careers/job"
                                    required
                                />
                            </div>

                        </div>


                        <button
                            className="admin-submit-btn"
                            type="submit"
                        >
                            {editingId
                                ? "Update Job →"
                                : "Create Job →"}
                        </button>

                    </form>

                </section>


                {/* JOB LIST */}

                <section className="admin-jobs">

                    <div className="admin-list-heading">

                        <div>
                            <span className="section-label">
                                CURRENT JOBS
                            </span>

                            <h2>
                                Manage opportunities
                            </h2>
                        </div>

                        <span>
                            {jobs.length} jobs
                        </span>

                    </div>


                    {loading ? (
                        <p>Loading jobs...</p>
                    ) : jobs.length === 0 ? (
                        <p>No jobs available.</p>
                    ) : (

                        <div className="admin-job-list">

                            {jobs.map(job => (

                                <div
                                    className="admin-job-card"
                                    key={job.id}
                                >

                                    <div className="admin-job-info">

                                        <div className="company-logo">
                                            {job.company.charAt(0)}
                                        </div>

                                        <div>

                                            <span className="job-type">
                                                {job.experienceLevel}
                                            </span>

                                            <h3>
                                                {job.title}
                                            </h3>

                                            <p>
                                                {job.company}
                                                {" • "}
                                                {job.location}
                                            </p>

                                        </div>

                                    </div>


                                    <div className="admin-actions">

                                        <button
                                            className="edit-btn"
                                            onClick={() =>
                                                handleEdit(job)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                handleDelete(job.id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </div>

        </div>
    );
}

export default Admin;