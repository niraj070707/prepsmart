"use client";
import { db } from "@/utils/db";
import { UserAnswer, MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Badge } from "@/components/ui/badge";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#A05195'];

export default function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [mockInterview, setMockInterview] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [emotionAnalysis, setEmotionAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feedbackRes, interviewRes] = await Promise.all([
          getFeedback(),
          getMockInterviewDetails()
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getMockInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interview))
        .limit(1);

      if (result.length > 0) {
        setMockInterview(result[0]);
      }
    } catch (error) {
      console.error("Failed to fetch mock interview details:", error);
    }
  };

  const getFeedback = async () => {
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, params.interview))
        .orderBy(UserAnswer.id);

      setFeedbackList(result);

      if (result.length > 0) {
        // Calculate average rating
        const totalRating = result.reduce((sum, item) => sum + (Number(item.rating) || 0), 0);
        setAverageRating(parseFloat((totalRating / result.length).toFixed(1)));

        // Get the first valid emotion feedback (since they're all the same)
        const answerWithEmotion = result.find(item => item.emotionFeedback);
        if (answerWithEmotion?.emotionFeedback) {
          try {
            const parsed = JSON.parse(answerWithEmotion.emotionFeedback);
            if (parsed.success) {
              setEmotionAnalysis(parsed);
            }
          } catch (e) {
            console.error("Failed to parse emotion feedback", e);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
    }
  };

  const getEmotionChartData = () => {
    if (!emotionAnalysis?.insights?.emotion_distribution) return [];

    return Object.entries(emotionAnalysis.insights.emotion_distribution)
      .map(([name, value]) => ({
        name,
        value
      }))
      .sort((a, b) => b.value - a.value); // Sort by value descending
  };

  const getSuccessRate = () => {
    if (!emotionAnalysis?.statistics) return null;
    const { total_images, successful_analyses } = emotionAnalysis.statistics;
    return total_images > 0 ? (successful_analyses / total_images * 100).toFixed(0) : null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mb-20 max-w-4xl mx-auto">
      <div className="p-6 md:p-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-green-600">Interview Feedback Report</h2>
            {mockInterview && (
              <div className="mt-2 space-y-1">
                <p className="text-gray-600">
                  <span className="font-medium">Position:</span> {mockInterview.jobPosition}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Experience Level:</span> {mockInterview.jobExperience}
                </p>
              </div>
            )}
          </div>
          <Badge className="text-sm bg-transparent text-gray-200">
            {new Date().toLocaleDateString()}
          </Badge>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Performance Summary</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Questions Answered</p>
              <p className="text-2xl text-blue-600 font-bold">{feedbackList.length}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Average Rating</p>
              <p className={`text-2xl font-bold ${averageRating && averageRating < 5 ? "text-red-500" : "text-green-600"}`}>
                {averageRating !== null ? `${averageRating}/10` : "N/A"}
              </p>
            </div>

            {emotionAnalysis?.statistics && (
              <div className="bg-purple-50 text-purple-600 p-4 rounded-lg">
                <p className="text-sm">Analysis Coverage</p>
                <p className="text-2xl font-bold">{getSuccessRate()}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {emotionAnalysis.statistics.successful_analyses} of {emotionAnalysis.statistics.total_images} analyzed
                </p>
              </div>
            )}
          </div>

          {/* Emotion Summary */}
          {emotionAnalysis && (
            <div className=" text-gray-700 border-t pt-4">
              <h4 className="font-mono font-semibold text-lg mb-3">Emotion Analysis Summary</h4>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getEmotionChartData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {getEmotionChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="md:w-1/2 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Dominant Emotion</h4>
                    <p className="text-lg font-semibold capitalize">
                      {emotionAnalysis.insights.dominant_emotion.toLowerCase()}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700">Confidence Level</h4>
                    <p className="text-lg font-semibold">
                      {(emotionAnalysis.insights.confidence_average * 100).toFixed(1)}%
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700">Key Improvement Tip</h4>
                    <p className="text-md font-sans text-orange-400 mt-1">
                      {emotionAnalysis.insights.general_tip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Question Feedback */}
        <div className="bg-white text-gray-700 rounded-lg shadow p-6">
          <h3 className="text-xl text-gray-700 font-mono font-semibold mb-4">Question-by-Question Feedback</h3>
          <p className="text-sm text-gray-500 mb-6">
            Review each question, your response, and suggestions for improvement
          </p>

          <div className="space-y-6">
            {feedbackList.map((item, index) => {
              const emotionData = item.emotionFeedback
                ? JSON.parse(item.emotionFeedback)
                : null;

              return (
                <Collapsible key={index} className="border rounded-lg overflow-hidden">
                  <CollapsibleTrigger className="w-full p-4 bg-gray-50 hover:bg-gray-100 text-left flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">Question {index + 1}</span>
                      {item.rating && (
                        <Badge
                          variant={parseInt(item.rating) >= 7 ? "default" : "destructive"}
                          className="px-2 py-0.5 text-xs"
                        >
                          {item.rating}/10
                        </Badge>
                      )}
                      {emotionData?.insights && (
                        <Badge variant="outline" className="px-2 py-0.5 text-xs capitalize">
                          {emotionData.insights.dominant_emotion.toLowerCase()}
                        </Badge>
                      )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 text-gray-500" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Question</h4>
                      <p className="mt-1">{item.question}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-red-50 p-3 rounded">
                        <h4 className="text-sm font-medium text-red-600">Your Answer</h4>
                        <p className="mt-1 text-red-800">{item.userAnswer}</p>
                      </div>

                      <div className="bg-green-50 p-3 rounded">
                        <h4 className="text-sm font-medium text-green-600">Suggested Answer</h4>
                        <p className="mt-1 text-green-800">{item.correctAnswer}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded">
                      <h4 className="text-sm font-medium text-blue-600">Feedback</h4>
                      <p className="mt-1 text-blue-800">{item.feedback}</p>
                    </div>

                    {emotionData?.insights && (
                      <div className="bg-purple-50 p-3 rounded">
                        <h4 className="text-sm font-medium text-purple-600">Emotion Analysis</h4>
                        <div className="mt-2 space-y-2">
                          <p className="text-sm">
                            <span className="font-medium">Dominant Emotion:</span>{" "}
                            <span className="capitalize">
                              {emotionData.insights.dominant_emotion.toLowerCase()}
                            </span>
                          </p>
                          {emotionData.insights.general_tip && (
                            <p className="text-sm">
                              <span className="font-medium">Tip:</span> {emotionData.insights.general_tip}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={() => router.replace("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}