import React, { useEffect, useState, useRef } from 'react';
import { getEducationalNotes } from '../../utils/SumarizeUtlis';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { BookOpen, RefreshCw, AlertTriangle, Copy, Check, ChevronDown, ChevronUp, Menu, X, Download } from 'lucide-react';

const SummaryList = ({ videoId }) => {
  const [educationalNotes, setEducationalNotes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [expandedSubtopics, setExpandedSubtopics] = useState({});
  const [copyStatus, setCopyStatus] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const contentRef = useRef(null);
  const menuRef = useRef(null);

  // MathJax configuration with safeguards for null values
  const mathJaxConfig = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
    },
    startup: {
      typeset: false,
    },
    svg: {
      fontCache: 'global'
    },
    options: {
      enableMenu: false,
      renderActions: {
        addMenu: [],
        checkLoading: []
      }
    }
  };

  useEffect(() => {
    if (videoId) {
      fetchNotes();
    }
  }, [videoId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);  

  // Initialize expanded state for all topics when notes load
  useEffect(() => {
    if (educationalNotes?.notes?.topics) {
      const initialExpandState = {};
      const initialSubtopicExpandState = {};
      
      educationalNotes.notes.topics.forEach((topic, topicIndex) => {
        initialExpandState[topicIndex] = false; // All collapsed initially
        
        // Initialize subtopics expand state
        if (topic.subtopics && topic.subtopics.length > 0) {
          topic.subtopics.forEach((_, subtopicIndex) => {
            initialSubtopicExpandState[`${topicIndex}-${subtopicIndex}`] = false;
          });
        }
      });
      
      setExpandedTopics(initialExpandState);
      setExpandedSubtopics(initialSubtopicExpandState);
    }
  }, [educationalNotes]);

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getEducationalNotes(videoId);
      setEducationalNotes(result);
       
    } catch (err) {
      setError("Failed to fetch educational notes.");
    }
    setLoading(false);
  };

  // Safe format text to render LaTeX correctly with error handling
  const formatText = (text) => {
    if (!text) return "";
    
    try {
      return <MathJax hideUntilTypeset="first">{text}</MathJax>;
    } catch (error) {
      console.error("MathJax formatting error:", error);
      return text; // Fallback to plain text if MathJax fails
    }
  };

  // Toggle dark mode (now using Tailwind dark mode)
   

  // Toggle topic expansion
  const toggleTopic = (topicIndex) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicIndex]: !prev[topicIndex]
    }));
  };

  // Toggle subtopic expansion
  const toggleSubtopic = (topicIndex, subtopicIndex, e) => {
    e.stopPropagation(); // Prevent event bubbling
    const key = `${topicIndex}-${subtopicIndex}`;
    setExpandedSubtopics(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Expand or collapse all topics
  const toggleAllTopics = (expand) => {
    if (!educationalNotes?.notes?.topics) return;
    
    const newExpandState = {};
    educationalNotes.notes.topics.forEach((_, topicIndex) => {
      newExpandState[topicIndex] = expand;
    });
    setExpandedTopics(newExpandState);
    
    // Also expand/collapse all subtopics
    if (expand) {
      const newSubtopicExpandState = {};
      educationalNotes.notes.topics.forEach((topic, topicIndex) => {
        if (topic.subtopics && topic.subtopics.length > 0) {
          topic.subtopics.forEach((_, subtopicIndex) => {
            newSubtopicExpandState[`${topicIndex}-${subtopicIndex}`] = expand;
          });
        }
      });
      setExpandedSubtopics(newSubtopicExpandState);
    }
  };

  // Function to copy text to clipboard
  const copyToClipboard = async (text, id, e) => {
    if (e) e.stopPropagation(); // Prevent event bubbling
    
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
      topic.keyPoints.forEach((point) => {
        content += `• ${point}\n`;
      });
      content += "\n";
    }
    
    if (topic.formulas && topic.formulas.length > 0) {
      content += "Formulas:\n";
      topic.formulas.forEach((formula) => {
        content += `• ${formula.formula}\n`;
        if (formula.explanation) {
          content += `  Explanation: ${formula.explanation}\n`;
        }
      });
      content += "\n";
    }
    
    if (topic.examples && topic.examples.length > 0) {
      content += "Examples:\n";
      topic.examples.forEach((example) => {
        content += `• ${example}\n`;
      });
      content += "\n";
    }
    
    if (topic.codeSnippets && topic.codeSnippets.length > 0) {
      content += "Code Snippets:\n";
      topic.codeSnippets.forEach((snippet) => {
        content += `${snippet.language || 'Code'}:\n${snippet.code}\n`;
        if (snippet.explanation) {
          content += `Explanation: ${snippet.explanation}\n`;
        }
        content += "\n";
      });
    }
    
    if (topic.visualAids && topic.visualAids.length > 0) {
      content += "Visual Aids:\n";
      topic.visualAids.forEach((aid) => {
        content += `• ${aid.description}\n`;
      });
      content += "\n";
    }
    
    if (topic.subtopics && topic.subtopics.length > 0) {
      content += "Subtopics:\n";
      topic.subtopics.forEach((subtopic) => {
        content += `• ${subtopic.title}\n`;
        content += `  ${subtopic.content}\n\n`;
        
        if (subtopic.keyPoints && subtopic.keyPoints.length > 0) {
          content += "  Key Points:\n";
          subtopic.keyPoints.forEach((point) => {
            content += `  • ${point}\n`;
          });
          content += "\n";
        }
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
    
    if (educationalNotes.additionalResources?.length > 0) {
      content += "\nAdditional Resources:\n";
      educationalNotes.additionalResources.forEach((resource) => {
        content += `• ${resource}\n`;
      });
    }
    
    return content;
  };

  // Function to render code snippets with syntax highlighting
  const renderCodeSnippet = (snippet, index) => (
    <div key={index} className="bg-gray-900 dark:bg-gray-800 text-white p-3 sm:p-4 rounded-lg shadow-md mt-2 sm:mt-3 overflow-x-auto relative group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 uppercase font-semibold">{snippet.language || 'Code'}</span>
        <button
          onClick={(e) => copyToClipboard(snippet.code, `code-${index}`, e)}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded"
          aria-label="Copy code"
        >
          {copyStatus[`code-${index}`] ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="whitespace-pre-wrap text-xs sm:text-sm">
        <code>{snippet.code}</code>
      </pre>
      {snippet.explanation && (
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-700">
          <p className="text-gray-300 dark:text-gray-300 text-xs sm:text-sm">
            {formatText(snippet.explanation)}
          </p>
        </div>
      )}
    </div>
  );

  // Function to render formulas
  const renderFormula = (formula, index) => (
    <div key={index} className="bg-indigo-50 dark:bg-indigo-900 text-gray-800 dark:text-white p-3 rounded-lg mt-2 sm:mt-3">
      <div className="my-2 text-center">
        {formatText(formula.formula)}
      </div>
      {formula.explanation && (
        <div className="mt-2 text-gray-700 dark:text-gray-200 text-xs sm:text-sm">
          <strong>Explanation:</strong> {formatText(formula.explanation)}
        </div>
      )}
    </div>
  );

  // Function to render visual aids
  const renderVisualAid = (visualAid, index) => (
    <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mt-2 sm:mt-3">
      <h5 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
        {visualAid.description}
      </h5>
      {visualAid.imageUrl && (
        <div className="flex justify-center">
          <img 
            src={visualAid.imageUrl} 
            alt={visualAid.altText || visualAid.description} 
            className="max-h-32 sm:max-h-48 object-contain rounded"
          />
        </div>
      )}
    </div>
  );

  // Function to render subtopics
  const renderSubtopic = (subtopic, topicIndex, subtopicIndex) => {
    const key = `${topicIndex}-${subtopicIndex}`;
    const isExpanded = expandedSubtopics[key];
    
    return (
      <div key={subtopicIndex} className="mt-2 sm:mt-3 border-l-2 border-indigo-200 dark:border-indigo-700 pl-2 sm:pl-3">
        <div 
          className="flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded transition-colors"
          onClick={(e) => toggleSubtopic(topicIndex, subtopicIndex, e)}
        >
          <h5 className="text-xs sm:text-sm font-semibold text-indigo-700 dark:text-indigo-400">
            {formatText(subtopic.title)}
          </h5>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        
        {isExpanded && (
          <div className="ml-2 mt-2">
            <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3">
              {formatText(subtopic.content)}
            </p>
            
            {subtopic.keyPoints && subtopic.keyPoints.length > 0 && (
              <div className="mb-2 sm:mb-3">
                <h6 className="font-medium text-gray-700 dark:text-gray-300 text-xs mb-1">Key Points:</h6>
                <ul className="space-y-1 pl-4">
                  {subtopic.keyPoints.map((point, idx) => (
                    <li key={idx} className="text-gray-600 dark:text-gray-400 list-disc text-xs">
                      {formatText(point)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {subtopic.visualAids && subtopic.visualAids.length > 0 && (
              <div className="mb-2 sm:mb-3">
                <h6 className="font-medium text-gray-700 dark:text-gray-300 text-xs mb-1">Visual Aids:</h6>
                {subtopic.visualAids.map((aid, idx) => renderVisualAid(aid, `subtopic-${topicIndex}-${subtopicIndex}-${idx}`))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <MathJaxContext config={mathJaxConfig}>
      <div className=" bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-3 sm:p-4 rounded-xl shadow-lg h-[100vh] max-w-full sm:max-w-4xl mx-auto relative">
        {/* Floating Action Button */}
        <button
          
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="absolute z-10 top-5 right-7 p-3 bg-indigo-600 dark:bg-indigo-700 text-white rounded-full shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
          aria-label="Open menu"
        >
          {isMenuOpen ? <X size={15} /> : <Menu size={15} />}
        </button>
        
        {/* Floating Menu */}
        {isMenuOpen && (
          <div ref={menuRef} className="absolute z-40 top-16 right-4 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-2 w-48 sm:w-56 transition-all">
            <div className="space-y-2">
              <button 
                onClick={fetchNotes} 
                className="flex items-center w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white px-3 py-2 rounded-lg transition shadow-sm text-xs sm:text-sm"
                disabled={loading}
              >
                <RefreshCw size={14} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh Notes
              </button>
              
              
              
              {educationalNotes?.notes && (
                <>
                  <button 
                    onClick={(e) => copyToClipboard(getAllContent(), 'all-content', e)}
                    className="flex items-center w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white px-3 py-2 rounded-lg transition shadow-sm text-xs sm:text-sm"
                  >
                    {copyStatus['all-content'] ? <Check size={14} className="mr-2" /> : <Copy size={14} className="mr-2" />}
                    Copy All
                  </button>
                  
                  <button 
                    onClick={() => toggleAllTopics(true)}
                    className="flex items-center w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 text-white px-3 py-2 rounded-lg transition shadow-sm text-xs sm:text-sm"
                  >
                    <ChevronDown size={14} className="mr-2" />
                    Expand All
                  </button>
                  
                  <button 
                    onClick={() => toggleAllTopics(false)}
                    className="flex items-center w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-3 py-2 rounded-lg transition shadow-sm text-xs sm:text-sm"
                  >
                    <ChevronUp size={14} className="mr-2" />
                    Collapse All
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Loading & Error Messages */}
        {loading && (
          <div className="flex items-center justify-center py-6 sm:py-8">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-blue-600 dark:border-indigo-500 border-t-white dark:border-t-gray-800 rounded-full animate-spin"></div>
              <p className="mt-3 text-blue-600 dark:text-indigo-400 font-medium text-xs sm:text-sm">Loading content...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded-lg flex items-start mb-3 sm:mb-4 text-xs sm:text-sm">
            <AlertTriangle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Content Container */}
        {!loading && (
          <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-xl shadow-md overflow-hidden" ref={contentRef}>
            {/* Educational Notes Content */}
            {educationalNotes?.notes && (
              <div className="p-3 sm:p-4 max-h-[50vh] md:max-h-[80vh] lg:max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                    {educationalNotes.notes.title}
                  </h2>
                </div>
                
                {educationalNotes.notes.topics?.map((topic, topicIndex) => {
                  const isExpanded = expandedTopics[topicIndex];
                  const topicId = `topic-${topicIndex}`;
                  
                  return (
                    <div key={topicIndex} className="mb-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div 
                        className="bg-indigo-50 dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-gray-700 py-2 px-3 flex justify-between items-center cursor-pointer transition-colors"
                        onClick={() => toggleTopic(topicIndex)}
                      >
                        <h3 className="text-sm sm:text-base font-bold text-indigo-800 dark:text-indigo-300 flex items-center">
                          <span className="mr-2">{topicIndex + 1}.</span>
                          {formatText(topic.title)}
                        </h3>
                        <div className="flex items-center">
                          <button
                            onClick={(e) => copyToClipboard(getTopicTextContent(topic), topicId, e)}
                            className="mr-2 text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-1 rounded"
                            aria-label="Copy topic content"
                          >
                            {copyStatus[topicId] ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="p-3">
                          <p className="text-gray-700 dark:text-gray-300 mb-3 text-xs sm:text-sm leading-relaxed">
                            {formatText(topic.summary)}
                          </p>
                          
                          {/* Key Points */}
                          {topic.keyPoints && topic.keyPoints.length > 0 && (
                            <div className="mb-3 sm:mb-4">
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2 text-xs sm:text-sm flex items-center">
                                <span className="inline-block w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full mr-2"></span>
                                Key Points
                              </h4>
                              <ul className="space-y-1 sm:space-y-1.5 pl-4">
                                {topic.keyPoints.map((point, i) => (
                                  <li key={i} className="text-gray-700 dark:text-gray-300 list-disc text-xs sm:text-sm">
                                    {formatText(point)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Formulas */}
                          {topic.formulas && topic.formulas.length > 0 && (
                            <div className="mb-3 sm:mb-4">
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2 text-xs sm:text-sm flex items-center">
                                <span className="inline-block w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mr-2"></span>
                                Formulas
                              </h4>
                              {topic.formulas.map((formula, i) => renderFormula(formula, `${topicIndex}-formula-${i}`))}
                            </div>
                          )}
                          
                          {/* Examples */}
                          {topic.examples && topic.examples.length > 0 && (
                            <div className="mb-3 sm:mb-4">
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2 text-xs sm:text-sm flex items-center">
                                <span className="inline-block w-1.5 h-1.5 bg-green-600 dark:bg-green-400 rounded-full mr-2"></span>
                                Examples
                              </h4>
                              <div className="bg-green-50 dark:bg-gray-800 p-2 sm:p-3 rounded-lg">
                                <ul className="space-y-1 sm:space-y-2">
                                  {topic.examples.map((example, i) => (
                                    <li key={i} className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm flex items-start">
                                      <span className="inline-block w-1 h-1 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                                      {formatText(example)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                          
                          {/* Visual Aids */}
                          {topic.visualAids && topic.visualAids.length > 0 && (
                            <div className="mb-3 sm:mb-4">
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2 text-xs sm:text-sm flex items-center">
                                <span className="inline-block w-1.5 h-1.5 bg-amber-600 dark:bg-amber-400 rounded-full mr-2"></span>
                                Visual Aids
                              </h4>
                              {topic.visualAids.map((aid, i) => renderVisualAid(aid, `${topicIndex}-aid-${i}`))}
                            </div>
                          )}
                          
                          {/* Code Snippets */}
                          {topic.codeSnippets && topic.codeSnippets.length > 0 && (
                            <div className="mb-3 sm:mb-4">
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2 text-xs sm:text-sm flex items-center">
                                <span className="inline-block w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full mr-2"></span>
                                Code Snippets
                              </h4>
                              {topic.codeSnippets.map((snippet, i) => renderCodeSnippet(snippet, `${topicIndex}-${i}`))}
                            </div>
                          )}
                          
                          {/* Subtopics */}
                          {topic.subtopics && topic.subtopics.length > 0 && (
                            <div className="mb-3">
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2 text-xs sm:text-sm flex items-center">
                                <span className="inline-block w-1.5 h-1.5 bg-teal-600 dark:bg-teal-400 rounded-full mr-2"></span>
                                Subtopics
                              </h4>
                              {topic.subtopics.map((subtopic, i) => renderSubtopic(subtopic, topicIndex, i))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Additional Resources */}
                {educationalNotes.additionalResources && educationalNotes.additionalResources.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Additional Resources</h3>
                    <ul className="space-y-1">
                      {educationalNotes.additionalResources.map((resource, index) => (
                        <li key={index} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm">
                          <a href={resource} target="_blank" rel="noopener noreferrer">
                            {resource}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* Empty State */}
            {!educationalNotes?.notes && !loading && (
              <div className="p-6 sm:p-8 text-center">
                <BookOpen size={28} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <h3 className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300 mb-1">No Educational Notes Available</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Click the menu button to load content.</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* CSS for MathJax compatibility with Tailwind dark mode */}
      <style jsx global>{`
        .dark .MJX-TEX {
          color: #f0f0f0 !important;
        }
        
        /* Ensure proper rendering in both modes */
        .MathJax {
          display: inline !important;
          font-size: inherit !important;
        }
        
        /* Responsive font sizing for MathJax */
        @media (max-width: 640px) {
          .MathJax {
            font-size: 90% !important;
          }
        }
      `}</style>
    </MathJaxContext>
  );
};

export default SummaryList;