import React, { useState, useEffect } from 'react';
import { Classification } from "@/entities/Classification";
import { InvokeLLM } from "@/integrations/Core";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

import CommentInput from "../components/classifier/CommentInput";
import ResultDisplay from "../components/classifier/ResultDisplay";
import HistoryList from "../components/classifier/HistoryList";

export default function ClassifierPage() {
    const [currentResult, setCurrentResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const data = await Classification.list('-created_date', 10);
            setHistory(data);
        } catch (err) {
            console.error("Error loading history:", err);
        }
    };

    const classifyComment = async (comment) => {
        setIsProcessing(true);
        setError(null);
        const startTime = Date.now();

        try {
            // Use AI to classify the comment
            const response = await InvokeLLM({
                prompt: `Analyze the following comment for toxicity. Consider content that is:
                - Hateful, abusive, or harassing
                - Contains threats or incites violence  
                - Uses profanity or vulgar language
                - Is discriminatory based on race, gender, religion, etc.
                - Is severely insulting or demeaning

                Comment to analyze: "${comment}"

                Provide a toxicity classification with confidence score.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        is_toxic: {
                            type: "boolean",
                            description: "True if the comment is toxic, false otherwise"
                        },
                        confidence: {
                            type: "number",
                            description: "Confidence score between 0 and 1"
                        },
                        reasoning: {
                            type: "string",
                            description: "Brief explanation of the classification"
                        }
                    }
                }
            });

            const processingTime = Date.now() - startTime;
            
            const result = {
                comment,
                result: response.is_toxic ? 'TOXIC' : 'NON-TOXIC',
                confidence: response.confidence,
                processing_time: processingTime
            };

            // Save to database
            const savedResult = await Classification.create(result);
            
            setCurrentResult(savedResult);
            await loadHistory(); // Refresh history

        } catch (err) {
            console.error("Classification error:", err);
            setError("Failed to classify comment. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const clearHistory = async () => {
        // Note: We can only clear the UI history, not delete from database
        // Users can delete records through the workspace if needed
        setHistory([]);
        setCurrentResult(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <motion.div 
                    className="text-center space-y-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-light text-gray-800 tracking-tight">
                        Toxic Comment
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-medium">
                            Classifier
                        </span>
                    </h1>
                    <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
                        Advanced AI-powered tool to detect toxic content in comments and text.
                        Get instant classifications with confidence scores.
                    </p>
                </motion.div>

                {/* Error Alert */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Alert variant="destructive" className="border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Input */}
                    <motion.div 
                        className="space-y-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <CommentInput 
                            onClassify={classifyComment}
                            isProcessing={isProcessing}
                        />
                        
                        {currentResult && (
                            <ResultDisplay result={currentResult} />
                        )}
                    </motion.div>

                    {/* Right Column - History */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <HistoryList 
                            history={history}
                            onClearHistory={clearHistory}
                        />
                    </motion.div>
                </div>

                {/* Footer */}
                <motion.div 
                    className="text-center pt-8 border-t border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <p className="text-sm text-gray-500 font-light">
                        Classifications are AI-generated and may not be 100% accurate. 
                        Use as a moderation aid alongside human review.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}