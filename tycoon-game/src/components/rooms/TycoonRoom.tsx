import React, { useMemo, useState } from 'react';
import { Sprite, AnimatedSprite } from '@pixi/react';
import { Assets,  Sprite as PixiSprite, Texture } from 'pixi.js';
import { OutlineFilter } from 'pixi-filters';
import { HsvColorReplaceFilter } from './filters/HsvColorReplaceFilter';


interface Furniture {
    assetName: string;
    x: number;
    y: number;
    scale: { x: number; y: number };
    eventName: string;
}

interface Animation {
    x: number;
    y: number;
    scale: number;
}

interface TycoonRoomProps {
    background: string;
    furnitures: Furniture[];
    animations: Animation[];
    stageX: number;
    stageY: number;
    scale: number;
}

const TycoonRoom: React.FC<TycoonRoomProps> = ({
    background,
    furnitures,
    animations,
    stageX,
    stageY,
    scale,
}) => {
    const [hoveredFurniture, setHoveredFurniture] = useState<number | null>(null);

    const outlineFilter = useMemo(() => new OutlineFilter(17, 0xffff00), []);

    const animationTextures = useMemo(() => {
        const asset = Assets.cache.get('assets/tp/table_animation_tutorial.json');

        if (asset && asset.data && asset.data.animations) {
            const humanWriteAnimation = asset.data.animations["human_write_animation"];
            return humanWriteAnimation.map((frame: string) =>
                Texture.from(frame)
            );
        }
    }, []);

    const handlePointerOver = (index: number) => {
        if (furnitures[index].eventName !== '') {
            setHoveredFurniture(index);
        }
    };

    const handlePointerOut = (index: number) => {
        if (furnitures[index].eventName !== '') {
            setHoveredFurniture(null);
        }
    };

    
    const colorMappings = [
        // Bluza (na niebiesko)
        { oldColorRange: { hue: [52, 56] as [number, number], tolerance: 1 }, newColor: '#00ffff' },    // Odcienie czerwieni na niebiesko
        { oldColorRange: { hue: [223, 223] as [number, number], tolerance: 1 }, newColor: '#FF6A00' },    // Odcienie czerwieni na niebiesko
        { oldColorRange: { hue: [37, 49] as [number, number], tolerance: 1 }, newColor: '#3D2000' },    // Odcienie czerwieni na niebiesko
    ];
    const colorReplaceFilterHsv = useMemo(() => new HsvColorReplaceFilter(colorMappings), []);

    return (
        <>
            <Sprite
                image={background}
                x={stageX}
                y={stageY}
                scale={scale}
            />

            {furnitures.map((furniture, index) => (
                <React.Fragment key={index}>
                    <Sprite
                        image={furniture.assetName}
                        x={stageX + furniture.x * scale}
                        y={stageY + furniture.y * scale}
                        scale={{ x: scale * furniture.scale.x, y: scale * furniture.scale.y }}
                        filters={hoveredFurniture === index && furniture.eventName !== '' ? [outlineFilter] : []}
                        interactive={furniture.eventName !== ''}
                        pointerover={() => handlePointerOver(index)}
                        pointerout={() => handlePointerOut(index)}
                    />
                </React.Fragment>
            ))}

            {animations.map((animation, index) => (
                <AnimatedSprite
                    key={index}
                    x={stageX + animation.x * scale}
                    y={stageY + animation.y * scale}
                    scale={{ x: scale * animation.scale, y: scale * animation.scale }}
                    isPlaying={true}
                    textures={animationTextures}
                    animationSpeed={0.05}
                    loop={true}
                    filters={[colorReplaceFilterHsv]}
                />
            ))}
        </>
    );
};

export default TycoonRoom;
