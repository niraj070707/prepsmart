"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import QustionsSection from './_components/QustionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const StartInterview = ({ params }) => {
    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState({});
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [interviewQuestion, setInterviewQuestion] = useState([]);

    useEffect(() => {
        if (params.interview) {
            GetInterviewDetails();
        }
    }, [params.interview]);  // Ensuring the effect runs when `params.interview` changes

    const GetQuestions = () => {
        if (Object.keys(mockInterviewQuestion).length > 0) {
            const firstKey = Object.keys(mockInterviewQuestion)[0];
            return mockInterviewQuestion[firstKey];
        }
        return [];
    }

    useEffect(() => {
        console.log("Parsed Response:", mockInterviewQuestion);
        console.log("Hello:", GetQuestions());
        const InterviewQuestion = GetQuestions();
        setInterviewQuestion(InterviewQuestion);

    }, [mockInterviewQuestion]); // Log only after data is set

    const GetInterviewDetails = async () => {
        try {
            const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interview));

            if (result.length > 0) {
                setInterviewData(result[0]);

                // Parse the JSON response properly
                const jsonMockResp = JSON.parse(result[0].jsonMockResp);
                setMockInterviewQuestion(jsonMockResp);
            } else {
                console.log("No interview data found");
            }
        } catch (error) {
            console.error("Error fetching interview details:", error);
        }
    };

    return (
        <div>
            <div className='mb-8 grid grid-cols-1 md:grid-cols-2 gap-10'>
                <QustionsSection
                    mockInterviewQuestion={interviewQuestion}  // Fixed key name
                    activeQuestionIndex={activeQuestionIndex}
                />
                <RecordAnswerSection
                    interviewData={interviewData}
                    mockInterviewQuestion={interviewQuestion}  // Fixed key name
                    activeQuestionIndex={activeQuestionIndex}
                />
            </div>
            <div className='mb-5 gap-7 flex justify-end'>
                {activeQuestionIndex > 0 && <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>Previous Question</Button>}
                {activeQuestionIndex !== (mockInterviewQuestion?.interviewQuestions?.length - 1) && (
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>Next Question</Button>
                )}
                {activeQuestionIndex === (mockInterviewQuestion?.interviewQuestions?.length - 1) && (
                    <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
                        <Button>End Interview</Button>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default StartInterview;
