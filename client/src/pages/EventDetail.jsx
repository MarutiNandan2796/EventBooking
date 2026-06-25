import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaMoneyBillWave, FaTicketAlt, FaLock, FaArrowRight } from 'react-icons/fa';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (err) {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setBookingLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            if (!showOTP) {
                await api.post('/bookings/send-otp');
                setShowOTP(true);
                setSuccessMsg('OTP sent to your email. Please verify to confirm booking.');
            } else {
                await api.post('/bookings', { eventId: event._id, otp });
                setSuccessMsg('Booking requested! Awaiting admin confirmation.');
                setShowOTP(false);
                // Update local seats count dynamically after booking
                setEvent({ ...event, availableSeats: event.availableSeats - 1 });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="py-20 text-center text-xl font-semibold text-slate-700">Loading...</div>;
    if (error && !event) return <div className="py-20 text-center text-xl text-red-500">{error || 'Event not found'}</div>;

    const isSoldOut = event.availableSeats <= 0;

    return (
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
            <div className="relative h-[300px] overflow-hidden bg-slate-900 md:h-[420px]">
                {event.image ? (
                    <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-950 via-slate-800 to-slate-700 text-6xl font-black uppercase tracking-[0.4em] text-white/40">
                        {event.category}
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white backdrop-blur-md">
                    <FaTicketAlt className="text-amber-300" />
                    {event.category}
                </div>
                <div className="absolute bottom-6 left-6 right-6 max-w-4xl text-white">
                    <h1 className="text-4xl font-black leading-tight md:text-6xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{event.title}</h1>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 md:text-lg">{event.description}</p>
                </div>
            </div>

            <div className="grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10 lg:p-12">
                <div className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                            <div className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Date</div>
                            <div className="mt-2 flex items-center gap-3 text-lg font-semibold text-slate-950"><FaCalendarAlt className="text-orange-500" />{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                            <div className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Location</div>
                            <div className="mt-2 flex items-center gap-3 text-lg font-semibold text-slate-950"><FaMapMarkerAlt className="text-cyan-500" />{event.location}</div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                            <div className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Ticket Price</div>
                            <div className="mt-2 flex items-center gap-3 text-lg font-semibold text-slate-950"><FaMoneyBillWave className="text-emerald-500" />{event.ticketPrice === 0 ? <span className="text-emerald-600">Free</span> : `₹${event.ticketPrice}`}</div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                            <div className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Availability</div>
                            <div className="mt-2 flex items-center gap-3 text-lg font-semibold text-slate-950"><FaChair className="text-slate-700" /><span className={event.availableSeats < 10 ? 'text-orange-600' : 'text-slate-950'}>{event.availableSeats}</span> / {event.totalSeats}</div>
                        </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-slate-950 to-slate-900 p-6 text-white shadow-lg">
                        <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-300">
                            <FaLock className="text-cyan-300" />
                            Booking flow
                        </div>
                        <h3 className="mt-3 text-2xl font-black" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Secure OTP protected request</h3>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">Tap once to send an OTP, verify with the code you receive, and submit your booking request for admin confirmation.</p>
                    </div>
                </div>

                <aside className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-7">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <div className="text-xs font-bold uppercase tracking-[0.35em] text-orange-500">Book now</div>
                            <h3 className="text-2xl font-black text-slate-950" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Booking Details</h3>
                        </div>
                        <div className="rounded-2xl bg-slate-950 p-3 text-white">
                            <FaTicketAlt />
                        </div>
                    </div>

                    {showOTP && (
                        <div className="mb-5">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Enter OTP to Confirm</label>
                            <input
                                type="text"
                                required
                                placeholder="6-digit code"
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3.5 text-center text-lg font-bold tracking-[0.4em] outline-none transition focus:border-slate-900"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength="6"
                            />
                        </div>
                    )}

                    <button
                        onClick={handleBooking}
                        disabled={isSoldOut || bookingLoading || (showOTP && !otp)}
                        className={`flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-lg font-bold transition ${isSoldOut || (successMsg && !showOTP)
                            ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                            : 'bg-slate-950 text-white shadow-lg shadow-slate-950/15 hover:-translate-y-0.5 hover:bg-orange-500'
                            }`}
                    >
                        {bookingLoading ? 'Processing...' : (showOTP ? 'Verify OTP & Confirm' : (successMsg && !showOTP ? 'Request Sent' : (isSoldOut ? 'Sold Out' : 'Send OTP')))}
                        {!bookingLoading && !isSoldOut && <FaArrowRight />}
                    </button>

                    <div className="mt-5 space-y-3">
                        {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-center text-sm font-medium text-red-700">{error}</p>}
                        {successMsg && <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-700">{successMsg}</p>}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default EventDetail;
