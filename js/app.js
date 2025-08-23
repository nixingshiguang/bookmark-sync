// 主应用程序
class BookmarkApp {
    constructor() {
        this.viewMode = 'list'; // grid 或 list
        this.sortBy = 'name'; // name, date, type
        this.sortOrder = 'asc'; // asc 或 desc
        this.init();
    }

    async init() {
        // 显示加载状态
        this.showLoadingState();
        
        try {
            // 等待数据加载完成
            await window.bookmarkData.init();
            
            // 初始化各个组件
            this.initComponents();
            this.bindEvents();
            this.loadInitialData();
            
            // 设置初始状态
            this.updateStats();
            this.setViewMode(this.viewMode);
            
            // 隐藏加载状态
            this.hideLoadingState();
            
            // 检查API连接状态
            this.checkApiConnection();
            
            // 监听数据刷新事件
            document.addEventListener('dataRefreshed', () => {
                this.refreshCurrentView();
                this.updateStats();
            });
            
        } catch (error) {
            console.error('应用初始化失败:', error);
            this.showErrorState('数据加载失败，请检查网络连接或API服务');
        }
    }

    initComponents() {
        // 初始化书签渲染器
        window.bookmarkRenderer = new BookmarkRenderer();
        
        // 初始化快速访问
        this.initQuickAccess();
        
        // 加载当前文件夹
        window.navigationManager.loadCurrentFolder();
    }

    // 初始化快速访问
    initQuickAccess() {
        const quickAccessContainer = document.getElementById('quick-access');
        const rootFolders = window.bookmarkData.getRootBookmarks().filter(item => item.isFolder);
        
        // 清空现有内容
        quickAccessContainer.innerHTML = '';
        
        // 为每个根级别文件夹创建快速访问项
        rootFolders.forEach(folder => {
            const quickItem = document.createElement('div');
            quickItem.className = 'quick-item';
            quickItem.dataset.folderId = folder.id;
            
            // 根据文件夹名称选择合适的图标
            const icon = this.getFolderIcon(folder.name);
            
            quickItem.innerHTML = `
                <i class="${icon}"></i>
                <span>${folder.name}</span>
            `;
            
            // 添加点击事件
            quickItem.addEventListener('click', () => {
                window.navigationManager.navigateTo(folder.id, folder.name);
            });
            
            quickAccessContainer.appendChild(quickItem);
        });
    }

    // 根据文件夹名称获取合适的图标
    getFolderIcon(name) {
        const iconMap = {
            'AI': 'fas fa-robot',
            'A.I.O': 'fas fa-cube',
            '开发': 'fas fa-code',
            '工具': 'fas fa-tools',
            '网盘': 'fas fa-cloud',
            '天天向上': 'fas fa-chart-line',
            '大佬们': 'fas fa-users',
            '工作': 'fas fa-briefcase',
            '个人': 'fas fa-user',
            '新闻': 'fas fa-newspaper',
            '学习': 'fas fa-graduation-cap',
            '娱乐': 'fas fa-gamepad',
            '购物': 'fas fa-shopping-cart',
            '社交': 'fas fa-comments'
        };
        
        // 查找匹配的图标，如果没有找到则使用默认文件夹图标
        for (const [keyword, icon] of Object.entries(iconMap)) {
            if (name.includes(keyword)) {
                return icon;
            }
        }
        
        return 'fas fa-folder';
    }

