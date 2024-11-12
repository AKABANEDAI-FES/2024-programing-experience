import ConversationPage from 'features/quest/component/App';
import { useState } from 'react';
import Component from './Control.page';

export default function App() {
  // markdownText と setMarkdownText を useState で定義
  const [markdownText, setMarkdownText] = useState('');

  // デバッグ用ログ
  console.log('App: markdownText:', markdownText);
  console.log('App: setMarkdownText is a function:', typeof setMarkdownText === 'function');

  console.log('uu', setMarkdownText);

  return (
    <div>
      {/* Component に markdownText と setMarkdownText をプロップとして渡す */}
      <Component markdownText={markdownText} setMarkdownText={setMarkdownText} />
      {/* ConversationPage に markdownText を渡す */}
      <ConversationPage conversations={markdownText ? [markdownText] : []} />
    </div>
  );
}
