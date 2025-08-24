// 主题管理
class ThemeManager {
    constructor() {
        this.currentTheme = 'default';
        this.themeLink = document.getElementById('theme-link');
        this.init();
    }

    init() {
        // 从本地存储加载主题设置
        const savedTheme = localStorage.getItem('bookmark-theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else if (this.currentTheme === 'transparent') {
            // 如果默认是透明主题，确保添加背景图
            this.addBackgroundImage();
        }

        // 绑定主题切换事件
        this.bindEvents();
    }

    bindEvents() {
        const themeBtn = document.getElementById('theme-btn');
        const themeDropdown = document.getElementById('theme-dropdown');
        const themeOptions = document.querySelectorAll('.theme-option');

        // 切换主题下拉菜单
        themeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            themeDropdown.classList.toggle('show');
        });

        // 点击其他地方关闭下拉菜单
        document.addEventListener('click', () => {
            themeDropdown.classList.remove('show');
        });

        // 主题选项点击事件
        themeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const theme = option.dataset.theme;
                this.setTheme(theme);
                themeDropdown.classList.remove('show');
            });
        });
    }

    setTheme(themeName) {
        this.currentTheme = themeName;
        this.themeLink.href = `css/themes/${themeName}.css`;
        
        // 保存到本地存储
        localStorage.setItem('bookmark-theme', themeName);
        
        // 更新主题选项的激活状态
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.toggle('active', option.dataset.theme === themeName);
        });

        // 处理透明主题的特殊类名
        document.body.classList.remove('theme-transparent');
        if (themeName === 'transparent') {
            document.body.classList.add('theme-transparent');
            this.addBackgroundImage();
        } else {
            this.removeBackgroundImage();
        }

        // 触发主题变更事件
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeName }
        }));
    }

    // 显示背景图元素
    addBackgroundImage() {
        const bgContainer = document.getElementById('background-container');
        if (bgContainer) {
            bgContainer.style.display = 'block';
        }
    }
    
    // 隐藏背景图元素
    removeBackgroundImage() {
        const bgContainer = document.getElementById('background-container');
        if (bgContainer) {
            bgContainer.style.display = 'none';
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    // 检测系统主题偏好
    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'default';
    }

    // 监听系统主题变化
    watchSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (this.currentTheme === 'auto') {
                    this.setTheme(e.matches ? 'dark' : 'default');
                }
            });
        }
    }
}

// 全局主题管理器实例
window.themeManager = new ThemeManager();