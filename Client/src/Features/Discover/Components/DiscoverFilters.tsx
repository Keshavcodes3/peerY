import { Filter, Code2, Clock, MapPin } from 'lucide-react';

export default function DiscoverFilters() {
    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-8">
                <Filter size={18} className="text-zinc-400" />
                <h3 className="text-sm font-semibold text-zinc-900 tracking-wide uppercase">Filters</h3>
            </div>

            <div className="space-y-8 flex-1">
                {/* Role Filter */}
                <div>
                    <h4 className="text-xs font-semibold text-zinc-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <Code2 size={14} /> Role
                    </h4>
                    <div className="space-y-2">
                        {['Frontend Developer', 'Backend Engineer', 'Full Stack', 'Product Designer'].map(role => (
                            <label key={role} className="flex items-center gap-3 group cursor-pointer">
                                <div className="w-4 h-4 rounded border border-zinc-300 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                                    {role === 'Frontend Developer' && <div className="w-2 h-2 bg-blue-500 rounded-sm" />}
                                </div>
                                <span className="text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors">{role}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Availability Filter */}
                <div>
                    <h4 className="text-xs font-semibold text-zinc-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <Clock size={14} /> Availability
                    </h4>
                    <div className="space-y-2">
                        {['Full-time', 'Part-time', 'Weekends', 'Evenings'].map(time => (
                            <label key={time} className="flex items-center gap-3 group cursor-pointer">
                                <div className="w-4 h-4 rounded border border-zinc-300 flex items-center justify-center group-hover:border-blue-500 transition-colors" />
                                <span className="text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors">{time}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Location Filter */}
                <div>
                    <h4 className="text-xs font-semibold text-zinc-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <MapPin size={14} /> Location
                    </h4>
                    <select className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:border-blue-500 transition-colors">
                        <option>Anywhere (Remote)</option>
                        <option>North America</option>
                        <option>Europe</option>
                        <option>Asia</option>
                    </select>
                </div>
            </div>

            <button className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-sm font-medium rounded-xl transition-colors mt-6">
                Reset Filters
            </button>
        </div>
    );
}
