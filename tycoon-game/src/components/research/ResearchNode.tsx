import React, { useMemo } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import researchBulb from './../../assets/svg/lampka_biala.svg';
import researchCountur from './../../assets/svg/lampka_kontur.svg';
import SVGIcon from '../basic/SVGIcon';
import FillableSvgIcon from '../basic/FillableSvgIcon';

interface ResearchNodeData {
  label: string;
  state: 'ready' | 'open' | 'current' | 'hidden';
}

const ResearchNode: React.FC<NodeProps<ResearchNodeData>> = ({ data }) => {
  const { label, state } = data || { label: "missing", state: 'current' };

  const { fillColor, strokeColor } = useMemo(() => {
    switch (state) {
      case 'open':
        return {
          fillColor: 'white',
          strokeColor: 'black',
        };
      case 'current':
        return {
          fillColor: '#ffff5f',
          strokeColor: 'black',
        };
      case 'ready':
        return {
          fillColor: '#87ffaf',
          strokeColor: 'black',
        };
      case 'hidden':
        return {
          fillColor: 'red',
          strokeColor: 'black',
        };
      default:
        return {
          fillColor: 'gray',
          strokeColor: 'black',
        };
    }
  }, [state]);

  return (
    <div className="indicator">
      {/* <span className="indicator-item badge badge-secondary">90%</span>
      <span className="indicator-item badge badge-primary indicator-bottom indicator-end">1</span>
      <span className="indicator-item badge badge-success indicator-bottom indicator-start">LVL: 1</span> */}
      <div className="">
        <div className="p-4 bg-white shadow-md rounded-md flex items-center">
          <FillableSvgIcon countur={researchCountur} fillShape={researchBulb} fillColor={fillColor} strokeColor={strokeColor} strokeWidthScale={2} />
          <span>{label}</span>
          <Handle type="source" position={Position.Bottom} />
          <Handle type="target" position={Position.Top} />
        </div>
      </div>
    </div>
  );
};

export default ResearchNode;
