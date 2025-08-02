import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
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


const classifyComment = async (comment) => {
    setIsProcessing(true);
    setError(null);
    const startTime = Date.now();

    try {
        const res = await axios.post('http://localhost:4000/api/classify', { comment });

        const processingTime = Date.now() - startTime;

        const result = {
            comment,
            result: res.data.prediction === 1 ? 'TOXIC' : 'NON-TOXIC',
            confidence: res.data.confidence || 1.0, 
            processing_time: processingTime,
            created_date: new Date().toISOString() 
        };

        setCurrentResult(result);
        setHistory(prev => [result, ...prev]);

    } catch (err) {
        console.error("Classification error:", err);
        setError("Failed to classify comment. Please try again.");
    } finally {
        setIsProcessing(false);
    }
};

    const clearHistory = async () => {
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