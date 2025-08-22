const fs = require('fs');

// 读取原始文件
let content = fs.readFileSync('data.json', 'utf8');

// 修复JSON格式
// 1. 在开头添加缺失的 {
if (!content.trim().startsWith('{')) {
    content = '{\n  "' + content;
}

// 2. 修复属性之间缺少逗号的问题
content = content.replace(/"\s*\n\s*"/g, '",\n      "');

// 3. 修复对象之间缺少逗号的问题
content = content.replace(/}\s*\n\s*{/g, '},\n    {');

// 4. 确保文件以正确的格式结束
if (!content.trim().endsWith('}')) {
    content = content.trim() + '\n}';
}

// 写入修复后的文件
fs.writeFileSync('data-fixed.json', content);

// 验证修复后的JSON
try {
    const data = JSON.parse(content);
    console.log('JSON修复成功！');
    console.log('书签数量:', data.bookmarks ? data.bookmarks.length : 0);
} catch (error) {
    console.log('JSON修复失败:', error.message);
    console.log('需要手动修复');
}