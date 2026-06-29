import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaRupeeSign, FaUsers, FaClock, FaCalendarAlt, FaTrash, FaCheck, FaTimes, FaTag, FaImage } from 'react-icons/fa';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Seating Map states for Admin
    const [selectedEventForMap, setSelectedEventForMap] = useState(null);
    const [mapSeats, setMapSeats] = useState([]);
    const [mapLoading, setMapLoading] = useState(false);

    const [showEventForm, setShowEventForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: ''
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my') // Admin gets all bookings
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenSeatingMap = async (eventObj) => {
        setSelectedEventForMap(eventObj);
        setMapLoading(true);
        try {
            const { data } = await api.get(`/bookings/event/${eventObj._id}/seats`);
            setMapSeats(data);
        } catch (error) {
            console.error("Failed to load map seats", error);
            alert("Could not load seating details for this event");
        } finally {
            setMapLoading(false);
        }
    };

    const renderSeatingMapModal = () => {
        if (!selectedEventForMap) return null;
        const totalSeats = selectedEventForMap.totalSeats;
        const cols = 10;
        const rowCount = Math.ceil(totalSeats / cols);
        const gridRows = [];

        for (let i = 0; i < rowCount; i++) {
            const rowLabel = String.fromCharCode(65 + i);
            const rowSeats = [];
            const seatsInThisRow = Math.min(cols, totalSeats - i * cols);
            for (let j = 1; j <= seatsInThisRow; j++) {
                rowSeats.push(`${rowLabel}${j}`);
            }
            gridRows.push({ label: rowLabel, seats: rowSeats });
        }

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in-scale">
                <div className="relative w-full max-w-4xl rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl p-6 md:p-8 flex flex-col max-h-[90vh]">
                    <button 
                        onClick={() => setSelectedEventForMap(null)} 
                        className="absolute top-4 right-4 rounded-full bg-white/5 border border-white/10 p-2 text-slate-400 hover:text-white transition"
                    >
                        <FaTimes className="text-sm" />
                    </button>

                    <div className="mb-4">
                        <div className="text-xs font-bold uppercase tracking-[0.25em] text-orange-400 mb-1">Live Seating Layout</div>
                        <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                            {selectedEventForMap.title}
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Check occupied seats, pending requests, and current availability.</p>
                    </div>

                    {mapLoading ? (
                        <div className="flex-grow flex items-center justify-center py-20 text-slate-400">Loading seating chart...</div>
                    ) : (
                        <div className="flex-grow overflow-y-auto space-y-6 pr-2 scrollbar-thin">
                            {/* Legend */}
                            <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider py-2 justify-center">
                                <div className="flex items-center gap-2">
                                    <span className="h-4 w-4 rounded bg-slate-800 border border-white/10" />
                                    <span className="text-slate-400">Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-4 w-4 rounded bg-amber-500/20 border border-amber-500/30 animate-pulse" />
                                    <span className="text-amber-400 font-semibold">Pending Request</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-4 w-4 rounded bg-red-500/20 border border-red-500/30" />
                                    <span className="text-red-400 font-semibold">Confirmed Booking</span>
                                </div>
                            </div>

                            {/* Stage Indicator */}
                            <div className="relative my-4 flex items-center justify-center">
                                <div className="w-3/5 rounded-b-full border-t-2 border-white/10 bg-slate-950/40 py-1.5 text-center text-[9px] font-bold uppercase tracking-[0.4em] text-slate-600">
                                    STAGE / SCREEN
                                </div>
                            </div>

                            {/* Seats Grid */}
                            <div className="space-y-3 overflow-x-auto pb-4 scrollbar-thin">
                                {gridRows.map(row => (
                                    <div key={row.label} className="flex items-center justify-center gap-2.5 min-w-[500px]">
                                        <span className="w-6 text-center text-xs font-extrabold text-slate-500">{row.label}</span>
                                        <div className="flex items-center gap-2">
                                            {row.seats.map(seat => {
                                                const occupied = mapSeats.find(s => s.seatNumber === seat);
                                                const isPending = occupied && occupied.status === 'pending';
                                                const isConfirmed = occupied && occupied.status === 'confirmed';

                                                let seatClass = "bg-slate-800 text-slate-400 border-white/5";
                                                let tooltip = `Seat ${seat}: Available`;
                                                if (isPending) {
                                                    seatClass = "bg-amber-500/10 text-amber-500 border-amber-500/20";
                                                    tooltip = `Seat ${seat}: Pending Request`;
                                                } else if (isConfirmed) {
                                                    seatClass = "bg-red-500/10 text-red-500 border-red-500/20";
                                                    tooltip = `Seat ${seat}: Confirmed`;
                                                }

                                                return (
                                                    <div 
                                                        key={seat}
                                                        title={tooltip}
                                                        className={`group relative flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-bold transition duration-150 ${seatClass}`}
                                                    >
                                                        {seat.slice(1)}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            setShowEventForm(false);
            setFormData({ title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating event');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                fetchData();
            } catch (error) {
                alert('Error deleting event');
            }
        }
    };

    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            await api.put(`/bookings/${id}/confirm`, { paymentStatus });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error confirming booking');
        }
    };

    const handleCancelBooking = async (id) => {
        if (window.confirm('Cancel this user\'s booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchData();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    if (loading) return <div className="py-20 text-center text-xl font-semibold text-slate-700">Loading admin panel...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-100">
            {/* Header Control Center */}
            <div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-950/80 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
                <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
                    <div>
                        <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-orange-400">
                            <FaUsers />
                            Admin Control Center
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Admin Dashboard</h1>
                        <p className="mt-2 text-sm text-slate-400">Manage events and manually confirm bookings.</p>
                    </div>
                    <button
                        onClick={() => setShowEventForm(!showEventForm)}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-bold transition duration-200 shadow-md md:w-auto ${
                            showEventForm 
                            ? 'bg-slate-800 text-slate-200 border border-white/10 hover:bg-slate-700' 
                            : 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 hover:brightness-110'
                        }`}
                    >
                        {showEventForm ? 'Cancel Creation' : <><FaPlus className="text-xs" /> Create New Event</>}
                    </button>
                </div>
            </div>

            {/* Admin Stats Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Total Revenue */}
                <div className="flex items-center justify-between rounded-3xl border border-white/5 bg-slate-900/40 p-6 shadow-md border-l-4 border-l-emerald-500">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 mb-1">Total Revenue</p>
                        <h3 className="text-3xl font-black text-emerald-400">₹{bookings.reduce((sum, b) => b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + b.amount : sum, 0)}</h3>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 text-xl font-bold"><FaRupeeSign /></div>
                </div>

                {/* Paid Clients */}
                <div className="flex items-center justify-between rounded-3xl border border-white/5 bg-slate-900/40 p-6 shadow-md border-l-4 border-l-cyan-500">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 mb-1">Paid Clients</p>
                        <h3 className="text-3xl font-black text-cyan-400">{new Set(bookings.filter(b => b.paymentStatus === 'paid' && b.status === 'confirmed').map(b => b.userId?._id)).size}</h3>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 text-xl font-bold"><FaUsers /></div>
                </div>

                {/* Pending Requests */}
                <div className="flex items-center justify-between rounded-3xl border border-white/5 bg-slate-900/40 p-6 shadow-md border-l-4 border-l-amber-500">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 mb-1">Pending Requests</p>
                        <h3 className="text-3xl font-black text-amber-400">{bookings.filter(b => b.status === 'pending').length}</h3>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 text-xl font-bold"><FaClock /></div>
                </div>
            </div>

            {/* Create Event Form */}
            {showEventForm && (
                <div className="rounded-[2rem] border border-white/5 bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
                    <h2 className="mb-6 text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Create New Event</h2>
                    <form onSubmit={handleCreateEvent} className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="relative">
                            <FaTag className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                            <input required type="text" placeholder="Event Title" className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-11 py-3.5 text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        </div>
                        <div className="relative">
                            <FaTag className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                            <input required type="text" placeholder="Category (e.g., Tech, Music)" className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-11 py-3.5 text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                        </div>
                        <div className="relative">
                            <FaCalendarAlt className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                            <input required type="date" className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-11 py-3.5 text-slate-100 outline-none transition focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        </div>
                        <div className="relative">
                            <FaUsers className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                            <input required type="text" placeholder="Location" className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-11 py-3.5 text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                        </div>
                        <input required type="number" placeholder="Total Seats" className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3.5 text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10" value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
                        <input required type="number" placeholder="Ticket Price (0 for free)" className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3.5 text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />

                        <div className="md:col-span-2 relative">
                            <FaImage className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                            <input type="text" placeholder="Image URL (direct link)" className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-11 py-3.5 text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                        </div>

                        <textarea required placeholder="Event Description" className="h-36 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3.5 text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 md:col-span-2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        <button type="submit" className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-4 font-bold text-slate-950 shadow-lg shadow-orange-500/15 hover:brightness-110">
                            <FaPlus className="text-sm" /> Publish Event
                        </button>
                    </form>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Events list */}
                <div className="flex flex-col">
                    <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 border border-white/10 text-xs font-bold text-slate-300">{events.length}</span>
                        Upcoming Events
                    </h2>
                    <div className="overflow-hidden rounded-3xl border border-white/5 bg-slate-950/40 shadow-lg">
                        <ul className="max-h-[600px] divide-y divide-white/5 overflow-y-auto">
                            {events.length === 0 ? (
                                <li className="p-6 text-center text-slate-500">No events created yet.</li>
                            ) : (
                                events.map(event => (
                                    <li key={event._id} className="flex flex-col gap-4 p-6 transition hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h4 className="mb-1 font-bold text-white leading-tight">{event.title}</h4>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                                <span className="flex items-center gap-1.5 font-semibold">
                                                    <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></div> 
                                                    {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <span className="flex items-center gap-1.5 font-semibold">
                                                    <div className={`h-2 w-2 rounded-full ${event.availableSeats > 0 ? 'bg-emerald-400' : 'bg-red-400'}`}></div> 
                                                    {event.availableSeats}/{event.totalSeats} seats left
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            <button 
                                                onClick={() => handleOpenSeatingMap(event)}
                                                className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-950/20 px-3.5 py-2 text-xs font-bold text-cyan-400 transition hover:bg-cyan-500 hover:text-slate-950 sm:w-auto"
                                            >
                                                Seating Map
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteEvent(event._id)} 
                                                className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-950/20 px-3.5 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500 hover:text-white sm:w-auto"
                                            >
                                                <FaTrash className="text-xs" /> Delete
                                            </button>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bookings Section */}
                <div className="flex flex-col">
                    <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-400">{bookings.length}</span>
                        Booking Requests
                    </h2>
                    <div className="overflow-hidden rounded-3xl border border-white/5 bg-slate-950/40 shadow-lg">
                        <ul className="max-h-[600px] divide-y divide-white/5 overflow-y-auto">
                            {bookings.length === 0 ? (
                                <li className="p-6 text-center text-slate-500">No bookings yet.</li>
                            ) : (
                                bookings.map(booking => (
                                    <li key={booking._id} className={`border-l-4 p-6 transition hover:bg-white/5 border-b border-white/5 last:border-0 ${booking.status === 'pending' ? 'border-l-amber-500' : booking.status === 'confirmed' ? 'border-l-emerald-500' : 'border-l-red-500'}`}>
                                        <div className="mb-3 flex items-start justify-between gap-4">
                                            <h4 className="text-lg font-bold leading-tight text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{booking.eventId?.title || 'Deleted Event'}</h4>
                                            <div className="flex shrink-0 flex-col items-end gap-1.5 ml-4">
                                                <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-amber-500/20 text-amber-400 border border-amber-500/20'}`}>{booking.status}</span>
                                                {booking.status !== 'cancelled' && <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${booking.paymentStatus === 'paid' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20' : 'bg-slate-800 text-slate-400 border border-white/5'}`}>{booking.paymentStatus.replace('_', ' ')}</span>}
                                            </div>
                                        </div>
                                        <div className="mb-4 rounded-2xl bg-white/5 p-4 text-xs text-slate-400 space-y-1.5">
                                            <p className="flex items-center gap-2">
                                                <span className="w-16 font-bold uppercase tracking-wider text-slate-500">User:</span>
                                                <span className="font-semibold text-slate-200">{booking.userId?.name}</span>
                                                <span className="text-slate-500">({booking.userId?.email})</span>
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <span className="w-16 font-bold uppercase tracking-wider text-slate-500">Amount:</span>
                                                <span className={`font-semibold ${booking.amount === 0 ? 'text-emerald-400 font-bold' : 'text-slate-200'}`}>{booking.amount === 0 ? 'Free' : `₹${booking.amount}`}</span>
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <span className="w-16 font-bold uppercase tracking-wider text-slate-500">Date:</span>
                                                <span className="text-slate-300">{new Date(booking.bookedAt).toLocaleString()}</span>
                                            </p>
                                            {booking.seatNumber && (
                                                <p className="flex items-center gap-2">
                                                    <span className="w-16 font-bold uppercase tracking-wider text-slate-500">Seat:</span>
                                                    <span className="font-bold text-orange-400">{booking.seatNumber}</span>
                                                </p>
                                            )}
                                            {booking.eventId && (
                                                <p className="mt-2 flex items-center gap-2 border-t border-white/5 pt-2 text-slate-400">
                                                    <span className="w-16 font-bold uppercase tracking-wider text-slate-500">Seats:</span>
                                                    <span><strong className={`font-bold ${booking.eventId.availableSeats > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{booking.eventId.availableSeats}</strong> remaining of {booking.eventId.totalSeats}</span>
                                                </p>
                                            )}
                                        </div>

                                        {booking.status === 'pending' && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <button onClick={() => handleConfirmBooking(booking._id, 'paid')} className="flex-1 min-w-[120px] rounded-2xl border border-emerald-500/20 bg-emerald-950/20 px-3 py-2.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500 hover:text-slate-950">
                                                    <FaCheck className="inline mr-1" /> Approve as Paid
                                                </button>
                                                <button onClick={() => handleConfirmBooking(booking._id, 'not_paid')} className="flex-1 min-w-[120px] rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-xs font-bold text-slate-200 transition hover:bg-white hover:text-slate-950">
                                                    <FaCheck className="inline mr-1" /> Approve Undecided
                                                </button>
                                                <button onClick={() => handleCancelBooking(booking._id)} className="w-[85px] rounded-2xl border border-red-500/20 bg-red-950/20 px-3 py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-500 hover:text-white">
                                                    <FaTimes className="inline mr-1" /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            
            {/* Seating Map Modal */}
            {renderSeatingMapModal()}
        </div>
    );
};

export default AdminDashboard;
