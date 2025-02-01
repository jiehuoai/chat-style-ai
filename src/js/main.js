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

    // 生成图片函数
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

    // 下载按钮功能
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

    async function generateSplitImages() {
        const splitHeight = parseInt(splitHeightInput.value);
        const originalContent = preview.innerHTML;
        
        // 创建预览容器
        preview.innerHTML = '';
        const container = document.createElement('div');
        container.className = 'space-y-4';
        preview.appendChild(container);

        // 创建临时容器用于分页计算
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalContent;
        tempDiv.className = 'xiaohongshu-preview';
        tempDiv.style.width = `${preview.clientWidth}px`;
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);

        // 分页处理
        const pages = [];
        let currentPage = document.createElement('div');
        let currentHeight = 0;

        // 遍历所有子元素
        Array.from(tempDiv.children).forEach(element => {
            const elementHeight = element.offsetHeight;
            const elementClone = element.cloneNode(true);
            
            // 检查是否需要新页面
            if (currentHeight + elementHeight > splitHeight || 
                (element.tagName.match(/^H[1-6]$/) && currentHeight > splitHeight * 0.7)) {
                if (currentPage.children.length > 0) {
                    pages.push(currentPage);
                    currentPage = document.createElement('div');
                    currentHeight = 0;
                }
            }

            // 添加元素到当前页
            currentPage.appendChild(elementClone);
            currentHeight += elementHeight;

            // 处理超高元素
            if (elementHeight > splitHeight) {
                if (currentPage.children.length > 1) {
                    currentPage.removeChild(elementClone);
                    pages.push(currentPage);
                    currentPage = document.createElement('div');
                    currentPage.appendChild(elementClone);
                }
                pages.push(currentPage);
                currentPage = document.createElement('div');
                currentHeight = 0;
            }
        });

        // 添加最后一页
        if (currentPage.children.length > 0) {
            pages.push(currentPage);
        }

        // 清理临时元素
        document.body.removeChild(tempDiv);

        // 生成预览图片
        for (let i = 0; i < pages.length; i++) {
            const pageContainer = document.createElement('div');
            pageContainer.className = 'xiaohongshu-page bg-white p-6 rounded-lg mb-4';
            pageContainer.style.width = `${preview.clientWidth}px`;
            pageContainer.style.minHeight = `${splitHeight}px`;
            pageContainer.appendChild(pages[i].cloneNode(true));
            
            // 应用样式
            applyXiaohongshuStyle(pageContainer);
            
            try {
                document.body.appendChild(pageContainer);
                pageContainer.style.position = 'fixed';
                pageContainer.style.left = '-9999px';
                
                const canvas = await html2canvas(pageContainer, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    logging: false,
                    useCORS: true,
                    allowTaint: true
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
                document.body.removeChild(pageContainer);
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

    async function downloadSplitImages() {
        const images = preview.querySelectorAll('img');
        
        for (let i = 0; i < images.length; i++) {
            try {
                const link = document.createElement('a');
                link.download = `xiaohongshu-style-image-${i + 1}.png`;
                link.href = images[i].src;
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
}); 