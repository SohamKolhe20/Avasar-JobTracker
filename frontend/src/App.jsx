import { useEffect, useState } from "react";
import "./index.css";
import api from "./services/api";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Jobs from "./pages/Jobs";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import JobDetails from "./pages/JobDetails";
function Home() {
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isLoggedIn = !!token;
  const isAdmin = user?.role === "ADMIN";
  const [menuOpen, setMenuOpen] = useState(false);
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
            alt="avasar"
            className="logo-image"
          />

          <span>avasar</span>
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


        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </nav>
      {menuOpen && (
        <div className="mobile-menu">

          <Link
            to="/jobs"
            onClick={() => setMenuOpen(false)}
          >
            Jobs
          </Link>

          <a
            href="#about"
            onClick={() => setMenuOpen(false)}
          >
            About
          </a>

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="mobile-menu-button"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </Link>
              )}

              <button
                className="mobile-menu-button"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </button>
            </>
          )}

        </div>
      )}


      {/* ================= HERO ================= */}

      <main>

        <section className="hero">

          <div className="hero-content">

            <div className="hero-badge">
              ✦ Your job search, simplified
            </div>


            <h1>
              Find the job
              <br />
              <span>you deserve.</span>
            </h1>


            <p>
              Discover relevant opportunities, apply with confidence,
              and never lose track of an application again.
            </p>


            <div className="hero-actions">

              <Link to="/jobs" className="primary-btn">
                  Explore Jobs
              </Link>


              <Link to="/register" className="get-started-btn">
                Get Started
              </Link>

            </div>

          </div>


          {/* ================= HERO VISUAL ================= */}

          <div className="hero-visual">




            <div className="main-orb">

              <div className="orb-inner">

                <img
                  src="/avasarLogo.png"
                  alt="avasar logo"
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
            <strong>{jobs.length}</strong>
            <span>Opportunities</span>
          </div>

          <div>
            <strong>
              {new Set(jobs.map((job) => job.company)).size}
            </strong>
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
                    id={job.id}
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
              One place for your {" "}
              <span>entire job journey.
              </span>
            </h2>


            <p>
              Find opportunities and track your applications
              without losing sight of where you are in the process.
            </p>


            <div className="features">

              <div
                className="feature-card"
                onClick={() => {
                  document.getElementById("jobs")?.scrollIntoView({
                    behavior: "smooth"
                  });
                }}
                role="button"
                tabIndex={0}
              >
                <div className="feature-icon">🔎</div>
                <h3>Discover</h3>
                <p>Find relevant job opportunities.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <h3>Apply</h3>
                <p>Apply directly through company links.</p>
              </div>

              <Link to="/dashboard" className="feature-card">
                <div className="feature-icon">📋</div>
                <h3>Track</h3>
                <p>Keep your applications organized.</p>
              </Link>

            </div>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <footer>

        <div className="logo">

          <img
            src="/avasarLogo.png"
            alt="avasar"
            className="logo-image"
          />

          avasar

        </div>


        <p>
          Find your next opportunity.
        </p>

      </footer>

    </div>
  );
}


/* ================= JOB CARD ================= */

function JobCard({
  id,
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


  const navigate = useNavigate();

  const handleViewJob = () => {
    navigate(`/jobs/${id}`);
  };


  return (
    <article className="job-card">


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
        onClick={handleViewJob}
      >
        View Job
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
        <Route path="/register" element={<Register />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* User dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;