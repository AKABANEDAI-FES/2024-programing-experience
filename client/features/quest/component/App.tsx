import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './App.module.css';
import { Button } from './Button';
import { Card, CardContent } from './Card';

interface ConversationPageProps {
  conversations?: string[];
}

const ConversationPage: React.FC<ConversationPageProps> = ({ conversations = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const handleNext = () => {
    if (currentIndex < conversations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardContent className={styles.cardContent}>
          {showAll ? (
            conversations.map((conversation, index) => (
              <div key={index} className={styles.cardContent}>
                <ReactMarkdown>{conversation}</ReactMarkdown>
              </div>
            ))
          ) : (
            <ReactMarkdown>{conversations[currentIndex]}</ReactMarkdown>
          )}
        </CardContent>
      </Card>
      <div className={styles.buttonContainer}>
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0 || showAll}
          className={styles.button}
        >
          前へ
        </Button>
        <Button onClick={toggleShowAll} className={styles.button}>
          {showAll ? '1つずつ表示' : '全て表示'}
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentIndex === conversations.length - 1 || showAll}
          className={styles.button}
        >
          次へ
        </Button>
      </div>
    </div>
  );
};

export default ConversationPage;
