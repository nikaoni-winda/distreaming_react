import { useState } from 'react';

function StarRating({ rating, onRatingChange, disabled = false }) {
    const [hoverRating, setHoverRating] = useState(0);

    const handleClick = (value) => {
        if (!disabled && onRatingChange) {
            onRatingChange(value);
        }
    };

    const handleMouseEnter = (value) => {
        if (!disabled) {
            setHoverRating(value);
        }
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const getStarFill = (starIndex) => {
        const currentRating = hoverRating || rating;
        const leftValue = starIndex * 2 - 1;  
        const rightValue = starIndex * 2;    

        if (currentRating >= rightValue) {
            return 'full'; // Both halves filled
        } else if (currentRating >= leftValue) {
            return 'half'; // Only left half filled
        }
        return 'empty';
    };

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((starIndex) => {
                const leftValue = starIndex * 2 - 1;
                const rightValue = starIndex * 2;
                const fillType = getStarFill(starIndex);

                return (
                    <div
                        key={starIndex}
                        className="relative cursor-pointer"
                        onMouseLeave={handleMouseLeave}
                    >
                        <svg
                            className="w-8 h-8"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Background (empty star) */}
                            <path
                                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                fill={fillType === 'empty' ? '#374151' : 'none'}
                                stroke="#9CA3AF"
                                strokeWidth="1"
                            />

                            {/* Left half */}
                            <defs>
                                <clipPath id={`clip-left-${starIndex}`}>
                                    <rect x="0" y="0" width="12" height="24" />
                                </clipPath>
                            </defs>
                            {(fillType === 'half' || fillType === 'full') && (
                                <path
                                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                    fill="#FBBF24"
                                    clipPath={`url(#clip-left-${starIndex})`}
                                />
                            )}

                            {/* Right half */}
                            <defs>
                                <clipPath id={`clip-right-${starIndex}`}>
                                    <rect x="12" y="0" width="12" height="24" />
                                </clipPath>
                            </defs>
                            {fillType === 'full' && (
                                <path
                                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                    fill="#FBBF24"
                                    clipPath={`url(#clip-right-${starIndex})`}
                                />
                            )}
                        </svg>

                        {/* Invisible click areas for left and right halves */}
                        {!disabled && (
                            <>
                                {/* Left half clickable area */}
                                <div
                                    className="absolute top-0 left-0 w-1/2 h-full"
                                    onClick={() => handleClick(leftValue)}
                                    onMouseEnter={() => handleMouseEnter(leftValue)}
                                />
                                {/* Right half clickable area */}
                                <div
                                    className="absolute top-0 right-0 w-1/2 h-full"
                                    onClick={() => handleClick(rightValue)}
                                    onMouseEnter={() => handleMouseEnter(rightValue)}
                                />
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default StarRating;
