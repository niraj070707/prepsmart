"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import InterviewItemCard from './InterviewItemCard';

const InterviewList = () => {
    const [interviewList, setInterviewList] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        if (user) GetInterviewList();
    }, [user]);

    const GetInterviewList = async () => {
        try {
            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.createdBy, user?.primaryEmailAddress.emailAddress))
                .orderBy(desc(MockInterview.id));

            console.log("Fetched Interviews:", result);
            setInterviewList(result);
        } catch (error) {
            console.error("Error fetching interview list:", error);
        }
    };

    return (
        <div>
            <h2 className="mt-10 font-medium text-xl">Previous Mock Interview</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
                {interviewList.length > 0 ? (
                    interviewList.map((interview, index) => (
                        <InterviewItemCard interview={interview} key={index} />
                    ))
                ) : (
                    <p>No interviews found.</p>
                )}
            </div>
        </div>
    );
};

export default InterviewList;
