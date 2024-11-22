import React, { createContext, useContext, useState, useCallback } from 'react';
import { Feedback } from '@/components/ui/Feedback';

interface FeedbackContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feedbackState, setFeedbackState] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    show: false,
    type: 'success',
    message: '',
  });

  const showFeedback = useCallback((type: 'success' | 'error', message: string) => {
    setFeedbackState({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setFeedbackState(prev => ({ ...prev, show: false }));
    }, 3000);
  }, []);

  const showSuccess = useCallback((message: string) => {
    showFeedback('success', message);
  }, [showFeedback]);

  const showError = useCallback((message: string) => {
    showFeedback('error', message);
  }, [showFeedback]);

  return (
    <FeedbackContext.Provider value={{ showSuccess, showError }}>
      {children}
      <Feedback
        show={feedbackState.show}
        type={feedbackState.type}
        message={feedbackState.message}
      />
    </FeedbackContext.Provider>
  );
};
