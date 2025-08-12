import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  ControlButton,
} from '@xyflow/react';
import { RotateCw, Expand, Shrink } from 'lucide-react';
import '@xyflow/react/dist/style.css';

import './styles/Canvas.css';
import { flowData } from './data/data';
import { getNodeTypes } from './nodes/nodeTypes';

const Canvas = () => {
    const containerRef = useRef(null);
    const [nodes, setNodes] = useState([flowData.nodes.find(n => n.id === 'root_node')]);
    const [edges, setEdges] = useState([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedNodes, setSelectedNodes] = useState(new Set());
  
    const handleNodeClick = useCallback((event, clickedNode) => {
      const isExpanded = nodes.some(node => node.data.parentId === clickedNode.id);
  
      setSelectedNodes(prev => new Set([clickedNode.id]));
  
      if (isExpanded) {
        const nodesToRemove = new Set();
        const queue = [clickedNode.id];
        
        while(queue.length > 0) {
          const currentId = queue.shift();
          const children = nodes.filter(n => n.data.parentId === currentId);
          children.forEach(child => {
            nodesToRemove.add(child.id);
            queue.push(child.id);
          });
        }
        
        setNodes(prev => prev.map(n => 
          n.id === clickedNode.id 
            ? { ...n, data: { ...n.data, expanded: false } }
            : n
        ).filter(n => !nodesToRemove.has(n.id)));
        
        setEdges(prev => prev.filter(e => {
            const sourceNodeExists = !nodesToRemove.has(e.source);
            const targetNodeExists = !nodesToRemove.has(e.target);
            return sourceNodeExists && targetNodeExists;
        }));
  
      } else {
        const childrenData = clickedNode.data.type === 'root'
          ? flowData.nodes.filter(n => flowData.edges.some(e => e.source === clickedNode.id && e.target === n.id))
          : clickedNode.data.children || [];
  
        if (childrenData.length === 0) return;
  
        const newNodes = [];
        const newEdges = [];
        
        childrenData.forEach((childData, index) => {
          let position;
          if (clickedNode.data.type === 'section') {
              position = {
                  x: clickedNode.position.x,
                  y: clickedNode.position.y + 120 + (index * 90),
              };
          } else {
              position = {
                  x: clickedNode.position.x - ((childrenData.length - 1) * 200) + (index * 400),
                  y: clickedNode.position.y + 180,
              };
          }
  
          const childNode = {
            id: childData.id || childData.data?.id,
            data: { ...childData.data, ...childData, parentId: clickedNode.id },
            position: position,
            type: childData.type === 'playlistNode' ? 'playlistNode' : `${childData.type}Node`,
          };
          newNodes.push(childNode);
          
          const newEdge = {
            id: `e-${clickedNode.id}-${childNode.id}`,
            source: clickedNode.id,
            target: childNode.id,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#6366f1', strokeWidth: 2 }
          };
          newEdges.push(newEdge);
        });
  
        setNodes(prev => prev.map(n => 
          n.id === clickedNode.id 
            ? { ...n, data: { ...n.data, expanded: true } }
            : n
        ).concat(newNodes));
        
        setEdges(prev => [...prev, ...newEdges]);
      }
    }, [nodes]);
  
    const nodeTypes = useMemo(() => getNodeTypes(selectedNodes), [selectedNodes]);
  
    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(err => {
          alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      } else {
        document.exitFullscreen();
      }
    };
  
    const resetView = () => {
      setNodes([flowData.nodes.find(n => n.id === 'root_node')]);
      setEdges([]);
      setSelectedNodes(new Set());
    };
  
    useEffect(() => {
      const onFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };
      document.addEventListener('fullscreenchange', onFullscreenChange);
      return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, []);
    
    return (
      <div ref={containerRef} className="w-full h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
       
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          attributionPosition="top-right"
          className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: false,
            style: { stroke: '#94a3b8', strokeWidth: 2 }
          }}
        >
          <MiniMap 
            nodeColor={(node) => {
                if (node.id === 'root_node') return '#10b981';
                if (node.type === 'sectionNode') return '#a855f7';
                if (node.type === 'videoNode') return '#22c55e';
                return '#3b82f6';
            }}
            maskColor="rgba(255, 255, 255, 0.1)"
          />
          <Controls>
              <ControlButton onClick={resetView} title="Reset View">
                  <RotateCw size={16} />
              </ControlButton>
              <ControlButton onClick={toggleFullscreen} title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
                  {isFullscreen ? <Shrink size={16} /> : <Expand size={16} />}
              </ControlButton>
          </Controls>
          <Background 
            color="rgba(148, 163, 184, 0.3)" 
            gap={20} 
            size={1}
            className="dark:!bg-gray-900"
          />
        </ReactFlow>
      </div>
    );
};

export default Canvas;
