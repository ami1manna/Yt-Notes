import React, { useState, useMemo, memo, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  Handle,
  Position,
  ControlButton,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// --- DATA ---
const flowData = {
  "nodes": [
    {
      "id": "root_node",
      "data": { "label": "All Learning Paths", "type": "root" },
      "position": { "x": 425, "y": 25 },
      "type": "rootNode"
    },
    {
      "id": "pl_1",
      "position": { "x": 100, "y": 150 },
      "data": { 
        "label": "React JS Roadmap", 
        "duration": 72446,
        "type": "playlist",
        "difficulty": "Intermediate",
        "progress": 65,
        "children": [
          {
            "id": "sec_1_1",
            "name": "React Fundamentals",
            "type": "section",
            "progress": 80,
            "children": [
              { "id": "vz1RlUyrc3w", "title": "React JS roadmap", "duration": 1818, "type": "video", "completed": true },
              { "id": "k3KqQvywToE", "title": "Create react projects", "duration": 2116, "type": "video", "completed": true }
            ]
          },
          {
            "id": "sec_1_2",
            "name": "State Management",
            "type": "section",
            "progress": 50,
            "children": [
              { "id": "lI7IIOWM0Mo", "title": "Why you need hooks", "duration": 1698, "type": "video", "completed": true },
              { "id": "MPCVGFvgVEQ", "title": "Virtual DOM & Fibre", "duration": 1281, "type": "video", "completed": false }
            ]
          }
        ]
      },
      "type": "playlistNode"
    },
    {
      "id": "pl_2",
      "position": { "x": 400, "y": 150 },
      "data": { 
        "label": "Advanced React Patterns", 
        "duration": 55000, 
        "type": "playlist",
        "difficulty": "Advanced",
        "progress": 25
      },
      "type": "playlistNode"
    },
    {
      "id": "pl_3",
      "position": { "x": 700, "y": 150 },
      "data": { 
        "label": "Node.js for Beginners", 
        "duration": 68000, 
        "type": "playlist",
        "difficulty": "Beginner",
        "progress": 90
      },
      "type": "playlistNode"
    }
  ],
  "edges": [
    { "id": "eroot-1", "source": "root_node", "target": "pl_1", "type": "smoothstep" },
    { "id": "eroot-2", "source": "root_node", "target": "pl_2", "type": "smoothstep" },
    { "id": "eroot-3", "source": "root_node", "target": "pl_3", "type": "smoothstep" }
  ]
};

// --- UTILS ---
const formatDuration = (totalSeconds) => {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return '00:00';
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  if (hours > 0) {
    return `${paddedHours}h ${paddedMinutes}m`;
  }
  return `${paddedMinutes}m ${paddedSeconds}s`;
};

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Beginner': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    case 'Intermediate': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
    case 'Advanced': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
    default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
  }
};

