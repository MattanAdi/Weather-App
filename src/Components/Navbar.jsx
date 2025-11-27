import React from 'react';
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    let nav = useNavigate()


    function navHome() {
        nav('/')
    }
    function navFav() {
        nav('/favorites')
    }


    return (
        <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/80 via-slate-900 to-slate-900/80 shadow-xl shadow-black/50">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 text-white sm:px-6 lg:px-8">
                <button
                    className="text-lg font-semibold tracking-wider text-white transition hover:text-cyan-300"
                    onClick={navHome}
                >
                    Weather Studio
                </button>
                <div className="flex gap-3">
                    <button
                        type='button'
                        className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-cyan-400 hover:text-cyan-300"
                        onClick={navHome}
                    >
                        Home
                    </button>
                    <button
                        type='button'
                        className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-amber-400 hover:text-amber-200"
                        onClick={navFav}
                    >
                        Favorites
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
