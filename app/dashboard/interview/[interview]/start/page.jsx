"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import QustionsSection from './_components/QustionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';

const StartInterview = ({ params }) => {
    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    useEffect(() => {
        console.log(params.interview);
        GetInterviewDetails();
    }, [])

    const GetInterviewDetails = async () => {
        try {
            const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interview));
            console.log(result);

            if (result.length > 0) {
                setInterviewData(result[0]);

                // Parse the JSON string into an object
                const jsonMockResp = JSON.parse(result[0].jsonMockResp);
                setMockInterviewQuestion(jsonMockResp);

                // Log the parsed object properly
                console.log("Parsed Response:", jsonMockResp);
            } else {
                console.log("No interview data found");
            }
        } catch (error) {
            console.error("Error fetching interview details:", error);
        }
    };
    return (
        <div>
            <div className=' mb-8 grid grid-cols-1 md:grid-cols-2 gap-10'>
                <QustionsSection mockInterviewQuestion={mockInterviewQuestion?.interview_questions} activeQuestionIndex={activeQuestionIndex}/>

                <RecordAnswerSection interviewData={interviewData} mockInterviewQuestion={mockInterviewQuestion?.interview_questions} activeQuestionIndex={activeQuestionIndex}/>
            </div>
        </div>
    )
}

export default StartInterview