    bindEvents() {
        // 视图切换
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.setViewMode(view);
            });
        });

        // 排序选择
        document.getElementById('sort-select').addEventListener('change', (e) => {
            this.setSortBy(e.target.value);
        });

        // 响应式侧边栏
        this.handleResponsiveSidebar();
    }

    loadInitialData() {
        // 加载根目录内容
        const rootBookmarks = window.bookmarkData.getRootBookmarks();
        window.bookmarkRenderer.renderBookmarks(rootBookmarks);
    }

    // 设置视图模式
    setViewMode(mode) {
        this.viewMode = mode;
        const container = document.getElementById('bookmark-container');
        const viewBtns = document.querySelectorAll('.view-btn');

        // 更新容器类名
        container.className = `bookmark-container ${mode}-view`;

        // 更新按钮状态
        viewBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === mode);
        });

        // 重新渲染当前内容
        this.refreshCurrentView();

        // 保存设置
        localStorage.setItem('bookmark-view-mode', mode);
    }

    // 设置排序方式
    setSortBy(sortBy) {
        this.sortBy = sortBy;
        this.refreshCurrentView();
        
        // 保存设置
        localStorage.setItem('bookmark-sort-by', sortBy);
    }

    // 刷新当前视图
    refreshCurrentView() {
        if (window.searchManager.isSearchMode) {
            window.searchManager.renderSearchResults();
        } else {
            window.navigationManager.loadCurrentFolder();
        }
    }

    // 更新统计信息
    updateStats() {
        const stats = window.bookmarkData.getStats();
        
        document.getElementById('total-bookmarks').textContent = stats.totalBookmarks;
        document.getElementById('total-folders').textContent = stats.totalFolders;
        
        if (stats.lastSync) {
            const lastSync = new Date(stats.lastSync).toLocaleString('zh-CN');
            document.getElementById('last-sync').textContent = lastSync;
        }
    }

    // 处理响应式侧边栏
    handleResponsiveSidebar() {
        const handleResize = () => {
            const sidebar = document.getElementById('sidebar');
            const expandBtn = document.getElementById('sidebar-expand-btn');
            
            if (window.innerWidth <= 768) {
                sidebar.classList.add('mobile');
                // 移动端隐藏展开按钮
                expandBtn.style.display = 'none';
            } else {
                sidebar.classList.remove('mobile', 'show');
                // 桌面端根据侧边栏状态显示展开按钮
                if (sidebar.classList.contains('collapsed')) {
                    expandBtn.style.display = 'flex';
                } else {
                    expandBtn.style.display = 'none';
                }
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // 初始调用
    }

    // 显示书签详情
    showBookmarkDetails(bookmark) {
        const modal = document.getElementById('bookmark-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        modalTitle.textContent = bookmark.name;

        let detailsHTML = `
            <div class="bookmark-details">
                <div class="detail-row">
                    <strong>名称:</strong>
                    <span>${bookmark.name}</span>
                </div>
        `;

        if (bookmark.url) {
            detailsHTML += `
                <div class="detail-row">
                    <strong>网址:</strong>
                    <a href="${bookmark.url}" target="_blank">${bookmark.url}</a>
                </div>
            `;
        }

        detailsHTML += `
            <div class="detail-row">
                <strong>类型:</strong>
                <span>${bookmark.isFolder ? '文件夹' : '书签'}</span>
            </div>
            <div class="detail-row">
                <strong>添加时间:</strong>
                <span>${window.bookmarkData.formatDate(bookmark.dateAdded)}</span>
            </div>
        `;

        if (bookmark.tags && bookmark.tags.length > 0) {
            detailsHTML += `
                <div class="detail-row">
                    <strong>标签:</strong>
                    <div class="tags">
                        ${bookmark.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `;
        }

        if (bookmark.metadata) {
            if (bookmark.metadata.notes) {
                detailsHTML += `
                    <div class="detail-row">
                        <strong>备注:</strong>
                        <span>${bookmark.metadata.notes}</span>
                    </div>
                `;
            }

            if (bookmark.metadata.visitCount) {
                detailsHTML += `
                    <div class="detail-row">
                        <strong>访问次数:</strong>
                        <span>${bookmark.metadata.visitCount}</span>
                    </div>
                `;
            }

            if (bookmark.metadata.lastVisited) {
                const lastVisited = new Date(bookmark.metadata.lastVisited).toLocaleString('zh-CN');
                detailsHTML += `
                    <div class="detail-row">
                        <strong>最后访问:</strong>
                        <span>${lastVisited}</span>
                    </div>
                `;
            }
        }

        detailsHTML += '</div>';
        modalBody.innerHTML = detailsHTML;

        modal.classList.add('show');
    }

    // 隐藏模态框
    hideModal() {
        const modal = document.getElementById('bookmark-modal');
        modal.classList.remove('show');
    }

    // 显示加载状态
    showLoadingState() {
        const container = document.getElementById('bookmark-container');
        const statusText = document.getElementById('status-text');
        
        container.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>正在加载书签数据...</p>
            </div>
        `;
        
        statusText.textContent = '正在加载...';
    }

    // 隐藏加载状态
    hideLoadingState() {
        const statusText = document.getElementById('status-text');
        statusText.textContent = '就绪';
    }

    // 显示错误状态
    showErrorState(message) {
        const container = document.getElementById('bookmark-container');
        const statusText = document.getElementById('status-text');
        
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #dc3545; margin-bottom: 16px;"></i>
                <p style="color: var(--text-color); margin-bottom: 16px;">${message}</p>
                <button class="retry-btn" onclick="window.app.retryDataLoad()">
                    <i class="fas fa-redo"></i> 重试加载
                </button>
            </div>
        `;
        
        statusText.textContent = '加载失败';
    }

    // 重试数据加载
    async retryDataLoad() {
        this.showLoadingState();
        try {
            await window.bookmarkData.refresh();
            this.loadInitialData();
            this.updateStats();
            this.hideLoadingState();
        } catch (error) {
            this.showErrorState('重试失败，请检查网络连接或API服务');
        }
    }

    // 检查API连接状态
    async checkApiConnection() {
        const isConnected = await window.bookmarkData.checkApiStatus();
        const statusText = document.getElementById('status-text');
        
        if (isConnected) {
            statusText.textContent = '已连接到API服务';
        } else {
            statusText.textContent = '使用离线数据';
        }
    }
}

// 书签渲染器
class BookmarkRenderer {
    constructor() {
        this.bindModalEvents();
    }

    bindModalEvents() {
        // 模态框关闭事件
        document.getElementById('modal-close').addEventListener('click', () => {
            window.app.hideModal();
        });

        // 点击模态框背景关闭
        document.getElementById('bookmark-modal').addEventListener('click', (e) => {
            if (e.target.id === 'bookmark-modal') {
                window.app.hideModal();
            }
        });
    }

    // 渲染书签列表
    renderBookmarks(bookmarks, isSearchResult = false) {
        const container = document.getElementById('bookmark-container');
        const itemCount = document.getElementById('item-count');

        if (!bookmarks || bookmarks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open" style="font-size: 48px; color: var(--text-secondary); margin-bottom: 16px;"></i>
                    <p style="color: var(--text-secondary);">此文件夹为空</p>
                </div>
            `;
            itemCount.textContent = '0 项';
            return;
        }

        // 排序书签
        const sortedBookmarks = this.sortBookmarks([...bookmarks]);

        // 更新项目计数
        itemCount.textContent = `${sortedBookmarks.length} 项`;

        // 渲染书签项目
        container.innerHTML = '';
        sortedBookmarks.forEach(bookmark => {
            const element = this.createBookmarkElement(bookmark, isSearchResult);
            container.appendChild(element);
        });
    }

    // 创建书签元素
    createBookmarkElement(bookmark, isSearchResult = false) {
        const element = document.createElement('div');
        element.className = `bookmark-item ${bookmark.isFolder ? 'folder' : 'bookmark'}`;
        element.dataset.id = bookmark.id;

        // 获取图标
        const icon = this.getBookmarkIcon(bookmark);
        
        // 根据视图模式渲染不同的结构
        if (window.app.viewMode === 'grid') {
            element.innerHTML = `
                <div class="bookmark-icon">${icon}</div>
                <div class="bookmark-name" title="${bookmark.name}">${bookmark.name}</div>
                ${bookmark.url ? `<div class="bookmark-url" title="${bookmark.url}">${this.truncateUrl(bookmark.url)}</div>` : ''}
                ${isSearchResult && bookmark.path ? `<div class="bookmark-path">${bookmark.path.join(' > ')}</div>` : ''}
            `;
        } else {
            element.innerHTML = `
                <div class="bookmark-icon">${icon}</div>
                <div class="bookmark-info">
                    <div class="bookmark-name" title="${bookmark.name}">${bookmark.name}</div>
                    ${bookmark.url ? `<div class="bookmark-url" title="${bookmark.url}">${bookmark.url}</div>` : ''}
                    ${isSearchResult && bookmark.path ? `<div class="bookmark-path">${bookmark.path.join(' > ')}</div>` : ''}
                </div>
                <div class="bookmark-meta">
                    ${window.bookmarkData.formatDate(bookmark.dateAdded)}
                </div>
            `;
        }

        // 绑定事件
        this.bindBookmarkEvents(element, bookmark);

        return element;
    }

    // 绑定书签事件
    bindBookmarkEvents(element, bookmark) {
        // 单击事件
        element.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (bookmark.isFolder) {
                // 导航到文件夹
                window.navigationManager.navigateTo(bookmark.id, bookmark.name);
            } else {
                // 打开书签
                if (bookmark.url) {
                    window.open(bookmark.url, '_blank');
                }
            }
        });

        // 右键菜单
        element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e, bookmark);
        });

        // 双击显示详情
        element.addEventListener('dblclick', (e) => {
            e.preventDefault();
            window.app.showBookmarkDetails(bookmark);
        });
    }

    // 显示右键菜单
    showContextMenu(event, bookmark) {
        // 简单的右键菜单实现
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.position = 'fixed';
        menu.style.left = event.clientX + 'px';
        menu.style.top = event.clientY + 'px';
        menu.style.background = 'var(--bg-color)';
        menu.style.border = '1px solid var(--border-color)';
        menu.style.borderRadius = '4px';
        menu.style.padding = '4px 0';
        menu.style.zIndex = '1000';
        menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';

        const menuItems = [];

        if (!bookmark.isFolder && bookmark.url) {
            menuItems.push({ text: '打开链接', action: () => window.open(bookmark.url, '_blank') });
            menuItems.push({ text: '在新标签页打开', action: () => window.open(bookmark.url, '_blank') });
        }

        menuItems.push({ text: '查看详情', action: () => window.app.showBookmarkDetails(bookmark) });

        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.textContent = item.text;
            menuItem.style.padding = '8px 16px';
            menuItem.style.cursor = 'pointer';
            menuItem.style.fontSize = '14px';
            
            menuItem.addEventListener('click', () => {
                item.action();
                document.body.removeChild(menu);
            });

            menuItem.addEventListener('mouseenter', () => {
                menuItem.style.background = 'var(--hover-bg)';
            });

            menuItem.addEventListener('mouseleave', () => {
                menuItem.style.background = 'transparent';
            });

            menu.appendChild(menuItem);
        });

        document.body.appendChild(menu);

        // 点击其他地方关闭菜单
        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                document.body.removeChild(menu);
                document.removeEventListener('click', closeMenu);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 0);
    }

    // 获取书签图标
    getBookmarkIcon(bookmark) {
        if (bookmark.isFolder) {
            return '<i class="fas fa-folder"></i>';
        }

        // 尝试获取网站图标
        const favicon = window.bookmarkData.getFavicon(bookmark.url);
        if (favicon) {
            return `<img src="${favicon}" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';" style="width: 16px; height: 16px;"><i class="fas fa-bookmark" style="display: none;"></i>`;
        }

        return '<i class="fas fa-bookmark"></i>';
    }

    // 截断URL显示
    truncateUrl(url, maxLength = 30) {
        if (url.length <= maxLength) return url;
        return url.substring(0, maxLength) + '...';
    }

    // 排序书签
    sortBookmarks(bookmarks) {
        const sortBy = window.app.sortBy;
        const sortOrder = window.app.sortOrder;

        bookmarks.sort((a, b) => {
            let comparison = 0;

            // 文件夹优先
            if (a.isFolder && !b.isFolder) return -1;
            if (!a.isFolder && b.isFolder) return 1;

            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name, 'zh-CN');
                    break;
                case 'date':
                    comparison = a.dateAdded - b.dateAdded;
                    break;
                case 'type':
                    if (a.isFolder === b.isFolder) {
                        comparison = a.name.localeCompare(b.name, 'zh-CN');
                    }
                    break;
                default:
                    comparison = a.name.localeCompare(b.name, 'zh-CN');
            }

            return sortOrder === 'desc' ? -comparison : comparison;
        });

        return bookmarks;
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BookmarkApp();
});

