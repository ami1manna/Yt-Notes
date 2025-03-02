import React, { useEffect, useState, useRef } from 'react';
import { getEducationalNotes, getSummary } from '../../utils/SumarizeUtlis';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { BookOpen, FileText, RefreshCw, AlertTriangle, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

const SummaryList = ({ videoId }) => {
  const [summaryList, setSummaryList] = useState(null);
  const [educationalNotes, setEducationalNotes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [expandedTopics, setExpandedTopics] = useState({});
  const [copyStatus, setCopyStatus] = useState({});
  const contentRef = useRef(null);

  // MathJax configuration
  const mathJaxConfig = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
    },
    startup: {
      typeset: true,
    }
  };

  useEffect(() => {
    if (videoId) {
      fetchSummary();
      fetchNotes();
    }
  }, [videoId]);

  // Initialize expanded state for all topics when notes load
  useEffect(() => {
    if (educationalNotes?.notes?.topics) {
      const initialExpandState = {};
      educationalNotes.notes.topics.forEach((_, index) => {
        initialExpandState[index] = false; // All collapsed initially
      });
      setExpandedTopics(initialExpandState);
    }
  }, [educationalNotes]);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getSummary(videoId);
      setSummaryList(result);
      console.log("Summary:", result);
    } catch (err) {
      setError("Failed to fetch summary.");
    }
    setLoading(false);
  };

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getEducationalNotes(videoId);
      setEducationalNotes(result);
      console.log("Educational Notes:", result);
    } catch (err) {
      setError("Failed to fetch educational notes.");
    }
    setLoading(false);
  };

  // Format text to render LaTeX correctly
  const formatText = (text) => {
    if (!text) return "";
    return <MathJax>{text}</MathJax>;
  };

  // Toggle topic expansion
  const toggleTopic = (topicIndex) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicIndex]: !prev[topicIndex]
    }));
  };

  // Function to copy text to clipboard
  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Extract plain text content from topics
  const getTopicTextContent = (topic) => {
    let content = `${topic.title}\n\n${topic.summary}\n\n`;
    
    if (topic.keyPoints && topic.keyPoints.length > 0) {
      content += "Key Points:\n";
      topic.keyPoints.forEach((point, i) => {
        content += `- ${point}\n`;
      });
      content += "\n";
    }
    
    if (topic.examples && topic.examples.length > 0) {
      content += "Examples:\n";
      topic.examples.forEach((example, i) => {
        content += `- ${example}\n`;
      });
      content += "\n";
    }
    
    if (topic.codeSnippets && topic.codeSnippets.length > 0) {
      content += "Code Snippets:\n";
      topic.codeSnippets.forEach((snippet, i) => {
        content += `${snippet.language || 'Code'}:\n${snippet.code}\n`;
        if (snippet.explanation) {
          content += `Explanation: ${snippet.explanation}\n`;
        }
        content += "\n";
      });
    }
    
    return content;
  };

  // Get all content for copying everything
  const getAllContent = () => {
    if (!educationalNotes?.notes) return "";
    
    let content = `${educationalNotes.notes.title}\n\n`;
    
    educationalNotes.notes.topics?.forEach((topic, index) => {
      content += `${index + 1}. ${getTopicTextContent(topic)}\n`;
    });
    
    return content;
  };

  // Function to render code snippets with syntax highlighting
  const renderCodeSnippet = (snippet, index) => (
    <div key={index} className="bg-gray-900 text-white p-4 rounded-lg shadow-md mt-3 overflow-x-auto relative group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 uppercase font-semibold">{snippet.language || 'Code'}</span>
        <button
          onClick={() => copyToClipboard(snippet.code, `code-${index}`)}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded"
          aria-label="Copy code"
        >
          {copyStatus[`code-${index}`] ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="whitespace-pre-wrap text-sm">
        <code>{snippet.code}</code>
      </pre>
      {snippet.explanation && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-gray-300 text-sm">{formatText(snippet.explanation)}</p>
        </div>
      )}
    </div>
  );

  return (
    <MathJaxContext config={mathJaxConfig}>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl shadow-lg max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button 
            onClick={() => setActiveTab('summary')} 
            className={`flex items-center px-4 py-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'summary' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            <FileText size={16} className="mr-2" />
            Summary
          </button>
          <button 
            onClick={() => setActiveTab('notes')} 
            className={`flex items-center px-4 py-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'notes' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            <BookOpen size={16} className="mr-2" />
            Educational Notes
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button 
            onClick={fetchSummary} 
            className="flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition shadow-sm text-sm"
            disabled={loading}
          >
            <RefreshCw size={14} className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Summary
          </button>
          <button 
            onClick={fetchNotes} 
            className="flex items-center bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition shadow-sm text-sm"
            disabled={loading}
          >
            <RefreshCw size={14} className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Notes
          </button>
          
          {activeTab === 'notes' && educationalNotes?.notes && (
            <button 
              onClick={() => copyToClipboard(getAllContent(), 'all-content')}
              className="flex items-center bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition shadow-sm text-sm ml-auto"
            >
              {copyStatus['all-content'] ? <Check size={14} className="mr-1.5" /> : <Copy size={14} className="mr-1.5" />}
              Copy All
            </button>
          )}
        </div>

        {/* Loading & Error Messages */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-blue-600 font-medium text-sm">Loading content...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-start mb-4 text-sm">
            <AlertTriangle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Content Container */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden" ref={contentRef}>
            {/* Summary Content */}
            {activeTab === 'summary' && summaryList?.summary && (
              <div className="p-4 max-h-[600px] overflow-y-auto">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">Video Summary</h2>
                  
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <h3 className="text-base font-semibold text-blue-800 mb-1">Overview</h3>
                    <p className="text-gray-700 leading-relaxed text-sm">{formatText(summaryList.summary.overview)}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-gray-800 mb-2">Key Points</h3>
                    <ul className="space-y-1.5">
                      {summaryList.summary.keyPoints?.map((point, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-flex items-center justify-center bg-blue-600 text-white rounded-full w-5 h-5 text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 text-sm">{formatText(point)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-base font-semibold text-gray-800 mb-1">Main Topics</h3>
                    <p className="text-gray-700 text-sm">{formatText(summaryList.summary.mainTopics)}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Educational Notes Content */}
            {activeTab === 'notes' && educationalNotes?.notes && (
              <div className="p-4 max-h-[600px] overflow-y-auto">
                <div className="flex justify-between items-center mb-3 pb-2 border-b">
                  <h2 className="text-xl font-bold text-gray-800">
                    {educationalNotes.notes.title}
                  </h2>
                </div>
                
                {educationalNotes.notes.topics?.map((topic, topicIndex) => {
                  const isExpanded = expandedTopics[topicIndex];
                  const topicId = `topic-${topicIndex}`;
                  
                  return (
                    <div key={topicIndex} className="mb-3 bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div 
                        className="bg-indigo-50 py-2 px-3 flex justify-between items-center cursor-pointer hover:bg-indigo-100 transition-colors"
                        onClick={() => toggleTopic(topicIndex)}
                      >
                        <h3 className="text-base font-bold text-indigo-800 flex items-center">
                          <span className="mr-2">{topicIndex + 1}.</span>
                          {formatText(topic.title)}
                        </h3>
                        <div className="flex items-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(getTopicTextContent(topic), topicId);
                            }}
                            className="mr-2 text-indigo-700 hover:text-indigo-900 p-1 rounded"
                            aria-label="Copy topic content"
                          >
                            {copyStatus[topicId] ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="p-3">
                          <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                            {formatText(topic.summary)}
                          </p>
                          
                          {/* Key Points */}
                          {topic.keyPoints && topic.keyPoints.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-gray-800 mb-2 text-sm flex items-center">
                                <span className="inline-block w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></span>
                                Key Points
                              </h4>
                              <ul className="space-y-1.5 pl-4">
                                {topic.keyPoints.map((point, i) => (
                                  <li key={i} className="text-gray-700 list-disc text-sm">
                                    {formatText(point)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Examples */}
                          {topic.examples && topic.examples.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-gray-800 mb-2 text-sm flex items-center">
                                <span className="inline-block w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                                Examples
                              </h4>
                              <div className="bg-green-50 p-3 rounded-lg">
                                <ul className="space-y-2">
                                  {topic.examples.map((example, i) => (
                                    <li key={i} className="text-gray-700 text-sm">
                                      <span className="inline-flex items-center justify-center bg-green-600 text-white rounded-full w-5 h-5 text-xs font-medium mr-2">
                                        {i + 1}
                                      </span>
                                      {formatText(example)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                          
                          {/* Code Snippets */}
                          {topic.codeSnippets && topic.codeSnippets.length > 0 && (
                            <div className="mb-3">
                              <h4 className="font-semibold text-gray-800 mb-2 text-sm flex items-center">
                                <span className="inline-block w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></span>
                                Code Snippets
                              </h4>
                              {topic.codeSnippets.map((snippet, i) => renderCodeSnippet(snippet, `${topicIndex}-${i}`))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Empty States */}
            {activeTab === 'summary' && !summaryList?.summary && !loading && (
              <div className="p-8 text-center">
                <FileText size={36} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-base font-medium text-gray-600 mb-1">No Summary Available</h3>
                <p className="text-gray-500 text-sm">Click the "Refresh Summary" button to load content.</p>
              </div>
            )}
            
            {activeTab === 'notes' && !educationalNotes?.notes && !loading && (
              <div className="p-8 text-center">
                <BookOpen size={36} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-base font-medium text-gray-600 mb-1">No Educational Notes Available</h3>
                <p className="text-gray-500 text-sm">Click the "Refresh Notes" button to load content.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MathJaxContext>
  );
};

export default SummaryList;