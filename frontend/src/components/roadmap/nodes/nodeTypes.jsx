import React from 'react';
import RootNode from './RootNode';
import PlaylistNode from './PlaylistNode';
import SectionNode from './SectionNode';
import VideoNode from './VideoNode';

// We pass selectedNodes so the individual components can react to selection
export const getNodeTypes = (selectedNodes) => ({
  rootNode: (props) => <RootNode {...props} selected={selectedNodes.has(props.id)} />,
  playlistNode: (props) => <PlaylistNode {...props} selected={selectedNodes.has(props.id)} />,
  sectionNode: (props) => <SectionNode {...props} selected={selectedNodes.has(props.id)} />,
  videoNode: (props) => <VideoNode {...props} selected={selectedNodes.has(props.id)} />,
});
