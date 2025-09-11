(function () {
    var isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(navigator.userAgent);
    var viewport = document.querySelector('meta[name="viewport"]');
    if (isMobile) {
        viewport.content = "width=device-width, initial-scale=1.0, user-scalable=no";
    } else {
        viewport.content = "width=device-width, initial-scale=1.0";
    }
})();

// 页面加载和hash切换
window.addEventListener('DOMContentLoaded', checkHash);
window.addEventListener('hashchange', checkHash);
function checkHash() {
    let hash = decodeURIComponent(window.location.hash);
    switch (hash) {
        case '#八叉': qiehuan("t2"); break;
        case '#P站': qiehuan("t3"); break;
        case '#绅士': qiehuan("t4"); break;
        case '#其它': qiehuan("t99"); break;
        case '#at': qiehuan("t0"); break;
        default: qiehuan("t1"); break;
    }
    marktxt();
    window.scrollTo(0, 0);
}

//侧边栏内容处理
const sidebar = document.getElementById('mySidebar');
if (sidebar) {
    sidebar.innerHTML = `
<a href="/" class="hash-link">首页</a>
<a href="/#八叉" class="hash-link">八叉书库讲解</a>
<a href="/#P站" class="hash-link">pixiv小说讲解</a>
<a href="/#绅士" class="hash-link">绅士漫画介绍</a>
<a href="/boke/" class="hash-link">博客贴</a>`;
}

// 切换内容区块
function qiehuan(x) {
    document.querySelectorAll('.lyctxt').forEach(div => div.classList.remove('active'));
    document.querySelector(`.lyctxt.${x}`).classList.add('active');
}

// 处理元素的点击和触摸事件
function isBarElement(el) {
    return el.classList && el.classList.contains('bar');
}
let activeBar = null; // 记录当前激活的bar元素

document.addEventListener('pointerdown', function (e) {
    let tar = e.target;
    if (isBarElement(tar)) {
        activateElement(tar);
        activeBar = tar;
    } else {
        document.querySelectorAll('.bar').forEach(b => b.classList.remove('active'));
        activeBar = null;
    }
});
document.addEventListener('pointerup', function (e) {
    let tar = e.target;
    // 如果 pointerup 不是在 bar 或不是同一个 bar，或者手指滑出，则取消激活
    if (activeBar && tar !== activeBar) {
        deactivateElement(activeBar);
        activeBar = null;
    } else if (isBarElement(tar)) {
        setTimeout(() => {
            deactivateElement(tar);
            if (activeBar === tar) activeBar = null;
        }, 200);
    } else if (tar.closest('.sidebar a')) {
        closeSidebar(e);
    }
});
document.addEventListener('pointercancel', function (e) {
    if (activeBar) {
        deactivateElement(activeBar);
        activeBar = null;
    }
});

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

// 内容区块动画和文本处理
function marktxt() {
    let container = document.querySelector('.lyctxt.active');
    requestAnimationFrame(() => {
        container.style.animation = 'fadeIn 0.6s ease-in forwards';
    });
    let text = container.innerHTML;
    const replaceRules = [
        { regex: /```([\s\S]+?)```/g, replacement: '<div class="code"><pre>$1</pre></div>' },
        { regex: /\/\/tab.*/g, replacement: '' },
        { regex: /!\[(.+)\]\((.+)\s+"(.+)" (.+)\)/g, replacement: '<img class="lycimg" alt="$1" src="$2" title="$3" loading="lazy" width="$4">' },
        { regex: /!\[(.+),(.+)\]\((.+)\)\[(.+)\]\(([^\s"]+) "([^\s"]+)"\)/g, replacement: '<video class="lycvideo" width="$1" height="$2" $3><source src="$5" type="$6">$4</video>' },
        { regex: /\[(.+?)\]\((.+?)\)/g, replacement: '<a href="$2" target="_blank">$1</a>' },
        { regex: /\s+##(\d) (.+)/g, replacement: '\n<h$1 style="margin:0.5em;line-height:1em;">$2</h$1>' },
        { regex: /~~(.+?)~~/g, replacement: '<del>$1</del>' }
    ];
    replaceRules.forEach(rule => {
        text = text.replace(rule.regex, rule.replacement);
    });
    text = text.replace(/\s+(tab.?)\s(.+)|，。/g,(match,p1,p2) => {
        if (match === '，。') return '<br>';
        if (p1=='tabc') return `<p style="margin:2ex;text-align: center;">${p2}</p>`;
        if (p1=='tabr') return `<p style="margin:2ex;text-align: right;">${p2}</p>`;
        if (p1=='tabd') return `<p style="margin:1ex;">${p2}</p>`;
        if (p1=='tab') return `<p style="margin:1ex;">　　${p2}</p>`;
        return match;
    });

    container.innerHTML = text;
    container.querySelectorAll('.code').forEach(preBlock => {
        const btext = '复制';
        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.textContent = btext;
        const pre = preBlock.querySelector('pre');
        pre.innerHTML = pre.innerText
        .replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|(@js:|{{|}}|\$\.)|[?!+=\-:&\|]/g, (match,p1) => {
            if (match.length == 1) return `<span class="keychar">${match}</span>`;
            else if (p1) return `<span class="legadokey">${p1}</span>`;
            return `<span class="string">${match}</span>`
        })
        .replace(/\b(var|let|const|function)\b/g,'<span class="keyword">$1</span>')
        .replace(/(?<=\s)(\/\/.+)/g,'<span class="comment">$1</span>');
        preBlock.appendChild(button);
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(pre.innerText)
                .then(() => {
                    button.textContent = "✓已复制";
                    setTimeout(() => {
                        button.textContent = btext;
                    }, 1500);
                })
                .catch(err => {
                    console.error('复制失败:', err);
                    button.textContent = "✗失败";
                    setTimeout(() => {
                        button.textContent = btext;
                    }, 1500);
                });
        });
    });
}

// 侧边栏开关
function toggleSidebar() {
    document.getElementById("mySidebar").classList.toggle("active");
}
function closeSidebar(event) {
    event.stopPropagation();
    document.getElementById("mySidebar").classList.remove("active");
}

// 复制文本
function copyText(button, weizi) {
    const text = weizi == 'before' ?
        button.previousElementSibling.textContent :
        weizi == 'after' ?
            button.nextElementSibling.textContent :
            '异常';
    const btext = button.textContent;
    navigator.clipboard.writeText(text)
        .then(() => {
            button.textContent = "✓已复制";
            setTimeout(() => {
                button.textContent = btext;
            }, 1500);
        })
        .catch(err => {
            console.error('复制失败:', err);
            button.textContent = "✗失败";
            setTimeout(() => {
                button.textContent = btext;
            }, 1500);
        });
}
// 按钮同意功能
function agree(button, txt, ts) {
    if (button.textContent != txt) {
        button.textContent = txt;
        if (ts) button.insertAdjacentHTML('afterend', ts);
    }
}