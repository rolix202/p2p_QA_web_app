import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    ArrowUpIcon,
    ArrowDownIcon,
    CheckCircleIcon,
    UserCircleIcon,
    PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { useParams } from "react-router-dom";
import defaultAvatar from "../assets/default-avatar.png";
import { toast } from "react-toastify";

const SingleQuestionPage = () => {
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newAnswer, setNewAnswer] = useState("");

    const { id } = useParams();

    const backendEndpoint = import.meta.env.VITE_BACKEND_ENDPOINT;

    // console.log(backendEndpoint);
    

    const fetchQuestion = async () => {
        try {
            const { data } = await axios.get(`${backendEndpoint}/api/v1/question/${id}`);
            setQuestion(data.data.question);
            setAnswers(data.data.answers);
            setLoading(false);
        } catch (error) {
            toast.error(error.response?.data || error.response?.data?.message || error.message || "Error fetching question");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, [id]);

    const handleVote = async (answerId, type) => {
        try {
            const { data } = await axios.post(`/api/answers/${answerId}/vote`, { type });
            setAnswers((prevAnswers) =>
                prevAnswers.map((answer) =>
                    answer._id === answerId
                        ? { ...answer, votes: data.updatedVotes }
                        : answer
                )
            );
        } catch (error) {
            console.error("Error voting:", error);
        }
    };

    const handleAddAnswer = async () => {
        if (!newAnswer.trim()) return;
        try {
            const response = await axios.post(`${backendEndpoint}/api/v1/question/${id}/answer`, {
                questionId: question._id,
                answerBody: newAnswer,
            }, { withCredentials: true });
            toast.success(response.data.message || "Answer posted successfully.");
            setNewAnswer("");
            fetchQuestion(); // Re-fetch the data
        } catch (error) {
            toast.error(error.response?.data || error.response?.data?.message || error.message || "Error posting answer. Try again!");
            // console.error("Error adding answer:", error);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="bg-gray-100 min-h-screen pb-16">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-green-500 to-green-700 text-white py-16">
                <div
                    className={`relative z-10 max-w-5xl mx-auto px-6 flex flex-col ${question.photo_upload?.[0]?.image_secure_url ? "md:flex-row items-center" : "text-center"
                        }`}
                >
                    {/* Text Content */}
                    <div className={`space-y-4 ${question.photo_upload?.[0]?.image_secure_url ? "md:w-1/2" : ""}`}>
                        <h1 className="text-5xl font-extrabold leading-tight">{question.title}</h1>
                        <p className="text-xl font-light text-gray-200">{question.description}</p>
                        <div className={`flex items-center justify-center ${question.photo_upload?.[0]?.image_secure_url ? "md:justify-start" : ""} text-sm space-x-4 mt-4`}>
                            <div className="flex items-center space-x-2">
                                <UserCircleIcon className="w-6 h-6 text-gray-300" />
                                <span>{`${question.postedBy.firstName} ${question.postedBy.lastName}`}</span>
                            </div>
                            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                        </div>

                        {/* Community ID and Points */}
                        <div className={`flex items-center justify-center ${question.photo_upload?.[0]?.image_secure_url ? "md:justify-start" : ""} space-x-4 mt-4`}>
                            {/* Community ID Badge */}
                            <div className="flex items-center space-x-2 bg-yellow-300 text-yellow-700 py-1 px-3 rounded-full shadow-md hover:bg-yellow-400 cursor-pointer transform transition duration-200 ease-in-out">
                                <span className="font-semibold text-sm">Community ID:</span>
                                <span className="text-sm">{question.postedBy.communityID}</span>
                            </div>

                            {/* Points Badge */}
                            <div className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-1 px-3 rounded-full shadow-md hover:from-indigo-600 hover:to-blue-600 cursor-pointer transform transition duration-200 ease-in-out">
                                <span className="font-semibold text-sm">Points:</span>
                                <span className="text-sm">{question.postedBy.points || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Question Image */}
                    {question.photo_upload?.[0]?.image_secure_url && (
                        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
                            <img
                                src={question.photo_upload[0].image_secure_url}
                                alt="Question Visual"
                                className="w-full max-w-md rounded-lg shadow-lg transform transition duration-500 hover:scale-105"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Answers Section */}
            <div className="max-w-5xl mx-auto mt-8 space-y-6 px-6">
                {answers.map((answer) => (
                    <div
                        key={answer._id}
                        className="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition"
                    >
                        <div className="flex items-center mb-4">
                            <img
                                src={answer.postedBy.avatar || defaultAvatar}
                                alt="User Avatar"
                                className="w-12 h-12 rounded-full border-2 border-gray-200"
                            />
                            <div className="ml-3">
                                <h3 className="font-semibold flex items-center text-gray-800">
                                    {`${answer.postedBy.firstName} ${answer.postedBy.lastName}`}
                                    {answer.postedBy.badges && (
                                        <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full flex items-center space-x-1">
                                            <CheckCircleIcon className="w-4 h-4" />
                                            <span>{answer.postedBy.communityID}</span>
                                        </span>
                                    )}
                                </h3>
                                <p className="text-xs text-gray-500">{new Date(answer.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        <p className="text-gray-800 mb-4">{answer.answerBody}</p>
                        {answer.image && (
                            <div className="mt-4">
                                <img
                                    src={answer.image}
                                    alt="Answer visual"
                                    className="rounded-lg shadow-md w-full max-h-72 object-cover"
                                />
                            </div>
                        )}
                        <div className="flex items-center space-x-4 mt-4">
                            <button
                                className="flex items-center text-green-600 hover:text-green-800"
                                onClick={() => handleVote(answer._id, "upvote")}
                            >
                                <ArrowUpIcon className="w-5 h-5 mr-1" />
                                <span>{answer.votes.upvotes.length}</span>
                            </button>
                            <button
                                className="flex items-center text-red-600 hover:text-red-800"
                                onClick={() => handleVote(answer._id, "downvote")}
                            >
                                <ArrowDownIcon className="w-5 h-5 mr-1" />
                                <span>{answer.votes.downvotes.length}</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Answer Section */}
            <div className="max-w-5xl mx-auto mt-12 bg-white p-8 shadow-lg rounded-lg px-6">
                <h2 className="text-lg font-semibold mb-4">Your Answer</h2>
                <textarea
                    rows="5"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Write your answer here..."
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <button
                    onClick={handleAddAnswer}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg flex items-center space-x-2 hover:from-blue-600 hover:to-blue-700"
                >
                    <PencilSquareIcon className="w-5 h-5" />
                    <span>Submit</span>
                </button>
            </div>
        </div>
    );
};

export default SingleQuestionPage;
