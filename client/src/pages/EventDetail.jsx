import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaMoneyBillWave, FaTicketAlt, FaLock, FaArrowRight, FaStar, FaClock, FaCheckCircle, FaTag } from 'react-icons/fa';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [serverOtp, setServerOtp] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Seating & Reviews states
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState('');

    // Promo Code states
    const [promoCodeInput, setPromoCodeInput] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);

    useEffect(() => {
        const fetchEventAndDetails = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
                
                // Fetch occupied seats
                try {
                    const seatsRes = await api.get(`/bookings/event/${id}/seats`);
                    setOccupiedSeats(seatsRes.data || []);
                } catch (err) {
                    console.error("Failed to load seats", err);
                }

                // Fetch reviews
                try {
                    const reviewsRes = await api.get(`/reviews/${id}`);
                    setReviews(reviewsRes.data || []);
                } catch (err) {
                    console.error("Failed to load reviews", err);
                }
            } catch (err) {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };
        fetchEventAndDetails();
    }, [id]);

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (!selectedSeat) {
            setError('Please select a seat from the seating chart.');
            return;
        }
        setBookingLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            if (!showOTP) {
                const otpRes = await api.post('/bookings/send-otp');
                if (otpRes?.data?.otp) {
                    setOtp(otpRes.data.otp);
                    setServerOtp(otpRes.data.otp);
                }
                setShowOTP(true);
                setSuccessMsg('Verification code generated. Confirm below to complete booking.');
            } else {
                await api.post('/bookings', { 
                    eventId: event._id, 
                    otp, 
                    seatNumber: selectedSeat,
                    promoCode: appliedPromo ? appliedPromo.code : undefined
                });
                setSuccessMsg('🎉 Seat requested successfully! Awaiting admin confirmation.');
                setShowOTP(false);
                setOccupiedSeats([...occupiedSeats, { seatNumber: selectedSeat, status: 'pending', userId: user._id }]);
                setSelectedSeat(null);
                setAppliedPromo(null);
                setDiscountAmount(0);
                setPromoCodeInput('');
                // Update local seats count dynamically after booking
                setEvent(prev => ({ ...prev, availableSeats: Math.max(0, prev.availableSeats - 1) }));
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    const handleApplyPromo = async () => {
        setError('');
        setSuccessMsg('');
        if (!promoCodeInput.trim()) return;

        try {
            const { data } = await api.post('/promos/validate', { code: promoCodeInput });
            setAppliedPromo(data);
            
            let discount = 0;
            if (data.discountType === 'percentage') {
                discount = (event.ticketPrice * data.discountValue) / 100;
            } else {
                discount = data.discountValue;
            }
            setDiscountAmount(discount);
            setSuccessMsg(`Promo code ${data.code} applied successfully!`);
        } catch (err) {
            setAppliedPromo(null);
            setDiscountAmount(0);
            setError(err.response?.data?.message || 'Invalid or expired promo code');
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewLoading(true);
        setReviewError('');
        try {
            const { data } = await api.post(`/reviews/${id}`, {
                rating: reviewRating,
                comment: reviewComment
            });
            setReviews([{ ...data, userId: { name: user.name } }, ...reviews]);
            setReviewComment('');
            setReviewRating(5);
        } catch (err) {
            setReviewError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setReviewLoading(false);
        }
    };

    // Render dynamic seating grid (10 seats per row)
    const renderSeatingGrid = () => {
        if (!event) return null;
        const totalSeats = event.totalSeats || 100;
        const cols = 10;
        const rowCount = Math.ceil(totalSeats / cols);
        const gridRows = [];

        for (let i = 0; i < rowCount; i++) {
            const rowLabel = String.fromCharCode(65 + i); // A, B, C...
            const rowSeats = [];
            const seatsInThisRow = Math.min(cols, totalSeats - i * cols);
            for (let j = 1; j <= seatsInThisRow; j++) {
                rowSeats.push(`${rowLabel}${j}`);
            }
            gridRows.push({ label: rowLabel, seats: rowSeats });
        }

        return (
            <div className="space-y-4 rounded-3xl border border-white/5 bg-slate-950/40 p-6 md:p-8 shadow-inner">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h4 className="text-sm font-bold text-white tracking-wider uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Select Your Seat
                    </h4>
                    <span className="text-xs text-orange-400 font-semibold">
                        {selectedSeat ? `Selected Seat: ${selectedSeat}` : 'Choose an available seat below'}
                    </span>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider py-2">
                    <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded bg-slate-800 border border-white/10" />
                        <span className="text-slate-400">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded bg-amber-500/20 border border-amber-500/30" />
                        <span className="text-amber-400">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded bg-red-500/20 border border-red-500/30" />
                        <span className="text-red-400">Reserved</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded bg-emerald-500 shadow-md shadow-emerald-500/20 animate-pulse" />
                        <span className="text-emerald-400 font-bold">Selected</span>
                    </div>
                </div>

                {/* Stage Indicator */}
                <div className="relative my-6 flex items-center justify-center">
                    <div className="w-4/5 rounded-b-full border-t-2 border-white/10 bg-slate-900/30 py-1.5 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-slate-600">
                        STAGE / SCREEN
                    </div>
                </div>

                {/* Seats Grid */}
                <div className="space-y-3 overflow-x-auto pb-4 scrollbar-thin">
                    {gridRows.map(row => (
                        <div key={row.label} className="flex items-center justify-center gap-2.5 min-w-[500px]">
                            {/* Row Label */}
                            <span className="w-6 text-center text-xs font-extrabold text-slate-500">{row.label}</span>
                            
                            {/* Row Seats */}
                            <div className="flex items-center gap-2.5">
                                {row.seats.map(seat => {
                                    const occupied = occupiedSeats.find(s => s.seatNumber === seat);
                                    const isPending = occupied && occupied.status === 'pending';
                                    const isConfirmed = occupied && occupied.status === 'confirmed';
                                    const isSelected = selectedSeat === seat;

                                    let seatClass = "bg-slate-800 text-slate-300 border-white/5 hover:border-orange-500/30 hover:bg-slate-700/80 cursor-pointer";
                                    if (isPending) {
                                        seatClass = "bg-amber-500/10 text-amber-500/80 border-amber-500/20 cursor-not-allowed";
                                    } else if (isConfirmed) {
                                        seatClass = "bg-red-500/10 text-red-500/80 border-red-500/20 cursor-not-allowed";
                                    } else if (isSelected) {
                                        seatClass = "bg-emerald-500 text-slate-950 font-black border-emerald-500 shadow-md shadow-emerald-500/35 scale-105";
                                    }

                                    return (
                                        <button
                                            key={seat}
                                            disabled={!!occupied && !isSelected}
                                            type="button"
                                            onClick={() => setSelectedSeat(seat)}
                                            title={occupied ? `Seat ${seat} is ${occupied.status}` : `Select seat ${seat}`}
                                            className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-bold transition duration-150 ${seatClass}`}
                                        >
                                            {seat.slice(1)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex min-h-[65vh] flex-col items-center justify-center space-y-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent shadow-lg shadow-orange-500/20" />
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Loading Event Details...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="mx-auto max-w-2xl rounded-[2.5rem] border border-white/5 bg-slate-950/80 p-12 text-center shadow-2xl backdrop-blur-xl space-y-6">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500/10 text-3xl text-orange-400 border border-orange-500/20">
                    <FaTicketAlt />
                </div>
                <h2 className="text-3xl font-extrabold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Event Not Found</h2>
                <p className="text-slate-400 text-sm max-w-md mx-auto">The event you are looking for does not exist, has expired, or was removed.</p>
                <button
                    onClick={() => navigate('/')}
                    className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-bold text-slate-950 shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition"
                >
                    Explore Events
                </button>
            </div>
        );
    }

    const isSoldOut = event.availableSeats <= 0;
    const hasConfirmedBooking = user && occupiedSeats.some(s => (s.userId?._id || s.userId) === user._id && s.status === 'confirmed');
    const hasReviewed = user && reviews.some(r => (r.userId?._id || r.userId) === user._id);
    const canReview = hasConfirmedBooking && !hasReviewed;

    return (
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-950/80 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl animate-fade-in-scale text-slate-100">
            {/* Immersive Image Banner */}
            <div className="relative h-[300px] overflow-hidden bg-slate-950 md:h-[420px]">
                {event.image ? (
                    <img src={event.image} alt={event.title} className="h-full w-full object-cover brightness-[0.8]" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-6xl font-black uppercase tracking-[0.4em] text-slate-700/35">
                        {event.category || 'Event'}
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-orange-400 backdrop-blur-md animate-slide-up opacity-0">
                    <FaTicketAlt className="text-orange-400" />
                    {event.category || 'Featured'}
                </div>
                <div className="absolute bottom-6 left-6 right-6 max-w-4xl space-y-3">
                    <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl text-white animate-slide-up opacity-0 delay-50" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{event.title}</h1>
                    <p className="max-w-3xl text-sm leading-6 text-slate-300 md:text-base animate-slide-up opacity-0 delay-100">{event.description}</p>
                </div>
            </div>

            <div className="grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10 lg:p-12">
                {/* Left Info Panel */}
                <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/5 bg-white/5 p-5 shadow-sm animate-slide-up opacity-0 delay-100 transition hover:border-white/10">
                            <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">Date</div>
                            <div className="mt-2.5 flex items-center gap-3 text-base font-bold text-slate-200">
                                <FaCalendarAlt className="text-orange-400 text-lg" />
                                {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                        <div className="rounded-2xl border border-white/5 bg-white/5 p-5 shadow-sm animate-slide-up opacity-0 delay-150 transition hover:border-white/10">
                            <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">Location</div>
                            <div className="mt-2.5 flex items-center gap-3 text-base font-bold text-slate-200">
                                <FaMapMarkerAlt className="text-cyan-400 text-lg" />
                                {event.location}
                            </div>
                        </div>
                        <div className="rounded-2xl border border-white/5 bg-white/5 p-5 shadow-sm animate-slide-up opacity-0 delay-200 transition hover:border-white/10">
                            <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">Ticket Price</div>
                            <div className="mt-2.5 flex items-center gap-3 text-base font-bold text-slate-200">
                                <FaMoneyBillWave className="text-emerald-400 text-lg" />
                                {event.ticketPrice === 0 ? <span className="text-emerald-400 font-extrabold">FREE</span> : <span className="text-gradient font-black">₹{event.ticketPrice}</span>}
                            </div>
                        </div>
                        <div className="rounded-2xl border border-white/5 bg-white/5 p-5 shadow-sm animate-slide-up opacity-0 delay-250 transition hover:border-white/10">
                            <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">Availability</div>
                            <div className="mt-2.5 flex items-center gap-3 text-base font-bold text-slate-200">
                                <FaChair className="text-slate-400 text-lg" />
                                <span className={event.availableSeats < 10 ? 'text-orange-400 font-extrabold' : 'text-slate-200'}>{event.availableSeats}</span>
                                <span className="text-slate-500 font-medium">/ {event.totalSeats} seats left</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-slate-950 to-slate-900/60 p-6 shadow-md animate-slide-up opacity-0 delay-300">
                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.35em] text-orange-400">
                            <FaLock className="text-orange-400" />
                            Booking details
                        </div>
                        <h3 className="mt-3 text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Instant Seat Reservation</h3>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                            Choose an available seat in the seating chart below, click to reserve, and confirm your ticket request instantly.
                        </p>
                    </div>

                    {/* Interactive Seating Grid */}
                    {renderSeatingGrid()}
                </div>

                {/* Right Checkout Sidebar */}
                <aside className="rounded-3xl border border-white/5 bg-slate-950/40 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] md:p-8 flex flex-col justify-between animate-fade-in-scale opacity-0 delay-150">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-[0.35em] text-orange-500">Book now</div>
                                <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Ticket Booking</h3>
                            </div>
                            <div className="rounded-2xl bg-orange-500/10 p-3.5 text-orange-400 shadow-sm animate-float">
                                <FaTicketAlt className="text-lg" />
                            </div>
                        </div>

                        {selectedSeat && (
                            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-4 text-sm flex justify-between items-center animate-slide-up">
                                <span className="font-bold text-slate-400">Selected Seat:</span>
                                <span className="text-emerald-400 font-extrabold text-lg">{selectedSeat}</span>
                            </div>
                        )}

                        {/* Promo Code checkout input */}
                        {selectedSeat && !showOTP && event.ticketPrice > 0 && (
                            <div className="space-y-2 border-t border-white/5 pt-4 animate-slide-up">
                                <label className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Promo Code</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="ENTER CODE (e.g. WELCOME100)"
                                        className="flex-grow rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-orange-400 outline-none transition focus:border-orange-500/50"
                                        value={promoCodeInput}
                                        onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                                        disabled={appliedPromo}
                                    />
                                    {appliedPromo ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAppliedPromo(null);
                                                setDiscountAmount(0);
                                                setPromoCodeInput('');
                                                setSuccessMsg('');
                                            }}
                                            className="rounded-xl border border-red-500/25 bg-red-950/20 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition"
                                        >
                                            Remove
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleApplyPromo}
                                            disabled={!promoCodeInput.trim()}
                                            className="rounded-xl bg-orange-500/20 border border-orange-500/30 px-3.5 py-2 text-xs font-bold text-orange-400 hover:bg-orange-500 hover:text-slate-950 transition disabled:opacity-50"
                                        >
                                            Apply
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Price breakdown display */}
                        {appliedPromo && (
                            <div className="space-y-1.5 rounded-2xl bg-white/5 p-4 text-xs border border-white/5 animate-slide-up">
                                <div className="flex justify-between text-slate-400">
                                    <span>Original Price:</span>
                                    <span>₹{event.ticketPrice}</span>
                                </div>
                                <div className="flex justify-between text-emerald-400 font-medium">
                                    <span>Discount ({appliedPromo.code}):</span>
                                    <span>-₹{discountAmount}</span>
                                </div>
                                <div className="flex justify-between text-white font-extrabold text-sm border-t border-dashed border-white/10 pt-2 mt-2">
                                    <span>Final Price:</span>
                                    <span>₹{Math.max(0, event.ticketPrice - discountAmount)}</span>
                                </div>
                            </div>
                        )}

                        {showOTP && (
                            <div className="space-y-3 animate-slide-up">
                                {serverOtp && (
                                    <div className="rounded-2xl border border-orange-500/30 bg-orange-950/40 p-3.5 text-center animate-bounce-short">
                                        <span className="block text-[10px] uppercase font-bold text-orange-400 tracking-wider mb-1">Verification Code:</span>
                                        <span className="text-2xl font-black tracking-[0.4em] text-amber-300 font-mono">{serverOtp}</span>
                                        <span className="block text-[10px] text-slate-400 mt-1">(Pre-filled automatically)</span>
                                    </div>
                                )}
                                <label className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-400 text-center">Enter Code to Confirm</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="0 0 0 0 0 0"
                                    className="w-full rounded-2xl border border-white/10 bg-slate-950/60 py-3.5 text-center text-lg font-bold tracking-[0.5em] text-orange-400 placeholder:text-slate-700 outline-none transition focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength="6"
                                />
                            </div>
                        )}
                    </div>

                    <div className="pt-6 space-y-4">
                        <button
                            onClick={handleBooking}
                            disabled={isSoldOut || bookingLoading || (showOTP && !otp) || (!showOTP && !selectedSeat)}
                            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold transition duration-200 ${isSoldOut || (successMsg && !showOTP) || (!showOTP && !selectedSeat)
                                ? 'cursor-not-allowed bg-slate-800 text-slate-500 border border-white/5'
                                : 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-lg shadow-orange-500/10 hover:scale-[1.01] hover:brightness-110'
                                }`}
                        >
                            {bookingLoading ? 'Processing request...' : (showOTP ? 'Confirm & Book Spot' : (successMsg && !showOTP ? 'Spot Requested' : (isSoldOut ? 'Sold Out' : (!selectedSeat ? 'Select a Seat First' : 'Confirm & Reserve Seat'))))}
                            {!bookingLoading && !isSoldOut && <FaArrowRight className="text-sm" />}
                        </button>

                        <div className="space-y-3">
                            {error && <p className="rounded-2xl border border-red-500/20 bg-red-950/20 p-3.5 text-center text-sm font-semibold text-red-400">{error}</p>}
                            {successMsg && <p className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 text-center text-sm font-semibold text-emerald-400 animate-pulse">{successMsg}</p>}
                        </div>
                    </div>
                </aside>
            </div>

            {/* Reviews & Ratings Section */}
            <div className="border-t border-white/5 p-6 md:p-10 lg:p-12 space-y-8">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Attendee Reviews
                    {reviews.length > 0 && (
                        <span className="text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 rounded-full px-3 py-1 flex items-center gap-1.5">
                            ★ {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)} ({reviews.length} reviews)
                        </span>
                    )}
                </h3>

                <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
                    {/* Reviews List */}
                    <div className="space-y-6">
                        {reviews.length === 0 ? (
                            <p className="text-slate-500 italic py-4">No reviews yet for this event.</p>
                        ) : (
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                                {reviews.map(review => (
                                    <div key={review._id} className="rounded-2xl border border-white/5 bg-slate-900/40 p-5 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-200">{review.userId?.name || 'Anonymous User'}</span>
                                            <span className="text-amber-400 font-bold text-sm">
                                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed">{review.comment}</p>
                                        <div className="text-[10px] text-slate-600">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Review Form */}
                    <div>
                        {canReview ? (
                            <form onSubmit={handleReviewSubmit} className="rounded-3xl border border-white/5 bg-slate-900/60 p-6 space-y-4">
                                <h4 className="text-lg font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Share Your Experience</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Since you attended this event, your feedback is valuable to help others.
                                </p>
                                
                                <div className="space-y-1">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewRating(star)}
                                                className={`text-2xl transition hover:scale-110 ${star <= reviewRating ? 'text-amber-400' : 'text-slate-700'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Your Comment</label>
                                    <textarea
                                        required
                                        value={reviewComment}
                                        onChange={e => setReviewComment(e.target.value)}
                                        placeholder="Write your review here..."
                                        className="w-full h-24 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-orange-500/50"
                                    />
                                </div>

                                {reviewError && (
                                    <p className="text-xs text-red-400 font-semibold">{reviewError}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={reviewLoading}
                                    className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-sm font-bold text-slate-950 shadow-md hover:brightness-110 transition disabled:opacity-50"
                                >
                                    {reviewLoading ? 'Submitting...' : 'Post Review'}
                                </button>
                            </form>
                        ) : hasReviewed ? (
                            <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-6 text-center text-sm text-slate-400 italic">
                                Thank you! You have already reviewed this event.
                            </div>
                        ) : (
                            <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-6 text-center text-sm text-slate-400 italic">
                                Only confirmed attendees can leave reviews for this event.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
