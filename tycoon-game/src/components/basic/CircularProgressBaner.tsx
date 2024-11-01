import React, { useRef, useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { useSpring, animated } from '@react-spring/web';
import CircularProgress from './CircularProgress';

interface CircularProgressBanerProps {
    progress: number;
    label: string;
    color?: string;
}

const CircularProgressBaner: React.FC<CircularProgressBanerProps> = ({ progress, label, color = '#4caf50' }) => {
    const data = {
        labels: ['Progress', 'Remaining'],
        datasets: [
            {
                data: [progress, 100 - progress],
                backgroundColor: [color, '#e0e0e0'],
                hoverBackgroundColor: ['#66bb6a', '#f5f5f5'],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        cutout: '70%',
        plugins: {
            tooltip: {
                enabled: false,
            },
            legend: {
                display: false,
            },
            datalabels: {
                display: false,
            },
        },
    };

    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [textWidth, setTextWidth] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        const currentTextWidth = textRef.current?.scrollWidth || 0;
        const currentContainerWidth = containerRef.current?.offsetWidth || 0;

        setTextWidth(currentTextWidth);
        setContainerWidth(currentContainerWidth);
        setShouldAnimate(currentTextWidth > currentContainerWidth);
    }, [label]);

    const { x } = useSpring({
        from: { x: containerWidth },
        to: { x: -textWidth },
        config: { duration: (textWidth + containerWidth) * 15 }, // Adjust this factor as needed to control speed
        loop: true,
        reset: false,
    });

    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex flex-col w-12 h-12">
                <CircularProgress progress={progress} />
            </div>
            <div className="w-full overflow-hidden whitespace-nowrap" ref={containerRef}>
                {shouldAnimate && <animated.div
                    className="inline-block"
                    style={{ transform: x.to((x) => `translateX(${x}px)`) }}
                    ref={textRef}
                >
                    <span className='text-sm text-primary-content'>{label}</span>
                </animated.div>}

                {!shouldAnimate && <span className='text-sm text-primary-content'>{label}</span>}
            </div>
        </div>
    );
};

export default CircularProgressBaner;
