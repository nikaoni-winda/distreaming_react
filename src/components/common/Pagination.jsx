import PropTypes from 'prop-types';

function Pagination({ pagination, onPageChange }) {
    if (!pagination || pagination.total_pages <= 1) {
        return null;
    }

    const { current_page, total_pages, has_prev, has_next } = pagination;

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxPages = 5;

        let startPage = Math.max(1, current_page - 2);
        let endPage = Math.min(total_pages, current_page + 2);

        if (current_page <= 3) {
            endPage = Math.min(total_pages, maxPages);
        }
        if (current_page >= total_pages - 2) {
            startPage = Math.max(1, total_pages - maxPages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(current_page - 1)}
                disabled={!has_prev}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800"
                aria-label="Previous page"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* First Page */}
            {pageNumbers[0] > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition"
                    >
                        1
                    </button>
                    {pageNumbers[0] > 2 && (
                        <span className="text-gray-500">...</span>
                    )}
                </>
            )}

            {/* Page Numbers */}
            {pageNumbers.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 rounded transition ${page === current_page
                            ? 'bg-netflix-red text-white font-bold'
                            : 'bg-gray-800 hover:bg-gray-700 text-white'
                        }`}
                >
                    {page}
                </button>
            ))}

            {/* Last Page */}
            {pageNumbers[pageNumbers.length - 1] < total_pages && (
                <>
                    {pageNumbers[pageNumbers.length - 1] < total_pages - 1 && (
                        <span className="text-gray-500">...</span>
                    )}
                    <button
                        onClick={() => onPageChange(total_pages)}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition"
                    >
                        {total_pages}
                    </button>
                </>
            )}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(current_page + 1)}
                disabled={!has_next}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800"
                aria-label="Next page"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}

Pagination.propTypes = {
    pagination: PropTypes.shape({
        current_page: PropTypes.number.isRequired,
        total_pages: PropTypes.number.isRequired,
        per_page: PropTypes.number,
        total_items: PropTypes.number,
        has_next: PropTypes.bool.isRequired,
        has_prev: PropTypes.bool.isRequired,
    }).isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
