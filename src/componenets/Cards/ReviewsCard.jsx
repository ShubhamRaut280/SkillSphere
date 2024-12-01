import React, { useEffect, useState } from "react";
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc, getFirestore, updateDoc, query, getDocs, collection, where } from 'firebase/firestore';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const ReviewsCard = ({ freelancerId }) => {
  const [reviewsData, setReviewsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const ratingDocRef = doc(db, "ratings", freelancerId);
        const ratingDoc = await getDoc(ratingDocRef);

        if (ratingDoc.exists()) {
          setReviewsData(ratingDoc.data());
        } else {
          setReviewsData({ avg_rating: 0, ratings: [] }); // Default if no reviews
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [freelancerId]);

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  return (
    <div className="p-6 border rounded-[30px] shadow-lg bg-white">
    {/* Average Rating */}
    <div className="flex items-center gap-2 mb-4">
      <h3 className="text-lg font-bold text-gray-800">Average Rating:</h3>
      <div className="flex items-center gap-1">
        {[...Array(Math.round(reviewsData.avg_rating))].map((_, index) => (
          <FontAwesomeIcon
            key={index}
            icon={faStar}
            className="text-yellow-400"
          />
        ))}
        <span className="text-gray-600">({reviewsData.avg_rating.toFixed(1)})</span>
      </div>
    </div>
  
    {/* Individual Reviews */}
    {reviewsData.ratings.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviewsData.ratings.map((review, index) => (
          <div
            key={index}
            className="p-4 border rounded-md bg-gray-50 shadow-sm"
          >
            <p className="text-sm text-gray-800 mb-2">
              <strong>Rating:</strong> {review.rating}/5
            </p>
            <p className="text-sm text-gray-600">
              <strong>Review:</strong> {review.review}
            </p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-500">No reviews yet.</p>
    )}
  </div>
  
  );
};

export default ReviewsCard;
