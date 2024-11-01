import React, { useEffect } from 'react';
import ReactFlow, { Background, Controls, Edge, Node, ReactFlowProvider, ReactFlowInstance } from 'reactflow';
import 'reactflow/dist/style.css';
import ResearchNode from './ResearchNode';
import { IntermediateEdge, IntermediateNode } from './models';

interface ReactFlowWrapperProps {
  intermediateNodes: IntermediateNode[];
  intermediateEdges: IntermediateEdge[];
  onNodeClick: (intermediateNode: IntermediateNode) => void;
}

const nodeTypes = {
  custom: ResearchNode,
};

const ReactFlowContent: React.FC<ReactFlowWrapperProps> = ({ intermediateNodes, intermediateEdges, onNodeClick }) => {

  const nodes: Node[] = intermediateNodes.map((node) => ({
    id: node.id.toString(),
    data: { label: node.name, state: node.state },
    position: { x: node.position.x * 400, y: node.position.y * 200 },
    type: 'custom',
  }));

  const edges: Edge[] = intermediateEdges.map((edge) => ({
    id: `e${edge.from}-${edge.to}`,
    source: edge.from.toString(),
    target: edge.to.toString(),
  }));

  const handleNodeClick = (event: any, node: Node) => {
    const clickedNode = intermediateNodes.find(n => n.id.toString() === node.id);
    if (clickedNode) {
      onNodeClick(clickedNode);
    }
  };

  const handleInit = (reactFlowInstance: ReactFlowInstance) => {
    reactFlowInstance.fitView({ padding: 5.0 }); // Automatyczne centrowanie
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodeClick={handleNodeClick}
      nodeTypes={nodeTypes}
      onInit={handleInit} // Zmieniono na onInit
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
};

const ReactFlowWrapper: React.FC<ReactFlowWrapperProps> = (props) => {
  return (
    <div className='h-full w-full'>
      <ReactFlowProvider>
        <ReactFlowContent {...props} />
      </ReactFlowProvider>
    </div>
  );
};

export default ReactFlowWrapper;
