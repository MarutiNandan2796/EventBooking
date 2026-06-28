import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaTimesCircle, FaUserCircle, FaClock, FaTag } from 'react-icons/fa';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPass, setSelectedPass] = useState(null);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchBookings();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    if (loading) return <div className="py-20 text-center text-xl font-semibold text-slate-700">Loading dashboard...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in text-slate-100">
            {/* Header Banner */}
            <div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-950/80 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
                <div className="grid gap-6 p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:p-8">
                    <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-orange-500 to-amber-500 text-3xl font-black uppercase text-slate-950 shadow-lg shadow-orange-500/20">
                        {user?.name?.charAt(0)}
                    </div>
                    <div>
                        <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-orange-400">
                            <FaUserCircle />
                            User Dashboard
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Welcome, {user?.name}!</h1>
                        <p className="mt-2 text-sm text-slate-400">View your bookings, check statuses, and manage requests from one place.</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
                        <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500"><FaClock /> Activity</div>
                            <div className="mt-1 text-base font-bold text-white">Real-time bookings</div>
                        </div>
                        <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500"><FaTag /> Status</div>
                            <div className="mt-1 text-base font-bold text-white">Pending or confirmed</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* List Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="flex items-center gap-3 text-xl font-bold text-white sm:text-2xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <FaTicketAlt className="text-orange-500" /> My Booking Requests
                </h2>
            </div>

            {/* Bookings Render */}
            {bookings.length === 0 ? (
                <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-12 text-center shadow-lg">
                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-400 shadow-md">
                        <FaTicketAlt className="text-3xl" />
                    </div>
                    <p className="mb-6 mt-4 text-lg font-semibold text-slate-300">You haven't booked any events yet.</p>
                    <Link to="/" className="inline-block rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3.5 font-bold text-slate-950 shadow-md transition hover:scale-[1.02] hover:brightness-110">
                        Browse Events
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="glass-card glass-card-hover flex flex-col overflow-hidden rounded-3xl shadow-lg">
                            <div className="flex-grow p-6 space-y-4">
                                {booking.eventId ? (
                                    <>
                                        <div className="flex items-start justify-between gap-4">
                                            <h3 className="text-lg font-bold leading-tight text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{booking.eventId.title}</h3>
                                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                                                <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-amber-500/20 text-amber-400 border border-amber-500/20'}`}>
                                                    {booking.status}
                                                </span>
                                                {booking.status !== 'cancelled' && (
                                                    <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${booking.paymentStatus === 'paid' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20' : 'bg-slate-800 text-slate-400 border border-white/5'}`}>
                                                        {booking.paymentStatus.replace('_', ' ')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2 rounded-2xl bg-white/5 p-4 text-xs text-slate-400">
                                            <p><strong className="text-slate-300">Date:</strong> {new Date(booking.eventId.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            <p><strong className="text-slate-300">Amount:</strong> {booking.amount === 0 ? <span className="text-emerald-400">Free</span> : `₹${booking.amount}`}</p>
                                            <p><strong className="text-slate-300">Requested:</strong> {new Date(booking.bookedAt).toLocaleDateString()}</p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="italic text-red-400 text-sm font-semibold">Event details unavailable (might have been deleted)</p>
                                )}
                            </div>
                            <div className="flex shrink-0 items-center justify-between border-t border-white/5 bg-slate-950/40 p-4 px-6 text-sm">
                                {booking.eventId && booking.status !== 'cancelled' ? (
                                    <>
                                        <Link to={`/events/${booking.eventId._id}`} className="font-bold text-slate-400 hover:text-white transition">View Event</Link>
                                        {booking.status === 'confirmed' && (
                                            <button 
                                                onClick={() => setSelectedPass(booking)}
                                                className="flex items-center gap-1.5 font-bold text-cyan-400 hover:text-cyan-300 transition"
                                            >
                                                <FaTicketAlt className="text-xs animate-pulse" /> View Pass
                                            </button>
                                        )}
                                        <button
                                            onClick={() => cancelBooking(booking._id)}
                                            className="flex items-center gap-1.5 font-semibold text-red-400 transition hover:text-red-300"
                                        >
                                            <FaTimesCircle className="text-xs" /> Cancel
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full text-center text-xs italic text-slate-500">Booking Cancelled</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Ticket Pass Modal */}
            {selectedPass && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in-scale">
                    <div className="relative w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl flex flex-col md:flex-row overflow-hidden">
                        
                        {/* Notch Circles (Notches) */}
                        <div className="hidden md:block absolute left-[70%] -top-4 h-8 w-8 rounded-full bg-slate-950 border-b border-white/10" />
                        <div className="hidden md:block absolute left-[70%] -bottom-4 h-8 w-8 rounded-full bg-slate-950 border-t border-white/10" />
                        
                        {/* Close button */}
                        <button 
                            onClick={() => setSelectedPass(null)} 
                            className="absolute top-4 right-4 z-10 rounded-full bg-white/5 border border-white/10 p-2 text-slate-400 hover:text-white transition"
                        >
                            <FaTimesCircle className="text-lg" />
                        </button>

                        {/* Left Side: Main Ticket Info Stub */}
                        <div className="flex-grow p-8 bg-gradient-to-br from-slate-900 to-slate-950 md:max-w-[70%] border-r-2 border-dashed border-white/10 relative">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-orange-400">
                                Eventora Booking Pass
                            </div>
                            
                            <h2 className="text-2xl font-black text-white tracking-tight mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                {selectedPass.eventId?.title}
                            </h2>

                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs mb-6">
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Attendee</div>
                                    <div className="mt-1 font-semibold text-slate-200">{user?.name}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Event Category</div>
                                    <div className="mt-1 font-semibold text-slate-200 capitalize">{selectedPass.eventId?.category || 'General'}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Date</div>
                                    <div className="mt-1 font-semibold text-slate-200">
                                        {new Date(selectedPass.eventId?.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Location / Venue</div>
                                    <div className="mt-1 font-semibold text-slate-200 truncate">{selectedPass.eventId?.location}</div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                <div>
                                    <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Ticket Price</div>
                                    <div className="text-lg font-black text-gradient animate-logo-gradient">₹{selectedPass.amount}</div>
                                </div>
                                <div>
                                    <button 
                                        onClick={() => {
                                            setDownloading(true);
                                            setTimeout(() => {
                                                setDownloading(false);
                                                alert("Ticket Pass downloaded to your downloads folder!");
                                            }, 1500);
                                        }}
                                        disabled={downloading}
                                        className="rounded-xl bg-slate-800 border border-white/10 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition disabled:opacity-50"
                                    >
                                        {downloading ? 'Downloading...' : 'Download Pass'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: QR Code Stub */}
                        <div className="md:w-[30%] bg-slate-950 p-8 flex flex-col justify-center items-center gap-4 text-center shrink-0">
                            <div className="bg-white p-2.5 rounded-2xl shadow-lg border border-white/10">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&color=030712&data=${encodeURIComponent(`https://eventora.com/tickets/${selectedPass._id}`)}`} 
                                    alt="Verification QR Code"
                                    className="h-32 w-32 object-contain"
                                />
                            </div>
                            <div>
                                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Ticket Reference</div>
                                <div className="text-xs font-mono font-bold text-orange-400 uppercase">
                                    EVT-{selectedPass._id.slice(-6).toUpperCase()}
                                </div>
                            </div>
                            <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                Verified
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
