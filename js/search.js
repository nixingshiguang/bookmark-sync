// 搜索管理
class SearchManager {
    constructor() {
        this.isSearchMode = false;
        this.searchResults = [];
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const searchBtn = document.getElementById('search-btn');
        const searchContainer = document.getElementById('search-container');
        const searchInput = document.getElementById('search-input');
        const clearSearch = document.getElementById('clear-search');

        // 搜索按钮点击
        searchBtn.addEventListener('click', () => {
            this.toggleSearch();
        });

        // 搜索输入
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query) {
                this.performSearch(query);
            } else {
                this.clearSearch();
            }
        });

        // 清除搜索
        clearSearch.addEventListener('click', () => {
            this.clearSearch();
        });

        // ESC键退出搜索
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isSearchMode) {
                this.exitSearch();
            }
        });

        // 回车键搜索
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    this.performSearch(query);
                }
            }
        });
    }

    // 切换搜索模式
    toggleSearch() {
        if (this.isSearchMode) {
            this.exitSearch();
        } else {
            this.enterSearch();
        }
    }

    // 进入搜索模式
    enterSearch() {
        this.isSearchMode = true;
        const searchContainer = document.getElementById('search-container');
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');

        searchContainer.classList.add('show');
        searchBtn.classList.add('active');
        searchInput.focus();

        // 更新状态
        this.updateStatus('搜索模式');
    }

    // 退出搜索模式
    exitSearch() {
        this.isSearchMode = false;
        const searchContainer = document.getElementById('search-container');
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');

        searchContainer.classList.remove('show');
        searchBtn.classList.remove('active');
        searchInput.value = '';

        // 清除搜索结果
        this.clearSearch();
        this.updateStatus('就绪');
    }

    // 执行搜索
    performSearch(query) {
        this.searchResults = window.bookmarkData.searchBookmarks(query);
        this.renderSearchResults();
        this.updateStatus(`找到 ${this.searchResults.length} 个结果`);
    }

    // 清除搜索
    clearSearch() {
        const searchInput = document.getElementById('search-input');
        searchInput.value = '';
        this.searchResults = [];
        
        if (this.isSearchMode) {
            // 恢复当前文件夹视图
            window.navigationManager.loadCurrentFolder();
            this.updateStatus('搜索模式');
        }
    }

    // 渲染搜索结果
    renderSearchResults() {
        const container = document.getElementById('bookmark-container');
        
        if (this.searchResults.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search" style="font-size: 48px; color: var(--text-secondary); margin-bottom: 16px;"></i>
                    <p style="color: var(--text-secondary);">未找到匹配的书签</p>
                </div>
            `;
            return;
        }

        // 使用书签渲染器渲染搜索结果
        window.bookmarkRenderer.renderBookmarks(this.searchResults, true);
    }

    // 更新状态
    updateStatus(text) {
        const statusText = document.getElementById('status-text');
        statusText.textContent = text;
    }

    // 高亮搜索关键词
    highlightText(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // 获取搜索建议
    getSearchSuggestions(query) {
        const suggestions = [];
        const allBookmarks = this.getAllBookmarks();
        
        allBookmarks.forEach(bookmark => {
            if (bookmark.name.toLowerCase().includes(query.toLowerCase())) {
                suggestions.push(bookmark.name);
            }
            if (bookmark.url && bookmark.url.toLowerCase().includes(query.toLowerCase())) {
                suggestions.push(bookmark.url);
            }
        });

        // 去重并限制数量
        return [...new Set(suggestions)].slice(0, 5);
    }

    // 获取所有书签（扁平化）
    getAllBookmarks() {
        const allBookmarks = [];
        
        const flatten = (items) => {
            items.forEach(item => {
                allBookmarks.push(item);
                if (item.children) {
                    flatten(item.children);
                }
            });
        };

        flatten(window.bookmarkData.getRootBookmarks());
        return allBookmarks;
    }

    // 搜索过滤器
    applyFilters(results, filters = {}) {
        let filtered = [...results];

        // 按类型过滤
        if (filters.type) {
            filtered = filtered.filter(item => {
                return filters.type === 'folder' ? item.isFolder : !item.isFolder;
            });
        }

        // 按日期范围过滤
        if (filters.dateRange) {
            const { start, end } = filters.dateRange;
            filtered = filtered.filter(item => {
                const date = new Date(item.dateAdded);
                return (!start || date >= new Date(start)) && 
                       (!end || date <= new Date(end));
            });
        }

        // 按标签过滤
        if (filters.tags && filters.tags.length > 0) {
            filtered = filtered.filter(item => {
                return item.tags && item.tags.some(tag => 
                    filters.tags.includes(tag)
                );
            });
        }

        return filtered;
    }
}

// 全局搜索管理器实例
window.searchManager = new SearchManager();