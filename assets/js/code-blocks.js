const fs = require('fs');
const path = require('path');

const codeBlocksWithPaths = document.querySelectorAll('code[data-path]');

Array.prototype.forEach.call(codeBlocksWithPaths, (code) => {
	const codePath = path.join(__dirname, '..', code.dataset.path);
	const extension = path.extname(codePath);
	code.classList.add(`language-${extension.substring(1)}`);
	//将代码中的路径获取到，并读取到页面上
	code.textContent = fs.readFileSync(codePath);
});
//html文本被完全加载和解析后触发该事件，该事件主要用于使用于highlight.js插件对demo中用到的代码进行高亮处理
document.addEventListener('DOMContentLoaded', () => {
	const highlight = require('highlight.js');
	const codeBlocks = document.querySelectorAll('pre code');
	Array.prototype.forEach.call(codeBlocks, (code) => {
		highlight.highlightBlock(code);
	});
});
