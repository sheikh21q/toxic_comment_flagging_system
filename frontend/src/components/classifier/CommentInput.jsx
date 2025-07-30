import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EXAMPLE_COMMENTS = [
    {
        text: "This is a wonderful day and I hope everyone has a great time!",
        type: "positive"
    },
    {
        text: "I disagree with your opinion, but I respect your right to have it.",
        type: "neutral"
    },
    {
        text: "You are absolutely stupid and worthless, nobody likes you!",
        type: "toxic"
    },
    {
        text: "Thank you for sharing this helpful information with the community.",
        type: "positive"
    }
];

export default function CommentInput({ onClassify, isProcessing }) {
    const [comment, setComment] = useState('');
    const [selectedExample, setSelectedExample] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim() || isProcessing) return;
        
        await onClassify(comment.trim());
    };

    const handleExampleClick = (exampleComment) => {
        setComment(exampleComment.text);
        setSelectedExample(exampleComment);
    };

    const handleClear = () => {
        setComment('');
        setSelectedExample(null);
    };

    return (
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-light text-gray-800">
                    Analyze Comment
                </CardTitle>
                <p className="text-gray-500 text-sm font-light">
                    Enter a comment below to check if it contains toxic content
                </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Type or paste a comment here..."
                            className="min-h-[120px] resize-none border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-700"
                            maxLength={512}
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                            {comment.length}/512
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="submit"
                            disabled={!comment.trim() || isProcessing}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg transition-all duration-200 disabled:opacity-50"
                        >
                            <AnimatePresence mode="wait">
                                {isProcessing ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Analyzing...
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="send"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        Classify Comment
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                        
                        {comment && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClear}
                                className="border-gray-200 hover:bg-gray-50"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </form>

                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700">Try these examples:</h3>
                    <div className="grid gap-2">
                        {EXAMPLE_COMMENTS.map((example, index) => (
                            <motion.button
                                key={index}
                                onClick={() => handleExampleClick(example)}
                                className={`text-left p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                                    selectedExample === example
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-sm text-gray-700 leading-relaxed flex-1">
                                        "{example.text}"
                                    </p>
                                    <Badge 
                                        variant="secondary"
                                        className={`text-xs shrink-0 ${
                                            example.type === 'positive' ? 'bg-green-100 text-green-700' :
                                            example.type === 'toxic' ? 'bg-red-100 text-red-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        {example.type}
                                    </Badge>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}