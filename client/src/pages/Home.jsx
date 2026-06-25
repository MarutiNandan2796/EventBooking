import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt, FaStar, FaBolt, FaUsers } from 'react-icons/fa';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 400); // 400ms debounce
        return () => clearTimeout(timeoutId);
    }, [search]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <section className="relative mb-12 overflow-hidden rounded-[2rem] border border-slate-200/70 bg-slate-950 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.24),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(34,211,238,0.18),_transparent_26%)]" />
                <div className="absolute inset-0 opacity-35 bg-[url('https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2400&auto=format&fit=crop')] bg-cover bg-center mix-blend-soft-light" />
                <div className="relative grid gap-10 p-8 md:grid-cols-[1.2fr_0.8fr] md:p-14 lg:p-16">
                    <div className="space-y-6">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-100 backdrop-blur-sm">
                            <FaBolt className="text-amber-300" />
                            Book smarter
                        </span>
                        <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                            Discover events that feel <span className="bg-gradient-to-r from-orange-300 via-amber-200 to-cyan-200 bg-clip-text text-transparent">worth leaving home for</span>.
                        </h1>
                        <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                            Browse curated experiences, reserve seats in seconds, and manage everything from a clean dashboard designed for speed.
                        </p>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                <div className="mb-2 flex items-center gap-2 text-amber-300"><FaStar /> <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">Curated</span></div>
                                <div className="text-2xl font-bold">Premium picks</div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                <div className="mb-2 flex items-center gap-2 text-cyan-300"><FaUsers /> <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">Community</span></div>
                                <div className="text-2xl font-bold">Live audiences</div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                <div className="mb-2 flex items-center gap-2 text-orange-300"><FaShieldAlt /> <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">Secure</span></div>
                                <div className="text-2xl font-bold">OTP protected</div>
                            </div>
                        </div>
                    </div>

                    <div className="self-center rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5 shadow-2xl backdrop-blur-xl md:p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <div className="text-xs uppercase tracking-[0.35em] text-slate-400">Search</div>
                                <div className="text-lg font-semibold text-white">Find your next moment</div>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-3 text-amber-300">
                                <FaTicketAlt />
                            </div>
                        </div>
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search concerts, workshops, conferences..."
                                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-11 pr-4 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-300/60 focus:bg-white/10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-300">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Today</div>
                                <div className="mt-1 font-semibold text-white">Fresh listings</div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Seats</div>
                                <div className="mt-1 font-semibold text-white">Real-time updates</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="mb-12 grid grid-cols-1 gap-5 px-1 md:grid-cols-3">
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <div className="mb-5 inline-flex rounded-2xl bg-orange-500/10 p-4 text-2xl text-orange-600">
                        <FaRegClock />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-slate-900">Fast Booking</h3>
                    <p className="text-sm leading-6 text-slate-600">Reserve in a few clicks with a clean flow built to reduce friction.</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <div className="mb-5 inline-flex rounded-2xl bg-cyan-500/10 p-4 text-2xl text-cyan-700">
                        <FaTicketAlt />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-slate-900">Seamless Access</h3>
                    <p className="text-sm leading-6 text-slate-600">Track events, bookings, and status from one dashboard.</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <div className="mb-5 inline-flex rounded-2xl bg-slate-900/5 p-4 text-2xl text-slate-900">
                        <FaShieldAlt />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-slate-900">Secure Platform</h3>
                    <p className="text-sm leading-6 text-slate-600">OTP-backed verification for registrations and bookings.</p>
                </div>
            </div>

            <div className="mb-8 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="text-xs font-bold uppercase tracking-[0.35em] text-orange-500">Explore</div>
                    <h2 className="text-3xl font-black text-slate-950 md:text-4xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Upcoming Events</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {events.length} results found
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-xl font-semibold text-gray-600">Loading events...</div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 text-xl text-gray-500">No events found matching your search.</div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {events.map(event => (
                        <div key={event._id} className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
                            <div className="relative h-52 overflow-hidden bg-slate-200">
                                {event.image ? (
                                    <img src={event.image} alt={event.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-2xl font-bold text-slate-600">
                                        {event.category || 'Event'}
                                    </div>
                                )}
                                <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-slate-950/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white backdrop-blur-sm">
                                    {event.category || 'Featured'}
                                </div>
                                <div className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-sm font-bold shadow-lg shadow-slate-900/10 backdrop-blur-sm">
                                    {event.ticketPrice === 0 ? <span className="text-emerald-600">FREE</span> : <span className="text-slate-950">₹{event.ticketPrice}</span>}
                                </div>
                            </div>
                            <div className="flex flex-grow flex-col p-6">
                                <h2 className="mb-3 text-2xl font-black tracking-tight text-slate-950" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{event.title}</h2>
                                <div className="mb-4 flex flex-col gap-2 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-slate-400" />
                                        <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-slate-400" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <div className="mb-2 h-2 w-full rounded-full bg-slate-100">
                                        <div className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-cyan-400" style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }}></div>
                                    </div>
                                    <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-slate-500">{event.availableSeats} of {event.totalSeats} seats remaining</p>
                                    <Link to={`/events/${event._id}`} className="block w-full rounded-2xl bg-slate-950 py-3 text-center font-semibold text-white transition hover:bg-orange-500">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer Section */}
            <footer className="mt-auto border-t border-slate-200 pt-16 pb-8 text-center">
                <div className="mb-4 flex items-center justify-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                        <FaTicketAlt className="text-lg" />
                    </div>
                    <span className="text-xl font-black text-slate-950" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Eventora</span>
                </div>
                <p className="mx-auto mb-6 max-w-md text-sm leading-6 text-slate-600">
                    A sharper way to discover, book, and organize events with a polished, responsive experience.
                </p>
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                    &copy; {new Date().getFullYear()} Eventora Platform. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
