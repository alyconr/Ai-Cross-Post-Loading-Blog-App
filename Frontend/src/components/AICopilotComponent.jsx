import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import PropTypes from 'prop-types';

const CopilotPanel = ({ currentText, onSuggestionSelect, apiKey }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const copilotRef = useRef(null);
  const lastProcessedTextRef = useRef('');
  

  useEffect(() => {
    const fetchSuggestions = async () => {
      // Only fetch if we have new text and haven't already fetched suggestions for this text
      if (
        currentText && 
        currentText.length >= 50 && 
        currentText !== lastProcessedTextRef.current,
        apiKey
      ) {
        setIsLoading(true);
        lastProcessedTextRef.current = currentText;
        console.log('Fetching suggestions for:', currentText); // Debug log

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URI}/aiCopilotComponent/suggestions`,
            { text: currentText },
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true
            }
          );

          if (response.data?.suggestions) {
            // Clean up suggestions to remove any numbering
            const cleanedSuggestions = response.data.suggestions.map(suggestion => 
              suggestion.replace(/^\d+[.)]\s*/, '').trim()
            );
            setSuggestions(cleanedSuggestions);
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 1000);
    return () => clearTimeout(debounceTimer);
  }, [currentText, apiKey]);

 // Reset suggestions when currentText is empty
 useEffect(() => {
  if (!currentText) {
    setSuggestions([]);
    lastProcessedTextRef.current = '';
  }
}, [currentText]);

  // Log current state for debugging
  useEffect(() => {
    console.log('Current text:', currentText);
    console.log('Text length:', currentText?.length);
    console.log('Should show panel:', currentText && currentText.length >= 50);
  }, [currentText]);
// Don't render if there's no current text or if it's less than 50 characters

  // Don't render if conditions aren't met
  if (!currentText || currentText.length < 50) {
    console.log('Not showing panel - insufficient characters');
    return null;
  }
  return (
    <CopilotContainer ref={copilotRef}>
      <Title>AI Suggestions</Title>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <SuggestionsWrapper>
          {suggestions && suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <SuggestionCard
                key={index}
                onClick={() => {
                  console.log('Selecting suggestion:', suggestion); // Debug log
                  const cleanSuggestion = suggestion.replace(/^\d+[.)]\s*/, '').trim();
                  onSuggestionSelect(cleanSuggestion);
                  setSuggestions([]);
                  lastProcessedTextRef.current = ''; // Reset after selection
                }}
              >
                {suggestion.substring(0, 150)}... 
              </SuggestionCard>
            ))
          ) : (
            <NoSuggestionsMessage>Generating suggestions...</NoSuggestionsMessage>
          )}
        </SuggestionsWrapper>
      )}
    </CopilotContainer>
  );
};

CopilotPanel.propTypes = {
  currentText: PropTypes.string,
  onSuggestionSelect: PropTypes.func.isRequired,
  editorRef: PropTypes.object.isRequired,
  apiKey: PropTypes.string.isRequired
};

export default CopilotPanel;

const CopilotContainer = styled.div`
  position: fixed;
  right: 320px; // Adjusted position
  top: 120px; // Adjusted position
  width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 12px;
  z-index: 1000;
  opacity: 1;
  visibility: visible;
`;

const Title = styled.h3`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #333;
  font-weight: 600;
`;

const SuggestionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
`;

const SuggestionCard = styled.div`
  padding: 8px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  line-height: 1.4;

  &:hover {
    background: #e9ecef;
    transform: translateX(2px);
  }
`;

const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 15px auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const NoSuggestionsMessage = styled.div`
  text-align: center;
  color: #6c757d;
  padding: 15px;
  font-size: 13px;
  font-style: italic;
`;
