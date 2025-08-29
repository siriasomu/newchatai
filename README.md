# NewChatAI

Express.js와 Supabase를 사용한 채팅 애플리케이션입니다.

## 🚀 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Google AI Configuration
GOOGLE_API_KEY=your_google_api_key

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. Supabase 프로젝트 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트를 생성하세요.
2. 프로젝트 설정에서 URL과 anon key를 복사하세요.
3. `.env` 파일에 복사한 값들을 붙여넣으세요.

### 4. Google AI 설정

1. [Google AI Studio](https://makersuite.google.com/app/apikey)에서 API 키를 생성하세요.
2. 생성된 API 키를 `.env` 파일의 `GOOGLE_API_KEY`에 설정하세요.

### 5. 데이터베이스 테이블 생성

Supabase SQL Editor에서 다음 테이블들을 생성하세요:

#### Users 테이블
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  username VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Rooms 테이블
```sql
CREATE TABLE rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Messages 테이블
```sql
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  room_id UUID REFERENCES rooms(id),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. 서버 실행

#### 개발 모드 (nodemon 사용)
```bash
npm run dev
```

#### 프로덕션 모드
```bash
npm start
```

### 7. Vercel 배포

#### 자동 배포 설정
1. [Vercel](https://vercel.com)에 가입하고 GitHub 계정을 연결하세요.
2. "New Project"를 클릭하고 GitHub 저장소를 선택하세요.
3. 프로젝트 설정에서 다음 환경 변수를 추가하세요:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `GOOGLE_API_KEY`
4. "Deploy"를 클릭하면 자동으로 배포됩니다.

#### 수동 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

## 📁 프로젝트 구조

```
newchatai/
├── app.js                 # 메인 애플리케이션 파일
├── package.json           # 프로젝트 설정
├── nodemon.json          # nodemon 설정
├── vercel.json           # Vercel 배포 설정
├── config/
│   ├── supabase.js       # Supabase 클라이언트 설정
│   └── googleAI.js       # Google AI 클라이언트 설정
├── utils/
│   ├── supabaseHelpers.js # Supabase 헬퍼 함수들
│   └── googleAIHelpers.js # Google AI 헬퍼 함수들
└── README.md             # 프로젝트 문서
```

## 🔧 API 엔드포인트

### 기본 엔드포인트
- `GET /` - API 서버 정보
- `GET /health` - 헬스체크
- `GET /test-supabase` - Supabase 연결 테스트
- `GET /test-google-ai` - Google AI 연결 테스트

### AI 기능 엔드포인트
- `POST /chat` - Google AI 채팅
- `POST /generate-code` - 코드 생성

## 🛠️ 사용된 기술

- **Backend**: Express.js
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Generative AI (Gemini)
- **Development**: Nodemon
- **Environment**: dotenv
- **Deployment**: Vercel
- **CORS**: Cross-Origin Resource Sharing

## 📝 개발 가이드

### Supabase 헬퍼 함수 사용법

```javascript
const { userHelpers, chatHelpers, authHelpers } = require('./utils/supabaseHelpers');

// 사용자 생성
const { data, error } = await userHelpers.createUser({
  email: 'user@example.com',
  password: 'password123',
  username: 'username'
});

// 채팅 메시지 생성
const { data, error } = await chatHelpers.createMessage({
  content: 'Hello, World!',
  room_id: 'room-uuid',
  user_id: 'user-uuid'
});
```

### Google AI 헬퍼 함수 사용법

```javascript
const { textGeneration, chatFunctions, specializedFunctions } = require('./utils/googleAIHelpers');

// 텍스트 생성
const result = await textGeneration.generateText('안녕하세요!');

// 채팅 시작
const chatResult = await chatFunctions.startChat();
const response = await chatFunctions.sendMessage(chatResult.chat, '안녕하세요!');

// 코드 생성
const codeResult = await specializedFunctions.generateCode('배열을 정렬하는 함수', 'javascript');
```

## 🔒 보안 주의사항

- `.env` 파일을 `.gitignore`에 추가하여 민감한 정보가 노출되지 않도록 하세요.
- 프로덕션 환경에서는 강력한 비밀번호 해싱을 사용하세요.
- Supabase RLS (Row Level Security)를 설정하여 데이터 접근을 제한하세요.

## 📞 지원

문제가 발생하면 이슈를 생성해주세요.
