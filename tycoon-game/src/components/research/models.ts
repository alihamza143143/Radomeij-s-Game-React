export interface IntermediateNode {
    id: number;
    name: string;
    state: 'ready' | 'open' | 'current';
    position: { x: number; y: number };
}

export interface IntermediateEdge {
    from: number;
    to: number;
}
