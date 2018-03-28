const links = document.querySelectorAll('link[rel="import"]');

// Import and add each page to the DOM
// 获取index.html中通过link导入的页面
Array.prototype.forEach.call(links, (link) => {
	//获取导入页面的HTML，导入页面是使用的Html5中的<template>模板标签
	let template = link.import.querySelector('.task-template');
	//将template的文档节点，复制到index.html中，第二个参数为true表示递归复制其子节点
	let clone = document.importNode(template.content, true);

	//判断当前参数link是否为about页面，如果是about页面就将其作为body中的子节点添加到后面
	if (link.href.match('about.html')) {
		document.querySelector('body').appendChild(clone);
	} else {
		//如果当前节点不是about.html页面就添加到index.html中的<main>标签下
		document.querySelector('.content').appendChild(clone);
	}
});
//执行完此js后，index.html实际上除了页面内容外，分别在<main>标签下添加了几个子页面（节点），在<main>标签后添加了一个子页面（about.html）
//需要说明的是，此js中导入的所有html都是用了template标签，而该标签默认是display: none;的