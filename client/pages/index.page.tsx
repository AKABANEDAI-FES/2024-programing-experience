import { Playground } from 'features/playground/Playground';
import { Layout } from 'layouts/Layout';
import styles from './index.module.css';

const Home = () => {
  return (
    <Layout
      render={(user) => (
        <div className={styles.container}>
          <div className={styles.title}>Hello {user.displayName}!</div>
          <Playground />
        </div>
      )}
    />
  );
};

export default Home;
