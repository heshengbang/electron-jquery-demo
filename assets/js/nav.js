//electron-settings is a simple persistent user settings framework for Electron
const settings = require('electron-settings');

document.body.addEventListener('click', (event) => {
	//Html5 页面上通过使用data-*自定义属性标签来存放了自定义数据，js中通过dataset可以获取该方式定义的所有数据k-v集合
	//通过key值读取dataset中section的值
	window.console.dir('nav.js - addEventListener ' + event.target);
	if (event.target.dataset.section) {
		handleSectionTrigger(event);
		//通过key值读取dataset中modal的值
	} else if (event.target.dataset.modal) {
		handleModalTrigger(event);
	} else if (event.target.classList.contains('modal-hide')) {
		//该部分用来处理about.html中get start按钮的，主要操作是隐藏about.html
		window.console.log('clicked in about.html');
		hideAllModals();
	}
});
//处理index.html中具有data-section属性的元素点击事件，原理是data-*
function handleSectionTrigger(event) {
	window.console.dir('section ' + event.target);
	//清除页面的is-shown和左侧按钮is-selected样式
	hideAllSectionsAndDeselectButtons();

	// Highlight clicked button and show view 高亮被点击的按钮和显示其对应的视图
	//index.html中的导航栏中被点击的按钮添加is-selected样式
	event.target.classList.add('is-selected');

	// Display the current section 展示当前的section
	//通过event获取事件的元素进而得到data-*的自定义数据k-v集合，从而获得当前应被展示的section
	const sectionId = `${event.target.dataset.section}-section`;
	//给应展示的section添加is-shown样式
	document.getElementById(sectionId).classList.add('is-shown');

	// Save currently active button in localStorage 将当前激活的section保存到localstorage中
	const buttonId = event.target.getAttribute('id');
	//electron-settings是为electron做用户设置持久化的，通过key-value进行操作
	settings.set('activeSectionButtonId', buttonId);
}
//激活默认的section
function activateDefaultSection() {
	//触发导航栏第一个按钮的点击事件
	document.getElementById('button-windows').click();
}
//展示左侧导航栏和右侧主内容栏
function showMainContent() {
	// 查找出所有具有js-nav样式的元素，罗列出它们的样式表，然后给加上is-shown样式
	// 导航栏
	document.querySelector('.js-nav').classList.add('is-shown');
	// 内容栏
	document.querySelector('.js-content').classList.add('is-shown');
}
//处理具有data-modal属性的元素点击时间，原理同data-section
function handleModalTrigger(event) {
	window.console.dir('modal ' + event.target);
	hideAllModals();
	//获得index.html中data-modal的元素
	const modalId = `${event.target.dataset.modal}-modal`;
	window.console.log(modalId);
	//展示about.html
	document.getElementById(modalId).classList.add('is-shown');
}
//隐藏所有的modal实际上，也就about一个
function hideAllModals() {
	//通过modal和is-shown获取到元素，并移除其is-shown样式
	const modals = document.querySelectorAll('.modal.is-shown');
	Array.prototype.forEach.call(modals, (modal) => {
		modal.classList.remove('is-shown');
	});
	showMainContent();
}
//隐藏所有节(指import.js中导入的html)和未被选中的按钮
function hideAllSectionsAndDeselectButtons() {
	const sections = document.querySelectorAll('.js-section.is-shown');
	//移除所有未被选中的section的is-shown样式
	Array.prototype.forEach.call(sections, (section) => {
		section.classList.remove('is-shown');
	});
	//index.html 中左侧导航栏中所有按钮去除被选中样式
	const buttons = document.querySelectorAll('.nav-button.is-selected');
	Array.prototype.forEach.call(buttons, (button) => {
		button.classList.remove('is-selected');
	});
}
//展示about.html
function displayAbout() {
	//查找所有id=about-modal的元素，并将其展示出来
	document.querySelector('#about-modal').classList.add('is-shown');
}

// 从electron-settings中读取，打开最近一次打开的窗口，如果没有，则直接显示about.html
const sectionId = settings.get('activeSectionButtonId');
if (sectionId) {
	showMainContent();
	const section = document.getElementById(sectionId);
	if (section) section.click();
} else {
	activateDefaultSection();
	displayAbout();
}
