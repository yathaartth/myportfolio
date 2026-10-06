document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Active Link Highlight based on Current Page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 2. High-Performance RAF-Throttled Scroll Handlers
    const navbar = document.querySelector('.navbar');
    let backToTopBtn = document.querySelector('.back-to-top');
    let scrollTicking = false;

    function onScrollTick() {
        const scrollY = window.scrollY;
        if (navbar) {
            if (scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        if (backToTopBtn) {
            if (scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
        scrollTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(onScrollTick);
            scrollTicking = true;
        }
    }, { passive: true });

    // 3. Mobile Navigation Menu Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinksContainer.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu on clicking link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close menu on clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinksContainer.contains(e.target) && !navToggle.contains(e.target)) {
                navLinksContainer.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // 4. Apple-style Scroll Reveal Animation (IntersectionObserver)
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Spotlight Pointer Glow Effect & 3D Tilt on Glass Cards (Desktop only)
    const spotlightCards = document.querySelectorAll('.quick-card, .skill-card, .project-card, .social-card, .about-section, .learning-box, .contact-form-card, .timeline-content, .cert-card, .badge-card, .cert-stat-card, .resume-project-card, .resume-skill-category, .featured-blog-card, .blog-card');
    
    if (window.innerWidth > 900) {
        spotlightCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -4;
                const rotateY = ((x - centerX) / centerX) * 4;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // 6. Modern Kinetic Role Rotator in Hero Section
    const roleRotator = document.getElementById('hero-role-rotator');
    if (roleRotator) {
        const slides = roleRotator.querySelectorAll('.role-item, .role-slide');
        if (slides.length > 1) {
            let currentIndex = 0;
            setInterval(() => {
                const currentSlide = slides[currentIndex];
                currentIndex = (currentIndex + 1) % slides.length;
                const nextSlide = slides[currentIndex];

                currentSlide.classList.remove('active');
                currentSlide.classList.add('leaving');

                nextSlide.classList.remove('leaving');
                nextSlide.classList.add('active');

                setTimeout(() => {
                    currentSlide.classList.remove('leaving');
                }, 650);
            }, 3200);
        }
    }

    // 7. Formspree Seamless AJAX Submission with Success Animation
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const successBanner = document.getElementById('form-success');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const originalBtnHTML = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.classList.add('btn-sending');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Message...';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    if (successBanner) {
                        successBanner.style.display = 'flex';
                    }
                    submitBtn.classList.remove('btn-sending');
                    submitBtn.classList.add('btn-success');
                    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent Successfully!';

                    contactForm.reset();

                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('btn-success');
                        submitBtn.innerHTML = originalBtnHTML;
                    }, 6000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('btn-sending');
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error! Try Again';

                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnHTML;
                }, 4000);
            }
        });
    }

    // 8. Dynamic Back to Top Button
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTopBtn);
    }

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Universal Smooth Scrolling for Internal Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // 9. Modern Ultra-Fast Top Laser Page Transition
    let progressBar = document.getElementById('page-progress-bar');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'page-progress-bar';
        document.body.appendChild(progressBar);
    }

    // Flash finished on page readiness
    progressBar.classList.add('finished');
    document.body.classList.add('page-enter');
    setTimeout(() => {
        progressBar.classList.remove('loading', 'finished');
    }, 280);

    // Reset when navigating back/forward (bfcache)
    window.addEventListener('pageshow', () => {
        document.body.classList.remove('page-leaving');
        document.body.classList.add('page-enter');
        if (progressBar) progressBar.classList.remove('loading');
    });

    // Snappy, classy page navigation (110ms)
    let isNavigating = false;
    const allLinks = document.querySelectorAll('a[href]');
    allLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href ||
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.startsWith('javascript:') ||
            href.startsWith('http://') ||
            href.startsWith('https://') ||
            link.getAttribute('target') === '_blank' ||
            link.hasAttribute('download') ||
            href.endsWith('.pdf') ||
            href.endsWith('.docx')) {
            return;
        }

        link.addEventListener('click', (e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
                return;
            }

            const currentPath = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
            const targetPath = (href.split('/').pop() || 'index.html').toLowerCase();

            if (currentPath === targetPath) {
                return;
            }

            if (isNavigating) return;
            isNavigating = true;
            e.preventDefault();

            progressBar.classList.remove('finished');
            progressBar.classList.add('loading');
            document.body.classList.add('page-leaving');

            setTimeout(() => {
                window.location.href = href;
            }, 110);
        });
    });

    // ===================================================
    // 10. TOAST NOTIFICATION HELPER
    // ===================================================
    function showToast(message, icon = 'fas fa-check-circle') {
        let toast = document.querySelector('.toast-notice');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-notice';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<i class="${icon}" style="color: var(--accent-cyan);"></i> <span>${message}</span>`;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    // ===================================================
    // 11. CERTIFICATIONS & BADGES PAGE CONTROLS
    // ===================================================
    const certFilterTabs = document.querySelectorAll('.cert-filter-tab');
    const certCards = document.querySelectorAll('.cert-card');
    const badgeCards = document.querySelectorAll('.badge-card');
    const badgesSectionTitle = document.getElementById('badges-section-heading');

    if (certFilterTabs.length > 0) {
        certFilterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                certFilterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.getAttribute('data-filter');

                certCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'flex';
                        card.style.animation = 'pageQuickReveal 0.3s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });

                if (badgeCards.length > 0) {
                    if (filter === 'all' || filter === 'badges') {
                        badgeCards.forEach(b => {
                            b.style.display = 'flex';
                            b.style.animation = 'pageQuickReveal 0.3s ease forwards';
                        });
                        if (badgesSectionTitle) badgesSectionTitle.style.display = 'flex';
                    } else {
                        badgeCards.forEach(b => b.style.display = 'none');
                        if (badgesSectionTitle) badgesSectionTitle.style.display = 'none';
                    }
                }
            });
        });
    }

    // Certificate Preview Modal
    const certModal = document.getElementById('cert-preview-modal');
    const certModalClose = document.getElementById('cert-modal-close');
    const certModalBody = document.getElementById('cert-modal-body');
    const viewCertButtons = document.querySelectorAll('.btn-preview-cert');

    if (certModal) {
        viewCertButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const title = btn.getAttribute('data-title') || 'Verified Credential';
                const org = btn.getAttribute('data-org') || 'Accredited Issuer';
                const id = btn.getAttribute('data-id') || 'VERIFIED-ID';
                const date = btn.getAttribute('data-date') || '2025 - Present';
                const skills = btn.getAttribute('data-skills') || 'Computer Science';
                const url = btn.getAttribute('data-url') || '#';

                if (certModalBody) {
                    certModalBody.innerHTML = `
                        <div class="cert-preview-card">
                            <div class="cert-preview-watermark"><i class="fas fa-award"></i></div>
                            <span class="cert-verified-pill" style="margin-bottom: 16px;"><i class="fas fa-check-shield"></i> Official Credential Verification</span>
                            <h3 style="font-size: 1.5rem; color: #ffffff; margin-bottom: 8px;">${title}</h3>
                            <p style="color: var(--accent-cyan); font-weight: 700; font-size: 1.1rem; margin-bottom: 18px;">${org}</p>
                            
                            <div class="cert-meta-row" style="justify-content: center; margin-bottom: 22px;">
                                <div class="cert-meta-item"><i class="far fa-calendar-alt"></i> Issued: ${date}</div>
                                <div class="cert-meta-item"><i class="fas fa-fingerprint"></i> ID: ${id}</div>
                            </div>
                            
                            <div style="margin-bottom: 24px;">
                                <p style="font-size: 0.86rem; color: var(--text-muted); margin-bottom: 10px;">VALIDATED SKILLS & COMPETENCIES</p>
                                <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                                    ${skills.split(',').map(s => `<span class="cert-tag" style="background: rgba(56, 189, 248, 0.12); color: #e2e8f0; border-color: rgba(56, 189, 248, 0.3);">${s.trim()}</span>`).join('')}
                                </div>
                            </div>

                            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                                <a href="${url}" target="_blank" rel="noopener noreferrer" class="cert-btn cert-btn-primary">
                                    <i class="fas fa-external-link-alt"></i> Open Issuing Portal
                                </a>
                                <button type="button" class="cert-btn cert-btn-outline" onclick="window.print()">
                                    <i class="fas fa-print"></i> Print Details
                                </button>
                            </div>
                        </div>
                    `;
                }

                certModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeCertModal = () => {
            certModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) closeCertModal();
        });
    }

    // ===================================================
    // 12. UNIVERSAL PDF.JS RESUME VIEWER & VIEW TOGGLE
    // ===================================================
    const resumePdfView = document.getElementById('resume-pdf-view');
    const resumeInteractiveView = document.getElementById('resume-interactive-view');
    const toggleViewPdf = document.getElementById('toggle-view-pdf');
    const toggleViewInteractive = document.getElementById('toggle-view-interactive');
    const btnDownloadResume = document.getElementById('btn-download-resume');
    const btnPrintResume = document.getElementById('btn-print-resume');

    if (btnDownloadResume) {
        btnDownloadResume.addEventListener('click', () => {
            showToast('Downloading official resume PDF...', 'fas fa-file-pdf');
        });
    }

    if (btnPrintResume) {
        btnPrintResume.addEventListener('click', () => {
            window.print();
        });
    }

    // Toggle between PDF Viewer and Interactive HTML View
    if (toggleViewPdf && toggleViewInteractive && resumePdfView && resumeInteractiveView) {
        toggleViewPdf.addEventListener('click', () => {
            toggleViewPdf.classList.add('active');
            toggleViewInteractive.classList.remove('active');
            resumePdfView.style.display = 'flex';
            resumeInteractiveView.style.display = 'none';
            showToast('Switched to PDF Viewer', 'fas fa-file-pdf');
        });

        toggleViewInteractive.addEventListener('click', () => {
            toggleViewInteractive.classList.add('active');
            toggleViewPdf.classList.remove('active');
            resumePdfView.style.display = 'none';
            resumeInteractiveView.style.display = 'block';
            showToast('Switched to Interactive View', 'fas fa-align-left');
        });
    }

    // PDF.js Canvas Engine Initialization
    const pdfRenderArea = document.getElementById('pdf-render-area');
    const pdfLoading = document.getElementById('pdf-loading');
    const pdfFallback = document.getElementById('pdf-fallback');
    const pdfZoomIn = document.getElementById('pdf-zoom-in');
    const pdfZoomOut = document.getElementById('pdf-zoom-out');
    const pdfFitWidth = document.getElementById('pdf-fit-width');
    const pdfZoomLevel = document.getElementById('pdf-zoom-level');
    const pdfPageNum = document.getElementById('pdf-page-num');

    if (pdfRenderArea) {
        let currentPdfDoc = null;
        let baseScale = 1.0;
        let userZoom = 1.0;
        let renderingInProgress = false;

        function getFitScale(page) {
            const containerWidth = pdfRenderArea.clientWidth || 
                (window.innerWidth > 900 ? 860 : Math.max(window.innerWidth - 48, 280));
            const unscaledViewport = page.getViewport({ scale: 1.0 });
            const fit = (containerWidth - 20) / unscaledViewport.width;
            return Math.min(Math.max(fit, 0.4), 2.2);
        }

        function renderPdfPage(scaleMultiplier = 1.0) {
            if (!currentPdfDoc || renderingInProgress) return;
            renderingInProgress = true;

            currentPdfDoc.getPage(1).then(page => {
                if (pdfLoading) pdfLoading.classList.add('hidden');
                if (pdfFallback) pdfFallback.style.display = 'none';

                const computedScale = baseScale * scaleMultiplier;
                const dpr = Math.min(window.devicePixelRatio || 1, 2.5); // Sharp vector text on high-DPI screens
                const viewport = page.getViewport({ scale: computedScale });

                let canvas = pdfRenderArea.querySelector('canvas');
                if (!canvas) {
                    canvas = document.createElement('canvas');
                    canvas.className = 'pdf-page-canvas';
                    pdfRenderArea.appendChild(canvas);
                }

                canvas.width = Math.floor(viewport.width * dpr);
                canvas.height = Math.floor(viewport.height * dpr);
                canvas.style.width = Math.floor(viewport.width) + 'px';
                canvas.style.height = Math.floor(viewport.height) + 'px';

                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                const renderContext = {
                    canvasContext: ctx,
                    transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null,
                    viewport: viewport
                };

                page.render(renderContext).promise.then(() => {
                    renderingInProgress = false;
                    if (pdfZoomLevel) pdfZoomLevel.textContent = `${Math.round(scaleMultiplier * 100)}%`;
                    if (pdfPageNum) pdfPageNum.innerHTML = `<i class="fas fa-file-alt"></i> Page 1 of ${currentPdfDoc.numPages || 1}`;
                }).catch(err => {
                    console.error('Page render error:', err);
                    renderingInProgress = false;
                });
            }).catch(err => {
                console.error('Get page error:', err);
                renderingInProgress = false;
                showPdfFallback();
            });
        }

        function showPdfFallback() {
            if (pdfLoading) pdfLoading.classList.add('hidden');
            if (pdfFallback) pdfFallback.style.display = 'block';
        }

        function loadPdf() {
            if (typeof pdfjsLib === 'undefined') {
                showPdfFallback();
                return;
            }

            try {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            } catch (e) {
                console.warn('PDF.js worker setup note:', e);
            }

            const loadingTask = pdfjsLib.getDocument('resume.pdf');
            loadingTask.promise.then(pdf => {
                currentPdfDoc = pdf;
                pdf.getPage(1).then(page => {
                    baseScale = getFitScale(page);
                    userZoom = 1.0;
                    renderPdfPage(userZoom);
                });
            }).catch(err => {
                console.warn('PDF.js loading failed (possible file:// origin CORS), showing fallback:', err);
                showPdfFallback();
            });
        }

        if (pdfZoomIn) {
            pdfZoomIn.addEventListener('click', () => {
                if (userZoom < 2.0) {
                    userZoom = Math.min(userZoom + 0.2, 2.0);
                    renderPdfPage(userZoom);
                }
            });
        }

        if (pdfZoomOut) {
            pdfZoomOut.addEventListener('click', () => {
                if (userZoom > 0.6) {
                    userZoom = Math.max(userZoom - 0.2, 0.6);
                    renderPdfPage(userZoom);
                }
            });
        }

        if (pdfFitWidth) {
            pdfFitWidth.addEventListener('click', () => {
                if (!currentPdfDoc) return;
                currentPdfDoc.getPage(1).then(page => {
                    baseScale = getFitScale(page);
                    userZoom = 1.0;
                    renderPdfPage(userZoom);
                });
            });
        }

        let resizeDebounce;
        window.addEventListener('resize', () => {
            clearTimeout(resizeDebounce);
            resizeDebounce = setTimeout(() => {
                if (currentPdfDoc) {
                    currentPdfDoc.getPage(1).then(page => {
                        baseScale = getFitScale(page);
                        renderPdfPage(userZoom);
                    });
                }
            }, 180);
        });

        loadPdf();
    }

    // ===================================================
    // 13. BLOG & TECH INSIGHTS PAGE CONTROLS
    // ===================================================
    const blogSearchInput = document.getElementById('blog-search-input');
    const blogSearchClear = document.getElementById('blog-search-clear');
    const blogFilterTabs = document.querySelectorAll('.blog-filter-tab');
    const blogCards = document.querySelectorAll('.blog-card');
    const featuredBlogCard = document.querySelector('.featured-blog-card');

    let currentBlogFilter = 'all';
    let currentBlogSearch = '';

    function filterBlogPosts() {
        const query = currentBlogSearch.toLowerCase().trim();

        blogCards.forEach(card => {
            const category = card.getAttribute('data-category') || '';
            const title = (card.querySelector('.blog-card-title')?.textContent || '').toLowerCase();
            const excerpt = (card.querySelector('.blog-card-excerpt')?.textContent || '').toLowerCase();
            const tags = (card.getAttribute('data-tags') || '').toLowerCase();

            const matchesCategory = currentBlogFilter === 'all' || category === currentBlogFilter;
            const matchesQuery = !query || title.includes(query) || excerpt.includes(query) || tags.includes(query);

            if (matchesCategory && matchesQuery) {
                card.style.display = 'flex';
                card.style.animation = 'pageQuickReveal 0.3s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });

        if (featuredBlogCard) {
            const fCategory = featuredBlogCard.getAttribute('data-category') || '';
            const fTitle = (featuredBlogCard.querySelector('.featured-blog-title')?.textContent || '').toLowerCase();
            const fExcerpt = (featuredBlogCard.querySelector('.featured-blog-excerpt')?.textContent || '').toLowerCase();

            const fMatchesCategory = currentBlogFilter === 'all' || fCategory === currentBlogFilter;
            const fMatchesQuery = !query || fTitle.includes(query) || fExcerpt.includes(query);

            featuredBlogCard.style.display = (fMatchesCategory && fMatchesQuery) ? 'block' : 'none';
        }
    }

    if (blogSearchInput) {
        blogSearchInput.addEventListener('input', (e) => {
            currentBlogSearch = e.target.value;
            if (blogSearchClear) {
                blogSearchClear.style.display = currentBlogSearch.length > 0 ? 'block' : 'none';
            }
            filterBlogPosts();
        });

        if (blogSearchClear) {
            blogSearchClear.addEventListener('click', () => {
                blogSearchInput.value = '';
                currentBlogSearch = '';
                blogSearchClear.style.display = 'none';
                blogSearchInput.focus();
                filterBlogPosts();
            });
        }
    }

    if (blogFilterTabs.length > 0) {
        blogFilterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                blogFilterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentBlogFilter = tab.getAttribute('data-category');
                filterBlogPosts();
            });
        });
    }

    // Blog Articles Dataset for Reader Modal
    const blogArticles = {
        'sys-design': {
            title: 'Demystifying System Design: How Modern Web Applications Scale',
            category: 'Engineering Architecture',
            date: 'October 2026',
            readTime: '6 min read',
            content: `
                <p>When you start learning web development, your mental model is straightforward: a client (browser) sends an HTTP request to a server, the server queries a database, builds an HTML or JSON response, and sends it back. This works impeccably for hundreds or thousands of daily users.</p>
                <p>However, when traffic escalates into millions of concurrent requests per second, this single-box paradigm collapses completely under CPU exhaustion, thread starvation, and database lock contention.</p>
                
                <h4>1. The First Bottleneck: De-Coupling and Load Balancing</h4>
                <p>To eliminate single points of failure, the first step is introducing a Layer 7 Reverse Proxy / Load Balancer (such as NGINX or HAProxy). Instead of users connecting directly to an application server, the load balancer distributes incoming connections using intelligent algorithms like round-robin, least connections, or IP hashing.</p>
                <pre><code>// Conceptual Load Balancing Routing
Incoming Request -> [NGINX / Cloudflare CDN]
                        ├──> App Server 01 (Worker Pool)
                        ├──> App Server 02 (Worker Pool)
                        └──> App Server 03 (Worker Pool)</code></pre>

                <h4>2. The Power of In-Memory Caching (Redis)</h4>
                <p>Reading from disk or calculating complex SQL JOINs on every page load is disastrous for latency. Implementing an in-memory key-value cache like <code>Redis</code> or <code>Memcached</code> lets you serve repetitive read queries in sub-millisecond timeframes.</p>
                
                <div class="site-modal-callout">
                    <strong>Rule of Thumb:</strong> Cache aggressive read targets (user sessions, static catalog items, feed listings) and implement <em>Cache-Aside</em> or <em>Write-Through</em> invalidation patterns to prevent stale data.
                </div>

                <h4>3. Database Partitioning &amp; Read Replicas</h4>
                <p>Relational databases naturally struggle when writes and reads compete on the same primary instance. By separating reads across multiple read replicas while directing mutations (INSERT, UPDATE) strictly to the Primary master, database throughput surges exponentially.</p>

                <h4>Key Takeaways</h4>
                <ul>
                    <li>Scale horizontally (adding inexpensive nodes) rather than endlessly scaling vertically.</li>
                    <li>Always cache at the edge with CDNs for static assets and in-memory caches for volatile hot paths.</li>
                    <li>Design systems with graceful degradation: when a subsystem fails, the rest of the application should remain functional.</li>
                </ul>
            `
        },
        'vanilla-js': {
            title: 'Why Pure JavaScript and Vanilla CSS Are Still Superpowers in 2026',
            category: 'Web Development',
            date: 'September 2026',
            readTime: '5 min read',
            content: `
                <p>In modern web engineering, frameworks like React, Next.js, and Vue dominate the discourse. Yet, relying exclusively on multi-megabyte npm dependencies without mastering fundamental web primitives often leads to bloated bundle sizes, slow First Contentful Paint (FCP), and fragile codebases.</p>
                
                <h4>The Evolution of Native CSS</h4>
                <p>Years ago, developers needed preprocessors like Sass and heavy utility libraries just to handle basic nesting, variables, and responsive grids. Today, native CSS provides:</p>
                <ul>
                    <li><strong>CSS Custom Properties (Variables):</strong> Reactive, runtime-switchable styling without re-compilation.</li>
                    <li><strong>CSS Grid &amp; Flexbox:</strong> True two-dimensional layout power built right into the browser rendering engine.</li>
                    <li><strong><code>:has()</code> selector &amp; Container Queries:</strong> Component-driven styling without JavaScript element-resize listeners.</li>
                </ul>

                <h4>Modern JavaScript: Faster than Ever</h4>
                <p>The modern browser DOM API is extraordinarily fast. With ES6+ classes, native modules, <code>IntersectionObserver</code> for lazy loading and animations, and native <code>fetch()</code>, you can build interactive, glassmorphic interfaces that run at locked 60 FPS with zero external dependencies.</p>
                <pre><code>// Zero-overhead scroll reveal using native browser APIs
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });</code></pre>

                <div class="site-modal-callout">
                    <strong>The Real Advantage:</strong> When you understand how the browser renders pixels (DOM -> CSSOM -> Render Tree -> Layout -> Paint -> Composite), you write significantly more performant code, regardless of whether you choose a framework later.
                </div>
            `
        },
        'cpp-memory': {
            title: 'From C++ Pointers to Memory Safety: Navigating Low-Level & High-Level Languages',
            category: 'CS Fundamentals',
            date: 'September 2026',
            readTime: '7 min read',
            content: `
                <p>Many undergraduate computer science students are introduced to programming via Python or JavaScript. While these languages allow you to build working scripts rapidly, they abstract away the single most crucial resource in computing: physical memory.</p>

                <h4>The Mental Model: Stack vs Heap</h4>
                <p>Learning C and C++ forces you to confront the reality of the machine:</p>
                <ul>
                    <li><strong>The Stack:</strong> Extremely fast, CPU-managed contiguous memory for local variables and function call frames. Automatically unwinds when scope terminates.</li>
                    <li><strong>The Heap:</strong> Dynamically allocated memory requested from the OS via <code>malloc</code> or <code>new</code>. Flexible in size, but requires explicit lifecycle management.</li>
                </ul>

                <h4>Pointers and Addressing</h4>
                <p>A pointer is simply a variable that stores another variable's memory address. Understanding indirection demystifies how arrays, linked lists, and tree structures actually exist on silicon.</p>
                <pre><code>// Simple pointer manipulation in C++
int val = 42;
int* ptr = &val;  // ptr holds the memory address of val
*ptr = 99;        // dereference and mutate value directly in memory</code></pre>

                <div class="site-modal-callout">
                    <strong>Why It Matters:</strong> Once you understand cache locality, memory alignment, and pointers in C++, you gain a superpower: you instantly understand why certain Python or JavaScript operations cause performance cliffs, memory leaks, or garbage collection pauses.
                </div>
            `
        },
        'dsa-intuition': {
            title: 'Building Intuition for Data Structures & Algorithmic Problem Solving',
            category: 'CS Fundamentals',
            date: 'August 2026',
            readTime: '6 min read',
            content: `
                <p>The standard way people prepare for technical problem solving is brute-force memorization: solving hundreds of problems until patterns feel familiar. However, true problem solving comes from developing a systematic taxonomy of algorithmic patterns.</p>

                <h4>1. Recognizing the Pattern in the Problem Description</h4>
                <ul>
                    <li><strong>Sorted Array / Finding Pairs:</strong> Think <em>Two Pointers</em> or <em>Binary Search</em> ($O(\\log n)$ or $O(n)$).</li>
                    <li><strong>Contiguous Subarrays with Constraints:</strong> Think <em>Sliding Window</em>.</li>
                    <li><strong>Shortest Path in Unweighted Graph:</strong> Think <em>Breadth-First Search (BFS)</em> using a Queue.</li>
                    <li><strong>Exhaustive Exploration / Combinations:</strong> Think <em>Depth-First Search (DFS) / Backtracking</em>.</li>
                    <li><strong>Overlapping Subproblems with Optimal Substructure:</strong> Think <em>Dynamic Programming</em>.</li>
                </ul>

                <h4>2. The Trade-Off Mindset</h4>
                <p>Engineering is the discipline of trade-offs. Can you sacrifice $O(n)$ additional memory (hash maps or sets) to reduce runtime from $O(n^2)$ down to $O(n)$? Almost always yes. Understanding this balance is what interviewers and engineering teams truly look for.</p>
            `
        },
        'git-workflow': {
            title: 'The Developer Workflow: Git Internals, Clean Commits, and Collaborative CI/CD',
            category: 'Developer Journey',
            date: 'August 2026',
            readTime: '4 min read',
            content: `
                <p>To many junior developers, Git is perceived as a magic black box where you execute <code>git add .</code>, <code>git commit -m "fixed stuff"</code>, and <code>git push origin main</code>. But under the hood, Git is a beautifully elegant content-addressable key-value filesystem.</p>

                <h4>The Four Object Types</h4>
                <p>Every commit you create in Git is composed of four immutable primitives inside <code>.git/objects</code>:</p>
                <ul>
                    <li><strong>Blob:</strong> Raw file data compressed and hashed via SHA-1 / SHA-256.</li>
                    <li><strong>Tree:</strong> Directory structure referencing blobs and sub-trees with filenames and file modes.</li>
                    <li><strong>Commit:</strong> Metadata containing author, committer, timestamp, commit message, and a reference to the top-level tree and parent commit(s).</li>
                    <li><strong>Annotated Tag:</strong> A permanent reference pointing to a specific commit.</li>
                </ul>

                <h4>Writing Professional Commits</h4>
                <p>Adopting Conventional Commits (<code>feat:</code>, <code>fix:</code>, <code>refactor:</code>, <code>docs:</code>) makes repository logs instantly scannable and enables automated semantic versioning and changelog generation in production CI/CD pipelines.</p>
            `
        }
    };

    const blogReaderModal = document.getElementById('blog-reader-modal');
    const blogReaderClose = document.getElementById('blog-reader-close');
    const blogReaderTitle = document.getElementById('blog-reader-title');
    const blogReaderCategory = document.getElementById('blog-reader-category');
    const blogReaderDate = document.getElementById('blog-reader-date');
    const blogReaderTime = document.getElementById('blog-reader-time');
    const blogReaderBody = document.getElementById('blog-reader-body');
    const readArticleButtons = document.querySelectorAll('.btn-read-article, .blog-read-btn, .featured-blog-card .cert-btn-primary');

    if (blogReaderModal) {
        readArticleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const articleId = btn.getAttribute('data-article-id') || 'sys-design';
                const article = blogArticles[articleId] || blogArticles['sys-design'];

                if (blogReaderTitle) blogReaderTitle.textContent = article.title;
                if (blogReaderCategory) blogReaderCategory.textContent = article.category;
                if (blogReaderDate) blogReaderDate.textContent = article.date;
                if (blogReaderTime) blogReaderTime.textContent = article.readTime;
                if (blogReaderBody) blogReaderBody.innerHTML = article.content;

                blogReaderModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeBlogModal = () => {
            blogReaderModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (blogReaderClose) blogReaderClose.addEventListener('click', closeBlogModal);
        blogReaderModal.addEventListener('click', (e) => {
            if (e.target === blogReaderModal) closeBlogModal();
        });
    }

    // Global ESC Key Listener for all modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (certModal && certModal.classList.contains('active')) {
                certModal.classList.remove('active');
                document.body.style.overflow = '';
            }
            if (blogReaderModal && blogReaderModal.classList.contains('active')) {
                blogReaderModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
});