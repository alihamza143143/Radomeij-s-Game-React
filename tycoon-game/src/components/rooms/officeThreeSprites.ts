import { Polygon } from 'pixi.js';
import colliders from '../../assets/tp/colliders_with_top_left.json';
import { Collider, FurnitureItem, Position } from './models/furnitureModels';

const FURNITURE_SIZE = 1024;
const furnitureList: FurnitureItem[] = [

];

const animationList = [
    { x: 3500, y: 950, scale: 1, animationName: 'human_write_animation' }, // Przykładowa animacja
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


export const getOfficeThreeSetup = () => {
    const background = "office_3.png";


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
        defaultZoom: 0.2
    };
};