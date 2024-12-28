import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

const QuestionsFeed = () => {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);


  const backendEndpoint = import.meta.env.VITE_BACKEND_ENDPOINT;

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendEndpoint}/api/v1/question?page=${page}`,
        { withCredentials: true }
      );
      // Merge new questions without duplicates
      setQuestions((prev) => {
        const newQuestions = response.data.data;
        const uniqueQuestions = [
          ...prev,
          ...newQuestions.filter(
            (newQ) => !prev.some((prevQ) => prevQ._id === newQ._id)
          ),
        ];
        return uniqueQuestions;
      });
    } catch (error) {
      toast.error(error.response?.data || error.response?.data?.message || error.message || "Error fetching question");
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log("Fetching questions...");
    fetchQuestions();
  }, []);

  return (
    <section className="questions bg-gradient-to-b from-green-50 via-gray-50 to-green-100 py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-10">
          Discover Recent Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {questions.map((question) => (
            <div
              key={question._id}
              className="p-6 bg-white shadow-lg rounded-xl hover:shadow-xl transition transform hover:scale-105"
            >
              <Link to={`/question/${question._id}/detail`}>
                <h3 className="text-2xl font-bold text-green-700 truncate hover:underline">
                  {question.title}
                </h3>
              </Link>

              <p className="text-sm text-gray-500 mt-2">
                Posted by:{" "}
                <span className="font-semibold text-green-600">
                  {question.postedBy?.firstName} {question.postedBy?.lastName}
                </span>{" "}
                • {new Date(question.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mt-4">
                {question.description.length > 100
                  ? `${question.description.substring(0, 100)}...`
                  : question.description}
              </p>
              <div className="mt-3">
                <span className="text-sm inline-block bg-green-100 text-green-700 px-3 py-1 rounded-lg">
                  #{question.category}
                </span>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 bg-gradient-to-r from-green-500 to-green-700 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-md">
                    <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
                    <span>{question.answerCount || 0} Answers</span>
                  </div>
                </div>
                <Link
                  to={`/question/${question._id}/detail`}
                  className="text-blue-600 font-medium hover:text-blue-800 underline transition duration-300"
                >
                  View Details
                </Link>
              </div>

            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link to="/questions"

            className={`px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full shadow-md ${loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
              }`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More Questions"}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default QuestionsFeed;
