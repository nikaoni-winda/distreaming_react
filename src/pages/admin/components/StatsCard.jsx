const StatsCard = ({ icon, title, value, color }) => (
    <div className="bg-netflix-darkGray p-6 rounded-lg border border-gray-800 flex items-center space-x-4 hover:border-gray-600 transition">
        <div className={`p-4 rounded-full bg-gray-900 ${color} text-2xl`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-400 text-sm font-medium h-10 flex items-center leading-tight">{title}</p>
            <p className="text-2xl font-bold text-white leading-none">{value}</p>
        </div>
    </div>
);

export default StatsCard;
