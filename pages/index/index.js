// index.js
Page({
  data: {
    searchText: '',
    searchHistory: []
  },

  onLoad() {
    // 加载搜索历史
    this.loadSearchHistory();
  },

  // 搜索输入处理
  onSearchInput(e) {
    this.setData({
      searchText: e.detail.value
    });
  },

  // 搜索按钮点击
  onSearch() {
    const { searchText } = this.data;
    if (!searchText.trim()) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      });
      return;
    }

    // 保存搜索历史
    this.saveSearchHistory(searchText);
    
    // 执行搜索逻辑
    this.performSearch(searchText);
  },

  // 执行搜索
  performSearch(keyword) {
    wx.showLoading({
      title: '搜索中...'
    });

    // 这里可以调用API进行搜索
    // 模拟搜索延迟
    setTimeout(() => {
      wx.hideLoading();
      
      // 跳转到搜索结果页面或显示结果
      wx.showToast({
        title: `搜索: ${keyword}`,
        icon: 'none'
      });
    }, 1500);
  },

  // 快捷服务点击
  onServiceTap(e) {
    const type = e.currentTarget.dataset.type;
    const serviceMap = {
      'marriage': '婚姻家事',
      'contract': '合同纠纷',
      'labor': '劳动纠纷',
      'property': '房产纠纷'
    };

    wx.showToast({
      title: `选择服务: ${serviceMap[type]}`,
      icon: 'none'
    });

    // 这里可以跳转到对应的服务页面
  },

  // 保存搜索历史
  saveSearchHistory(keyword) {
    let history = wx.getStorageSync('searchHistory') || [];
    
    // 去重
    if (!history.includes(keyword)) {
      history.unshift(keyword);
      // 只保留最近10条
      history = history.slice(0, 10);
      wx.setStorageSync('searchHistory', history);
    }
  },

  // 加载搜索历史
  loadSearchHistory() {
    const history = wx.getStorageSync('searchHistory') || [];
    this.setData({
      searchHistory: history
    });
  },

  // 跳转到语音对话页面的方法
  goToVoiceChat() {
    wx.navigateTo({
      url: '/pages/voice-chat/voice-chat',
      success: () => {
        console.log('跳转到语音对话页面成功');
      },
      fail: (error) => {
        console.error('跳转失败:', error);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  }
})
