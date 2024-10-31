import { Playground } from 'features/playground/Playground';
import ConversationPage from 'features/quest/component/App';
import styles from './index.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Hello</div>

      <Playground />
      <ConversationPage />
    </div>
  );
};

export default Home;
