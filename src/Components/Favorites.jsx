import React from 'react';
import { useNavigate } from 'react-router-dom'

const Favorites = (props) => {
    const navigate = useNavigate();

    function clickFavorite(id) {
        props.clickFavoritedCity(id)
        navigate('/')
    }

    function deleteFavorite(event, id) {
        event.stopPropagation()
        props.deleteFavorite(id)
    }

    const hasFavorites = Boolean(props.favorite.length)

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-6">
                <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-900/40 backdrop-blur-xl">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-semibold text-white">Favorites</h1>
                        <p className="text-sm text-slate-300">Tap a card to load it back into the explorer.</p>
                    </div>
                    {hasFavorites ? (
                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {props.favorite.map((val) => (
                                <article
                                    key={val.id}
                                    onClick={() => clickFavorite(val.id)}
                                    className="group rounded-2xl border border-white/10 bg-slate-900/40 p-4 text-sm text-white transition hover:-translate-y-1 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/30"
                                >
                                    <dl className="space-y-2">
                                        <div className="flex items-baseline justify-between text-xs uppercase tracking-wide text-slate-400">
                                            <dt>City</dt>
                                            <dd className="text-base font-semibold text-white">{val.cityname}</dd>
                                        </div>
                                        <div className="flex items-baseline justify-between text-xs uppercase tracking-wide text-slate-400">
                                            <dt>Weather</dt>
                                            <dd className="text-base font-semibold text-white">{val.currentweather}</dd>
                                        </div>
                                        <div className="flex items-baseline justify-between text-xs uppercase tracking-wide text-slate-400">
                                            <dt>Temp</dt>
                                            <dd className="text-base font-semibold text-white">{val.temperature}°C</dd>
                                        </div>
                                    </dl>
                                    <button
                                        type="button"
                                        onClick={(event) => deleteFavorite(event, val.id)}
                                        className="mt-4 inline-flex items-center justify-center rounded-full bg-rose-500/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-rose-500"
                                    >
                                        Delete
                                    </button>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-6 text-sm text-slate-300">Save a city from the home view to revisit it later.</p>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Favorites;
