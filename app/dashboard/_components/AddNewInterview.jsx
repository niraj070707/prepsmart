"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; // Correct import for Input
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/utils/db";
import { chatSession } from "@/utils/geminiAiModel";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { LoaderCircle } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';


const AddNewInterview = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [noOfQuestions, setNoOfQuestions] = useState(3);
    const [jobExperience, setJobExperience] = useState(0);
    const [loading, setLoading] = useState(false);
    const [jsonResponce, setJsonResponse] = useState('');
    const user = useUser();
    const router = useRouter();
    console.log(user?.user?.primaryEmailAddress?.emailAddress);

    const onSubmit = async (ev) => {
        ev.preventDefault();
        setLoading(true);

        try {
            // Log input values for debugging
            console.log({ jobPosition, jobDescription, jobExperience, noOfQuestions});

            // Construct the input prompt
            const inputPrompt = `Job position: ${jobPosition} Job description: ${jobDescription} Job experience: ${jobExperience} years, Using this information give us ${noOfQuestions} interview questions along with answers and return the result in JSON format. Also, make sure it will parse easily in JSON. And give respone as array of object as each object has keys questions, answers and other if needed,please check on your side that it easily parsed`;
            console.log('InputPrompt:', inputPrompt);

            // Send the prompt to the chat session
            const result = await chatSession.sendMessage(inputPrompt);
            const mockJsonResponse = result.response.text().replace(/```json|```/g, '').trim();

            // Attempt to parse the JSON response
            try {
                const parsedResponse = JSON.parse(mockJsonResponse);
                console.log("Parsed Response:", parsedResponse);

                // Set the JSON response in state
                setJsonResponse(mockJsonResponse);

                // If the response is valid, save it to the database
                if (mockJsonResponse) {
                    const response = await db.insert(MockInterview).values({
                        mockId: uuidv4(),
                        noOfQuestions: noOfQuestions,
                        jobPosition: jobPosition,
                        jobDesc: jobDescription,
                        jobExperience: jobExperience,
                        jsonMockResp: mockJsonResponse,
                        createdBy: user?.user?.primaryEmailAddress?.emailAddress,
                        createdAt: moment().format('DD-MM-yyyy'),
                    }).returning({ mockId: MockInterview.mockId });

                    console.log('Database Response:', response);
                    router.push(`/dashboard/interview/${response[0].mockId}`);
                } else {
                    console.log('No JSON response received');
                }
            } catch (parseError) {
                console.error("Failed to parse JSON:", parseError);
                console.error("JSON String:", mockJsonResponse);
                throw new Error("Failed to parse the response as JSON.");
            }
        } catch (error) {
            console.error("Error during onSubmit:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* DialogTrigger is used to open the dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                    <div
                        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
                        onClick={() => setOpenDialog(true)}
                    >
                        <h2 className="font-semibold text-lg text-center">+ Add new</h2>
                    </div>
                </DialogTrigger>

                {/* DialogContent contains the dialog's content */}
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-bold text-2xl">Tell us more about your job interviewing</DialogTitle>
                        <form onSubmit={onSubmit}>
                            <div className="text-sm text-muted-foreground">
                                <h2>
                                    Add details about your job position/role, job description, and
                                    years of experience
                                </h2>
                                <div className="mt-7 my-3 space-y-4">
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700">Job Role/Position</Label>
                                        <Input onChange={(ev) => setJobPosition(ev.target.value)} placeholder="Ex. Full Stack Developer" required />
                                    </div>
                                </div>
                                <div className=" my-3 space-y-4">
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700">Job Description/Tech Stack (In short)</Label>
                                        <Textarea onChange={(ev) => setJobDescription(ev.target.value)} placeholder="Ex. React, Angular, NodeJs, Postgresql" required />
                                    </div>
                                </div>
                                <div className=" my-3 space-y-4">
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700">Years of experience</Label>
                                        <Input onChange={(ev) => setJobExperience(ev.target.value)} placeholder="Ex. 2" type="number" required max={75} />
                                    </div>
                                </div>
                                <div className=" my-3 space-y-4">
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700">Number of Questions</Label>
                                        <Input onChange={(ev) => setNoOfQuestions(ev.target.value)} placeholder="Ex. 3" type="number" required max={10} />
                                    </div>
                                </div>
                                <div className="flex gap-5 justify-end mt-6">
                                    <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                                        Close
                                    </Button>
                                    <Button type="submit" disabled={loading}>
                                        {loading ?
                                            <>
                                                <LoaderCircle className="animate-spin" />'Generating From AI'
                                            </> : 'Start Interview'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddNewInterview;