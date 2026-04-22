import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApplicationById, updateApplicationStatus } from "../../services/api.js";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Wrench,
  FileText,
  ChevronDown,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Building2,
  Calendar,
  Globe,
  Share2,
  Printer,
  Download
} from "lucide-react";

const STATUSES = ["Submitted", "Under Review", "Selected", "Rejected"];

const STATUS_CONFIG = {
  Submitted: { color: "bg-blue-100 text-blue-700 border-blue-200", dotColor: "bg-blue-500", icon: Clock },
  "Under Review": { color: "bg-yellow-100 text-yellow-700 border-yellow-200", dotColor: "bg-yellow-500", icon: AlertCircle },
  Selected: { color: "bg-green-100 text-green-700 border-green-200", dotColor: "bg-green-500", icon: CheckCircle },
  Rejected: { color: "bg-red-100 text-red-700 border-red-200", dotColor: "bg-red-500", icon: XCircle },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Submitted;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border ${cfg.color}`}>
      <Icon className="w-4 h-4" /> {status}
    </span>
  );
};

const Section = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
    <div className="flex items-center gap-2.5 bg-slate-50/50 px-6 py-4 border-b border-slate-100">
      <Icon className="w-5 h-5 text-teal-600" />
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">{title}</h3>
    </div>
    <div className="px-6 py-6">{children}</div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    <span className="text-sm text-slate-800 break-words font-medium">{value || <span className="text-slate-300 italic">—</span>}</span>
  </div>
);

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const data = await getApplicationById(id);
        setApplication(data.data);
      } catch (err) {
        setError(err.message || "Failed to load application details.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === application.applicationStatus) return;
    setUpdating(true);
    setUpdateError("");
    try {
      await updateApplicationStatus(id, newStatus);
      setApplication((prev) => ({ ...prev, applicationStatus: newStatus }));
    } catch (err) {
      setUpdateError(err.message || "Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Error</h2>
          <p className="text-slate-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate("/hr/dashboard")}
            className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const p = application.personalDetails || {};
  const addr = p.address || {};
  const job = application.jobId || {};

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans">
      {/* Sticky Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => navigate("/hr/dashboard")}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors shrink-0"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg font-black text-slate-800 truncate leading-tight">
                {p.fullName || "Applicant Detail"}
              </h1>
              <p className="text-xs text-slate-400 font-medium truncate flex items-center gap-1.5 mt-0.5">
                <Briefcase className="w-3.5 h-3.5" />
                {job.job_title} · {job.department || "General"}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors border border-transparent hover:border-slate-200">
              <Printer className="w-4.5 h-4.5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors border border-transparent hover:border-slate-200">
              <Share2 className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2">
          {/* Summary Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 to-teal-600" />
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-24 h-24 rounded-3xl bg-teal-50 border-4 border-white shadow-sm flex items-center justify-center text-teal-700 font-black text-3xl uppercase shrink-0 ring-1 ring-teal-100">
                {p.fullName?.charAt(0)}
              </div>
              <div className="text-center sm:text-left min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                    {p.fullName}
                  </h2>
                  <StatusBadge status={application.applicationStatus} />
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-2 gap-x-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-teal-500" /> {p.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-teal-500" /> {p.mobile}
                  </span>
                </div>
                {p.linkedin || p.github || p.portfolio ? (
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4">
                    {p.linkedin && (
                      <a href={p.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" /> LINKEDIN
                      </a>
                    )}
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" /> GITHUB
                      </a>
                    )}
                    {p.portfolio && (
                      <a href={p.portfolio} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-teal-600 transition-colors">
                        <Globe className="w-3.5 h-3.5" /> PORTFOLIO
                      </a>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <Section icon={User} title="Contact & Address">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
              <InfoRow label="Alt. Phone" value={p.alternatePhone} />
              <InfoRow label="Date of Birth" value={p.dob ? new Date(p.dob).toLocaleDateString("en-IN") : null} />
              <InfoRow label="Gender" value={p.gender} />
              <InfoRow label="Nationality" value={p.nationality} />
              <div className="col-span-full h-px bg-slate-50 my-2" />
              <InfoRow label="Current Address" value={addr.currentAddress} />
              <InfoRow label="Permanent Address" value={addr.permanentAddress} />
              <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <InfoRow label="City" value={addr.city} />
                <InfoRow label="State" value={addr.state} />
                <InfoRow label="Country" value={addr.country} />
                <InfoRow label="Pincode" value={addr.pincode} />
              </div>
            </div>
          </Section>

          {application.academics?.length > 0 && (
            <Section icon={GraduationCap} title="Education History">
              <div className="space-y-4">
                {application.academics.map((ac, i) => (
                  <div key={i} className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 hover:border-teal-100 transition-colors group">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                      <div className="col-span-full flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-teal-600 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-widest">{ac.educationLevel}</span>
                        <span className="text-xs font-bold text-slate-400">{ac.startYear} – {ac.endYear}</span>
                      </div>
                      <InfoRow label="Degree" value={ac.degree} />
                      <InfoRow label="Specialization" value={ac.specialization} />
                      <InfoRow label="Institution" value={ac.institutionName} />
                      <InfoRow label="Board/Univ." value={ac.boardOrUniversity} />
                      <InfoRow label="Percentage / CGPA" value={ac.percentageOrCGPA} />
                      <InfoRow label="Mode" value={ac.mode} />
                      {ac.backlogs?.hasBacklogs && (
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-red-400 hover:text-slate-900 transition-colors p-1 uppercase tracking-widest leading-none">Backlogs</span>
                          <span className="text-sm font-black text-red-600 bg-red-50 w-fit px-2 py-0.5 rounded leading-none">{ac.backlogs.count}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {!application.isFresher && application.experiences?.length > 0 && (
            <Section icon={Briefcase} title="Professional Experience">
               <div className="space-y-4">
                {application.experiences.map((exp, i) => (
                  <div key={i} className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 hover:border-teal-100 transition-colors">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                      <div className="col-span-full flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-teal-600 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-widest">{exp.employmentType}</span>
                        <span className="text-xs font-bold text-slate-400">
                           {exp.startDate ? new Date(exp.startDate).toLocaleDateString("en-IN", { month: 'short', year: 'numeric' }) : ''} – {exp.currentlyWorking ? "Present" : (exp.endDate ? new Date(exp.endDate).toLocaleDateString("en-IN", { month: 'short', year: 'numeric' }) : '')}
                        </span>
                      </div>
                      <InfoRow label="Company" value={exp.companyName} />
                      <InfoRow label="Job Title" value={exp.jobTitle} />
                      <InfoRow label="Notice Period" value={exp.noticePeriod} />
                      {exp.skillsUsed?.length > 0 && (
                        <div className="col-span-full mt-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Skills Utilized</p>
                          <div className="flex flex-wrap gap-2">
                            {exp.skillsUsed.map((s, j) => (
                              <span key={j} className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-lg text-xs font-semibold shadow-sm group-hover:border-teal-200 transition-colors">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {application.skills?.technical?.length > 0 && (
             <Section icon={Wrench} title="Expertise & Skills">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Technical proficiency
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {application.skills.technical.map((s, i) => (
                        <span key={i} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-200 uppercase tracking-wider">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  {application.skills.soft?.length > 0 && (
                    <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Core soft skills
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {application.skills.soft.map((s, i) => (
                        <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-xs font-bold uppercase tracking-wider">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  )}
                </div>
             </Section>
          )}

          {application.projects?.length > 0 && (
            <Section icon={FolderKanban} title="Key Projects">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {application.projects.map((proj, i) => (
                  <div key={i} className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-3">
                    <h4 className="font-bold text-slate-800 text-sm tracking-tight">{proj.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{proj.description}</p>
                    {proj.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 my-1">
                        {proj.technologies.map((t, j) => (
                          <span key={j} className="text-[10px] font-bold bg-white text-slate-400 border border-slate-100 px-2 py-0.5 rounded uppercase">{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4 pt-2 mt-auto">
                      {proj.githubLink && (
                        <a href={proj.githubLink} target="_blank" rel="noreferrer" className="text-[11px] font-black text-slate-800 hover:teal-600 transition-colors flex items-center gap-1 uppercase tracking-widest">
                          <Globe className="w-3.5 h-3.5" /> GITHUB
                        </a>
                      )}
                      {proj.liveLink && (
                        <a href={proj.liveLink} target="_blank" rel="noreferrer" className="text-[11px] font-black text-teal-600 hover:teal-700 transition-colors flex items-center gap-1 uppercase tracking-widest">
                          <ExternalLink className="w-3.5 h-3.5" /> PREVIEW
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Right Column: Actions & Doc */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status Control Card */}
          <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-xl shadow-slate-200 sticky top-24">
            <h3 className="text-lg font-black tracking-tight mb-6">Review Panel</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Status</label>
                <div className="flex items-center gap-3">
                   <StatusBadge status={application.applicationStatus} />
                   {updating && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                </div>
              </div>

              {updateError && (
                <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-200 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {updateError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quick actions</label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                   {STATUSES.map(s => (
                     <button
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        disabled={updating || application.applicationStatus === s}
                        className={`w-full py-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                          application.applicationStatus === s
                          ? "bg-white/10 text-white/40 cursor-not-allowed border border-white/5"
                          : "bg-white/5 hover:bg-white/15 text-white border border-white/10"
                        }`}
                     >
                       <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[s].dotColor}`} />
                       SET AS {s.toUpperCase()}
                     </button>
                   ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-4">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Documents attached</h3>
                {application.documents?.resume && (
                  <a
                    href={application.documents.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between group p-4 bg-teal-500 hover:bg-teal-400 rounded-2xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                       <FileText className="w-6 h-6 text-white" />
                       <span className="font-bold text-sm text-white">RESUME.PDF</span>
                    </div>
                    <Download className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                  </a>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplicationDetail;