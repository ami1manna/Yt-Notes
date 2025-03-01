import React, { useEffect, useState } from 'react';
import { getEducationalNotes, getSummary } from '../../utils/SumarizeUtlis';

const SummaryList = ({ videoId }) => {
  const [summaryList, setSummaryList] = useState(null);
  const [educationalNotes, setEducationalNotes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (videoId) {
      fetchSummary();
      fetchNotes();
    }
  }, [videoId]);

  const fetchSummary = async () => {
    setLoading(true);
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
    try {
      const result = await getEducationalNotes(videoId);
      setEducationalNotes(result);
      console.log("Educational Notes:", result);
    } catch (err) {
      setError("Failed to fetch educational notes.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Buttons */}
      <div className="flex space-x-4 mb-4">
        <button onClick={fetchSummary} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
          Fetch Summary
        </button>
        <button onClick={fetchNotes} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
          Fetch Notes
        </button>
      </div>

      {/* Loading & Error Messages */}
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Scrollable Content Container */}
      <div className="max-h-[500px] overflow-y-auto border border-gray-300 rounded-lg p-4 bg-white shadow-lg">
        
        {/* Summary Section */}
        {summaryList?.summary && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Summary</h2>
            <p className="text-gray-700"><strong>Overview:</strong> {summaryList.summary.overview}</p>
            <h3 className="font-medium text-gray-800 mt-3">Key Points:</h3>
            <ul className="list-disc list-inside text-gray-700">
              {summaryList.summary.keyPoints?.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
            <p className="text-gray-700 mt-3"><strong>Main Topics:</strong> {summaryList.summary.mainTopics}</p>
          </div>
        )}

        {/* Educational Notes Section */}
        {educationalNotes?.notes && (
          <div className="border-t border-gray-300 pt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{educationalNotes.notes.title}</h2>
            {educationalNotes.notes.topics?.map((topic, index) => (
              <div key={index} className="border-b border-gray-300 pb-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{topic.title}</h3>
                <p className="text-gray-700">{topic.summary}</p>

                {/* Key Points */}
                {topic.keyPoints && (
                  <>
                    <h4 className="font-medium text-gray-800 mt-3">Key Points:</h4>
                    <ul className="list-disc list-inside text-gray-700">
                      {topic.keyPoints.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </>
                )}

                {/* Examples */}
                {topic.examples && topic.examples.length > 0 && (
                  <>
                    <h4 className="font-medium text-gray-800 mt-3">Examples:</h4>
                    <ul className="list-disc list-inside text-gray-700">
                      {topic.examples.map((example, i) => (
                        <li key={i}>{example}</li>
                      ))}
                    </ul>
                  </>
                )}

                {/* Code Snippets */}
                {topic.codeSnippets && topic.codeSnippets.length > 0 && (
                  <>
                    <h4 className="font-medium text-gray-800 mt-3">Code Snippets:</h4>
                    {topic.codeSnippets.map((snippet, i) => (
                      <div key={i} className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto mt-2">
                        <pre className="whitespace-pre-wrap">
                          <code>{snippet.code}</code>
                        </pre>
                        <p className="text-gray-300 mt-2"><strong>Explanation:</strong> {snippet.explanation}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryList;
