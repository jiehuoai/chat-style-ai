document.addEventListener('DOMContentLoaded', function() {
    const markdownInput = document.getElementById('markdown-input');
    const preview = document.getElementById('preview');
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const splitImageCheckbox = document.getElementById('split-image');
    const splitHeightInput = document.getElementById('split-height');
    const templateSelect = document.getElementById('template-select');

    // 配置 marked
    marked.setOptions({
        breaks: true,
        gfm: true
    });

    // 定义模板样式
    const templates = {
        default: {
            name: '默认样式',
            styles: {
                container: {
                    fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
                    lineHeight: '1.8',
                    color: '#333',
                    padding: '20px',
                    backgroundColor: '#ffffff'
                },
                heading: {
                    fontWeight: 'bold',
                    margin: '1em 0 0.5em',
                    color: '#333'
                },
                link: {
                    color: '#ff2442',
                    textDecoration: 'none'
                },
                list: {
                    paddingLeft: '1.5em',
                    margin: '0.5em 0'
                }
            }
        },
        modern: {
            name: '现代简约',
            styles: {
                container: {
                    fontFamily: "'SF Pro Display', 'Inter', sans-serif",
                    lineHeight: '1.6',
                    color: '#2d3436',
                    padding: '24px',
                    backgroundColor: '#fafafa'
                },
                heading: {
                    fontWeight: '600',
                    margin: '1.2em 0 0.8em',
                    color: '#2d3436',
                    letterSpacing: '-0.02em'
                },
                link: {
                    color: '#0984e3',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(9, 132, 227, 0.3)'
                },
                list: {
                    paddingLeft: '1.2em',
                    margin: '0.8em 0'
                }
            }
        },
        elegant: {
            name: '优雅文艺',
            styles: {
                container: {
                    fontFamily: "'Noto Serif SC', 'Source Han Serif SC', serif",
                    lineHeight: '2',
                    color: '#2c3e50',
                    padding: '32px',
                    backgroundColor: '#fff9f0'
                },
                heading: {
                    fontWeight: '500',
                    margin: '1.5em 0 1em',
                    color: '#34495e',
                    borderBottom: '2px solid rgba(52, 73, 94, 0.1)',
                    paddingBottom: '0.3em'
                },
                link: {
                    color: '#c0392b',
                    textDecoration: 'none',
                    borderBottom: '1px dashed rgba(192, 57, 43, 0.3)'
                },
                list: {
                    paddingLeft: '2em',
                    margin: '1em 0'
                }
            }
        },
        vibrant: {
            name: '活力多彩',
            styles: {
                container: {
                    fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif",
                    lineHeight: '1.7',
                    color: '#444',
                    padding: '24px',
                    backgroundColor: '#ffffff',
                    borderLeft: '4px solid #00b894'
                },
                heading: {
                    fontWeight: 'bold',
                    margin: '1.2em 0 0.8em',
                    color: '#00b894',
                    paddingLeft: '0.5em',
                    borderLeft: '3px solid #00b894'
                },
                link: {
                    color: '#0984e3',
                    textDecoration: 'none',
                    background: 'linear-gradient(120deg, #81ecec 0%, #81ecec 100%)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 0.2em',
                    backgroundPosition: '0 88%',
                    transition: 'background-size 0.25s ease-in'
                },
                list: {
                    paddingLeft: '1.5em',
                    margin: '0.8em 0'
                }
            }
        },
        minimalist: {
            name: '极简白',
            styles: {
                container: {
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    lineHeight: '1.7',
                    color: '#2c3e50',
                    padding: '28px',
                    backgroundColor: '#ffffff',
                    maxWidth: '100%'
                },
                heading: {
                    fontWeight: '500',
                    margin: '1.5em 0 1em',
                    color: '#000',
                    letterSpacing: '-0.03em'
                },
                link: {
                    color: '#3498db',
                    textDecoration: 'none',
                    borderBottom: '1px solid #3498db'
                },
                list: {
                    paddingLeft: '1.2em',
                    margin: '0.8em 0',
                    color: '#34495e'
                }
            }
        },
        retro: {
            name: '复古风',
            styles: {
                container: {
                    fontFamily: "'Times New Roman', serif",
                    lineHeight: '1.8',
                    color: '#2c1810',
                    padding: '32px',
                    backgroundColor: '#f8f3e9',
                    borderRadius: '8px',
                    boxShadow: '0 0 20px rgba(0,0,0,0.1)'
                },
                heading: {
                    fontFamily: "'Georgia', serif",
                    fontWeight: 'bold',
                    margin: '1.2em 0 0.8em',
                    color: '#4a3728',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                },
                link: {
                    color: '#8b4513',
                    textDecoration: 'none',
                    borderBottom: '2px solid #8b4513'
                },
                list: {
                    paddingLeft: '2em',
                    margin: '1em 0',
                    listStyleType: 'circle'
                }
            }
        },
        tech: {
            name: '科技感',
            styles: {
                container: {
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    lineHeight: '1.6',
                    color: '#e0e0e0',
                    padding: '24px',
                    backgroundColor: '#1e1e1e',
                    borderRadius: '8px',
                    border: '1px solid #333'
                },
                heading: {
                    fontWeight: '600',
                    margin: '1em 0 0.8em',
                    color: '#61afef',
                    borderBottom: '1px solid #333',
                    paddingBottom: '0.3em'
                },
                link: {
                    color: '#98c379',
                    textDecoration: 'none',
                    borderBottom: '1px dashed #98c379'
                },
                list: {
                    paddingLeft: '1.5em',
                    margin: '0.8em 0',
                    color: '#abb2bf'
                }
            }
        },
        nature: {
            name: '自然风',
            styles: {
                container: {
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                    lineHeight: '1.8',
                    color: '#2d3436',
                    padding: '28px',
                    backgroundColor: '#f0f7f4',
                    borderRadius: '12px',
                    border: '1px solid #a8e6cf'
                },
                heading: {
                    fontWeight: '600',
                    margin: '1.2em 0 0.8em',
                    color: '#2d6a4f',
                    paddingLeft: '0.5em',
                    borderLeft: '4px solid #a8e6cf'
                },
                link: {
                    color: '#40916c',
                    textDecoration: 'none',
                    borderBottom: '2px solid rgba(64, 145, 108, 0.3)'
                },
                list: {
                    paddingLeft: '1.6em',
                    margin: '0.8em 0',
                    listStyleType: 'disc'
                }
            }
        },
        handwritten: {
            name: '手写风',
            styles: {
                container: {
                    fontFamily: "'Comic Sans MS', 'Segoe Print', cursive",
                    lineHeight: '1.8',
                    color: '#333',
                    padding: '30px',
                    backgroundColor: '#fffdf7',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                },
                heading: {
                    fontWeight: 'bold',
                    margin: '1.2em 0 0.8em',
                    color: '#ff6b6b',
                    textDecoration: 'underline wavy #ff6b6b'
                },
                link: {
                    color: '#4ecdc4',
                    textDecoration: 'none',
                    borderBottom: '2px dashed #4ecdc4'
                },
                list: {
                    paddingLeft: '2em',
                    margin: '1em 0',
                    listStyleType: 'square'
                }
            }
        },
        cute: {
            name: '可爱少女',
            styles: {
                container: {
                    fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif",
                    lineHeight: '1.8',
                    color: '#594d4d',
                    padding: '25px',
                    backgroundColor: '#fff5f5',
                    borderRadius: '12px',
                    border: '2px solid #ffb6c1',
                    boxShadow: '0 4px 12px rgba(255, 182, 193, 0.2)'
                },
                heading: {
                    fontWeight: 'bold',
                    margin: '1.2em 0 0.8em',
                    color: '#ff8ba7',
                    textAlign: 'center',
                    background: 'linear-gradient(120deg, #ffd1d1 0%, #ffd1d1 100%)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 0.3em',
                    backgroundPosition: '0 88%',
                    padding: '0 0.5em'
                },
                link: {
                    color: '#ff8ba7',
                    textDecoration: 'none',
                    borderBottom: '2px dotted #ff8ba7'
                },
                list: {
                    paddingLeft: '1.8em',
                    margin: '0.8em 0',
                    listStyleType: '🌸'
                }
            }
        },
        lifestyle: {
            name: '生活方式',
            styles: {
                container: {
                    fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif",
                    lineHeight: '1.8',
                    color: '#4a4a4a',
                    padding: '28px',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(149, 157, 165, 0.1)'
                },
                heading: {
                    fontWeight: '600',
                    margin: '1.3em 0 0.8em',
                    color: '#2b2b2b',
                    borderBottom: '3px solid #ffd166',
                    paddingBottom: '0.3em',
                    display: 'inline-block'
                },
                link: {
                    color: '#06d6a0',
                    textDecoration: 'none',
                    fontWeight: '500'
                },
                list: {
                    paddingLeft: '1.5em',
                    margin: '0.8em 0',
                    listStyleType: '✨'
                }
            }
        },
        coffee: {
            name: '咖啡时光',
            styles: {
                container: {
                    fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif",
                    lineHeight: '1.9',
                    color: '#433d3c',
                    padding: '30px',
                    backgroundColor: '#f9f5f0',
                    borderRadius: '12px',
                    border: '1px solid #e6d5c3'
                },
                heading: {
                    fontWeight: '600',
                    margin: '1.2em 0 0.8em',
                    color: '#6f4e37',
                    textAlign: 'left',
                    paddingLeft: '1em',
                    borderLeft: '4px solid #c0a080'
                },
                link: {
                    color: '#8b593e',
                    textDecoration: 'none',
                    borderBottom: '1px solid #8b593e'
                },
                list: {
                    paddingLeft: '1.6em',
                    margin: '0.8em 0',
                    listStyleType: '☕️'
                }
            }
        },
        minimal_pink: {
            name: '粉色简约',
            styles: {
                container: {
                    fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif",
                    lineHeight: '1.75',
                    color: '#4f4f4f',
                    padding: '25px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    borderTop: '3px solid #ff7eb6'
                },
                heading: {
                    fontWeight: '600',
                    margin: '1.2em 0 0.8em',
                    color: '#ff7eb6',
                    letterSpacing: '0.05em'
                },
                link: {
                    color: '#ff7eb6',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(255, 126, 182, 0.3)'
                },
                list: {
                    paddingLeft: '1.5em',
                    margin: '0.8em 0',
                    listStyleType: '💗'
                }
            }
        },
        travel: {
            name: '旅行日记',
            styles: {
                container: {
                    fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif",
                    lineHeight: '1.8',
                    color: '#2d4059',
                    padding: '28px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '16px',
                    border: '1px solid #e9ecef'
                },
                heading: {
                    fontWeight: '600',
                    margin: '1.3em 0 0.8em',
                    color: '#3d84a8',
                    textAlign: 'left',
                    paddingBottom: '0.3em',
                    borderBottom: '2px dashed #abedd8'
                },
                link: {
                    color: '#46cdcf',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(70, 205, 207, 0.3)'
                },
                list: {
                    paddingLeft: '1.6em',
                    margin: '0.8em 0',
                    listStyleType: '✈️'
                }
            }
        }
    };

    // 实时预览功能
    markdownInput.addEventListener('input', updatePreview);

    function updatePreview() {
        const markdown = markdownInput.value;
        const html = marked.parse(markdown);
        preview.innerHTML = html;
        applyXiaohongshuStyle();
    }

    function applyXiaohongshuStyle(target = preview) {
        const templateName = templateSelect.value;
        const template = templates[templateName];
        
        // 应用容器样式
        Object.assign(target.style, template.styles.container);

        // 样式化标题
        const headings = target.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            Object.assign(heading.style, template.styles.heading);
        });

        // 样式化链接
        const links = target.querySelectorAll('a');
        links.forEach(link => {
            Object.assign(link.style, template.styles.link);
        });

        // 样式化列表
        const lists = target.querySelectorAll('ul, ol');
        lists.forEach(list => {
            Object.assign(list.style, template.styles.list);
        });

        // 添加模板特定的额外样式
        if (template.styles.additional) {
            template.styles.additional(target);
        }
    }

    // 监听模板选择变化
    templateSelect.addEventListener('change', updatePreview);

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
        // 保存原始预览内容
        const originalContent = preview.innerHTML;
        
        try {
            // 创建一个临时容器，保持和预览完全一样的样式
            const container = document.createElement('div');
            container.className = 'bg-white p-6 rounded-lg shadow';
            container.style.width = `${preview.clientWidth}px`;
            container.innerHTML = originalContent;
            
            // 应用当前选择的主题样式
            const templateName = templateSelect.value;
            const template = templates[templateName];
            applyXiaohongshuStyle(container);
            
            // 临时添加到文档中进行渲染
            document.body.appendChild(container);
            container.style.position = 'fixed';
            container.style.left = '-9999px';
            container.style.top = '0';
            
            // 使用更高的 scale 值以获得更清晰的图片
            const canvas = await html2canvas(container, {
                scale: 2,
                backgroundColor: template.styles.container.backgroundColor || '#ffffff',
                logging: false,
                useCORS: true,
                allowTaint: true,
                width: preview.clientWidth,
                height: container.offsetHeight
            });
            
            // 创建下载链接
            const link = document.createElement('a');
            link.download = `chatstyle-${templateName}-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            
            // 清理临时元素
            document.body.removeChild(container);
            
            // 触发下载
            link.click();
        } catch (error) {
            console.error('生成图片失败:', error);
            alert('生成图片失败，请重试');
        }
    }

    async function downloadSplitImages() {
        const images = preview.querySelectorAll('img');
        const templateName = templateSelect.value;
        
        for (let i = 0; i < images.length; i++) {
            try {
                // 创建临时容器
                const container = document.createElement('div');
                container.className = 'bg-white p-6 rounded-lg shadow';
                container.style.width = `${preview.clientWidth}px`;
                
                // 创建图片容器
                const imgWrapper = document.createElement('div');
                imgWrapper.className = 'relative';
                
                // 克隆原始图片
                const img = images[i].cloneNode(true);
                imgWrapper.appendChild(img);
                
                // 添加页码（如果有多页）
                if (images.length > 1) {
                    const pageNum = document.createElement('div');
                    pageNum.className = 'absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded';
                    pageNum.textContent = `${i + 1}/${images.length}`;
                    imgWrapper.appendChild(pageNum);
                }
                
                container.appendChild(imgWrapper);
                
                // 应用主题样式
                applyXiaohongshuStyle(container);
                
                // 临时添加到文档中进行渲染
                document.body.appendChild(container);
                container.style.position = 'fixed';
                container.style.left = '-9999px';
                container.style.top = '0';
                
                // 生成图片
                const canvas = await html2canvas(container, {
                    scale: 2,
                    backgroundColor: templates[templateName].styles.container.backgroundColor || '#ffffff',
                    logging: false,
                    useCORS: true,
                    allowTaint: true
                });
                
                // 创建下载链接
                const link = document.createElement('a');
                link.download = `chatstyle-${templateName}-${i + 1}-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                
                // 清理临时元素
                document.body.removeChild(container);
                
                // 触发下载
                link.click();
                
                // 添加延迟以避免浏览器下载限制
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error('下载图片失败:', error);
                alert(`下载第 ${i + 1} 张图片失败，请重试`);
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