import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, Clock, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function ResultDisplay({ result }) {
    if (!result) return null;

    const isToxic = result.result === 'TOXIC';
const confidencePercentage = result.confidence ? Math.round(result.confidence * 100) : 100


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card className={`border-0 shadow-xl ${
                isToxic ? 'bg-gradient-to-br from-red-50 to-red-100/50' : 'bg-gradient-to-br from-green-50 to-green-100/50'
            }`}>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3">
                        {isToxic ? (
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        ) : (
                            <Shield className="w-6 h-6 text-green-600" />
                        )}
                        <span className="text-xl font-light">Classification Result</span>
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Main Result */}
                    <div className="text-center space-y-4">
                        <Badge 
                            className={`text-lg px-6 py-2 font-medium ${
                                isToxic 
                                    ? 'bg-red-600 text-white hover:bg-red-700' 
                                    : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                        >
                            {result.result}
                        </Badge>
                        
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>Confidence Level</span>
                                <span className="font-semibold">{confidencePercentage}%</span>
                            </div>
                            <Progress 
                                value={confidencePercentage} 
                                className={`h-3 ${
                                    isToxic ? '[&>*]:bg-red-500' : '[&>*]:bg-green-500'
                                }`}
                            />
                        </div>
                    </div>

                    {/* Comment Preview */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <MessageSquare className="w-4 h-4" />
                            Analyzed Comment
                        </div>
                        <div className="p-4 bg-white/60 rounded-lg border border-gray-200">
                            <p className="text-gray-700 leading-relaxed">
                                "{result.comment}"
                            </p>
                        </div>
                    </div>

                    {/* Processing Info */}
                    {result.processing_time && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-200">
                            <Clock className="w-3 h-3" />
                            <span>Processed in {result.processing_time}ms</span>
                        </div>
                    )}

                    {/* Interpretation */}
                    <div className={`p-4 rounded-lg ${
                        isToxic ? 'bg-red-100/50 border border-red-200' : 'bg-green-100/50 border border-green-200'
                    }`}>
                        <p className={`text-sm leading-relaxed ${
                            isToxic ? 'text-red-800' : 'text-green-800'
                        }`}>
                            {isToxic ? (
                                `This comment has been classified as toxic with ${confidencePercentage}% confidence. It may contain harmful, offensive, or inappropriate content.`
                            ) : (
                                `This comment has been classified as non-toxic with ${confidencePercentage}% confidence. It appears to be appropriate and safe content.`
                            )}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}