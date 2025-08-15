// voice-chat.js
Page({
  data: {
    chatMessages: [],
    isRecording: false,
    isProcessing: false,
    isTyping: false,
    showPermissionTip: false,
    scrollToView: '',
    currentTime: '',
    recordingManager: null,
    tempFilePath: ''
  },

  onLoad() {
    this.initRecordingManager();
    this.updateCurrentTime();
    this.checkPermission();
  },

  onShow() {
    // 页面显示时更新时间
    this.updateCurrentTime();
  },

  // 初始化录音管理器
  initRecordingManager() {
    this.recordingManager = wx.getRecorderManager();
    
    this.recordingManager.onStart(() => {
      console.log('录音开始');
      this.setData({ isRecording: true });
    });

    this.recordingManager.onStop((res) => {
      console.log('录音结束', res);
      this.setData({ 
        isRecording: false,
        tempFilePath: res.tempFilePath 
      });
      this.processVoiceMessage(res.tempFilePath);
    });

    this.recordingManager.onError((res) => {
      console.error('录音错误', res);
      wx.showToast({
        title: '录音失败',
        icon: 'none'
      });
      this.setData({ isRecording: false });
    });
  },

  // 检查录音权限
  checkPermission() {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.record']) {
          this.setData({ showPermissionTip: true });
        }
      }
    });
  },

  // 请求录音权限
  requestPermission() {
    wx.authorize({
      scope: 'scope.record',
      success: () => {
        this.setData({ showPermissionTip: false });
        wx.showToast({
          title: '权限获取成功',
          icon: 'success'
        });
      },
      fail: () => {
        wx.showModal({
          title: '权限被拒绝',
          content: '请在设置中开启录音权限',
          showCancel: false
        });
      }
    });
  },

  // 开始录音
  startRecording() {
    if (this.data.isProcessing) return;
    
    this.recordingManager.start({
      duration: 60000, // 最长60秒
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 48000,
      format: 'mp3'
    });
  },

  // 停止录音
  stopRecording() {
    if (this.data.isRecording) {
      this.recordingManager.stop();
    }
  },

  // 取消录音
  cancelRecording() {
    if (this.data.isRecording) {
      this.recordingManager.stop();
      this.setData({ isRecording: false });
    }
  },

  // 处理语音消息
  processVoiceMessage(filePath) {
    this.setData({ isProcessing: true });
    
    // 添加用户语音消息到对话列表
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: '�� 语音消息',
      time: this.getCurrentTime(),
      avatar: '/images/user-avatar.png'
    };
    
    this.addMessage(userMessage);
    
    // 显示AI正在输入状态
    this.setData({ isTyping: true });
    
    // 模拟语音识别和AI回复
    setTimeout(() => {
      this.setData({ isTyping: false });
      
      // 模拟AI回复
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: this.generateAIResponse(),
        time: this.getCurrentTime(),
        avatar: '/images/ai-avatar.png'
      };
      
      this.addMessage(aiMessage);
      this.setData({ isProcessing: false });
    }, 2000);
  },

  // 生成AI回复（模拟）
  generateAIResponse() {
    const responses = [
      "根据您描述的情况，我建议您...",
      "这个问题涉及到法律条款，具体来说...",
      "从法律角度分析，您需要注意以下几点...",
      "根据相关法律规定，您有权...",
      "建议您收集相关证据，然后...",
      "这种情况下，您可以考虑以下解决方案..."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  },

  // 添加消息到对话列表
  addMessage(message) {
    const messages = [...this.data.chatMessages, message];
    this.setData({ 
      chatMessages: messages,
      scrollToView: `msg-${message.id}`
    });
  },

  // 清空对话
  clearChat() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有对话记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ chatMessages: [] });
          wx.showToast({
            title: '对话已清空',
            icon: 'success'
          });
        }
      }
    });
  },

  // 显示对话历史
  showHistory() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 获取当前时间
  getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  // 更新当前时间
  updateCurrentTime() {
    this.setData({
      currentTime: this.getCurrentTime()
    });
  }
}); 