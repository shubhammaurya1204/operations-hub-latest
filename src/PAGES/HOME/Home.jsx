import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, TrendingUp, ArrowRight, Lock } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-[var(--color-primary)] rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-[var(--color-secondary)] rounded-full mix-blend-screen filter blur-[100px] opacity-10"></div>

      {/* Main Container */}
      <div className="max-w-5xl w-full bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10">
        
        {/* Left Side - Branding & Info */}
        <div className="bg-[var(--color-bg-deep)] p-12 md:w-5/12 flex flex-col justify-between relative overflow-hidden border-r border-[var(--color-border)]">
          {/* Subtle background gradient */}
          <div className="absolute inset-0 bg-linear-to-br from-[var(--color-primary)]/10 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="p-2 border border-[var(--color-border)] bg-[var(--color-bg-alt)]/50 rounded-lg backdrop-blur-md">
                <Shield className="text-[var(--color-secondary)]" size={28} />
              </div>
              <span className="font-bold text-xl tracking-wide text-[var(--color-text)]">
                Workspace<span className="text-[var(--color-secondary)]">OS</span>
              </span>
            </div>

            <h1 className="text-4xl font-serif text-[var(--color-text)] mb-6 leading-tight">
              Your Central <br /> Operations Hub
            </h1>
            <p className="text-[var(--color-text-muted)] text-lg mb-10 font-light leading-relaxed">
              Secure, unified access to the tools that power our company's daily workflow.
            </p>

            {/* Feature List */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="p-2 border border-[var(--color-border)] bg-[var(--color-bg)] rounded-lg group-hover:border-[var(--color-secondary)] transition-colors duration-300">
                  <Lock className="text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] transition-colors" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-[var(--color-text)]">Admin Control</h3>
                  <p className="text-sm text-[var(--color-muted)] font-light">System configurations & access</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-2 border border-[var(--color-border)] bg-[var(--color-bg)] rounded-lg group-hover:border-[var(--color-secondary)] transition-colors duration-300">
                  <Users className="text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] transition-colors" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-[var(--color-text)]">Human Resources</h3>
                  <p className="text-sm text-[var(--color-muted)] font-light">Directory & employee management</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-2 border border-[var(--color-border)] bg-[var(--color-bg)] rounded-lg group-hover:border-[var(--color-secondary)] transition-colors duration-300">
                  <TrendingUp className="text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] transition-colors" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-[var(--color-text)]">Sales Pipeline</h3>
                  <p className="text-sm text-[var(--color-muted)] font-light">CRM & performance tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Action */}
        <div className="p-12 md:w-7/12 flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent)] rounded-full mix-blend-screen filter blur-[120px] opacity-5"></div>

          <div className="max-w-md w-full relative z-10">
            <h2 className="text-3xl font-serif text-[var(--color-text)] mb-3">Welcome Back</h2>
            <p className="text-[var(--color-text-muted)] font-light mb-10">
              Please log in with your employee credentials to access your departmental dashboard.
            </p>

            {/* Login Button */}
            <button 
              onClick={() => navigate('/login')}
              className="group relative w-full flex justify-center items-center gap-3 py-4 px-8 border border-[var(--color-primary)] text-lg font-medium rounded-xl text-[var(--color-text)] bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)] hover:shadow-[0_0_20px_rgba(28,107,54,0.4)] focus:outline-none transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Continue to Login
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </span>
            </button>

            {/* Security Note */}
            <div className="mt-8 pt-8 border-t border-[var(--color-border)] flex items-center justify-center gap-2 text-sm text-[var(--color-muted)] font-light">
              <Lock size={14} />
              <span>Restricted to authorized personnel only.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}