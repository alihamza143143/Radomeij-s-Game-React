import { Polygon } from "pixi.js";

export interface FurnitureItem {
    x: number;
    y: number;
    mirror: boolean;
    assetName: string;
    furnitureName: string;
    eventName: string;
    hitArea?: Polygon | null;
}

export interface Position {
    x: number;
    y: number;
    scale: { x: number; y: number };
}

export interface Collider {
    Name: string;
    "Hull Polygon": string;
    top_left: [number, number][];
}