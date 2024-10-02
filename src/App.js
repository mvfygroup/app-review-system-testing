import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

// Sample reviews
const sampleReviews = [
  { rating: 5, reviewText: 'Amazing app! Really helped me.', status: 'approved' },
  { rating: 4, reviewText: 'Great functionality but needs more features.', status: 'approved' },
  { rating: 3, reviewText: 'Average experience.', status: 'pending' },
  { rating: 2, reviewText: 'Not user-friendly at all.', status: 'rejected' },
  { rating: 5, reviewText: 'I love this app! Highly recommend!', status: 'approved' },
  { rating: 4, reviewText: 'Very useful, but could be improved.', status: 'approved' },
  { rating: 1, reviewText: 'Terrible experience, wouldn’t use again.', status: 'rejected' },
  { rating: 3, reviewText: 'It’s okay, does the job.', status: 'pending' },
  { rating: 5, reviewText: 'Fantastic! Exceeded my expectations.', status: 'approved' },
  { rating: 4, reviewText: 'Good app, I use it daily.', status: 'approved' },
  { rating: 2, reviewText: 'Not as described, disappointed.', status: 'rejected' },
  { rating: 3, reviewText: 'Average, nothing special.', status: 'pending' },
  { rating: 5, reviewText: 'Excellent service and support!', status: 'approved' },
  { rating: 4, reviewText: 'Works well, but some bugs.', status: 'approved' },
  { rating: 1, reviewText: 'Worst app ever, don’t download!', status: 'rejected' },
];

const App = () => {
  const [currentPage, setCurrentPage] = useState('rating');
  const [reviews, setReviews] = useState(sampleReviews);
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [adminFilter, setAdminFilter] = useState('all');
  const [timer, setTimer] = useState(null);

  const togglePage = () => {
    setCurrentPage(currentPage === 'rating' ? 'admin' : 'rating');
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (newRating > 0) {
      const newReview = {
        rating: newRating,
        reviewText: newReviewText,
        status: 'pending',
      };
      setReviews((prevReviews) => [...prevReviews, newReview]);
      setNewReviewText('');
      setNewRating(0);
      startAutoApprovalTimer(newReview);
    }
  };

  const startAutoApprovalTimer = (review) => {
    const timerId = setTimeout(() => {
      setReviews((prevReviews) =>
        prevReviews.map((r) =>
          r.reviewText === review.reviewText ? { ...r, status: 'approved' } : r
        )
      );
    }, 75000); // 75 seconds

    setTimer(timerId);
  };

  const handleApproveReview = (reviewText) => {
    setReviews((prevReviews) =>
      prevReviews.map((r) =>
        r.reviewText === reviewText ? { ...r, status: 'approved' } : r
      )
    );
    clearTimeout(timer);
  };

  const handleRejectReview = (reviewText) => {
    setReviews((prevReviews) =>
      prevReviews.map((r) =>
        r.reviewText === reviewText ? { ...r, status: 'rejected' } : r
      )
    );
    clearTimeout(timer);
  };

  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;

  const filteredReviews = () => {
    if (adminFilter === 'all') return reviews;
    return reviews.filter((review) => review.status === adminFilter);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">MVfy App Review System</h1>
      <button
        onClick={togglePage}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105 mb-4"
      >
        Switch to {currentPage === 'rating' ? 'Admin' : 'Rating'} Page
      </button>

      {currentPage === 'rating' ? (
        <div className="text-center bg-white p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-3xl font-bold mb-4">Average Rating: {averageRating.toFixed(1)} ★</h2>
          <h3 className="text-lg text-gray-600">Total Ratings: {reviews.length}</h3>
          <form onSubmit={handleSubmitReview} className="mt-4">
            <div className="flex items-center justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-8 w-8 cursor-pointer ${
                    star <= newRating ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                  onClick={() => setNewRating(star)}
                />
              ))}
            </div>
            <textarea
              className="w-full p-2 border-2 border-gray-300 rounded-lg mb-4"
              rows="4"
              placeholder="Leave a review (optional)"
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105">
              Submit Review
            </button>
          </form>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2">Reviews:</h2>
            <div className="flex flex-col">
              {reviews.map((review, index) => (
                review.status === 'approved' && (
                  <div key={index} className="border p-4 m-2 rounded-lg bg-green-200">
                    <div className="flex items-center mb-2">
                      {[...Array(review.rating)].map((_, i) => (
                        <StarIcon key={i} className="h-6 w-6 text-yellow-500" />
                      ))}
                      {[...Array(5 - review.rating)].map((_, i) => (
                        <StarIcon key={i} className="h-6 w-6 text-gray-300" />
                      ))}
                    </div>
                    <p className="text-gray-800">{review.reviewText}</p>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center bg-white p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-3xl font-bold mb-4">Admin Page</h2>
          <div className="flex justify-center space-x-4 mb-4">
            <button onClick={() => setAdminFilter('all')} className="bg-blue-600 text-white px-4 py-2 rounded-lg">All Reviews</button>
            <button onClick={() => setAdminFilter('pending')} className="bg-yellow-500 text-white px-4 py-2 rounded-lg">Pending Reviews</button>
            <button onClick={() => setAdminFilter('approved')} className="bg-green-600 text-white px-4 py-2 rounded-lg">Approved Reviews</button>
            <button onClick={() => setAdminFilter('rejected')} className="bg-red-600 text-white px-4 py-2 rounded-lg">Rejected Reviews</button>
          </div>
          <div className="flex flex-col">
            {filteredReviews().map((review, index) => (
              <div key={index} className={`border p-4 m-2 rounded-lg ${review.status === 'approved' ? 'bg-green-100' : review.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                <div className="flex items-center mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-6 w-6 text-yellow-500" />
                  ))}
                  {[...Array(5 - review.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-6 w-6 text-gray-300" />
                  ))}
                </div>
                <p className="text-gray-800">{review.reviewText}</p>
                {review.status === 'pending' && (
                  <div className="mt-2">
                    <button onClick={() => handleApproveReview(review.reviewText)} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Approve</button>
                    <button onClick={() => handleRejectReview(review.reviewText)} className="bg-red-500 text-white px-2 py-1 rounded">Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
