// src/components/summary/SummaryList.jsx
import React, { useContext, useEffect } from 'react';
import { Clock, BookOpen, Award, List, Book, Link, Code, BookmarkIcon, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { useEducationalNotes } from '../../context/EducationalNotesContext';
import { useTranscript } from '../../context/TranscriptContext';
import StepProgressBar from '../ui/StepProgressBar'; // Import the StepProgressBar component

const SummaryList = ({ videoId }) => {
 
  const {
    transcriptData,
    loading: transcriptLoading,
    setCurrentVideoId : setTranscriptVideoId,
  } = useTranscript();

   
  // Custom hook to manage educational notes state and actions
  const {
    notes,
    loading: notesLoading,
    error,
    expandedSections,
    expandedTopics,
    currentVideoId,
    setCurrentVideoId,
    toggleSection,
    toggleTopic,
    handleTimestampClick
  } = useEducationalNotes();

  // MathJax configuration
  const mathJaxConfig = {
    tex: {
      inlineMath: [['$', '$']],
      displayMath: [['$$', '$$']]
    },
    startup: {
      typeset: false
    }
  };

  // Set current video ID when component mounts or videoId prop changes
  useEffect(() => {
    if (videoId !== currentVideoId) {
      setCurrentVideoId(videoId);
      setTranscriptVideoId(videoId);
    }
  }, [videoId, currentVideoId]);

  // Render formulas with MathJax
  const renderFormula = (formula) => {
    return (
      <MathJax>
        <div>{formula}</div>
      </MathJax>
    );
  };

  return (
    <>
      {/* Only show StepProgressBar when loading */}
      {(notesLoading || transcriptLoading) && (
        <StepProgressBar videoId={videoId} />
      )}
      
      {/* Content Area */}
      {notesLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 dark:border-orange-400"></div>
        </div>
      ) : !transcriptData || transcriptData.length === 0 ? (
        <>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400 px-4 py-3 rounded relative">
            <span className="block">No Transcript available.</span>
          </div>
          {transcriptLoading && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400 px-4 py-3 rounded relative mt-2">
              <span className="block">Fetching Transcript...</span>
            </div>
          )}
        </>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 px-4 py-3 rounded relative">
          <span className="block">Error: {error}</span>
        </div>
      ) : notes === null ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400 px-4 py-3 rounded relative">
          <span className="block">No educational notes available.</span>
        </div>
      ) : (
        <MathJaxContext config={mathJaxConfig}>
          <MathJax className="h-full">
            <div className="flex-1 overflow-y-auto h-full bg-gray-50 dark:bg-gray-900">
              <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-orange-100 shadow top-0 z-10 dark:bg-gray-900">
                  <div className="px-4 py-4">
                    <h6 className="text-xl md:text-2xl font-bold text-black dark:text-white">{notes.title}</h6>
                    <div className="mt-1 flex items-center">
                      <Award className="h-4 w-4 text-black dark:text-white mr-1" />
                      <span className="text-xs font-medium text-black dark:text-white">{notes.difficulty} Level</span>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="px-4 py-4 space-y-4">
                  {/* OVERVIEW SECTION */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <button
                      className="w-full px-4 py-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700"
                      onClick={() => toggleSection('overview')}
                    >
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Course Overview</h2>
                      {expandedSections.overview ?
                        <ChevronUp className="h-5 w-5 text-orange-500 dark:text-orange-400" /> :
                        <ChevronDown className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                      }
                    </button>

                    {expandedSections.overview && (
                      <div className="p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{notes.overview}</p>

                        {/* Prerequisites - Compact List */}
                        {notes.prerequisites && notes.prerequisites.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2 flex items-center text-gray-900 dark:text-white">
                              <BookOpen className="h-4 w-4 mr-1 text-orange-500 dark:text-orange-400" />
                              Prerequisites
                            </h3>
                            <ul className="list-disc text-sm text-gray-700 dark:text-gray-300 pl-5 space-y-1">
                              {notes.prerequisites.map((prereq, idx) => (
                                <li key={idx}>{prereq}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Summary - If Available */}
                        {notes.summary && (
                          <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2 flex items-center text-gray-900 dark:text-white">
                              <FileText className="h-4 w-4 mr-1 text-orange-500 dark:text-orange-400" />
                              Summary
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{notes.summary}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* TOPICS SECTION */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <button
                      className="w-full px-4 py-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700"
                      onClick={() => toggleSection('topics')}
                    >
                      <h2 className="text-lg font-semibold flex items-center text-gray-900 dark:text-white">
                        <List className="h-5 w-5 mr-2 text-orange-500 dark:text-orange-400" />
                        Topics
                      </h2>
                      {expandedSections.topics ?
                        <ChevronUp className="h-5 w-5 text-orange-500 dark:text-orange-400" /> :
                        <ChevronDown className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                      }
                    </button>

                    {expandedSections.topics && (
                      <div>
                        {notes.topics.map((topic, topicIdx) => (
                          <div key={topicIdx} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                            <button
                              className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700"
                              onClick={() => toggleTopic(topicIdx)}
                            >
                              <div className="flex items-center">
                                <h3 className="font-medium text-sm text-gray-900 dark:text-white">{topic.title}</h3>
                                {topic.displayStartTime && (
                                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 ml-2">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {topic.displayStartTime}
                                  </div>
                                )}
                              </div>
                              {expandedTopics[topicIdx] ?
                                <ChevronUp className="h-4 w-4 text-orange-500 dark:text-orange-400" /> :
                                <ChevronDown className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                              }
                            </button>

                            {expandedTopics[topicIdx] && (
                              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900">
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{topic.explanation}</p>

                                {/* Key Points */}
                                {topic.keyPoints && topic.keyPoints.length > 0 && (
                                  <div className="mb-4">
                                    <h3 className="text-sm font-medium mb-2 flex items-center text-gray-900 dark:text-white">
                                      <BookmarkIcon className="h-4 w-4 mr-1 text-orange-500 dark:text-orange-400" />
                                      Key Points
                                    </h3>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                      {topic.keyPoints.map((point, idx) => (
                                        <li key={idx}>{point}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Code Snippets */}
                                {topic.codeSnippets && topic.codeSnippets.length > 0 && (
                                  <div className="mb-4">
                                    <h3 className="text-sm font-medium mb-2 flex items-center text-gray-900 dark:text-white">
                                      <Code className="h-4 w-4 mr-1 text-orange-500 dark:text-orange-400" />
                                      Code Examples
                                    </h3>
                                    {topic.codeSnippets.map((snippet, idx) => (
                                      <div key={idx} className="mb-4 last:mb-0">
                                        {snippet.displayTime && (
                                          <button
                                            className="text-xs text-orange-600 dark:text-orange-400 mb-1 flex items-center"
                                            onClick={() => handleTimestampClick(snippet.timestamp)}
                                          >
                                            <Clock className="h-3 w-3 mr-1" />
                                            {snippet.displayTime}
                                          </button>
                                        )}
                                        <div className="rounded-md overflow-hidden">
                                          <SyntaxHighlighter
                                            language={snippet.language || 'javascript'}
                                            style={atomOneDark}
                                            customStyle={{ fontSize: '0.8rem', padding: '0.75rem' }}
                                            wrapLines={true}
                                            lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
                                          >
                                            {snippet.code}
                                          </SyntaxHighlighter>
                                        </div>
                                        {snippet.explanation && (
                                          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{snippet.explanation}</p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Formulas */}
                                {topic.formulas && topic.formulas.length > 0 && (
                                  <div className="mb-4">
                                    <h3 className="text-sm font-medium mb-2 flex items-center text-gray-900 dark:text-white">
                                      <BookmarkIcon className="h-4 w-4 mr-1 text-orange-500 dark:text-orange-400" />
                                      Formulas
                                    </h3>
                                    {topic.formulas.map((formula, idx) => (
                                      <div key={idx} className="mb-3 last:mb-0 p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                                        <div className="font-mono text-sm break-words text-gray-900 dark:text-white">
                                          {renderFormula(formula.formula)}
                                        </div>
                                        {formula.explanation && (
                                          <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">{formula.explanation}</p>
                                        )}
                                        {formula.displayTime && (
                                          <button
                                            className="text-xs text-orange-600 dark:text-orange-400 mt-1 flex items-center"
                                            onClick={() => handleTimestampClick(formula.timestamp)}
                                          >
                                            <Clock className="h-3 w-3 mr-1" />
                                            {formula.displayTime}
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Examples */}
                                {topic.examples && topic.examples.length > 0 && (
                                  <div>
                                    <h3 className="text-sm font-medium mb-2 flex items-center text-gray-900 dark:text-white">
                                      <Book className="h-4 w-4 mr-1 text-orange-500 dark:text-orange-400" />
                                      Examples
                                    </h3>
                                    {topic.examples.map((example, idx) => (
                                      <div key={idx} className="mb-3 last:mb-0 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-md">
                                        <div className="font-medium text-sm text-gray-900 dark:text-white">{example.text}</div>
                                        {example.explanation && (
                                          <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">{example.explanation}</p>
                                        )}
                                        {example.displayTime && (
                                          <button
                                            className="text-xs text-orange-600 dark:text-orange-400 mt-1 flex items-center"
                                            onClick={() => handleTimestampClick(example.timestamp)}
                                          >
                                            <Clock className="h-3 w-3 mr-1" />
                                            {example.displayTime}
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* RESOURCES SECTION */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
                    <button
                      className="w-full px-4 py-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700"
                      onClick={() => toggleSection('resources')}
                    >
                      <h2 className="text-lg font-semibold flex items-center text-gray-900 dark:text-white">
                        <Link className="h-5 w-5 mr-2 text-orange-500 dark:text-orange-400" />
                        Additional Resources
                      </h2>
                      {expandedSections.resources ?
                        <ChevronUp className="h-5 w-5 text-orange-500 dark:text-orange-400" /> :
                        <ChevronDown className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                      }
                    </button>

                    {expandedSections.resources && (
                      <div className="p-4">
                        {notes.additionalResources && notes.additionalResources.length > 0 ? (
                          <div className="space-y-3">
                            {notes.additionalResources.map((resource, idx) => (
                              <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <h3 className="font-medium text-sm text-orange-600 dark:text-orange-400">{resource.title}</h3>
                                {resource.description && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{resource.description}</p>
                                )}
                                {resource.link && (
                                  <a
                                    href={resource.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 inline-flex items-center text-xs font-medium text-orange-600 dark:text-orange-400"
                                  >
                                    Visit Resource
                                    <svg className="ml-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400">No additional resources available.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </MathJax>
        </MathJaxContext>
      )}
    </>
  );
};

export default SummaryList;