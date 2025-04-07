import React, { useEffect, useState } from "react";
import { Check, Loader } from "lucide-react";
import { useTranscript } from "../../context/TranscriptContext";
import { useEducationalNotes } from "../../context/EducationalNotesContext";

const StepProgressBar = ({ videoId }) => {
  const {
    loading: transcriptLoading,
    transcriptData,
    currentVideoId: transcriptVideoId
  } = useTranscript();

  const {
    loading: notesLoading,
    notes,
    currentVideoId: notesVideoId
  } = useEducationalNotes();

  const [steps, setSteps] = useState([
    { id: 'transcript', label: 'Fetch Transcript', status: 'pending', visible: true },
    { id: 'notes', label: 'Fetch Notes', status: 'pending', visible: true },
    { id: 'display', label: 'Display Content', status: 'pending', visible: true }
  ]);

  // Reset steps when video ID changes
  useEffect(() => {
    if (!videoId) return;

    // Reset steps when video ID changes
    setSteps(prevSteps => {
      // If we have transcript data for this video, mark transcript step as complete
      const hasTranscriptForVideo = transcriptData && 
                                transcriptData.length > 0 && 
                                transcriptVideoId === videoId;

      return prevSteps.map(step => {
        if (step.id === 'transcript') {
          return {
            ...step,
            status: hasTranscriptForVideo ? 'complete' : 'pending',
            visible: true // Always show the transcript step
          };
        }
        // Reset other steps
        return { ...step, status: 'pending', visible: true };
      });
    });
  }, [videoId, transcriptVideoId, transcriptData]);

  // Update transcript step status
  useEffect(() => {
    if (!videoId) return;

    setSteps(prevSteps => 
      prevSteps.map(step => {
        if (step.id === 'transcript') {
          if (transcriptLoading) {
            return { ...step, status: 'loading' };
          } else if (transcriptData && transcriptData.length > 0 && transcriptVideoId === videoId) {
            return { ...step, status: 'complete' };
          } else if (!transcriptLoading && (!transcriptData || transcriptData.length === 0)) {
            return { ...step, status: 'error' };
          }
        }
        return step;
      })
    );
  }, [transcriptLoading, transcriptData, videoId, transcriptVideoId]);

  // Update notes step status - only if transcript is complete
  useEffect(() => {
    if (!videoId) return;

    setSteps(prevSteps => {
      const transcriptStep = prevSteps.find(s => s.id === 'transcript');
      
      return prevSteps.map(step => {
        if (step.id === 'notes') {
          // Only process notes step if transcript step is complete
          if (transcriptStep.status === 'complete') {
            if (notesLoading) {
              return { ...step, status: 'loading' };
            } else if (notes && notesVideoId === videoId) {
              return { ...step, status: 'complete' };
            } else if (!notesLoading && !notes) {
              return { ...step, status: 'error' };
            }
          }
        }
        return step;
      });
    });
  }, [notesLoading, notes, videoId, notesVideoId]);

  // Update display step status
  useEffect(() => {
    if (!videoId) return;

    setSteps(prevSteps => {
      const transcriptStep = prevSteps.find(s => s.id === 'transcript');
      const notesStep = prevSteps.find(s => s.id === 'notes');
      
      return prevSteps.map(step => {
        if (step.id === 'display') {
          // Display is ready when both transcript and notes are complete
          if (transcriptStep.status === 'complete' && notesStep.status === 'complete') {
            return { ...step, status: 'complete' };
          } else if (transcriptStep.status === 'error' || notesStep.status === 'error') {
            return { ...step, status: 'error' };
          } else if (transcriptStep.status === 'loading' || notesStep.status === 'loading') {
            return { ...step, status: 'loading' };
          }
        }
        return step;
      });
    });
  }, [videoId]);

  // Don't render progress bar if there's no video ID
  if (!videoId) return null;

  // Filter to only show visible steps
  const visibleSteps = steps.filter(step => step.visible);

  // Return null if there are no steps to show
  if (visibleSteps.length === 0) return null;

  return (
    <div className="my-6 px-4">
      <div className="flex items-center justify-between">
        {visibleSteps.map((step, idx) => (
          <React.Fragment key={step.id}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full 
                ${step.status === 'complete' ? 'bg-green-500 text-white' : 
                  step.status === 'loading' ? 'bg-blue-400 text-white' : 
                  step.status === 'error' ? 'bg-red-500 text-white' : 
                  'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}
              `}>
                {step.status === 'complete' ? (
                  <Check className="w-5 h-5" />
                ) : step.status === 'loading' ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : step.status === 'error' ? (
                  "!"
                ) : (
                  idx + 1
                )}
              </div>
              <span className="mt-2 text-xs text-center">{step.label}</span>
            </div>
            
            {/* Connector line (except after last step) */}
            {idx < visibleSteps.length - 1 && (
              <div 
                className={`flex-1 h-0.5 mx-2 
                  ${(visibleSteps[idx].status === 'complete') ? 
                    'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepProgressBar;