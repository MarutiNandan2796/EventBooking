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
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
                <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">
                            <FaUsers />
                            Admin Control Center
                        </div>
                        <h1 className="text-3xl font-black md:text-4xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Admin Dashboard</h1>
                        <p className="mt-2 text-sm leading-7 text-slate-300">Manage events and manually confirm bookings.</p>
                    </div>
                <button
                    onClick={() => setShowEventForm(!showEventForm)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-slate-950 transition hover:bg-orange-500 hover:text-white md:w-auto"
                >
                        {showEventForm ? 'Cancel Creation' : <><FaPlus /> Create New Event</>}
                </button>
            </div>

            {/* Admin Stats Row */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                        <p className="mb-1 text-sm font-bold uppercase tracking-[0.3em] text-slate-500">Total Revenue</p>
                        <h3 className="text-3xl font-black text-emerald-600">₹{bookings.reduce((sum, b) => b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + b.amount : sum, 0)}</h3>
                    <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-xl font-bold">₹</div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 text-xl font-bold"><FaRupeeSign /></div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Paid Clients</p>
                        <p className="mb-1 text-sm font-bold uppercase tracking-[0.3em] text-slate-500">Paid Clients</p>
                        <h3 className="text-3xl font-black text-cyan-600">{new Set(bookings.filter(b => b.paymentStatus === 'paid' && b.status === 'confirmed').map(b => b.userId?._id)).size}</h3>
                    <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-xl font-bold">👤</div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600 text-xl font-bold"><FaUsers /></div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Pending Requests</p>
                        <p className="mb-1 text-sm font-bold uppercase tracking-[0.3em] text-slate-500">Pending Requests</p>
                        <h3 className="text-3xl font-black text-amber-600">{bookings.filter(b => b.status === 'pending').length}</h3>
                    <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl font-bold">⏳</div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 text-xl font-bold"><FaClock /></div>
            </div>

            {showEventForm && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 animation-slideDown">
                <div className="mb-8 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-8">
                    <h2 className="mb-6 text-2xl font-black text-slate-950" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Create New Event</h2>
                    <form onSubmit={handleCreateEvent} className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="relative"><FaTag className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input required type="text" placeholder="Event Title" className="w-full rounded-2xl border border-slate-300 px-11 py-3.5 outline-none transition focus:border-slate-900" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} /></div>
                        <div className="relative"><FaTag className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input required type="text" placeholder="Category (e.g., Tech, Music)" className="w-full rounded-2xl border border-slate-300 px-11 py-3.5 outline-none transition focus:border-slate-900" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} /></div>
                        <div className="relative"><FaCalendarAlt className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input required type="date" className="w-full rounded-2xl border border-slate-300 px-11 py-3.5 outline-none transition focus:border-slate-900" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} /></div>
                        <div className="relative"><FaUsers className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input required type="text" placeholder="Location" className="w-full rounded-2xl border border-slate-300 px-11 py-3.5 outline-none transition focus:border-slate-900" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} /></div>
                        <input required type="number" placeholder="Total Seats" className="rounded-2xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-slate-900" value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
                        <input required type="number" placeholder="Ticket Price (0 for free)" className="rounded-2xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-slate-900" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />

                        <div className="md:col-span-2 relative">
                            <FaImage className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Image URL (direct link)" className="w-full rounded-2xl border border-slate-300 px-11 py-3.5 outline-none transition focus:border-slate-900" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                        </div>

                        <textarea required placeholder="Event Description" className="h-36 rounded-2xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-slate-900 md:col-span-2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        <button type="submit" className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 py-3.5 font-bold text-white transition hover:bg-orange-500">
                            <FaPlus /> Publish Event
                        </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                    <h2 className="mb-6 flex items-center gap-3 text-2xl font-black text-slate-950" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm text-white">{events.length}</span>
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                        <ul className="max-h-[600px] divide-y divide-slate-100 overflow-y-auto">
                            {events.length === 0 ? <li className="p-6 text-center text-slate-500">No events created yet.</li> :
                                    <li key={event._id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition border-b border-gray-100 last:border-0">
                                    <li key={event._id} className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
                                            <h4 className="font-bold text-gray-900 mb-1 leading-tight">{event.title}</h4>
                                            <h4 className="mb-1 leading-tight font-black text-slate-950">{event.title}</h4>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                                <span className="flex items-center gap-1 font-medium"><div className="h-2 w-2 rounded-full bg-cyan-500"></div> {new Date(event.date).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1 font-medium"><div className={`h-2 w-2 rounded-full ${event.availableSeats > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div> {event.availableSeats}/{event.totalSeats} seats</span>
                                        </div>
                                        <button onClick={() => handleDeleteEvent(event._id)} className="w-full sm:w-auto text-red-500 hover:text-white hover:bg-red-500 border border-red-200 px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm shrink-0">
                                        <button onClick={() => handleDeleteEvent(event._id)} className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-2 text-sm font-bold text-red-500 transition hover:bg-red-500 hover:text-white sm:w-auto">
                                            <FaTrash /> Delete
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>

                {/* Bookings Section */}
                <div className="flex flex-col">
                    <h2 className="mb-6 flex items-center gap-3 text-2xl font-black text-slate-950" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">{bookings.length}</span>
                        Booking Requests
                    </h2>
                    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                        <ul className="max-h-[600px] divide-y divide-slate-100 overflow-y-auto">
                            {bookings.length === 0 ? <li className="p-6 text-center text-slate-500">No bookings yet.</li> :
                                bookings.map(booking => (
                                    <li key={booking._id} className={`border-l-4 p-6 transition hover:bg-slate-50 ${booking.status === 'pending' ? 'border-l-amber-400' : booking.status === 'confirmed' ? 'border-l-emerald-400' : 'border-l-red-400'}`}>
                                        <div className="mb-3 flex items-start justify-between gap-4">
                                            <h4 className="text-lg font-black leading-tight text-slate-950" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{booking.eventId?.title || 'Deleted Event'}</h4>
                                            <div className="flex shrink-0 flex-col items-end gap-1 ml-4">
                                                <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{booking.status}</span>
                                                {booking.status !== 'cancelled' && <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-wider ${booking.paymentStatus === 'paid' ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-700'}`}>{booking.paymentStatus.replace('_', ' ')}</span>}
                                            </div>
                                        </div>
                                        <div className="mb-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm">
                                            <p className="mb-1 flex items-center gap-2 text-slate-700">
                                                <span className="w-16 text-xs font-bold uppercase text-slate-500">User:</span>
                                                <span className="font-semibold">{booking.userId?.name}</span>
                                                <span className="text-slate-400">({booking.userId?.email})</span>
                                            </p>
                                            <p className="mb-1 flex items-center gap-2 text-slate-700">
                                                <span className="w-16 text-xs font-bold uppercase text-slate-500">Amount:</span>
                                                <span className={`font-semibold ${booking.amount === 0 ? 'text-emerald-600' : ''}`}>{booking.amount === 0 ? 'Free' : `₹${booking.amount}`}</span>
                                            </p>
                                            <p className="mb-1 flex items-center gap-2 text-slate-700">
                                                <span className="w-16 text-xs font-bold uppercase text-slate-500">Date:</span>
                                                <span>{new Date(booking.bookedAt).toLocaleString()}</span>
                                            </p>
                                            {booking.eventId && (
                                                <p className="mt-2 flex items-center gap-2 border-t border-slate-200 pt-2 text-slate-700">
                                                    <span className="w-16 text-xs font-bold uppercase text-slate-500">Seats:</span>
                                                    <span className={`font-bold ${booking.eventId.availableSeats > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{booking.eventId.availableSeats}</span> remaining of {booking.eventId.totalSeats}
                                                </p>
                                            )}
                                        </div>

                                        {booking.status === 'pending' && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <button onClick={() => handleConfirmBooking(booking._id, 'paid')} className="flex-1 min-w-[120px] rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white">
                                                    <FaCheck /> Approve as Paid
                                                </button>
                                                <button onClick={() => handleConfirmBooking(booking._id, 'not_paid')} className="flex-1 min-w-[120px] rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-800 hover:text-white">
                                                    <FaCheck /> Approve Undecided
                                                </button>
                                                <button onClick={() => handleCancelBooking(booking._id)} className="w-[90px] rounded-2xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-500 hover:text-white">
                                                    <FaTimes /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
