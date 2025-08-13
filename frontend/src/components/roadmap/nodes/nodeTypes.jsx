import React, { memo } from 'react';
import RootNode from './RootNode';
import PlaylistNode from './PlaylistNode';
import SectionNode from './SectionNode';
import VideoNode from './VideoNode';

// Create memoized node components
const createNodeComponent = (Component) => memo(({ selected, ...props }) => (
  <Component selected={selected} {...props} />
));

// Create node types outside of any component
const nodeTypes = {
  rootNode: createNodeComponent(RootNode),
  playlistNode: createNodeComponent(PlaylistNode),
  sectionNode: createNodeComponent(SectionNode),
  videoNode: createNodeComponent(VideoNode),
};

export const getNodeTypes = (selectedNodes) => ({
  rootNode: (props) => {
    const NodeComponent = nodeTypes.rootNode;
    return <NodeComponent {...props} selected={selectedNodes.has(props.id)} />;
  },
  playlistNode: (props) => {
    const NodeComponent = nodeTypes.playlistNode;
    return <NodeComponent {...props} selected={selectedNodes.has(props.id)} />;
  },
  sectionNode: (props) => {
    const NodeComponent = nodeTypes.sectionNode;
    return <NodeComponent {...props} selected={selectedNodes.has(props.id)} />;
  },
  videoNode: (props) => {
    const NodeComponent = nodeTypes.videoNode;
    return <NodeComponent {...props} selected={selectedNodes.has(props.id)} />;
  },
});