// --- PROGRESS BAR COMPONENT ---
const ProgressBar = memo(({ progress = 0, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
      <div 
        className={`${getProgressColor(progress)} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
});

// --- CUSTOM NODES ---
const RootNode = memo(({ data, selected }) => {
  return (
    <div className={`
      bg-gradient-to-br from-emerald-500 to-teal-600 
      border-2 border-emerald-400 rounded-xl shadow-xl 
      w-64 h-16 flex justify-center items-center 
      text-xl font-bold text-white cursor-pointer
      transform transition-all duration-300 ease-out
      hover:scale-105 hover:shadow-2xl hover:from-emerald-400 hover:to-teal-500
      ${selected ? 'ring-4 ring-emerald-300 scale-105' : ''}
    `}>
      <Handle type="source" position={Position.Bottom} className="!bg-white !border-emerald-500 !border-2 !w-3 !h-3" />
      <div className="flex items-center space-x-2">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
        </svg>
        <span>{data.label}</span>
      </div>
    </div>
  );
});

const PlaylistNode = memo(({ data, selected }) => {
  const isExpanded = data.expanded || false;
  
  return (
    <div className={`
      bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-xl shadow-lg 
      w-80 text-gray-900 dark:text-gray-100 p-5 cursor-pointer
      transform transition-all duration-300 ease-out
      hover:scale-105 hover:shadow-xl hover:border-blue-400
      ${selected ? 'ring-4 ring-blue-300 scale-105' : ''}
      ${isExpanded ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
    `}>
      <Handle type="target" position={Position.Top} className="!bg-blue-500 !border-white !border-2 !w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !border-white !border-2 !w-3 !h-3" />
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-1 leading-tight">
            {data.label}
          </h3>
          {data.difficulty && (
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(data.difficulty)}`}>
              {data.difficulty}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1 ml-2">
          {isExpanded ? (
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
          </svg>
          <span>{formatDuration(data.duration)}</span>
        </div>
        
        {data.progress !== undefined && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{data.progress}%</span>
            </div>
            <ProgressBar progress={data.progress} />
          </div>
        )}
      </div>
    </div>
  );
});

const SectionNode = memo(({ data, selected }) => {
  const isExpanded = data.expanded || false;
  
  return (
    <div className={`
      bg-purple-50 dark:bg-gray-700 border-2 border-purple-500 rounded-lg shadow-md 
      w-72 text-gray-900 dark:text-gray-100 p-4 cursor-pointer
      transform transition-all duration-300 ease-out
      hover:scale-105 hover:shadow-lg hover:border-purple-400
      ${selected ? 'ring-4 ring-purple-300 scale-105' : ''}
      ${isExpanded ? 'bg-purple-100 dark:bg-purple-900/30' : ''}
    `}>
      <Handle type="target" position={Position.Top} className="!bg-purple-500 !border-white !border-2 !w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} className="!bg-purple-500 !border-white !border-2 !w-3 !h-3" />
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
          </svg>
          <p className="font-semibold text-purple-800 dark:text-purple-300">{data.name}</p>
        </div>
        {isExpanded ? (
          <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"/>
          </svg>
        ) : (
          <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        )}
      </div>
      
      {data.progress !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Section Progress</span>
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{data.progress}%</span>
          </div>
          <ProgressBar progress={data.progress} size="sm" />
        </div>
      )}
    </div>
  );
});

const VideoNode = memo(({ data, selected }) => {
  const isCompleted = data.completed || false;
  
  return (
    <div className={`
      ${isCompleted ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-400'} 
      dark:bg-gray-700 border-2 rounded-lg shadow-md 
      w-64 text-gray-900 dark:text-gray-100 p-4
      transform transition-all duration-300 ease-out
      hover:scale-105 hover:shadow-lg
      ${selected ? 'ring-4 ring-green-300 scale-105' : ''}
      ${isCompleted ? 'hover:border-green-400' : 'hover:border-gray-500'}
    `}>
      <Handle type="target" position={Position.Top} className={`!border-white !border-2 !w-3 !h-3 ${isCompleted ? '!bg-green-500' : '!bg-gray-400'}`} />
      
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 p-2 rounded-lg ${isCompleted ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-600'}`}>
          {isCompleted ? (
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414L15.414 8a2 2 0 000-2.828L13.707 3.879a1 1 0 00-1.414 1.414L13.586 6H8a3 3 0 100 6h5.586l-1.293 1.293a1 1 0 101.414 1.414L15.414 14a2 2 0 000-2.828L13.707 9.879a1 1 0 00-1.414 1.414L13.586 12H8a1 1 0 110-2z"/>
            </svg>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm leading-tight ${isCompleted ? 'text-green-800 dark:text-green-300' : 'text-gray-800 dark:text-gray-200'}`}>
            {data.title}
          </p>
          <div className="flex items-center mt-2 space-x-2">
            <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
            </svg>
            <span className="text-xs text-gray-600 dark:text-gray-400">{formatDuration(data.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

// --- MAIN CANVAS COMPONENT ---
const Canvas = () => {
  const containerRef = useRef(null);
  const [nodes, setNodes] = useState([flowData.nodes.find(n => n.id === 'root_node')]);
  const [edges, setEdges] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState(new Set());

  const handleNodeClick = useCallback((event, clickedNode) => {
    const isExpanded = nodes.some(node => node.data.parentId === clickedNode.id);

    // Update node selection
    setSelectedNodes(prev => new Set([clickedNode.id]));

    if (isExpanded) {
      // --- COLLAPSE LOGIC ---
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
      // --- EXPAND LOGIC ---
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

  const nodeTypes = useMemo(() => ({
    rootNode: (props) => <RootNode {...props} selected={selectedNodes.has(props.id)} />,
    playlistNode: (props) => <PlaylistNode {...props} selected={selectedNodes.has(props.id)} />,
    sectionNode: (props) => <SectionNode {...props} selected={selectedNodes.has(props.id)} />,
    videoNode: (props) => <VideoNode {...props} selected={selectedNodes.has(props.id)} />,
  }), [selectedNodes]);

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
       <style>{`
        .react-flow__controls {
          background: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(203, 213, 225, 0.5) !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
        }
        
        .react-flow__controls button {
          background: transparent !important;
          border: none !important;
          transition: all 0.2s ease !important;
          border-radius: 8px !important;
        }
        
        .react-flow__controls button:hover {
          background: rgba(59, 130, 246, 0.1) !important;
          transform: scale(1.05) !important;
        }

        @media (prefers-color-scheme: dark) {
          .react-flow__controls {
            background: rgba(31, 41, 55, 0.9) !important;
            border: 1px solid rgba(75, 85, 99, 0.5) !important;
          }
          .react-flow__controls button {
            fill: #f3f4f6 !important;
          }
          .react-flow__controls button:hover {
            background: rgba(59, 130, 246, 0.2) !important;
          }
        }
        
        .react-flow__minimap {
          background: rgba(255, 255, 255, 0.9) !important;
          border: 1px solid rgba(203, 213, 225, 0.5) !important;
          border-radius: 12px !important;
          backdrop-filter: blur(10px) !important;
        }
        
        @media (prefers-color-scheme: dark) {
          .react-flow__minimap {
            background: rgba(31, 41, 55, 0.9) !important;
            border: 1px solid rgba(75, 85, 99, 0.5) !important;
          }
        }
        
        .react-flow__edge.animated {
          stroke-dasharray: 5;
          animation: dashdraw 0.5s linear infinite;
        }
        
        @keyframes dashdraw {
          to {
            stroke-dashoffset: -10;
          }
        }
      `}</style>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                  <path d="M21 3v5h-5"/>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                  <path d="M3 21v-5h5"/>
                </svg>
            </ControlButton>
            <ControlButton onClick={toggleFullscreen} title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
                {isFullscreen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                )}
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