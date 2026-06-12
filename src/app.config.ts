export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/create/index',
    'pages/mine/index',
    'pages/detail/index',
    'pages/team/index',
    'pages/notification/index',
    'pages/schedule/index'
  ],
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#6366f1',
    navigationBarTitleText: '网吧赛事',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#94a3b8',
    selectedColor: '#6366f1',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '赛事'
      },
      {
        pagePath: 'pages/create/index',
        text: '创建'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})