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
        const previewHeight = preview.scrollHeight;
        const numSplits = Math.ceil(previewHeight / splitHeight);
        
        preview.innerHTML = ''; // 清空预览区域
        const container = document.createElement('div');
        container.className = 'space-y-4';
        
        for (let i = 0; i < numSplits; i++) {
            const clonedPreview = preview.cloneNode(true);
            clonedPreview.style.height = `${splitHeight}px`;
            clonedPreview.style.overflow = 'hidden';
            clonedPreview.style.position = 'relative';
            clonedPreview.style.top = `-${i * splitHeight}px`;
            
            const canvas = await html2canvas(clonedPreview, {
                scale: 2,
                backgroundColor: '#ffffff',
                height: splitHeight,
                windowHeight: splitHeight
            });
            
            const img = document.createElement('img');
            img.src = canvas.toDataURL('image/png');
            img.style.width = '100%';
            img.style.borderRadius = '8px';
            
            const wrapper = document.createElement('div');
            wrapper.className = 'relative';
            wrapper.appendChild(img);
            
            // 添加页码
            const pageNum = document.createElement('div');
            pageNum.className = 'absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded';
            pageNum.textContent = `${i + 1}/${numSplits}`;
            wrapper.appendChild(pageNum);
            
            container.appendChild(wrapper);
        }
        
        preview.appendChild(container);
    }

    async function downloadSplitImages() {
        const splitHeight = parseInt(splitHeightInput.value);
        const previewHeight = preview.scrollHeight;
        const numSplits = Math.ceil(previewHeight / splitHeight);
        
        for (let i = 0; i < numSplits; i++) {
            const clonedPreview = preview.cloneNode(true);
            clonedPreview.style.height = `${splitHeight}px`;
            clonedPreview.style.overflow = 'hidden';
            clonedPreview.style.position = 'relative';
            clonedPreview.style.top = `-${i * splitHeight}px`;
            
            const canvas = await html2canvas(clonedPreview, {
                scale: 2,
                backgroundColor: '#ffffff',
                height: splitHeight,
                windowHeight: splitHeight
            });
            
            const link = document.createElement('a');
            link.download = `xiaohongshu-style-image-${i + 1}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            // 添加延迟以避免浏览器下载限制
            await new Promise(resolve => setTimeout(resolve, 500));
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
}); 