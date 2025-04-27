const h1f = document.getElementById("h1f");
h1f.classList.add("hidden");
/* 切换界面 */
window.addEventListener('DOMContentLoaded', checkHash);
window.addEventListener('hashchange', checkHash);
function checkHash() {
    let hash = window.location.hash;
    hash = decodeURIComponent(hash);
    switch (hash) {
        case '#八叉': qiehuan("t2"); break;
        case '#P站': qiehuan("t3"); break;
        case '#绅士': qiehuan("t4"); break;
        case '#其它': qiehuan("t99"); break;
        default: qiehuan("t1"); break;
    }
    marktxt();//mark文本
    window.scrollTo(0, 0); //从头浏览
}

//切换侧边栏
function qiehuan(x) {
    document.querySelectorAll('.lyctxt').forEach(div => {
        div.classList.remove('active');
    });
    //显示目标区块
    document.querySelector(`.lyctxt.${x}`).classList.add('active');
}

// 移动端和桌面端的点击和触摸处理函数
function setupHover(element) {
    let isTouch = false;
    // 触摸处理
    element.addEventListener('touchstart', function (e) {
        isTouch = true;
        activateElement(this);
        /* e.preventDefault(); // 阻止默认行为 */
    }, { passive: false });
    element.addEventListener('touchend', function () {
        isTouch = false;
        setTimeout(() => deactivateElement(this), 200);
    });
    // 鼠标处理
    element.addEventListener('mouseenter', function () {
        if (!isTouch) activateElement(this);
    });
    element.addEventListener('mouseleave', function () {
        if (!isTouch) deactivateElement(this);
    });
}
// 激活bar元素
function activateElement(el) {
    document.querySelectorAll('.bar').forEach(box => {
        if (box !== el) box.classList.remove('active');
    });
    el.classList.add('active');
}
// 关闭bar激活状态
function deactivateElement(el) {
    el.classList.remove('active');
}
// 全局触摸监听，清除bar状态
document.addEventListener('touchstart', function (e) {
    if (!e.target.closest('.bar')) {
        document.querySelectorAll('.bar').forEach(box => {
            box.classList.remove('active');
        });
    }
});
// 滚动时关闭所有状态
window.addEventListener('scroll', function () {
    document.querySelectorAll('.bar').forEach(box => {
        box.classList.remove('active');
    });
}, { passive: true });

function marktxt() {
    let container = document.querySelector('.lyctxt.active');
    let text = container.innerHTML;
    // 定义替换规则
    const replaceRules = [
        { regex: /\!\[(.+)\]\((.+)\s+"(.+)" (.+)\)/g, replacement: '<img alt="$1" src="$2" title="$3" loading="lazy" width="$4">' }, //图片
        { regex: /\[(.+?)\]\((.+?)\)/g, replacement: '<a href="$2" target="_blank">$1</a>' }, //链接
        { regex: /\s+#(\d) (.+)/g, replacement: '<h$1 style="margin:0.5em;line-height:1em;">$2</h$1>' }, //标题
        { regex: /~~(.+?)~~/g, replacement: '<del>$1</del>' }, //删除线
        { regex: /\s+tabc\s(.*)/g, replacement: '<p style="margin:2ex;text-align: center;">$1</p>' }, //居中文本
        { regex: /\s+tabd\s(.*)/g, replacement: '<p style="margin:1ex;">$1</p>' }, //不缩进
        { regex: /\s+tab\s(.*)/g, replacement: '<p style="margin:1ex;">　　$1</p>' }, //缩进
        { regex: /，。/g, replacement: '<br>' } //换行
    ];
    replaceRules.forEach(rule => {
        text = text.replace(rule.regex, rule.replacement);
    });
    //更新容器内容
    container.innerHTML = text;
    // 初始化bar动画
    container.querySelectorAll('.bar').forEach(setupHover);
}

//打开侧边栏
function toggleSidebar() {
    const sidebar = document.getElementById("mySidebar");
    sidebar.classList.toggle("active");
}
// 点击外部区域关闭
document.addEventListener('click', function (event) {
    const sidebar = document.getElementById("mySidebar");
    const isClickInside = sidebar.contains(event.target); //点击位置是否在侧边栏内
    const isButtonClick = event.target.closest('.open-btn'); //点击的是否为打开按钮
    const isLinkClick = event.target.closest('.sidebar a'); //点击的是否为侧边栏内的链接
    if (((!isClickInside && !isButtonClick) || isLinkClick) && sidebar.classList.contains("active")) {
        sidebar.classList.remove("active");
    }
});

function closeSidebar(event) {
    event.stopPropagation(); //阻止事件冒泡
    const sidebar = document.getElementById("mySidebar");
    sidebar.classList.remove("active");
}

function copyText(button, weizi) {
    const text = weizi == 'before' ?
        button.previousElementSibling.textContent :
        weizi == 'after' ?
            button.nextElementSibling.textContent :
            '异常';
    const btext = button.textContent;
    // 使用Clipboard API复制文本
    navigator.clipboard.writeText(text)
        .then(() => {
            button.textContent = "✓已复制";
            setTimeout(() => {
                button.textContent = btext;
            }, 1500);
        })
        .catch(err => {
            // 处理复制失败的情况
            console.error('复制失败:', err);
            button.textContent = "✗失败";
            setTimeout(() => {
                button.textContent = btext;
            }, 1500);
        });
}
function agree(button, txt, ts) {
    if (button.textContent != txt) {
        button.textContent = txt;
        if (ts) button.insertAdjacentHTML('afterend', ts);
    }
}