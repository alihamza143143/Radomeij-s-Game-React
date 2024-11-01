import { Polygon } from 'pixi.js';
import colliders from '../../assets/tp/colliders_with_top_left.json';
import { Collider, FurnitureItem, Position } from './models/furnitureModels';

import garage_bg from '@/assets/bg/room_walls.png';
import house_bg from '@/assets/bg/room_house.png';



const FURNITURE_SIZE = 1024;
const furnitureList: FurnitureItem[] = [
    { x: 1085, y: -50, mirror: true, assetName: 'furniture/shelf_electronic_lvl1.png', furnitureName: 'shelf_electronic_lvl1', eventName: '' },
    { x: 920, y: 470, mirror: true, assetName: 'furniture/desk_lvl1.png', furnitureName: 'desk_lvl1', eventName: '' },
    { x: 1030, y: 380, mirror: true, assetName: 'furniture/monitor70s.png', furnitureName: 'monitor70s', eventName: '' },
    { x: 825, y: 220, mirror: true, assetName: 'furniture/card_machine.png', furnitureName: 'card_machine', eventName: 'Card' },
    { x: 1350, y: 558, mirror: true, assetName: 'furniture/CPU_maker.png', furnitureName: 'CPU_maker', eventName: '' },
    { x: 595, y: 50, mirror: false, assetName: 'furniture/board.png', furnitureName: 'board', eventName: '' },
];


const animationList = [
    { x: 795, y: 900, scale: 1, animationName: 'human_write_animation' }, // Przykładowa animacja po przesunięciu
];


const calculatePosition = (offsetX: number, offsetY: number, mirror?: boolean): Position => {
    return {
        x: mirror ? offsetX + FURNITURE_SIZE : offsetX,
        y: offsetY,
        scale: { x: mirror ? -1 : 1, y: 1 },
    };
};


function getHitArea(furnitureName: string): Polygon | null {
    const collider = (colliders.colliders as Collider[]).find((c) => c.Name === furnitureName);
    if (!collider) {
        return null;
    }
    const points = collider.top_left.flatMap(point => [point[0], point[1]]);
    return new Polygon(points);
}


export const getTutorialRoomSetup = () => {
    const background = "room_house.png";

    const calculatedFurnitureList = furnitureList.map(item => {
        const position = calculatePosition(item.x, item.y, item.mirror);
        const hitArea = getHitArea(item.furnitureName);
        return {
            ...item, // Wszystkie właściwości z FurnitureItem
            ...position, // Właściwości pozycji
            hitArea, // Obszar kolizji jako Polygon
        };
    });

    const calculatedAnimationList = animationList.map(animation => ({
        ...animation, // Wszystkie właściwości animacji
    }));

    return {
        background,
        furnitureList: calculatedFurnitureList,
        animationList: calculatedAnimationList,
        defaultZoom: 0.6
    };
};