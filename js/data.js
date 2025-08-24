// 书签数据管理
class BookmarkData {
    constructor() {
        this.bookmarks = [];
        this.settings = {};
        this.stats = {};
        this.timestamp = null;
        this.init();
    }

    async init() {
        try {
            // 从API端点加载数据
            const response = await fetch('/api/data');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            this.bookmarks = data.bookmarks || [];
            this.settings = data.settings || {};
            this.stats = data.stats || {};
            this.timestamp = data.timestamp || null;
        } catch (error) {
            console.error('加载书签数据失败:', error);
            // 如果API加载失败，使用默认数据
            this.loadDefaultData();
        }
    }

    // 加载默认数据（作为备用）
    loadDefaultData() {
        const data = {
            "bookmarks": [
                {
                    "id": "1",
                    "name": "工作相关",
                    "url": null,
                    "parentId": "0",
                    "index": 0,
                    "dateAdded": 1627894500000,
                    "dateGroupModified": 1627894500000,
                    "isFolder": true,
                    "children": [
                        {
                            "id": "11",
                            "name": "开发文档",
                            "url": null,
                            "parentId": "1",
                            "index": 0,
                            "dateAdded": 1627894560000,
                            "dateGroupModified": 1627894560000,
                            "isFolder": true,
                            "children": [
                                {
                                    "id": "111",
                                    "name": "MDN Web 文档",
                                    "url": "https://developer.mozilla.org/zh-CN/",
                                    "parentId": "11",
                                    "index": 0,
                                    "dateAdded": 1627894620000,
                                    "isFolder": false
                                },
                                {
                                    "id": "112",
                                    "name": "React 官方文档",
                                    "url": "https://reactjs.org/docs/getting-started.html",
                                    "parentId": "11",
                                    "index": 1,
                                    "dateAdded": 1627894680000,
                                    "isFolder": false
                                }
                            ]
                        },
                        {
                            "id": "12",
                            "name": "项目管理",
                            "url": null,
                            "parentId": "1",
                            "index": 1,
                            "dateAdded": 1627894740000,
                            "dateGroupModified": 1627894740000,
                            "isFolder": true,
                            "children": [
                                {
                                    "id": "121",
                                    "name": "JIRA",
                                    "url": "https://www.atlassian.com/software/jira",
                                    "parentId": "12",
                                    "index": 0,
                                    "dateAdded": 1627894800000,
                                    "isFolder": false
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "2",
                    "name": "个人收藏",
                    "url": null,
                    "parentId": "0",
                    "index": 1,
                    "dateAdded": 1627895000000,
                    "dateGroupModified": 1627895000000,
                    "isFolder": true,
                    "children": [
                        {
                            "id": "21",
                            "name": "学习资源",
                            "url": null,
                            "parentId": "2",
                            "index": 0,
                            "dateAdded": 1627895060000,
                            "dateGroupModified": 1627895060000,
                            "isFolder": true,
                            "children": [
                                {
                                    "id": "211",
                                    "name": "Coursera",
                                    "url": "https://www.coursera.org/",
                                    "parentId": "21",
                                    "index": 0,
                                    "dateAdded": 1627895120000,
                                    "isFolder": false
                                },
                                {
                                    "id": "212",
                                    "name": "edX",
                                    "url": "https://www.edx.org/",
                                    "parentId": "21",
                                    "index": 1,
                                    "dateAdded": 1627895180000,
                                    "isFolder": false
                                }
                            ]
                        },
                        {
                            "id": "22",
                            "name": "娱乐",
                            "url": null,
                            "parentId": "2",
                            "index": 1,
                            "dateAdded": 1627895240000,
                            "dateGroupModified": 1627895240000,
                            "isFolder": true,
                            "children": [
                                {
                                    "id": "221",
                                    "name": "哔哩哔哩",
                                    "url": "https://www.bilibili.com/",
                                    "parentId": "22",
                                    "index": 0,
                                    "dateAdded": 1627895300000,
                                    "isFolder": false
                                },
                                {
                                    "id": "222",
                                    "name": "YouTube",
                                    "url": "https://www.youtube.com/",
                                    "parentId": "22",
                                    "index": 1,
                                    "dateAdded": 1627895360000,
                                    "isFolder": false,
                                    "tags": ["视频", "音乐", "教程"],
                                    "metadata": {
                                        "lastVisited": "2024-08-20T15:30:00.000Z",
                                        "visitCount": 158,
                                        "rating": 5,
                                        "notes": "常用视频网站，包含各类教程和娱乐内容"
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "3",
                    "name": "新闻媒体",
                    "url": "https://news.google.com/",
                    "parentId": "0",
                    "index": 2,
                    "dateAdded": 1627895420000,
                    "isFolder": false,
                    "metadata": {
                        "category": "新闻",
                        "importance": "高",
                        "customData": {
                            "refreshInterval": 30,
                            "notifications": true,
                            "topics": ["科技", "财经", "国际"]
                        }
                    }
                }
            ],
            "timestamp": "2024-08-22T12:00:00.000Z",
            "count": 12,
            "version": "1.2.0",
            "settings": {
                "syncEnabled": true,
                "syncInterval": 3600,
                "categories": ["工作", "个人", "新闻"],
                "filters": {
                    "excludeFolders": ["临时书签"],
                    "includeOnly": ["重要", "常用"],
                    "dateRange": {
                        "start": "2023-01-01T00:00:00.000Z",
                        "end": null
                    }
                },
                "display": {
                    "theme": "default",
                    "sortBy": "dateAdded",
                    "order": "desc",
                    "expandAll": false
                }
            },
            "stats": {
                "totalBookmarks": 12,
                "totalFolders": 7,
                "maxDepth": 3,
                "lastSync": "2024-08-21T18:30:00.000Z",
                "syncHistory": [
                    {
                        "date": "2024-08-21T18:30:00.000Z",
                        "status": "success",
                        "itemsChanged": 3
                    },
                    {
                        "date": "2024-08-20T12:15:00.000Z",
                        "status": "failed",
                        "error": "Network timeout",
                        "retries": 2
                    }
                ]
            }
        };

        this.bookmarks = data.bookmarks;
        this.settings = data.settings;
        this.stats = data.stats;
        this.timestamp = data.timestamp || null;
    }

    // 刷新数据
    async refresh() {
        await this.init();
        // 触发数据更新事件
        document.dispatchEvent(new CustomEvent('dataRefreshed'));
    }

    // 检查API连接状态
    async checkApiStatus() {
        try {
            const response = await fetch('/api/data', { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    // 获取根级别的书签
    getRootBookmarks() {
        return this.bookmarks.filter(item => item.parentId === '0' || item.parentId === '1');
    }

    // 根据ID查找书签
    findBookmarkById(id) {
        return this.bookmarks.find(item => item.id === id) || null;
    }

    // 获取书签的子项
    getChildren(parentId) {
        if (parentId === '0') {
            // 根目录：返回parentId为'0'或'1'的项目
            return this.bookmarks.filter(item => item.parentId === '0' || item.parentId === '1');
        }
        // 返回指定父级ID的所有子项
        return this.bookmarks.filter(item => item.parentId === parentId);
    }

    // 搜索书签
    searchBookmarks(query) {
        const results = [];
        const queryLower = query.toLowerCase();
        
        for (const item of this.bookmarks) {
            if (item.name.toLowerCase().includes(queryLower) ||
                (item.url && item.url.toLowerCase().includes(queryLower))) {
                
                // 构建路径
                const path = this.buildPath(item.id);
                results.push({
                    ...item,
                    path: path
                });
            }
        }
        return results;
    }

    // 构建书签的完整路径
    buildPath(itemId) {
        const path = [];
        let currentItem = this.findBookmarkById(itemId);
        
        while (currentItem && currentItem.parentId !== '0') {
            path.unshift(currentItem.name);
            currentItem = this.findBookmarkById(currentItem.parentId);
        }
        
        return path;
    }

    // 获取统计信息
    getStats() {
        // 如果有预设的stats就使用，否则动态计算
        if (this.stats && Object.keys(this.stats).length > 0) {
            return this.stats;
        }
        
        // 动态计算统计信息
        const totalBookmarks = this.bookmarks.filter(item => !item.isFolder).length;
        const totalFolders = this.bookmarks.filter(item => item.isFolder).length;
        
        // 计算最大深度
        let maxDepth = 1;
        const calculateDepth = (parentId, currentDepth = 1) => {
            const children = this.bookmarks.filter(item => item.parentId === parentId);
            if (children.length === 0) return currentDepth;
            
            let depth = currentDepth;
            children.forEach(child => {
                if (child.isFolder) {
                    const childDepth = calculateDepth(child.id, currentDepth + 1);
                    depth = Math.max(depth, childDepth);
                }
            });
            return depth;
        };
        
        // 从根级别开始计算深度
        const rootFolders = this.bookmarks.filter(item => item.isFolder && (item.parentId === '0' || item.parentId === '1'));
        rootFolders.forEach(folder => {
            const depth = calculateDepth(folder.id, 2);
            maxDepth = Math.max(maxDepth, depth);
        });
        
        return {
            totalBookmarks: totalBookmarks,
            totalFolders: totalFolders,
            maxDepth: maxDepth,
            lastSync: this.timestamp || null
        };
    }

    // 获取设置
    getSettings() {
        return this.settings;
    }

    // 格式化日期
    formatDate(timestamp) {
        return new Date(timestamp).toLocaleDateString('zh-CN');
    }

    // 获取网站图标
    getFavicon(url) {
        if (!url) return null;
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
        } catch {
            return null;
        }
    }
}

// 全局数据实例
window.bookmarkData = new BookmarkData();