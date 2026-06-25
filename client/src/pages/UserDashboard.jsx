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
        <div className="max-w-6xl mx-auto">
            <div className="mb-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
                <div className="grid gap-6 p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:p-8">
                    <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-white/10 text-3xl font-black uppercase text-white backdrop-blur-sm">
                        {user?.name?.charAt(0)}
                    </div>
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">
                            <FaUserCircle />
                            User Dashboard
                        </div>
                        <h1 className="text-3xl font-black leading-tight md:text-4xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Welcome, {user?.name}!</h1>
                        <p className="mt-2 text-sm leading-7 text-slate-300">View your bookings, check statuses, and manage requests from one place.</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-slate-400"><FaClock /> Activity</div>
                            <div className="mt-2 text-lg font-semibold text-white">Real-time bookings</div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-slate-400"><FaTag /> Status</div>
                            <div className="mt-2 text-lg font-semibold text-white">Pending or confirmed</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-3 text-xl font-bold text-slate-950 sm:text-2xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <FaTicketAlt className="text-orange-500" /> My Booking Requests
                </h2>
            </div>

            {bookings.length === 0 ? (
                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-12 text-center shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-950 text-white shadow-lg">
                        <FaTicketAlt className="text-3xl" />
                    </div>
                    <p className="mb-6 mt-4 text-xl font-medium text-slate-600">You haven't booked any events yet.</p>
                    <Link to="/" className="inline-block rounded-2xl bg-slate-950 px-8 py-3 font-bold text-white transition hover:bg-orange-500">
                        Browse Events
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="flex flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                            <div className="flex-grow border-b border-slate-100 p-6">
                                {booking.eventId ? (
                                    <>
                                        <div className="mb-4 flex items-start justify-between gap-4">
                                            <h3 className="text-lg font-black leading-tight text-slate-950" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{booking.eventId.title}</h3>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {booking.status}
                                                </span>
                                                {booking.status !== 'cancelled' && (
                                                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${booking.paymentStatus === 'paid' ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-700'}`}>
                                                        {booking.paymentStatus.replace('_', ' ')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mb-4 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                                            <p><strong className="text-slate-800">Date:</strong> {new Date(booking.eventId.date).toLocaleDateString()}</p>
                                            <p><strong className="text-slate-800">Amount:</strong> {booking.amount === 0 ? 'Free' : `₹${booking.amount}`}</p>
                                            <p><strong className="text-slate-800">Requested:</strong> {new Date(booking.bookedAt).toLocaleDateString()}</p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="italic text-red-500">Event details unavailable (might have been deleted)</p>
                                )}
                            </div>
                            <div className="flex shrink-0 items-center justify-between bg-slate-50 p-4">
                                {booking.eventId && booking.status !== 'cancelled' ? (
                                    <>
                                        <Link to={`/events/${booking.eventId._id}`} className="text-sm font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 hover:text-orange-500">View Event</Link>
                                        <button
                                            onClick={() => cancelBooking(booking._id)}
                                            className="flex items-center gap-1 text-sm font-semibold text-red-500 transition hover:text-red-700"
                                        >
                                            <FaTimesCircle /> Cancel
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full text-center text-sm italic text-slate-500">Booking Cancelled</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
