// 导航管理
class NavigationManager {
    constructor() {
        this.currentPath = ['0']; // 当前路径，0表示根目录
        this.pathNames = ['根目录']; // 路径名称
        this.history = []; // 导航历史
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateBreadcrumb();
        this.updateStatusBar();
    }

    bindEvents() {
        // 返回按钮
        document.getElementById('back-btn').addEventListener('click', () => {
            this.goBack();
        });

        // 主页按钮
        document.getElementById('home-btn').addEventListener('click', () => {
            this.goHome();
        });

        // 侧边栏切换
        document.getElementById('sidebar-toggle').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // 侧边栏展开按钮
        document.getElementById('sidebar-expand-btn').addEventListener('click', () => {
            this.expandSidebar();
        });

        // 快速访问项目
        document.querySelectorAll('.quick-item').forEach(item => {
            item.addEventListener('click', () => {
                const category = item.dataset.category;
                this.navigateToCategory(category);
            });
        });
    }

    // 导航到指定路径
    navigateTo(id, name) {
        // 保存当前状态到历史
        this.history.push({
            path: [...this.currentPath],
            names: [...this.pathNames]
        });

        // 更新当前路径
        this.currentPath.push(id);
        this.pathNames.push(name);

        // 更新界面
        this.updateBreadcrumb();
        this.updateStatusBar();
        this.loadCurrentFolder();

        // 更新返回按钮状态
        this.updateBackButton();
    }

    // 返回上级目录
    goBack() {
        if (this.history.length > 0) {
            const lastState = this.history.pop();
            this.currentPath = lastState.path;
            this.pathNames = lastState.names;
        } else if (this.currentPath.length > 1) {
            this.currentPath.pop();
            this.pathNames.pop();
        }

        this.updateBreadcrumb();
        this.updateStatusBar();
        this.loadCurrentFolder();
        this.updateBackButton();
    }

    // 返回根目录
    goHome() {
        this.history = [];
        this.currentPath = ['0'];
        this.pathNames = ['根目录'];

        this.updateBreadcrumb();
        this.updateStatusBar();
        this.loadCurrentFolder();
        this.updateBackButton();
    }

    // 导航到分类
    navigateToCategory(category) {
        const categoryMap = {
            '工作': '1',
            '个人': '2',
            '新闻': '3'
        };

        const id = categoryMap[category];
        if (id) {
            const bookmark = window.bookmarkData.findBookmarkById(id);
            if (bookmark) {
                this.goHome();
                this.navigateTo(id, bookmark.name);
            }
        }
    }

    // 更新面包屑导航
    updateBreadcrumb() {
        const breadcrumb = document.getElementById('breadcrumb');
        breadcrumb.innerHTML = '';

        this.pathNames.forEach((name, index) => {
            if (index > 0) {
                const separator = document.createElement('span');
                separator.className = 'breadcrumb-separator';
                separator.textContent = '>';
                breadcrumb.appendChild(separator);
            }

            const item = document.createElement('span');
            item.className = 'breadcrumb-item';
            item.textContent = name;

            if (index === this.pathNames.length - 1) {
                item.classList.add('active');
            } else {
                item.addEventListener('click', () => {
                    this.navigateToIndex(index);
                });
            }

            breadcrumb.appendChild(item);
        });
    }

    // 导航到面包屑中的指定索引
    navigateToIndex(index) {
        if (index < this.pathNames.length - 1) {
            this.currentPath = this.currentPath.slice(0, index + 1);
            this.pathNames = this.pathNames.slice(0, index + 1);

            this.updateBreadcrumb();
            this.updateStatusBar();
            this.loadCurrentFolder();
            this.updateBackButton();
        }
    }

    // 更新状态栏
    updateStatusBar() {
        const currentPath = document.getElementById('current-path');
        currentPath.textContent = this.pathNames.join(' > ');
    }

    // 更新返回按钮状态
    updateBackButton() {
        const backBtn = document.getElementById('back-btn');
        const canGoBack = this.history.length > 0 || this.currentPath.length > 1;
        backBtn.disabled = !canGoBack;
        backBtn.style.opacity = canGoBack ? '1' : '0.5';
    }

    // 切换侧边栏
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const expandBtn = document.getElementById('sidebar-expand-btn');
        
        sidebar.classList.toggle('collapsed');
        
        // 控制展开按钮的显示
        if (sidebar.classList.contains('collapsed')) {
            expandBtn.style.display = 'flex';
        } else {
            expandBtn.style.display = 'none';
        }
        
        // 在移动设备上使用不同的切换方式
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('show');
        }
    }

    // 展开侧边栏
    expandSidebar() {
        const sidebar = document.getElementById('sidebar');
        const expandBtn = document.getElementById('sidebar-expand-btn');
        
        sidebar.classList.remove('collapsed');
        expandBtn.style.display = 'none';
    }

    // 加载当前文件夹内容
    loadCurrentFolder() {
        const currentId = this.getCurrentId();
        const children = window.bookmarkData.getChildren(currentId);
        window.bookmarkRenderer.renderBookmarks(children);
    }

    // 获取当前路径ID
    getCurrentId() {
        return this.currentPath[this.currentPath.length - 1];
    }

    // 获取当前路径名称
    getCurrentName() {
        return this.pathNames[this.pathNames.length - 1];
    }

    // 获取完整路径
    getFullPath() {
        return {
            ids: [...this.currentPath],
            names: [...this.pathNames]
        };
    }
}

// 全局导航管理器实例
window.navigationManager = new NavigationManager();