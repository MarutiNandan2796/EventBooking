import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle, FaRedo, FaHome } from 'react-icons/fa';

const PaymentFailed = () => {
    return (
        <div className="flex min-h-[70vh] items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-[2rem] border border-red-200 bg-white p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-red-100 text-5xl text-red-600">
                    <FaTimesCircle />
                </div>
                <div className="mb-3 inline-flex rounded-full bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-red-700">Booking Failed</div>
                <h1 className="text-4xl font-black text-slate-950" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Booking Failed</h1>
                <p className="mt-4 text-lg leading-7 text-slate-600">We couldn't process your payment. Please ensure your payment details are correct and try again.</p>
                <div className="mt-8 space-y-4">
                    <Link to="/" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-4 font-bold text-white transition hover:bg-red-700">
                        <FaRedo /> Return to Events
                    </Link>
                    <Link to="/dashboard" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 font-bold text-slate-700 transition hover:bg-slate-100">
                        <FaHome /> Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;
