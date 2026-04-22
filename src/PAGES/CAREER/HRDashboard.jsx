import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getJobs } from "../../services/api.js";
import JobPostingForm from "../../Components/CAREER/HR-Components/JobPostingForm.jsx";
import ApplicationsViewer from "../../Components/CAREER/HR-Components/ApplicationsViewer";
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  Briefcase,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "post",         label: "Post a Job",    icon: PlusCircle },
  { id: "applications", label: "Applications",  icon: Users },
];

// ─── HR Dashboard ─────────────────────────────────────────────────────────────
const HRDashboard = () => {
  const [activeTab, setActiveTab] = useState("post");
  const [jobs, setJobs] = useState([]);      // all job postings (for filter dropdown)
  const [jobsLoading, setJobsLoading] = useState(true);

  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  navigate("/login", { replace: true });
};


  // Fetch all jobs on mount (needed for the applications filter dropdown)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data.data || []);
      } catch (err) {
        console.error("HR Dashboard: failed to load jobs:", err.message);
      } finally {
        setJobsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Called by JobPostingForm after a successful job creation
  // — appends the new job to the local list and switches to Applications tab
  const handleJobCreated = (newJob) => {
    setJobs((prev) => [newJob, ...prev]);
    // Give a moment for the success screen to show, then switch tabs
    setTimeout(() => setActiveTab("applications"), 2600);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Top Header Bar ── */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-0 flex items-center gap-0 h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2.5 mr-6">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
              <Briefcase className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <span className="font-extrabold text-gray-900 text-sm leading-none">Treebay</span>
              <span className="ml-1 text-xs text-teal-600 font-semibold">HR Panel</span>
            </div>
          </div>
          
          {/* Divider */}
          <div className="h-6 w-px bg-gray-200 mr-6" />

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link to="/" className="hover:text-teal-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600 font-medium">HR Dashboard</span>
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Job count badge */}
          {!jobsLoading && (
            <button 
            onClick={() => navigate("/hr/jobs")}
            className="flex items-center gap-1.5 text-white border border-gray-700 bg-blue-600 text-md rounded-md px-3 py-1.5 hover:bg-blue-500">
              <Briefcase className="w-3.5 h-3.5 text-white" />
              <span><strong className="text-white">{jobs.length}</strong> active posting{jobs.length !== 1 ? "s" : ""}</span>
            </button>
          )}
          <button
          onClick={handleLogout}
          className="flex items-center gap-2 m-5 px-4 py-2 bg-[#3D8F38] text-white rounded-lg text-sm font-medium hover:bg-[#2d6e2d] transition-all"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V7"
            />
          </svg>
          Logout
        </button>
        </div>
        
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Page Title ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-teal-600" />
              HR Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage job postings and review applicant submissions.
            </p>
          </div>

          {/* Quick stats row */}
          <div className="flex gap-3 flex-wrap">
            <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3 min-w-[120px]">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 leading-none">Active Jobs</p>
                <p className="text-xl font-bold text-gray-800 leading-snug">{jobs.length}</p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3 min-w-[120px]">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 leading-none">HR Panel</p>
                <p className="text-sm font-bold text-gray-800 leading-snug">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab Navigation ── */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm w-fit">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ── */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8">
          {activeTab === "post" && (
            <>
              {/* Section header */}
              <div className="mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-teal-600" />
                  Create New Job Posting
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Fill in the details below. The job will appear on the applicant-facing jobs page immediately.
                </p>
              </div>
              <JobPostingForm onJobCreated={handleJobCreated} />
            </>
          )}

          {activeTab === "applications" && (
            <>
              {/* Section header */}
              <div className="mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-600" />
                  Submitted Applications
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Review, filter, and update the status of all applicant submissions.
                </p>
              </div>
              <ApplicationsViewer jobs={jobs} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;