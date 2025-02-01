document.addEventListener('DOMContentLoaded', function() {
    const markdownInput = document.getElementById('markdown-input');
    const preview = document.getElementById('preview');
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const splitImageCheckbox = document.getElementById('split-image');
    const splitHeightInput = document.getElementById('split-height');

    // 配置 marked
    marked.setOptions({
        breaks: true,
        gfm: true
    });

    // 实时预览功能
    markdownInput.addEventListener('input', updatePreview);

    function updatePreview() {
        const markdown = markdownInput.value;
        const html = marked.parse(markdown);
        preview.innerHTML = html;
        applyXiaohongshuStyle();
    }

    function applyXiaohongshuStyle() {
        // 添加小红书风格的样式
        preview.style.fontFamily = "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif";
        preview.style.lineHeight = '1.8';
        preview.style.color = '#333';

        // 样式化标题
        const headings = preview.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            heading.style.fontWeight = 'bold';
            heading.style.margin = '1em 0 0.5em';
        });

        // 样式化链接
        const links = preview.querySelectorAll('a');
        links.forEach(link => {
            link.style.color = '#ff2442';
            link.style.textDecoration = 'none';
        });

        // 样式化列表
        const lists = preview.querySelectorAll('ul, ol');
        lists.forEach(list => {
            list.style.paddingLeft = '1.5em';
            list.style.margin = '0.5em 0';
        });
    }

    // 修改生成图片函数
    generateBtn.addEventListener('click', async () => {
        try {
            if (splitImageCheckbox.checked) {
                await generateSplitImages();
            } else {
                await generateSingleImage();
            }
        } catch (error) {
            console.error('生成图片失败:', error);
            alert('生成图片失败，请重试');
        }
    });

    // 修改下载按钮功能
    downloadBtn.addEventListener('click', async () => {
        try {
            if (splitImageCheckbox.checked) {
                await downloadSplitImages();
            } else {
                await downloadSingleImage();
            }
        } catch (error) {
            console.error('下载图片失败:', error);
            alert('下载图片失败，请重试');
        }
    });

    // 添加新的函数
    async function generateSplitImages() {
        const splitHeight = parseInt(splitHeightInput.value);
        const originalContent = preview.innerHTML;
        
        // 创建一个容器来存放分页后的内容
        const pages = [];
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalContent;
        tempDiv.style.width = `${preview.clientWidth}px`;
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.visibility = 'hidden';
        document.body.appendChild(tempDiv);
        
        // 计算内容高度并分页
        let currentPage = document.createElement('div');
        let currentHeight = 0;
        
        // 获取所有子元素
        const elements = Array.from(tempDiv.children);
        
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const elementHeight = element.offsetHeight;
            
            // 如果当前元素高度超过分页高度，需要强制分页
            if (elementHeight > splitHeight) {
                // 如果当前页有内容，先保存当前页
                if (currentPage.children.length > 0) {
                    pages.push(currentPage);
                    currentPage = document.createElement('div');
                    currentHeight = 0;
                }
                // 将大元素单独作为一页
                const largePage = document.createElement('div');
                largePage.appendChild(element.cloneNode(true));
                pages.push(largePage);
            } else if (currentHeight + elementHeight > splitHeight) {
                // 如果添加当前元素会超过页面高度，创建新页面
                pages.push(currentPage);
                currentPage = document.createElement('div');
                currentPage.appendChild(element.cloneNode(true));
                currentHeight = elementHeight;
            } else {
                // 添加到当前页
                currentPage.appendChild(element.cloneNode(true));
                currentHeight += elementHeight;
            }
        }
        
        // 添加最后一页（如果有内容）
        if (currentPage.children.length > 0) {
            pages.push(currentPage);
        }
        
        // 清理临时元素
        document.body.removeChild(tempDiv);
        
        // 生成预览
        preview.innerHTML = '';
        const container = document.createElement('div');
        container.className = 'space-y-4';
        
        // 为每个页面生成图片
        for (let i = 0; i < pages.length; i++) {
            const pageContainer = document.createElement('div');
            pageContainer.className = 'xiaohongshu-page bg-white p-6 rounded-lg';
            pageContainer.style.width = `${preview.clientWidth}px`;
            pageContainer.style.height = `${splitHeight}px`;
            pageContainer.style.overflow = 'hidden';
            pageContainer.appendChild(pages[i]);
            
            // 应用样式
            applyXiaohongshuStyle(pageContainer);
            
            // 创建一个固定尺寸的容器
            const renderContainer = document.createElement('div');
            renderContainer.style.width = `${preview.clientWidth}px`;
            renderContainer.style.height = `${splitHeight}px`;
            renderContainer.style.position = 'fixed';
            renderContainer.style.left = '-9999px';
            renderContainer.style.top = '0';
            renderContainer.appendChild(pageContainer);
            document.body.appendChild(renderContainer);
            
            try {
                const canvas = await html2canvas(pageContainer, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    logging: false,
                    useCORS: true,
                    allowTaint: true,
                    width: preview.clientWidth,
                    height: splitHeight,
                    windowWidth: preview.clientWidth,
                    windowHeight: splitHeight
                });
                
                const img = document.createElement('img');
                img.src = canvas.toDataURL('image/png');
                img.style.width = '100%';
                img.style.borderRadius = '8px';
                
                const wrapper = document.createElement('div');
                wrapper.className = 'relative mb-4';
                wrapper.appendChild(img);
                
                // 添加页码
                const pageNum = document.createElement('div');
                pageNum.className = 'absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded';
                pageNum.textContent = `${i + 1}/${pages.length}`;
                wrapper.appendChild(pageNum);
                
                container.appendChild(wrapper);
            } catch (error) {
                console.error('生成页面图片失败:', error);
            } finally {
                // 清理临时元素
                document.body.removeChild(renderContainer);
            }
        }
        
        preview.appendChild(container);
    }

    // 修改下载功能
    async function downloadSplitImages() {
        const images = preview.querySelectorAll('img');
        
        for (let i = 0; i < images.length; i++) {
            try {
                // 创建一个新的画布来确保正确的尺寸
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const splitHeight = parseInt(splitHeightInput.value);
                
                // 设置画布尺寸
                canvas.width = preview.clientWidth * 2; // 2倍清晰度
                canvas.height = splitHeight * 2;
                
                // 设置背景色
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // 加载图片
                const img = new Image();
                img.src = images[i].src;
                await new Promise((resolve) => {
                    img.onload = resolve;
                });
                
                // 绘制图片
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // 下载图片
                const link = document.createElement('a');
                link.download = `xiaohongshu-style-image-${i + 1}.png`;
                link.href = canvas.toDataURL('image/png');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // 添加延迟以避免浏览器下载限制
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error('下载图片失败:', error);
            }
        }
    }

    async function generateSingleImage() {
        const canvas = await html2canvas(preview, {
            scale: 2,
            backgroundColor: '#ffffff'
        });
        
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        img.style.width = '100%';
        img.style.borderRadius = '8px';
        preview.innerHTML = '';
        preview.appendChild(img);
    }

    async function downloadSingleImage() {
        const canvas = await html2canvas(preview, {
            scale: 2,
            backgroundColor: '#ffffff'
        });
        
        const link = document.createElement('a');
        link.download = 'xiaohongshu-style-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    // 修改 applyXiaohongshuStyle 函数使其可以接受目标元素参数
    function applyXiaohongshuStyle(target = preview) {
        // 添加小红书风格的样式
        target.style.fontFamily = "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif";
        target.style.lineHeight = '1.8';
        target.style.color = '#333';

        // 样式化标题
        const headings = target.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            heading.style.fontWeight = 'bold';
            heading.style.margin = '1em 0 0.5em';
        });

        // 样式化链接
        const links = target.querySelectorAll('a');
        links.forEach(link => {
            link.style.color = '#ff2442';
            link.style.textDecoration = 'none';
        });

        // 样式化列表
        const lists = target.querySelectorAll('ul, ol');
        lists.forEach(list => {
            list.style.paddingLeft = '1.5em';
            list.style.margin = '0.5em 0';
        });
    }
}); 