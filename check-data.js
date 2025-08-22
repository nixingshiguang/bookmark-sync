const data = require('./data.json');

console.log('书签总数:', data.bookmarks.length);

// 查找根级别的书签和文件夹
const rootItems = data.bookmarks.filter(b => b.parentId === '0' || b.parentId === '1');
console.log('根级别项目数:', rootItems.length);

console.log('\n根级别文件夹:');
const rootFolders = rootItems.filter(b => b.isFolder);
rootFolders.forEach(f => {
    console.log(`- ID: ${f.id}, Name: ${f.name}, ParentId: ${f.parentId}`);
});

console.log('\n根级别书签:');
const rootBookmarksOnly = rootItems.filter(b => !b.isFolder);
rootBookmarksOnly.forEach(b => {
    console.log(`- ID: ${b.id}, Name: ${b.name}, ParentId: ${b.parentId}`);
});

// 检查第一个文件夹的子项
if (rootFolders.length > 0) {
    const firstFolder = rootFolders[0];
    const children = data.bookmarks.filter(b => b.parentId === firstFolder.id);
    console.log(`\n文件夹 "${firstFolder.name}" 的子项数量:`, children.length);
    if (children.length > 0) {
        console.log('前5个子项:');
        children.slice(0, 5).forEach(c => {
            console.log(`  - ${c.name} (${c.isFolder ? '文件夹' : '书签'})`);
        });
    }
}