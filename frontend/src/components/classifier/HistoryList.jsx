import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, Trash2, AlertTriangle, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function HistoryList({ history, onClearHistory }) {
    if (!history || history.length === 0) {
        return (
            <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                    <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-light">
                        No classifications yet. Try analyzing some comments above.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-xl font-light text-gray-800">
                        <History className="w-5 h-5" />
                        Recent Classifications
                    </CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClearHistory}
                        className="text-gray-500 hover:text-red-600 border-gray-200"
                    >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Clear
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                <AnimatePresence>
                    {history.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 bg-white/60"
                        >
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex items-center gap-2">
                                    {item.result === 'TOXIC' ? (
                                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                                    ) : (
                                        <Shield className="w-4 h-4 text-green-500 shrink-0" />
                                    )}
                                    <Badge 
                                        className={`text-xs ${
                                            item.result === 'TOXIC' 
                                                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        }`}
                                    >
                                        {item.result}
                                    </Badge>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-medium text-gray-700">
                                        {item.confidence ? `${Math.round(item.confidence * 100)}%` : 'N/A'}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {item.created_date ? format(new Date(item.created_date), 'MMM d, HH:mm') : 'Now'}
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                                "{item.comment}"
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}