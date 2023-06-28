# Niconico React Vjs

ニコニコ動画のプレイヤーを React で Videojs を使って再生するライブラリ

## 注意点

- ### 360p までしか再生できません

  ニコニコ埋め込みプレイヤーのセッションを使用しているため。

- ### CORS は解決できません

  通常のブラウザで使用すると CORS ポリシーに違反するため、使用不可です。

  Userscript で`embed.nicovideo.jp`を React に書き換え、このライブラリを読み込むスクリプトを作成し、任意のページへ`embed.nicovideo.jp`を iframe として読み込むという使用方法を想定しています。

## Usage

App.tsx

```tsx
import {
  Comments,
  NicoReactVjsLayerItem,
  NiconicoReactVjs,
} from "niconico-react-vjs";
import "niconico-react-vjs/dist/style.css";

function App() {
  return (
    <NiconicoReactVjs
      videoid="sm36119058"
      autoPlay
      controls
      width={1280}
      height={720}
    >
      <Comments>
        <NicoReactVjsLayerItem>Layer</NicoReactVjsLayerItem>
      </Comments>
    </NiconicoReactVjs>
  );
}

export default App;
```

## Comments

```ts
import { Comments } from "niconico-react-vjs";
```

コメントを表示するコンポーネントです。
`NiconicoReactVjs`コンポーネント内に入れる事で使用できます。

## useComment()

```tsx
import { useComment } from "niconico-react-vjs";

export function Example() {
  const comment = useComment();
  //hide comment
  comment.disable();
  //show comment
  comment.enable();

  //is show
  comment.get();

  return <div></div>;
}
```

`NiconicoReactVjs`コンポーネントの子コンポーネントから使用可能です

コメントのコンテクストを使用できます。

コメント非表示の切り替えと、表示状態を取得できます。

## useVideoJS

```tsx
import { useVideoJS } from "niconico-react-vjs";
const player = useVideoJS();
```

videojs の player を取得できます。
`NiconicoReactVjs`コンポーネントの子コンポーネントから使用可能です。
