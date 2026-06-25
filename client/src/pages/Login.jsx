import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaLock, FaEnvelope, FaKey } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                const data = await login(email, password);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            } else {
                const data = await verifyOTP(email, otp);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            }
        } catch (err) {
            if (err.needsVerification) {
                setShowOTP(true);
                setError('Account not verified. A new OTP has been sent to your email.');
            } else {
                setError(err.message || err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] md:grid md:grid-cols-[1fr_0.9fr]">
            <div className="hidden bg-slate-950 p-10 text-white md:flex md:flex-col md:justify-between">
                <div>
                    <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">Secure access</div>
                    <h2 className="max-w-md text-4xl font-black leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Welcome back to the event floor.</h2>
                    <p className="mt-5 max-w-md text-slate-300 leading-7">Log in to manage bookings, verify OTPs, and continue where you left off.</p>
                </div>
                <div className="grid gap-3 text-sm text-slate-300">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">OTP verification for account recovery and booking flow.</div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Dashboard access for users and admins.</div>
                </div>
            </div>

            <div className="p-8 md:p-12">
                <div className="mb-8 text-center md:text-left">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-orange-600">
                        <FaLock />
                        Sign in
                    </div>
                    <h2 className="text-3xl font-black text-slate-950" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Welcome Back</h2>
                    <p className="mt-2 text-slate-500">Sign in to your Eventora account</p>
            </div>

                {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-red-700">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!showOTP ? (
                        <>
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
                        className="w-full rounded-2xl bg-slate-950 py-3.5 font-bold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? 'Processing...' : (showOTP ? 'Verify OTP & Log In' : 'Sign In')}
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-600 md:text-left">
                    Don't have an account? <Link to="/register" className="font-bold text-slate-950 underline decoration-slate-300 underline-offset-4 hover:text-orange-600">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
