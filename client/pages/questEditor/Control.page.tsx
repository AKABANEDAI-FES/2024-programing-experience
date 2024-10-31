import { useState } from 'react';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import styles from './Control.module.css';
import { Textarea } from './Texearea';

interface ComponentProps {
  markdownText: string;
  setMarkdownText: (text: string) => void;
}
export default function Component({ markdownText, setMarkdownText }: ComponentProps) {
  // 一時的な入力フィールドの状態
  const [inputText, setInputText] = useState(markdownText); // 初期値として markdownText を使用

  const [grid, setGrid] = useState(Array(10).fill(Array(10).fill(false)));

  const toggleCell = (rowIndex: number, colIndex: number) => {
    const newGrid = grid.map((row, i) =>
      i === rowIndex ? row.map((cell: boolean, j: number) => (j === colIndex ? !cell : cell)) : row,
    );
    setGrid(newGrid);
  };

  // テキスト送信ボタンのクリックイベント
  const handleSendText = () => {
    setMarkdownText(inputText); // 入力されたテキストを親コンポーネントに渡す
    setInputText(''); // テキスト送信後にフィールドをクリア
  };
  console.log('aa', inputText);

  return (
    <div className={styles.container}>
      <Card>
        <CardHeader>
          <CardTitle>コース作成</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={styles.grid}>
            {grid.map((row, rowIndex) =>
              row.map((cell: boolean, colIndex: number) => (
                <Button
                  key={`${rowIndex}-${colIndex}`}
                  variant={cell ? 'selected' : 'outline'}
                  className={styles.gridCell}
                  onClick={() => toggleCell(rowIndex, colIndex)}
                />
              )),
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>テキスト入力</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 入力フィールドの状態は inputText に保持 */}
          <Textarea
            placeholder="マークダウンテキストを入力してください..."
            value={inputText} // 初期状態として markdownText を反映
            onChange={(e) => setInputText(e.target.value)} // 入力内容を一時的に保存
            className={styles.textarea}
          />
          {/* テキスト送信ボタン */}
          <Button onClick={handleSendText} className={styles.sendButton}>
            テキスト送信
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
