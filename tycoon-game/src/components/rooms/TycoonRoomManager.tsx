import { RootState } from '@/store/store';
import { Stage } from '@pixi/react';
import { Assets, Sprite as PixiSprite, Texture } from 'pixi.js';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Camera from './Camera';
import TycoonRoom from './TycoonRoom';
import { getTutorialRoomSetup } from './firstRoomSprites';
import { getOfficeThreeSetup } from './officeThreeSprites';
import { getOfficeTwoSetup } from './officeTwoSprites';

const TycoonRoomManager: React.FC = () => {
    const [bgDimensions, setBgDimensions] = useState({ width: 0, height: 0 });
    const [bgImage, setBgImage] = useState<string>("room_house.png");
    const [bgZoom, setBgZoom] = useState<number>(1);
    const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [ready, setReady] = useState(false);
    const [furnitures, setFurnitures] = useState<any[]>([]);
    const [animations, setAnimations] = useState<any[]>([]);

    const currentOffice = useSelector((state: RootState) => state.office.currentOffice);

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const zoom = useRef(1);

    const handleResize = useCallback(() => {
        setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    useEffect(() => {
        let roomSetup = getTutorialRoomSetup();
        if (currentOffice?.id === 2) {
            roomSetup = getOfficeTwoSetup();
        } else if (currentOffice?.id === 3) {
            roomSetup = getOfficeThreeSetup();
        }

        Assets.load([
            "assets/tp/office-tutorial.json",
            "assets/tp/room0-0.json",
            "assets/tp/table_animation_tutorial.json",
            "assets/tp/offices-two-and-three-0.json",
        ]).then(() => {
            const texture = Texture.from(roomSetup.background);

            if (texture) {
                const sprite = new PixiSprite(texture);
                setBgDimensions({ width: sprite.width, height: sprite.height });
                setBgImage(roomSetup.background); // Ustawienie obrazu tła
            }

            setBgZoom(roomSetup.defaultZoom);

            setFurnitures(roomSetup.furnitureList);
            setAnimations(roomSetup.animationList);

            setReady(true);
        });
    }, [currentOffice]);

    const scale = useMemo(() => {
        if (bgDimensions.width === 0 || bgDimensions.height === 0) return 1;
        const scaleX = windowDimensions.width / bgDimensions.width;
        const scaleY = windowDimensions.height / bgDimensions.height;
        return Math.min(scaleX, scaleY);
    }, [windowDimensions, bgDimensions]);

    const stageWidth = bgDimensions.width;
    const stageHeight = bgDimensions.height;

    const stageX = (windowDimensions.width - stageWidth) / 2;
    const stageY = (windowDimensions.height - stageHeight) / 2;

    const handleMouseDown = (e: any) => {
        setDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY };
        setPrevPosition(position); // Save the current position before dragging
    };

    const handleMouseMove = (e: any) => {
        if (dragging) {
            const deltaDraggingPosition = {
                x: (e.clientX - dragStart.current.x) * 1 / zoom.current,
                y: (e.clientY - dragStart.current.y) * 1 / zoom.current
            };
            const newPosition = {
                x: prevPosition.x - deltaDraggingPosition.x,
                y: prevPosition.y - deltaDraggingPosition.y
            };
            setPosition(newPosition);
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    const handleZoomChange = (newZoom: number) => {
        zoom.current = newZoom;
    };

    const handleBoundaryExceed = (correctedPosition: { x: number; y: number }) => {
        // Check if the corrected position is different from the current position
        if (correctedPosition.x !== position.x || correctedPosition.y !== position.y) {
            setPosition(correctedPosition); // Update position to the corrected position
        }
    };

    const boundary = {
        x: stageX,
        y: stageY,
        width: stageWidth,
        height: stageHeight,
    };

    return (
        bgDimensions.width > 0 && bgDimensions.height > 0 && ready && (
            <Stage
                width={windowDimensions.width}
                height={windowDimensions.height}
                options={{ background: 0x1099bb, backgroundAlpha: 0 }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseOut={handleMouseUp}
                onMouseDown={handleMouseDown}
            >
                <Camera
                    position={position}
                    viewport={windowDimensions}
                    onZoomChange={handleZoomChange}
                    boundary={boundary}
                    onBoundaryExceed={handleBoundaryExceed}
                    maxZoom={1.25}
                    minZoom={0.02}
                    initialZoom={bgZoom}
                >
                    <TycoonRoom
                        // key={bgImage}
                        background={bgImage}
                        furnitures={furnitures}
                        animations={animations}
                        stageX={stageX}
                        stageY={stageY}
                        scale={1}
                    />
                </Camera>
            </Stage>
        )
    );
};

export default TycoonRoomManager;
