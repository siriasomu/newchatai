const supabase = require('../config/supabase');

// 사용자 관련 함수들
const userHelpers = {
  // 사용자 생성
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select();
    
    return { data, error };
  },

  // 사용자 조회
  async getUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  // 사용자 목록 조회
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    return { data, error };
  },

  // 사용자 업데이트
  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select();
    
    return { data, error };
  },

  // 사용자 삭제
  async deleteUser(id) {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    return { data, error };
  }
};

// 채팅 관련 함수들
const chatHelpers = {
  // 채팅 메시지 생성
  async createMessage(messageData) {
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select();
    
    return { data, error };
  },

  // 채팅방의 메시지들 조회
  async getMessagesByRoomId(roomId) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });
    
    return { data, error };
  },

  // 채팅방 생성
  async createRoom(roomData) {
    const { data, error } = await supabase
      .from('rooms')
      .insert([roomData])
      .select();
    
    return { data, error };
  },

  // 사용자의 채팅방 목록 조회
  async getUserRooms(userId) {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    return { data, error };
  }
};

// 인증 관련 함수들
const authHelpers = {
  // 이메일로 사용자 찾기
  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    return { data, error };
  },

  // 로그인 검증
  async validateLogin(email, password) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();
    
    return { data, error };
  }
};

module.exports = {
  userHelpers,
  chatHelpers,
  authHelpers
};
