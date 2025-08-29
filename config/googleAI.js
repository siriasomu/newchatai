const { GoogleGenerativeAI } = require('@google/generative-ai');

// Google AI 설정
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || 'your_google_api_key');

// 모델 설정 (업데이트: 최신 Gemini 모델로 변경)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// 채팅 모델 설정
const chatModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

module.exports = {
  genAI,
  model,
  chatModel
};
