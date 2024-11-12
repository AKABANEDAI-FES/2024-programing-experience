import styles from './Obstacle.module.css';

export const Obstacle = () => {
  const obstacles = [
    { x: 100, y: 100, width: 50, height: 50 },
    { x: 200, y: 200, width: 50, height: 50 },
  ];

  return (
    <>
      {obstacles.map((obstacle, index) => (
        <div
          key={index}
          className={styles.obstacle}
          style={{
            position: 'absolute',
            left: obstacle.x,
            top: obstacle.y,
            width: obstacle.width,
            height: obstacle.height,
            backgroundColor: 'gray',
            border: '2px solid darkgray',
          }}
        />
      ))}
    </>
  );
};
