// 1. 필요한 모듈들을 불러옵니다.
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 2. express 앱을 생성합니다.
const app = express();

// 3. Supabase 클라이언트를 불러옵니다.
const supabase = require('./config/supabase');

// 4. Google AI 클라이언트를 불러옵니다.
const { textGeneration, chatFunctions, specializedFunctions } = require('./utils/googleAIHelpers');

// 3. 포트 번호를 설정합니다.
// process.env.PORT는 배포 환경에서 제공하는 포트를 사용하고, 없으면 3000번을 사용합니다.
const port = process.env.PORT || 3000;

// 4. 미들웨어 설정
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://newchatai-pi.vercel.app', 'https://your-frontend-domain.netlify.app']
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 정적 파일 제공 (예: /public 아래 자산)
app.use(express.static('public'));

// 5. 루트 경로('/')에 대한 GET 요청을 처리하는 라우터를 설정합니다.
app.get('/', (req, res) => {
  res.json({
    message: 'NewChatAI API Server',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// 간단한 채팅 UI 제공
app.get('/chat-ui', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// 6. 헬스체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 7. Supabase 연결 테스트 라우트
app.get('/test-supabase', async (req, res) => {
  try {
    // Supabase 연결 테스트
    const { data, error } = await supabase.from('test').select('*').limit(1);
    
    if (error) {
      console.error('Supabase 연결 오류:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Supabase 연결 실패', 
        error: error.message 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Supabase 연결 성공!', 
      data: data 
    });
  } catch (error) {
    console.error('서버 오류:', error);
    res.status(500).json({ 
      success: false, 
      message: '서버 오류', 
      error: error.message 
    });
  }
});

// 8. Google AI 테스트 라우트들
app.get('/test-google-ai', async (req, res) => {
  try {
    const result = await textGeneration.generateText('안녕하세요! 간단한 테스트 메시지입니다.');
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Google AI 연결 실패',
        error: result.error
      });
    }
    
    res.json({
      success: true,
      message: 'Google AI 연결 성공!',
      response: result.text
    });
  } catch (error) {
    console.error('Google AI 테스트 오류:', error);
    res.status(500).json({
      success: false,
      message: 'Google AI 테스트 오류',
      error: error.message
    });
  }
});

// 9. Google AI 채팅 라우트
app.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: '메시지가 필요합니다.'
      });
    }
    
    // 새 채팅 시작
    const chatResult = await chatFunctions.startChat(history);
    
    if (!chatResult.success) {
      return res.status(500).json({
        success: false,
        message: '채팅 시작 실패',
        error: chatResult.error
      });
    }
    
    // 메시지 전송
    const response = await chatFunctions.sendMessage(chatResult.chat, message);
    
    if (!response.success) {
      return res.status(500).json({
        success: false,
        message: '메시지 전송 실패',
        error: response.error
      });
    }
    
    res.json({
      success: true,
      response: response.text,
      usage: response.usage
    });
  } catch (error) {
    console.error('채팅 오류:', error);
    res.status(500).json({
      success: false,
      message: '채팅 오류',
      error: error.message
    });
  }
});

// 10. 코드 생성 라우트
app.post('/generate-code', async (req, res) => {
  try {
    const { prompt, language = 'javascript' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: '프롬프트가 필요합니다.'
      });
    }
    
    const result = await specializedFunctions.generateCode(prompt, language);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: '코드 생성 실패',
        error: result.error
      });
    }
    
    res.json({
      success: true,
      code: result.text,
      usage: result.usage
    });
  } catch (error) {
    console.error('코드 생성 오류:', error);
    res.status(500).json({
      success: false,
      message: '코드 생성 오류',
      error: error.message
    });
  }
});


// 11. Vercel 서버리스에서는 앱을 내보내고, 로컬 실행 시에만 포트 리슨
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // 서버가 시작되면 콘솔에 메시지를 출력합니다.
  app.listen(port, () => {
    console.log(`✅ Server is running on http://localhost:${port}`);
  });
}
 