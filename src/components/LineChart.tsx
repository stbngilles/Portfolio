"use client";

import { motion } from "framer-motion";

const LineChart = () => {
    return (
        <div className="card w-full p-8 md:p-16 aspect-square flex items-center justify-center relative overflow-hidden">
            {/* Line Chart Visualization */}
            <svg className="w-full h-full" viewBox="0 0 500 300" preserveAspectRatio="xMidYMid meet">
                {/* Vertical lines at data points */}
                {[
                    { x: 60, y: 180 },
                    { x: 130, y: 140 },
                    { x: 200, y: 170 },
                    { x: 270, y: 100 },
                    { x: 340, y: 130 },
                    { x: 410, y: 70 }
                ].map((point, i) => (
                    <motion.line
                        key={`vline-${i}`}
                        x1={point.x}
                        y1={point.y}
                        x2={point.x}
                        y2="260"
                        stroke="rgba(59, 130, 246, 0.3)"
                        strokeWidth="2"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                    />
                ))}

                {/* Area fill under the curve */}
                <motion.path
                    d="M 60 180 Q 95 160, 130 140 T 200 170 Q 235 135, 270 100 T 340 130 Q 375 100, 410 70 L 410 260 L 60 260 Z"
                    fill="url(#lineChartBlueGradient)"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                />

                {/* Smooth curve line */}
                <motion.path
                    d="M 60 180 Q 95 160, 130 140 T 200 170 Q 235 135, 270 100 T 340 130 Q 375 100, 410 70"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />

                {/* Data points */}
                {[
                    { x: 60, y: 180 },
                    { x: 130, y: 140 },
                    { x: 200, y: 170 },
                    { x: 270, y: 100 },
                    { x: 340, y: 130 },
                    { x: 410, y: 70 }
                ].map((point, i) => (
                    <motion.circle
                        key={`point-${i}`}
                        cx={point.x}
                        cy={point.y}
                        r="6"
                        fill="#3b82f6"
                        stroke="#1e40af"
                        strokeWidth="2"
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.8 + i * 0.15 }}
                    />
                ))}

                {/* Gradient definitions */}
                <defs>
                    <linearGradient id="lineChartBlueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="#1e40af" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.05" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

export default LineChart;
