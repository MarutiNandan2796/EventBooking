import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt, FaStar, FaBolt, FaUsers } from 'react-icons/fa';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    const [currentMonth, setCurrentMonth] = useState(new Date());

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

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        // Month information
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Grid cells
        const calendarCells = [];
        
        // Blank cells before the 1st of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarCells.push(null);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            calendarCells.push(new Date(year, month, day));
        }

        // Helper to check if dates are same day
        const isSameDay = (d1, d2) => {
            return d1.getFullYear() === d2.getFullYear() &&
                   d1.getMonth() === d2.getMonth() &&
                   d1.getDate() === d2.getDate();
        };

        const handlePrevMonth = () => {
            setCurrentMonth(new Date(year, month - 1, 1));
        };

        const handleNextMonth = () => {
            setCurrentMonth(new Date(year, month + 1, 1));
        };

        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        return (
            <div className="rounded-[2rem] border border-white/5 bg-slate-900/40 p-6 md:p-8 shadow-xl backdrop-blur-xl animate-fade-in-scale">
                {/* Calendar Navigation Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                    <h3 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {monthNames[month]} {year}
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrevMonth}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-400 transition"
                        >
                            &larr; Prev
                        </button>
                        <button
                            onClick={handleNextMonth}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-400 transition"
                        >
                            Next &rarr;
                        </button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 md:gap-4">
                    {/* Weekday labels */}
                    {weekdays.map(d => (
                        <div key={d} className="text-center text-xs font-bold uppercase tracking-wider text-slate-500 py-2">
                            {d}
                        </div>
                    ))}

                    {/* Day cells */}
                    {calendarCells.map((dateObj, idx) => {
                        if (!dateObj) {
                            return <div key={`empty-${idx}`} className="h-24 md:h-32 rounded-2xl bg-white/[0.01] border border-transparent" />;
                        }

                        // Filter events scheduled for this day
                        const dayEvents = events.filter(event => isSameDay(new Date(event.date), dateObj));

                        return (
                            <div
                                key={dateObj.toISOString()}
                                className="h-24 md:h-32 rounded-2xl border border-white/5 bg-slate-950/20 p-2 md:p-3 flex flex-col justify-between hover:border-white/15 transition group"
                            >
                                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-200 transition">{dateObj.getDate()}</span>
                                <div className="space-y-1 overflow-y-auto max-h-16 md:max-h-20 scrollbar-none">
                                    {dayEvents.map(event => (
                                        <Link
                                            key={event._id}
                                            to={`/events/${event._id}`}
                                            className="block rounded-lg bg-orange-500/10 border border-orange-500/20 px-1.5 py-1 text-[9px] font-bold text-orange-400 hover:bg-orange-500 hover:text-slate-950 truncate transition"
                                            title={event.title}
                                        >
                                            {event.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen space-y-12 animate-fade-in-scale text-slate-100">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-950/80 p-8 md:p-14 lg:p-16 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(34,211,238,0.12),_transparent_35%)]" />
                <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2400&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
                
                <div className="relative grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-6">
                        <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-orange-400 backdrop-blur-sm animate-slide-up opacity-0">
                            <FaBolt className="text-orange-400" />
                            Book smarter
                        </span>
                        <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl animate-slide-up opacity-0 delay-50" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                            Discover events that feel <span className="text-gradient animate-logo-gradient font-black">worth leaving home for</span>.
                        </h1>
                        <p className="max-w-xl text-base leading-7 text-slate-400 md:text-lg animate-slide-up opacity-0 delay-100">
                            Browse curated experiences, reserve seats in seconds, and manage everything from a clean dashboard designed for speed.
                        </p>

                        <div className="grid gap-4 sm:grid-cols-3 pt-4 animate-slide-up opacity-0 delay-150">
                            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm transition duration-300 hover:border-orange-500/20">
                                <div className="mb-2 flex items-center gap-2 text-orange-400"><FaStar /> <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Curated</span></div>
                                <div className="text-xl font-bold">Premium Picks</div>
                            </div>
                            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm transition duration-300 hover:border-cyan-500/20">
                                <div className="mb-2 flex items-center gap-2 text-cyan-400"><FaUsers /> <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Community</span></div>
                                <div className="text-xl font-bold">Live Audiences</div>
                            </div>
                            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm transition duration-300 hover:border-violet-500/20">
                                <div className="mb-2 flex items-center gap-2 text-violet-400"><FaShieldAlt /> <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Instant</span></div>
                                <div className="text-xl font-bold">Instant Booking</div>
                            </div>
                        </div>
                    </div>

                    <div className="self-center rounded-3xl border border-white/5 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl md:p-8 animate-fade-in-scale opacity-0 delay-200">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Search</div>
                                <div className="text-lg font-bold text-white">Find your next moment</div>
                            </div>
                            <div className="rounded-2xl bg-orange-500/10 p-3.5 text-orange-400">
                                <FaTicketAlt className="text-lg" />
                            </div>
                        </div>
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search concerts, workshops, conferences..."
                                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-orange-500/50 focus:bg-white/10 focus:ring-4 focus:ring-orange-500/10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-400">
                            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Today</div>
                                <div className="mt-1 font-semibold text-slate-200">Fresh listings</div>
                            </div>
                            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Seats</div>
                                <div className="mt-1 font-semibold text-slate-200">Real-time updates</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 shadow-sm hover:border-white/15 hover:scale-[1.01] transition duration-300 animate-slide-up opacity-0 delay-100">
                    <div className="mb-5 inline-flex rounded-2xl bg-orange-500/10 p-4 text-2xl text-orange-400">
                        <FaRegClock />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-slate-100">Fast Booking</h3>
                    <p className="text-sm leading-6 text-slate-400">Reserve in a few clicks with a clean flow built to reduce friction.</p>
                </div>
                <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 shadow-sm hover:border-white/15 hover:scale-[1.01] transition duration-300 animate-slide-up opacity-0 delay-200">
                    <div className="mb-5 inline-flex rounded-2xl bg-cyan-500/10 p-4 text-2xl text-cyan-400">
                        <FaTicketAlt />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-slate-100">Seamless Access</h3>
                    <p className="text-sm leading-6 text-slate-400">Track events, bookings, and status from one dashboard.</p>
                </div>
                <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 shadow-sm hover:border-white/15 hover:scale-[1.01] transition duration-300 animate-slide-up opacity-0 delay-300">
                    <div className="mb-5 inline-flex rounded-2xl bg-violet-500/10 p-4 text-2xl text-violet-400">
                        <FaShieldAlt />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-slate-100">Secure Platform</h3>
                    <p className="text-sm leading-6 text-slate-400">Instant verification and real-time seat availability for all bookings.</p>
                </div>
            </div>

            {/* Header section */}
            <div className="flex flex-col gap-4 border-b border-white/5 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="text-xs font-bold uppercase tracking-[0.35em] text-orange-500 mb-1">Explore</div>
                    <h2 className="text-3xl font-black text-white md:text-4xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Upcoming Events</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-1 flex">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`rounded-xl px-4 py-2 text-xs font-bold transition duration-200 ${viewMode === 'list' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            List View
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`rounded-xl px-4 py-2 text-xs font-bold transition duration-200 ${viewMode === 'calendar' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Calendar View
                        </button>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        {events.length} results found
                    </div>
                </div>
            </div>

            {/* Events Grid / Calendar View */}
            {loading ? (
                <div className="text-center py-20 text-xl font-semibold text-slate-400">Loading events...</div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 text-xl text-slate-500">No events found matching your search.</div>
            ) : viewMode === 'calendar' ? (
                renderCalendar()
            ) : (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {events.map((event, index) => (
                        <div 
                            key={event._id} 
                            style={{ animationDelay: `${index * 80}ms` }}
                            className="glass-card glass-card-hover group flex flex-col overflow-hidden rounded-[2rem] shadow-lg animate-slide-up opacity-0"
                        >
                            <div className="relative h-56 overflow-hidden bg-slate-950">
                                {event.image ? (
                                    <img src={event.image} alt={event.title} className="h-full w-full object-cover transition duration-550 group-hover:scale-105 group-hover:brightness-95" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-2xl font-bold text-slate-400">
                                        {event.category || 'Event'}
                                    </div>
                                )}
                                <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-slate-950/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-200 backdrop-blur-md">
                                    {event.category || 'Featured'}
                                </div>
                                <div className="absolute right-4 top-4 rounded-full bg-slate-950/90 border border-white/10 px-3.5 py-1 text-sm font-extrabold shadow-lg backdrop-blur-md">
                                    {event.ticketPrice === 0 ? <span className="text-emerald-400">FREE</span> : <span className="text-gradient">₹{event.ticketPrice}</span>}
                                </div>
                            </div>
                            <div className="flex flex-grow flex-col p-6 space-y-4">
                                <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-orange-400 transition" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{event.title}</h3>
                                <div className="space-y-2 text-sm text-slate-400">
                                    <div className="flex items-center gap-2.5">
                                        <FaCalendarAlt className="text-slate-500" />
                                        <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <FaMapMarkerAlt className="text-slate-500" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                                <div className="pt-2 mt-auto space-y-3">
                                    <div>
                                        <div className="mb-2 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                                            <div className="h-2 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-cyan-400" style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }}></div>
                                        </div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{event.availableSeats} of {event.totalSeats} seats remaining</p>
                                    </div>
                                    <Link to={`/events/${event._id}`} className="block w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 shadow-md text-slate-950 py-3.5 text-center font-bold transition duration-200">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer Section */}
            <footer className="border-t border-white/5 pt-16 pb-8 text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-slate-950 shadow-lg shadow-orange-500/20">
                        <FaTicketAlt className="text-lg" />
                    </div>
                    <span className="text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Eventora</span>
                </div>
                <p className="mx-auto max-w-sm text-sm leading-6 text-slate-400">
                    A sharper way to discover, book, and organize events with a polished, responsive experience.
                </p>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
                    &copy; {new Date().getFullYear()} Eventora Platform. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
