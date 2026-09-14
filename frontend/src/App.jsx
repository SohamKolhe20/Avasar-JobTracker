import { useEffect, useState } from "react";
import "./index.css";
import api from "./services/api";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Jobs from "./pages/Jobs";
import Admin from "./pages/Admin";

function Home() {
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isLoggedIn = !!token;
  const isAdmin = user?.role === "ADMIN";

  const latestJob = jobs.length > 0 ? jobs[0] : null;


  useEffect(() => {
    fetchJobs();
  }, []);


  const fetchJobs = async () => {
    try {
      const response = await api.get("/jobs");
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to load jobs:", error);
    } finally {
      setLoadingJobs(false);
    }
  };


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  };


  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <Link to="/" className="logo">
          <img
            src="/avasarLogo.png"
            alt="Avasar"
            className="logo-image"
          />

          <span>AVASAR</span>
        </Link>


        <div className="nav-links">

          <Link to="/jobs">Jobs</Link>

          <a href="#about">About</a>


          {!isLoggedIn ? (
            <>
              <Link to="/login" className="login-btn">
                Login
              </Link>

              <Link to="/login" className="signup-btn">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <span className="nav-dashboard">
                <Link to="/dashboard" className="nav-link">
                    Dashboard
                </Link>
              </span>

              {isAdmin && (
                <span className="nav-admin">
                   <Link to="/admin">Admin</Link>
                </span>
              )}

              <button
                className="logout-btn"
                onClick={logout}
              >
                Logout
              </button>
            </>
          )}

        </div>


        <button className="menu-btn">
          ☰
        </button>

      </nav>


      {/* ================= HERO ================= */}

      <main>

        <section className="hero">

          <div className="hero-content">

            <div className="hero-badge">
              ✦ Your career, your opportunity
            </div>


            <h1>
              Find the job
              <br />
              <span>you deserve.</span>
            </h1>


            <p>
              Discover opportunities, apply with confidence,
              and keep every application organized in one place.
            </p>


            <div className="hero-actions">

              <Link to="/jobs" className="primary-btn">
                  Explore Jobs
              </Link>


              <Link
                to="/login"
                className="secondary-btn"
              >
                Create Account
              </Link>

            </div>

          </div>


          {/* ================= HERO VISUAL ================= */}

          <div className="hero-visual">




            <div className="main-orb">

              <div className="orb-inner">

                <img
                  src="/avasarLogo.png"
                  alt="Avasar logo"
                />

              </div>

            </div>


            {latestJob && (
              <a
                  className="floating-card card-two"
                  href={latestJob.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >

                <span>↗</span>

                New opportunity

                <strong>
                  {latestJob.company} </strong>

              </a>
            )}

          </div>

        </section>


        {/* ================= STATS ================= */}

        <section className="stats">

          <div>
            <strong>100+</strong>
            <span>Opportunities</span>
          </div>

          <div>
            <strong>50+</strong>
            <span>Companies</span>
          </div>

          <div>
            <strong>24/7</strong>
            <span>Application Tracking</span>
          </div>

        </section>


        {/* ================= JOBS ================= */}

        <section
          className="jobs-section"
          id="jobs"
        >

          <div className="section-heading">

            <div>

              <span className="section-label">
                OPPORTUNITIES
              </span>

              <h2>
                Explore recent jobs
              </h2>

            </div>


            <Link to="/jobs" className="view-all">
               View all →
            </Link>

          </div>


          <div className="jobs-grid">

            {loadingJobs ? (

              <p>
                Loading opportunities...
              </p>

            ) : jobs.length === 0 ? (

              <p>
                No jobs available yet.
              </p>

            ) : (

              jobs
                .slice(0, 6)
                .map((job) => (

                  <JobCard
                    key={job.id}
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    requirements={job.requirements}
                    jobUrl={job.jobUrl}
                  />

                ))

            )}

          </div>

        </section>


        {/* ================= ABOUT ================= */}

        <section
          className="about-section"
          id="about"
        >

          <div className="about-card">

            <span className="section-label">
              WHY AVASAR?
            </span>


            <h2>
              One place for your
              <span>
                entire job journey.
              </span>
            </h2>


            <p>
              Find opportunities and track your applications
              without losing sight of where you are in the process.
            </p>


            <div className="features">

              <div>

                <div className="feature-icon">
                  ⌕
                </div>

                <h3>
                  Discover
                </h3>

                <p>
                  Find relevant job opportunities.
                </p>

              </div>


              <div>

                <div className="feature-icon">
                  ↗
                </div>

                <h3>
                  Apply
                </h3>

                <p>
                  Apply directly through company links.
                </p>

              </div>


              <div>

                <div className="feature-icon">
                  ✓
                </div>

                <h3>
                  Track
                </h3>

                <p>
                  Keep your applications organized.
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <footer>

        <div className="logo">

          <img
            src="/avasarLogo.png"
            alt="Avasar"
            className="logo-image"
          />

          AVASAR

        </div>


        <p>
          Build your next opportunity.
        </p>

      </footer>

    </div>
  );
}


/* ================= JOB CARD ================= */

function JobCard({
  title,
  company,
  location,
  requirements,
  jobUrl
}) {

  const tags = requirements
    ? requirements
        .split(",")
        .map((tag) => tag.trim())
    : [];


  const handleApply = () => {

    if (!jobUrl) {
      return;
    }

    window.open(
      jobUrl,
      "_blank",
      "noopener,noreferrer"
    );

  };


  return (
    <article className="job-card">

      <div className="company-logo">
        {company?.charAt(0)}
      </div>


      <div className="job-info">

        <span className="job-type">
          FULL TIME
        </span>


        <h3>
          {title}
        </h3>


        <p className="company">

          {company}

          <span>
            {" • "}
          </span>

          {location}

        </p>


        <div className="tags">

          {tags
            .slice(0, 4)
            .map((tag, index) => (

              <span key={`${tag}-${index}`}>
                {tag}
              </span>

            ))}

        </div>

      </div>


      <button
        className="apply-btn"
        onClick={handleApply}
      >
        Apply →
      </button>

    </article>
  );
}


/* ================= APP / ROUTER ================= */

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home page */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/admin" element={<Admin />} />

        {/* User dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;