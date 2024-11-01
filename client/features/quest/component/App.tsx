import { Card, CardContent, CardHeader, CardTitle } from 'pages/questEditor/Card';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './App.module.css';
import { Button } from './Button';

interface ConversationPageProps {
  conversations?: string[];
}
//eslint-disable-next-line complexity
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
    <Card className={styles.card}>
      <CardHeader>
        <CardTitle>会話</CardTitle>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        {showAll ? (
          conversations.map((conversation, index) => (
            <div key={index} className={styles.conversation}>
              <ReactMarkdown>{conversation}</ReactMarkdown>
            </div>
          ))
        ) : conversations.length > 0 ? (
          <ReactMarkdown>{conversations[currentIndex]}</ReactMarkdown>
        ) : (
          <p>会話がありません。</p>
        )}
      </CardContent>
      <div className={styles.buttonContainer}>
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0 || showAll || conversations.length === 0}
          className={styles.button}
        >
          前へ
        </Button>
        <Button
          onClick={toggleShowAll}
          className={styles.button}
          disabled={conversations.length === 0}
        >
          {showAll ? '1つずつ表示' : '全て表示'}
        </Button>
        <Button
          onClick={handleNext}
          disabled={
            currentIndex === conversations.length - 1 || showAll || conversations.length === 0
          }
          className={styles.button}
        >
          次へ
        </Button>
      </div>
    </Card>
  );
};

export default ConversationPage;
