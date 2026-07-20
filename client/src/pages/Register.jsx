import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserPlus, FaEnvelope, FaLock, FaKey } from 'react-icons/fa';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState('');

    const [serverOtp, setServerOtp] = useState('');

    const { register, verifyOTP, login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                const resData = await register(name, email, password);
                if (resData?.isVerified) {
                    await login(email, password);
                    navigate('/dashboard');
                    return;
                }
                if (resData?.otp) {
                    setOtp(resData.otp);
                    setServerOtp(resData.otp);
                }
                setShowOTP(true);
                setError('');
            } else {
                await verifyOTP(email, otp);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(typeof err === 'string' ? err : (err?.message || 'Registration failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-950/80 shadow-[0_24px_80px_rgba(0,0,0,0.55)] grid md:grid-cols-2 min-h-[600px] backdrop-blur-xl animate-fade-in-scale">
            {/* Visual Sidebar */}
            <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-violet-600 p-8 text-slate-950 md:p-14 flex flex-col justify-between relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.15),_transparent_35%)] pointer-events-none" />
                <div className="relative z-10 space-y-6">
                    <div className="inline-flex rounded-full bg-white/20 border border-white/35 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-slate-950 animate-slide-up opacity-0">
                        <FaUserPlus />
                        Create account
                    </div>
                    <h2 className="text-4xl font-extrabold leading-tight tracking-tight animate-slide-up opacity-0 delay-50" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Join the fastest event booking flow.
                    </h2>
                    <p className="max-w-md text-sm leading-6 text-slate-900/80 animate-slide-up opacity-0 delay-100">
                        Register once and get instant access to a cleaner dashboard for upcoming events and bookings.
                    </p>
                </div>
                <div className="relative z-10 grid gap-4 text-xs font-bold text-slate-900/90 mt-10 animate-slide-up opacity-0 delay-150">
                    <div className="rounded-2xl bg-white/20 border border-white/10 p-4 shadow-sm backdrop-blur-md transition hover:bg-white/30">
                        Instant 1-Click registration
                    </div>
                    <div className="rounded-2xl bg-white/20 border border-white/10 p-4 shadow-sm backdrop-blur-md transition hover:bg-white/30">
                        Responsive mobile-first UI
                    </div>
                    <div className="rounded-2xl bg-white/20 border border-white/10 p-4 shadow-sm backdrop-blur-md transition hover:bg-white/30">
                        Dashboard & Admin Access
                    </div>
                </div>
            </div>

            {/* Registration Form Container */}
            <div className="p-8 md:p-14 flex flex-col justify-center bg-slate-900/20">
                <div className="mb-8 text-center md:text-left">
                    <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-orange-400 animate-slide-up opacity-0">
                        <FaUserPlus />
                        Sign up
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-white animate-slide-up opacity-0 delay-50" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Create Account</h2>
                    <p className="mt-2 text-sm text-slate-400 animate-slide-up opacity-0 delay-100">Join Eventora today</p>
                </div>

                {error && (
                    <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-950/20 p-4 text-center text-sm font-semibold text-red-400 animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!showOTP ? (
                        <>
                            <div className="animate-slide-up opacity-0 delay-100">
                                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Full Name</label>
                                <div className="relative">
                                    <FaUserPlus className={`absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 text-sm transition-all duration-300 ${focusedField === 'name' ? 'input-icon-active' : ''}`} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Arnav Saxena"
                                        className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-12 py-3.5 text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField('')}
                                    />
                                </div>
                            </div>
                            <div className="animate-slide-up opacity-0 delay-150">
                                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Email Address</label>
                                <div className="relative">
                                    <FaEnvelope className={`absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 text-sm transition-all duration-300 ${focusedField === 'email' ? 'input-icon-active' : ''}`} />
                                    <input
                                        type="email"
                                        required
                                        placeholder="name@domain.com"
                                        className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-12 py-3.5 text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField('')}
                                    />
                                </div>
                            </div>
                            <div className="animate-slide-up opacity-0 delay-200">
                                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Password</label>
                                <div className="relative">
                                    <FaLock className={`absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 text-sm transition-all duration-300 ${focusedField === 'password' ? 'input-icon-active' : ''}`} />
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-12 py-3.5 text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField('')}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-4 animate-slide-up opacity-0">
                            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4 text-center text-sm font-semibold text-emerald-400">
                                An OTP has been sent to your email. Please verify your account.
                            </div>
                            {serverOtp && (
                                <div className="rounded-2xl border border-orange-500/30 bg-orange-950/40 p-4 text-center animate-bounce-short">
                                    <span className="block text-xs uppercase font-bold text-orange-400 tracking-wider mb-1">Verification Code (OTP):</span>
                                    <span className="text-3xl font-black tracking-[0.4em] text-amber-300 font-mono">{serverOtp}</span>
                                    <span className="block text-[11px] text-slate-400 mt-1">(Pre-filled automatically below)</span>
                                </div>
                            )}
                            <div>
                                <label className="mb-2.5 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400 text-center">Verification Code (OTP)</label>
                                <div className="relative">
                                    <FaKey className={`absolute left-5 top-1/2 -translate-y-1/2 text-orange-400 text-sm transition-all duration-300 ${focusedField === 'otp' ? 'input-icon-active' : ''}`} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="0 0 0 0 0 0"
                                        className="w-full rounded-2xl border border-white/10 bg-slate-950/40 py-4 pl-12 pr-4 text-center text-xl font-bold tracking-[0.5em] text-orange-400 placeholder:text-slate-700 outline-none transition focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        onFocus={() => setFocusedField('otp')}
                                        onBlur={() => setFocusedField('')}
                                        maxLength="6"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-4 font-bold text-slate-950 shadow-lg shadow-orange-500/20 transition duration-200 hover:scale-[1.01] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 animate-slide-up opacity-0 delay-250"
                    >
                        {loading ? 'Creating account...' : (showOTP ? 'Verify & Complete' : 'Sign Up')}
                    </button>
                </form>

                {!showOTP && (
                    <p className="mt-8 text-center text-slate-400 md:text-left text-sm animate-slide-up opacity-0 delay-300">
                        Already have an account? <Link to="/login" className="font-bold text-orange-400 hover:text-orange-300 hover:underline transition">Sign in</Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Register;
