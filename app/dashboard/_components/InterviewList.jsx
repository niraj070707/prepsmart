"use client";
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import InterviewItemCard from './InterviewItemCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const InterviewList = () => {
    const [interviewList, setInterviewList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useUser();

    useEffect(() => {
        if (user) GetInterviewList();
    }, [user]);

    const GetInterviewList = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(MockInterview.id));

            setInterviewList(result);
        } catch (error) {
            console.error("Error fetching interview list:", error);
            setError("Failed to load interviews. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="mt-10">
                <h2 className="font-medium text-xl mb-4">Previous Mock Interviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(3)].map((_, index) => (
                        <Skeleton key={index} className="h-48 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-10">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-medium text-xl">Previous Mock Interviews</h2>
                <span className="text-sm text-muted-foreground">
                    {interviewList.length} interview{interviewList.length !== 1 ? 's' : ''}
                </span>
            </div>
            
            {interviewList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {interviewList.map((interview) => (
                        <InterviewItemCard 
                            interview={interview} 
                            key={interview.mockId} 
                            onDelete={() => GetInterviewList()}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-14 border rounded-lg">
                    <p className="text-muted-foreground">No interviews found</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Create your first mock interview to get started
                    </p>
                </div>
            )}
        </div>
    );
};

export default InterviewList;