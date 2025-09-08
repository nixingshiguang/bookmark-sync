# 书签导航系统

一个现代化的书签管理和导航系统，支持多种视图模式、主题切换和智能搜索功能。

## 浏览器扩展

请移步至[bookmark-sync-extension](https://github.com/nixingshiguang/bookmark-sync-extension)项目

## 🌟 功能特性

### 📁 书签管理
- **层级结构**：支持多层级文件夹组织
- **智能导航**：面包屑导航，快速返回上级目录
- **快速访问**：侧边栏动态生成根级别文件夹快捷入口
- **详情查看**：双击查看书签详细信息

### 🎨 视图模式
- **网格视图**：卡片式布局，直观展示书签图标和名称
- **列表视图**：详细信息展示，包含URL和添加时间
- **响应式设计**：自适应不同屏幕尺寸

### 🔍 搜索功能
- **实时搜索**：输入即搜，快速定位目标书签
- **路径显示**：搜索结果显示完整文件夹路径
- **智能匹配**：支持书签名称和URL搜索

### 🎨 主题系统
- **多主题支持**：默认、深色、蓝色、绿色主题
- **一键切换**：工具栏快速切换主题
- **本地存储**：记住用户主题偏好

### 📊 统计信息
- **实时统计**：动态计算书签和文件夹数量
- **深度分析**：显示文件夹最大嵌套层级
- **同步状态**：显示最后同步时间

## 🚀 快速开始

### 环境要求
- 现代浏览器（支持ES6+）
- 本地HTTP服务器（用于开发）

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd bookmark-sync
```

2. **启动本地服务器**
```bash
# 使用Python
python -m http.server 8000

# 或使用Node.js
npx serve .

# 或使用PHP
php -S localhost:8000
```

3. **访问应用**
打开浏览器访问 `http://localhost:8000`

## 📁 项目结构

```
bookmark-sync/
├── index.html              # 主页面
├── data.json               # 书签数据文件
├── css/                    # 样式文件
│   ├── base.css           # 基础样式
│   └── themes/            # 主题文件
│       ├── default.css    # 默认主题
│       ├── dark.css       # 深色主题
│       ├── blue.css       # 蓝色主题
│       └── green.css      # 绿色主题
├── js/                     # JavaScript文件
│   ├── app.js             # 主应用逻辑
│   ├── data.js            # 数据管理
│   ├── navigation.js      # 导航管理
│   ├── search.js          # 搜索功能
│   └── theme.js           # 主题管理
└── functions/              # 云函数（EdgeOne）
    └── api/
        ├── data/          # 数据API
        └── update/        # 更新API
```

## 🔧 配置说明

### 数据格式

书签数据采用JSON格式存储，支持以下字段：

```json
{
  "bookmarks": [
    {
      "id": "唯一标识符",
      "name": "书签名称",
      "url": "书签URL（文件夹为null）",
      "parentId": "父级ID（根目录为'0'或'1'）",
      "index": 0,
      "dateAdded": 1627894500000,
      "dateGroupModified": 1627894500000,
      "isFolder": true,
      "tags": ["标签1", "标签2"],
      "metadata": {
        "notes": "备注信息",
        "visitCount": 158,
        "lastVisited": "2024-08-20T15:30:00.000Z"
      }
    }
  ]
}
```

### 主题自定义

在 `css/themes/` 目录下创建新的主题文件：

```css
/* 自定义主题变量 */
:root {
  --primary-color: #your-color;
  --bg-color: #your-bg;
  --text-color: #your-text;
  /* 更多变量... */
}
```

## 🌐 部署说明

### 腾讯EdgeOne部署

本项目支持部署到腾讯EdgeOne边缘函数：

1. **配置KV存储**
```javascript
// 直接使用KvData变量（EdgeOne规范）
await KvData.put('bookmarks', JSON.stringify(data));
const data = await KvData.get('bookmarks');
```

2. **部署函数**
- 将 `functions/` 目录下的文件部署到EdgeOne
- 配置路由规则：`/api/*` 指向对应函数

### 静态部署

仅支持部署到`腾讯云edgeone pages`

原因：
+ 国内访问速度快
+ kv存储的特殊调用方式
+ 边缘函数的特殊使用方法

## 🎯 使用指南

### 基本操作

1. **浏览书签**
   - 点击文件夹进入子目录
   - 点击书签打开链接
   - 使用面包屑导航返回上级

2. **搜索书签**
   - 点击工具栏搜索按钮
   - 输入关键词实时搜索
   - 点击搜索结果直接访问

3. **切换视图**
   - 网格视图：适合浏览和快速定位
   - 列表视图：适合查看详细信息

4. **主题切换**
   - 点击调色板图标
   - 选择喜欢的主题
   - 设置会自动保存

### 快捷键

- `Ctrl + F`：打开搜索
- `Esc`：关闭搜索/模态框
- `Alt + ←`：返回上级
- `Alt + Home`：返回根目录

## 🔧 开发指南

### 添加新功能

1. **新增主题**
```css
/* css/themes/your-theme.css */
:root {
  /* 定义主题变量 */
}
```

2. **扩展搜索**
```javascript
// js/search.js
// 在searchBookmarks方法中添加新的搜索逻辑
```

3. **自定义图标**
```javascript
// js/app.js - getFolderIcon方法
const iconMap = {
  '新分类': 'fas fa-new-icon'
};
```

### API接口

#### 获取书签数据
```
GET /api/data
Response: JSON格式的书签数据
```

#### 更新书签数据
```
POST /api/update
Body: JSON格式的书签数据
```

## 🐛 故障排除

### 常见问题

1. **书签不显示**
   - 检查data.json格式是否正确
   - 确认parentId字段设置正确

2. **搜索无结果**
   - 检查搜索关键词拼写
   - 确认数据已正确加载

3. **主题不生效**
   - 检查CSS文件路径
   - 清除浏览器缓存

4. **统计信息为空**
   - 确认数据加载完成
   - 检查控制台错误信息

### 调试模式

在浏览器控制台中使用：
```javascript
// 查看当前数据
console.log(window.bookmarkData.bookmarks);

// 查看统计信息
console.log(window.bookmarkData.getStats());

// 重新加载数据
window.bookmarkData.refresh();
```

## 📝 更新日志

### v1.2.0 (2024-08-23)
- ✨ 修复JSON格式问题，支持扁平化数据结构
- 🎨 优化网格视图，隐藏URL显示
- 📊 改进统计信息动态计算
- 🚀 动态生成快速访问菜单

### v1.1.0 (2024-08-22)
- 🎨 添加多主题支持
- 🔍 实现智能搜索功能
- 📱 优化响应式设计
- 🐛 修复导航问题

### v1.0.0 (2024-08-21)
- 🎉 初始版本发布
- 📁 基础书签管理功能
- 🎨 网格和列表视图
- 🧭 面包屑导航

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [Font Awesome](https://fontawesome.com/) - 图标库
- [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) - 布局系统
- [腾讯EdgeOne](https://www.tencentcloud.com/products/eo) - 边缘计算平台
