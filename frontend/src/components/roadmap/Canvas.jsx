import React, { useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  ControlButton,
} from '@xyflow/react';
import { RotateCw, Expand, Shrink } from 'lucide-react';
import '@xyflow/react/dist/style.css';
import { useParams } from 'react-router-dom';
import { roadmapApi } from '../../utils/roadmapUtils';
import { getNodeTypes } from './nodes/nodeTypes';
import './styles/Canvas.css';

// Static node types
const nodeTypes = getNodeTypes(new Set());

const Canvas = () => {
    const containerRef = useRef(null);
    const { groupId } = useParams();
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch and display all nodes and edges
    useEffect(() => {
      const fetchRoadmapData = async () => {
        try {
          setLoading(true);
          const response = await roadmapApi.getRoadmap(groupId);
          
          if (response.success && response.data) {
            setNodes(response.data.nodes || []);
            setEdges(response.data.edges || []);
          } else {
            setError('Failed to load roadmap data');
          }
        } catch (err) {
          console.error('Error fetching roadmap data:', err);
          setError('Failed to load roadmap. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchRoadmapData();
    }, [groupId]);

    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        containerRef.current?.requestFullscreen?.()
          .then(() => setIsFullscreen(true))
          .catch(console.error);
      } else {
        document.exitFullscreen?.()
          .then(() => setIsFullscreen(false))
          .catch(console.error);
      }
    };

    const resetView = () => {
      // This will be handled by ReactFlow's fitView prop
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading roadmap...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Error Loading Roadmap</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return (
      <div ref={containerRef} className="w-full h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="top-right"
          className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
        >
          <Controls>
            <ControlButton onClick={resetView} title="Reset View">
              <RotateCw className="w-4 h-4" />
            </ControlButton>
            <ControlButton onClick={toggleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              {isFullscreen ? <Shrink className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
            </ControlButton>
          </Controls>
          <MiniMap nodeStrokeWidth={3} />
          <Background />
        </ReactFlow>
      </div>
    );
};

export default Canvas;
