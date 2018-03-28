const shell = require('electron').shell;

const links = document.querySelectorAll('a[href]');

Array.prototype.forEach.call(links, (link) => {
	const url = link.getAttribute('href');
	//如果a标签中的href属性包含http则禁用默认行为，转而打开系统的默认浏览器
	if (url.indexOf('http') === 0) {
		link.addEventListener('click', (e) => {
			// 通知浏览器不要执行与事件关联的默认动作
			e.preventDefault();
			shell.openExternal(url);
		});
	}
});
//执行完此js之后，index.html中所有指向联网操作的<a>标签都被禁止应用内打开，转而通过调用系统接口通过默认浏览器打开