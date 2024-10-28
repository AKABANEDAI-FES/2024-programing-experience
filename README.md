# 2024 - プログラミング体験企画

2024年度赤羽台祭のプログラミング体験企画です

## Development

https://nodejs.org/en で v20 以上をインストール

```sh
$ git clone https://github.com/frouriojs/catapult.git
$ cd catapult
$ rm -rf .git
$ git init
```

```sh
$ npm i
$ npm i --prefix client
$ npm i --prefix server
```

```sh
$ cp client/.env.example client/.env
$ cp server/.env.example server/.env
```

```sh
$ docker compose up -d
```

### 開発サーバー起動

```sh
$ npm run notios
```

## ローカルでのアカウント作成方法

Docker の Inbucket に仮想メールが届くため任意のメールアドレスでアカウント作成可能

検証コード含めて開発時のメールは全て http://localhost:2501 のヘッダー中央の「Recent Mailboxes」に届く

## Deploy

- `Dockerfile` でデプロイ可能

### デプロイ検証済みPaaS

- [Render](https://render.com)
- [Railway](https://railway.app)

### 外部連携サービス

- AWS Cognito
- AWS S3 or Cloudflare R2

ヘルスチェック用エンドポイント

`/api/health`

### Dockerfile を用いたデプロイ時の環境変数

```sh
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=
NEXT_PUBLIC_COGNITO_USER_POOL_ID=
NEXT_PUBLIC_COGNITO_POOL_ENDPOINT=
COGNITO_ACCESS_KEY=
COGNITO_SECRET_KEY=
COGNITO_REGION=
DATABASE_URL=
S3_ACCESS_KEY=
S3_BUCKET=
S3_ENDPOINT=
S3_REGION=
S3_SECRET_KEY=
PORT= # optional
```

## MinIO Console

http://localhost:9001

## PostgreSQL UI

```sh
$ cd server
$ npx prisma studio
```
