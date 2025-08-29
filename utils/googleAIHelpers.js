const { model, chatModel } = require('../config/googleAI');

// 텍스트 생성 함수
const textGeneration = {
  // 단일 텍스트 생성
  async generateText(prompt, options = {}) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return {
        success: true,
        text: response.text(),
        usage: result.response.usageMetadata
      };
    } catch (error) {
      console.error('Google AI 텍스트 생성 오류:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // 스트리밍 텍스트 생성
  async generateTextStream(prompt, onChunk) {
    try {
      const result = await model.generateContentStream(prompt);
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          onChunk(chunkText);
        }
      }
      
      return {
        success: true,
        usage: result.response.usageMetadata
      };
    } catch (error) {
      console.error('Google AI 스트리밍 오류:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

// 채팅 함수들
const chatFunctions = {
  // 새 채팅 시작
  async startChat(history = []) {
    try {
      const chat = chatModel.startChat({
        history: history,
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
        },
      });
      
      return {
        success: true,
        chat: chat
      };
    } catch (error) {
      console.error('Google AI 채팅 시작 오류:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // 채팅 메시지 전송
  async sendMessage(chat, message) {
    try {
      const result = await chat.sendMessage(message);
      const response = await result.response;
      
      return {
        success: true,
        text: response.text(),
        usage: result.response.usageMetadata
      };
    } catch (error) {
      console.error('Google AI 메시지 전송 오류:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // 채팅 히스토리 가져오기
  async getChatHistory(chat) {
    try {
      const history = await chat.getHistory();
      return {
        success: true,
        history: history
      };
    } catch (error) {
      console.error('Google AI 채팅 히스토리 오류:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

// 특화된 AI 기능들
const specializedFunctions = {
  // 코드 생성
  async generateCode(prompt, language = 'javascript') {
    const codePrompt = `다음 요구사항에 맞는 ${language} 코드를 생성해주세요: ${prompt}`;
    return await textGeneration.generateText(codePrompt);
  },

  // 코드 리뷰
  async reviewCode(code, language = 'javascript') {
    const reviewPrompt = `다음 ${language} 코드를 리뷰하고 개선사항을 제안해주세요:\n\n${code}`;
    return await textGeneration.generateText(reviewPrompt);
  },

  // 문서 요약
  async summarizeText(text, maxLength = 200) {
    const summaryPrompt = `다음 텍스트를 ${maxLength}자 이내로 요약해주세요:\n\n${text}`;
    return await textGeneration.generateText(summaryPrompt);
  },

  // 번역
  async translateText(text, targetLanguage) {
    const translatePrompt = `다음 텍스트를 ${targetLanguage}로 번역해주세요:\n\n${text}`;
    return await textGeneration.generateText(translatePrompt);
  },

  // 질문 답변
  async answerQuestion(question, context = '') {
    const qaPrompt = context 
      ? `다음 맥락을 바탕으로 질문에 답변해주세요:\n\n맥락: ${context}\n\n질문: ${question}`
      : `다음 질문에 답변해주세요: ${question}`;
    
    return await textGeneration.generateText(qaPrompt);
  }
};

module.exports = {
  textGeneration,
  chatFunctions,
  specializedFunctions
};
