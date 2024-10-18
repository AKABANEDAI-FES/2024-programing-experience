import { Playground } from 'features/playground/Playground';
import { Layout } from 'layouts/Layout';

import ConversationPage from 'features/quest/component/App';
import styles from './index.module.css';

const Home = () => {
  return (
    <Layout
      render={(user) => (
        <div className={styles.container}>
          <div className={styles.title}>Hello {user.signInName}!</div>
          <Playground />
          <ConversationPage />
        </div>
      )}
    />
  );
};

export default Home;
