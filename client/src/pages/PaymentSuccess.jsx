import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaArrowRight, FaHome } from 'react-icons/fa';

const PaymentSuccess = () => {
    return (
        <div className="flex min-h-[70vh] items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-[2rem] border border-emerald-200 bg-white p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-emerald-100 text-5xl text-emerald-600">
                    <FaCheckCircle />
                </div>
                <div className="mb-3 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-emerald-700">Booking Confirmed</div>
                <h1 className="text-4xl font-black text-slate-950" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Booking Confirmed!</h1>
                <p className="mt-4 text-lg leading-7 text-slate-600">Your ticket has been booked successfully. A confirmation email has been sent to your registered email address.</p>
                <div className="mt-8 space-y-4">
                    <Link to="/dashboard" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 font-bold text-white transition hover:bg-emerald-700">
                        View My Tickets <FaArrowRight />
                    </Link>
                    <Link to="/" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 font-bold text-slate-700 transition hover:bg-slate-100">
                        <FaHome /> Discover More Events
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
