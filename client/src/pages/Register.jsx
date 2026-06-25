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

    const { register, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                await register(name, email, password);
                setShowOTP(true);
                setError('');
            } else {
                await verifyOTP(email, otp);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] md:grid md:grid-cols-[0.9fr_1fr]">
            <div className="bg-gradient-to-br from-orange-500 via-amber-400 to-cyan-300 p-8 text-slate-950 md:p-10">
                <div className="mb-6 inline-flex rounded-full bg-white/50 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em]">
                    <FaUserPlus />
                    Create account
                </div>
                <h2 className="text-4xl font-black leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Join the fastest event booking flow.</h2>
                <p className="mt-5 max-w-md text-sm leading-7 text-slate-800/90">Register once, verify with OTP, and get access to a cleaner dashboard for upcoming events and bookings.</p>
                <div className="mt-8 grid gap-3 text-sm font-medium text-slate-900/80">
                    <div className="rounded-2xl bg-white/40 p-4 backdrop-blur">Secure OTP registration</div>
                    <div className="rounded-2xl bg-white/40 p-4 backdrop-blur">Responsive mobile-first UI</div>
                    <div className="rounded-2xl bg-white/40 p-4 backdrop-blur">Dashboard and admin access</div>
                </div>
            </div>

            <div className="p-8 md:p-12">
                <div className="mb-8 text-center md:text-left">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-slate-600">
                        <FaUserPlus />
                        Sign up
                    </div>
                    <h2 className="text-3xl font-black text-slate-950" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Create an Account</h2>
                    <p className="mt-2 text-slate-500">Join Eventora today</p>
                </div>

                {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-red-700">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!showOTP ? (
                        <>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
                                <div className="relative">
                                    <FaUserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-2xl border border-slate-300 bg-white px-12 py-3.5 outline-none transition focus:border-slate-900"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full rounded-2xl border border-slate-300 bg-white px-12 py-3.5 outline-none transition focus:border-slate-900"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                                <div className="relative">
                                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full rounded-2xl border border-slate-300 bg-white px-12 py-3.5 outline-none transition focus:border-slate-900"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div>
                            <p className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                                An OTP has been sent to your email. Please verify your account.
                            </p>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Verification Code (OTP)</label>
                            <div className="relative">
                                <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    placeholder="6-digit code"
                                    className="w-full rounded-2xl border border-slate-300 bg-white px-12 py-3.5 text-center text-lg font-bold tracking-[0.4em] outline-none transition focus:border-slate-900"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength="6"
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full rounded-2xl bg-slate-950 py-3.5 font-bold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? 'Processing...' : (showOTP ? 'Verify & Complete' : 'Sign Up')}
                    </button>
                </form>

                {!showOTP && (
                    <p className="mt-6 text-center text-slate-600 md:text-left">
                        Already have an account? <Link to="/login" className="font-bold text-slate-950 underline decoration-slate-300 underline-offset-4 hover:text-orange-600">Sign in</Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Register;
