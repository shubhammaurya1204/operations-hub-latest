import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllJobsForHR, toggleJobStatus } from "../../services/api.js";
import {
  ArrowLeft,
  Briefcase,
  ChevronRight,
  MapPin,
  Clock,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Building2,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const jobTypeColor = {
  "Full-time":  "bg-teal-50 text-teal-700 border-teal-200",
  "Part-time":  "bg-blue-50 text-blue-700 border-blue-200",
  Contract:     "bg-purple-50 text-purple-700 border-purple-200",
  Internship:   "bg-amber-50 text-amber-700 border-amber-200",
};

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ toast }) => {
  if (!toast) return null;
  const isSuccess = toast.type === "success";
  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold transition-all duration-300 ${
        isSuccess
          ? "bg-teal-50 text-teal-800 border-teal-200"
          : "bg-red-50 text-red-700 border-red-200"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
      )}
      {toast.message}
    </div>
  );
};

// ─── Job Card ─────────────────────────────────────────────────────────────────

const JobCard = ({ job, onToggle, toggling }) => {
  const isActive = job.isActive !== false; // treat missing as active

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md ${
        isActive
          ? "border-gray-100 hover:border-teal-200"
          : "border-gray-100 opacity-70 hover:opacity-90 hover:border-gray-300"
      }`}
    >
      {/* Status ribbon */}
      <div
        className={`absolute top-0 right-0 m-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
          isActive
            ? "bg-teal-50 text-teal-700 border-teal-200"
            : "bg-gray-100 text-gray-500 border-gray-200"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isActive ? "bg-teal-500 animate-pulse" : "bg-gray-400"
          }`}
        />
        {isActive ? "Active" : "Inactive"}
      </div>

      <div className="p-5">
        {/* Title + Company */}
        <div className="pr-20 mb-3">
          <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2">
            {job.job_title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-gray-500 text-sm">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span>{job.company}</span>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span
              className={`px-1.5 py-0.5 rounded-md border text-[11px] font-semibold ${
                jobTypeColor[job.jobType] || "bg-gray-50 text-gray-600 border-gray-200"
              }`}
            >
              {job.jobType}
            </span>
          </span>
          {job.lastDateToApply && (
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              Deadline: {formatDate(job.lastDateToApply)}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-4" />

        {/* Footer: posted date + toggle */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-gray-400">
            Posted {formatDate(job.createdAt)}
          </span>

          <button
            id={`toggle-job-${job._id}`}
            onClick={() => onToggle(job._id)}
            disabled={toggling === job._id}
            aria-label={isActive ? "Deactivate job" : "Activate job"}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-white border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                : "bg-white border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300"
            } disabled:opacity-50 disabled:cursor-wait`}
          >
            {toggling === job._id ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isActive ? (
              <ToggleRight className="w-4 h-4 text-red-400" />
            ) : (
              <ToggleLeft className="w-4 h-4 text-teal-500" />
            )}
            {toggling === job._id
              ? "Updating…"
              : isActive
              ? "Deactivate"
              : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const DisplayJobsOnHr = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggling, setToggling] = useState(null); // job._id currently being toggled
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all"); // "all" | "active" | "inactive"

  // ── Helpers ────────────────────────────────────────────────────────────────

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllJobsForHR();
      setJobs(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // ── Toggle ─────────────────────────────────────────────────────────────────

  const handleToggle = useCallback(
    async (id) => {
      setToggling(id);
      try {
        const result = await toggleJobStatus(id);
        // Optimistic UI: update the specific job in state
        setJobs((prev) =>
          prev.map((j) =>
            j._id === id ? { ...j, isActive: result.data.isActive } : j
          )
        );
        showToast(result.message || "Job status updated.");
      } catch (err) {
        showToast(`Failed: ${err.message}`, "error");
      } finally {
        setToggling(null);
      }
    },
    [showToast]
  );

  // ── Derived State ──────────────────────────────────────────────────────────

  const active   = jobs.filter((j) => j.isActive !== false);
  const inactive = jobs.filter((j) => j.isActive === false);
  const displayed =
    filter === "active"
      ? active
      : filter === "inactive"
      ? inactive
      : jobs;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-0 flex items-center gap-0 h-16">
          {/* Brand */}
          <div className="flex items-center gap-2.5 mr-6">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
              <Briefcase style={{ width: 18, height: 18 }} className="text-white" />
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
            <Link to="/hr/dashboard" className="hover:text-teal-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600 font-medium">Manage Jobs</span>
          </nav>

          <div className="flex-1" />

          {/* Refresh */}
          <button
            onClick={loadJobs}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Page Title + Stats ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-teal-600" />
              Manage Job Postings
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Activate or deactivate job postings visible to applicants.
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex gap-3 flex-wrap">
            <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3 min-w-[110px]">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 leading-none">Active</p>
                <p className="text-xl font-bold text-gray-800 leading-snug">{active.length}</p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3 min-w-[110px]">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 leading-none">Inactive</p>
                <p className="text-xl font-bold text-gray-800 leading-snug">{inactive.length}</p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3 min-w-[110px]">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 leading-none">Total</p>
                <p className="text-xl font-bold text-gray-800 leading-snug">{jobs.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm w-fit">
          {[
            { key: "all",      label: `All (${jobs.length})` },
            { key: "active",   label: `Active (${active.length})` },
            { key: "inactive", label: `Inactive (${inactive.length})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                filter === key
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
            <p className="text-sm">Loading job postings…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-red-500">
            <AlertTriangle className="w-8 h-8" />
            <p className="text-sm font-medium">Failed to load: {error}</p>
            <button
              onClick={loadJobs}
              className="mt-1 text-xs underline text-red-400 hover:text-red-600"
            >
              Try again
            </button>
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <Briefcase className="w-8 h-8" />
            <p className="text-sm">
              No{filter !== "all" ? ` ${filter}` : ""} job postings found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayed.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onToggle={handleToggle}
                toggling={toggling}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Toast ── */}
      <Toast toast={toast} />
    </div>
  );
};

export default DisplayJobsOnHr;