// 添加一些CSS样式到页面
const additionalStyles = `
<style>
.empty-state, .no-results, .loading-state, .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color);
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

.retry-btn {
    background: var(--primary-color);
    color: var(--primary-text);
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
}

.retry-btn:hover {
    background: var(--primary-color);
    opacity: 0.9;
    transform: translateY(-1px);
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.bookmark-details .detail-row {
    display: flex;
    margin-bottom: 12px;
    align-items: flex-start;
}

.bookmark-details .detail-row strong {
    min-width: 80px;
    margin-right: 12px;
    color: var(--text-secondary);
}

.bookmark-details .detail-row a {
    color: var(--primary-color);
    text-decoration: none;
}

.bookmark-details .detail-row a:hover {
    text-decoration: underline;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.tag {
    background: var(--primary-color);
    color: var(--primary-text);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
}

.bookmark-path {
    font-size: 11px;
    color: var(--text-secondary);
    margin-top: 4px;
    opacity: 0.8;
}

.context-menu {
    min-width: 120px;
}

@media (max-width: 768px) {
    .sidebar.mobile {
        position: fixed;
        left: -250px;
        top: 50px;
        height: calc(100vh - 50px);
        z-index: 100;
        transition: left 0.3s ease;
        background: var(--sidebar-bg);
        border-right: 1px solid var(--border-color);
    }
    
    .sidebar.mobile.show {
        left: 0;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);