/* ============================================
   Admin Panel - Complete Content Management
   ============================================ */

(function() {
  'use strict';

  // Simple password protection
  const ADMIN_PASSWORD = 'soapbox2025'; // Change this to your own password
  
  function checkAuth() {
    const stored = sessionStorage.getItem('admin_authenticated');
    if (stored === 'true') {
      return true;
    }
    
    const password = prompt('Enter admin password:');
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true');
      return true;
    } else {
      alert('Incorrect password. Access denied.');
      window.location.href = 'index.html';
      return false;
    }
  }

  // Check authentication on load
  if (!checkAuth()) {
    document.body.innerHTML = '<div style="padding: 2rem; text-align: center;"><h1>Access Denied</h1><p>Please refresh and enter the correct password.</p></div>';
  }

  // State
  let dispatches = [];
  let siteContent = {};
  let githubConfig = { enabled: false };
  let currentEditingIndex = null;

  // Load all data
  async function loadAllData() {
    try {
      // Load dispatches
      const dispatchesResponse = await fetch('data/dispatches.json');
      dispatches = await dispatchesResponse.json();

      // Load site content
      const siteResponse = await fetch('data/site-content.json');
      siteContent = await siteResponse.json();

      // Load GitHub config (from localStorage)
      const savedConfig = localStorage.getItem('githubConfig');
      if (savedConfig) {
        githubConfig = JSON.parse(savedConfig);
      } else {
        try {
          const configResponse = await fetch('data/github-config.json');
          githubConfig = await configResponse.json();
        } catch (e) {
          // File doesn't exist, use defaults
        }
      }

      // Show GitHub setup notice if not configured
      if (!githubConfig.enabled) {
        document.getElementById('githubSetup').style.display = 'block';
      }

      // Populate all forms
      populateAllForms();
      renderDispatchList();
    } catch (error) {
      showStatus('Error loading data: ' + error.message, 'error');
    }
  }

  // Tab navigation
  function initTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    const panels = document.querySelectorAll('.admin-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;

        // Update tabs
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update panels
        panels.forEach(p => p.classList.remove('active'));
        document.getElementById(`panel-${targetTab}`).classList.add('active');
      });
    });
  }

  // Status messages
  function showStatus(message, type = 'info') {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
    setTimeout(() => {
      statusEl.className = 'status-message';
    }, 5000);
  }

  // Array item management helpers
  function createArrayItem(value, index, containerId, onRemove) {
    const div = document.createElement('div');
    div.className = 'array-item';
    div.innerHTML = `
      <textarea class="array-item-input" style="width: 100%; min-height: 80px; padding: var(--spacing-sm); border: 1px solid var(--border); border-radius: 4px; font-family: var(--font-body);">${value || ''}</textarea>
      <button type="button" class="array-item-remove" onclick="removeArrayItem(this)">×</button>
    `;
    const container = document.getElementById(containerId);
    container.appendChild(div);
    
    if (onRemove) {
      div.querySelector('.array-item-remove').addEventListener('click', () => {
        onRemove(index);
        div.remove();
      });
    }
  }

  window.removeArrayItem = function(btn) {
    btn.closest('.array-item').remove();
  };

  window.addBookDescriptionItem = function() {
    createArrayItem('', null, 'bookDescriptionItems');
  };

  window.addExcerptItem = function() {
    createArrayItem('', null, 'excerptItems');
  };

  window.addAuthorBioItem = function() {
    createArrayItem('', null, 'authorBioItems');
  };

  window.addHouseRuleItem = function() {
    createArrayItem('', null, 'houseRulesItems');
  };

  window.addBeforeYouReadItem = function() {
    createArrayItem('', null, 'beforeYouReadItems');
  };

  window.addWhatThisIsItem = function() {
    createArrayItem('', null, 'whatThisIsItems');
  };

  // Populate forms with existing data
  function populateAllForms() {
    // Site settings
    if (siteContent.site) {
      document.getElementById('siteTitle').value = siteContent.site.title || '';
      document.getElementById('siteSubtitle').value = siteContent.site.subtitle || '';
      document.getElementById('siteAuthor').value = siteContent.site.author || '';
      document.getElementById('siteEmail').value = siteContent.site.email || '';
      document.getElementById('siteDomain').value = siteContent.site.domain || '';
    }

    // Book info
    if (siteContent.book) {
      document.getElementById('bookTitle').value = siteContent.book.title || '';
      document.getElementById('bookSubtitle').value = siteContent.book.subtitle || '';
      document.getElementById('excerptTitle').value = siteContent.book.excerpt?.title || 'Read the Introduction';
      document.getElementById('amazonLink').value = siteContent.book.purchaseLinks?.amazon || '';
      document.getElementById('takealotLink').value = siteContent.book.purchaseLinks?.takealot || '';
      document.getElementById('kindleLink').value = siteContent.book.purchaseLinks?.kindle || '';

      // Populate arrays
      if (siteContent.book.description) {
        siteContent.book.description.forEach(p => {
          createArrayItem(p, null, 'bookDescriptionItems');
        });
      }
      if (siteContent.book.excerpt?.content) {
        siteContent.book.excerpt.content.forEach(p => {
          createArrayItem(p, null, 'excerptItems');
        });
      }
    }

    // About page
    if (siteContent.about) {
      if (siteContent.about.authorBio) {
        siteContent.about.authorBio.forEach(p => {
          createArrayItem(p, null, 'authorBioItems');
        });
      }
      if (siteContent.about.houseRules) {
        siteContent.about.houseRules.forEach(r => {
          createArrayItem(r, null, 'houseRulesItems');
        });
      }
      if (siteContent.about.beforeYouRead) {
        siteContent.about.beforeYouRead.forEach(p => {
          createArrayItem(p, null, 'beforeYouReadItems');
        });
      }
    }

    // Home page
    if (siteContent.homePage?.whatThisIs) {
      siteContent.homePage.whatThisIs.forEach(p => {
        createArrayItem(p, null, 'whatThisIsItems');
      });
    }

    // GitHub config
    document.getElementById('githubEnabled').checked = githubConfig.enabled || false;
    document.getElementById('githubRepo').value = githubConfig.repository || '';
    document.getElementById('githubBranch').value = githubConfig.branch || 'main';
    document.getElementById('githubToken').value = githubConfig.token || '';
  }

  // Render dispatch list
  function renderDispatchList() {
    const container = document.getElementById('dispatchList');
    if (dispatches.length === 0) {
      container.innerHTML = '<p>No dispatches yet. Add one above!</p>';
      return;
    }

    container.innerHTML = dispatches.map((dispatch, index) => `
      <div class="item-card">
        <div class="item-card-info">
          <h4>${dispatch.title} ${dispatch.featured ? '<span style="color: var(--plum);">★ Featured</span>' : ''}</h4>
          <div class="item-card-meta">
            ${dispatch.chapter || ''} • ${dispatch.readTime || ''} • ${dispatch.tags?.join(', ') || ''}
          </div>
        </div>
        <div class="item-card-actions">
          <button class="btn btn--ghost" onclick="editDispatch(${index})">Edit</button>
          <button class="btn btn--ghost" onclick="deleteDispatch(${index})">Delete</button>
        </div>
      </div>
    `).join('');
  }

  // Edit dispatch
  window.editDispatch = function(index) {
    const dispatch = dispatches[index];
    document.getElementById('slug').value = dispatch.slug || '';
    document.getElementById('title').value = dispatch.title || '';
    document.getElementById('quote').value = dispatch.quote || '';
    document.getElementById('chapter').value = dispatch.chapter || '';
    document.getElementById('excerpt').value = dispatch.excerpt || '';
    document.getElementById('reflection').value = dispatch.reflection || '';
    document.getElementById('fullText').value = dispatch.fullText || '';
    document.getElementById('readTime').value = dispatch.readTime || '5 min';
    document.getElementById('date').value = dispatch.date || '';
    document.getElementById('featured').checked = dispatch.featured || false;
    
    if (dispatch.tags && dispatch.tags.length > 0) {
      document.getElementById('tag1').value = dispatch.tags[0] || '';
      document.getElementById('tag2').value = dispatch.tags[1] || '';
      document.getElementById('tag3').value = dispatch.tags[2] || '';
    }

    currentEditingIndex = index;
    dispatches.splice(index, 1);
    renderDispatchList();
    
    // Switch to dispatches tab
    document.querySelector('[data-tab="dispatches"]').click();
    document.getElementById('dispatchForm').scrollIntoView({ behavior: 'smooth' });
  };

  // Delete dispatch
  window.deleteDispatch = function(index) {
    if (confirm('Are you sure you want to delete this dispatch?')) {
      dispatches.splice(index, 1);
      renderDispatchList();
      saveData();
    }
  };

  // Get array values from container
  function getArrayValues(containerId) {
    const container = document.getElementById(containerId);
    const items = container.querySelectorAll('.array-item-input');
    return Array.from(items).map(item => item.value.trim()).filter(v => v);
  }

  // Save data (with GitHub or download)
  async function saveData() {
    if (githubConfig.enabled && githubConfig.repository && githubConfig.token) {
      await saveViaGitHub();
    } else {
      downloadFiles();
    }
  }

  // Save via GitHub API
  async function saveViaGitHub() {
    try {
      showStatus('Saving to GitHub...', 'info');

      const [owner, repo] = githubConfig.repository.split('/');
      const branch = githubConfig.branch || 'main';

      // Save dispatches.json
      await updateGitHubFile('data/dispatches.json', JSON.stringify(dispatches, null, 2), owner, repo, branch);

      // Save site-content.json
      await updateGitHubFile('data/site-content.json', JSON.stringify(siteContent, null, 2), owner, repo, branch);

      showStatus('✓ Saved successfully! Site will update automatically.', 'success');
    } catch (error) {
      showStatus('Error saving to GitHub: ' + error.message, 'error');
      console.error('GitHub save error:', error);
    }
  }

  // Update file via GitHub API
  async function updateGitHubFile(path, content, owner, repo, branch) {
    // Get current file SHA (required for update)
    const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const getResponse = await fetch(getUrl, {
      headers: {
        'Authorization': `token ${githubConfig.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    let sha = null;
    if (getResponse.ok) {
      const fileData = await getResponse.json();
      sha = fileData.sha;
    }

    // Update file
    const updateUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubConfig.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Update ${path} via admin panel`,
        content: btoa(unescape(encodeURIComponent(content))), // Base64 encode
        branch: branch,
        sha: sha // Include SHA if updating existing file
      })
    });

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      throw new Error(error.message || 'Failed to update file');
    }

    return await updateResponse.json();
  }

  // Download files (fallback)
  function downloadFiles() {
    // Download dispatches.json
    downloadJSON('dispatches.json', dispatches);
    
    // Download site-content.json
    downloadJSON('site-content.json', siteContent);

    showStatus('✓ Files downloaded! Upload them to your server to update the site.', 'success');
  }

  function downloadJSON(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Form handlers
  document.getElementById('dispatchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const tags = [
      document.getElementById('tag1').value.trim(),
      document.getElementById('tag2').value.trim(),
      document.getElementById('tag3').value.trim()
    ].filter(tag => tag);

    const dispatch = {
      slug: document.getElementById('slug').value.trim(),
      title: document.getElementById('title').value.trim(),
      quote: document.getElementById('quote').value.trim() || undefined,
      chapter: document.getElementById('chapter').value.trim() || undefined,
      excerpt: document.getElementById('excerpt').value.trim(),
      reflection: document.getElementById('reflection').value.trim() || undefined,
      fullText: document.getElementById('fullText').value.trim() || undefined,
      readTime: document.getElementById('readTime').value.trim(),
      tags: tags,
      date: document.getElementById('date').value,
      featured: document.getElementById('featured').checked
    };

    dispatches.push(dispatch);
    dispatches.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    renderDispatchList();
    document.getElementById('dispatchForm').reset();
    currentEditingIndex = null;
    saveData();
  });

  document.getElementById('bookForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    siteContent.book = {
      title: document.getElementById('bookTitle').value.trim(),
      subtitle: document.getElementById('bookSubtitle').value.trim(),
      description: getArrayValues('bookDescriptionItems'),
      excerpt: {
        title: document.getElementById('excerptTitle').value.trim(),
        content: getArrayValues('excerptItems')
      },
      purchaseLinks: {
        amazon: document.getElementById('amazonLink').value.trim() || '#',
        takealot: document.getElementById('takealotLink').value.trim() || '#',
        kindle: document.getElementById('kindleLink').value.trim() || '#'
      }
    };

    saveData();
  });

  document.getElementById('aboutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    siteContent.about = {
      authorBio: getArrayValues('authorBioItems'),
      houseRules: getArrayValues('houseRulesItems'),
      beforeYouRead: getArrayValues('beforeYouReadItems')
    };

    saveData();
  });

  document.getElementById('homeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    siteContent.homePage = {
      whatThisIs: getArrayValues('whatThisIsItems')
    };

    saveData();
  });

  document.getElementById('siteForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    siteContent.site = {
      title: document.getElementById('siteTitle').value.trim(),
      subtitle: document.getElementById('siteSubtitle').value.trim(),
      author: document.getElementById('siteAuthor').value.trim(),
      email: document.getElementById('siteEmail').value.trim(),
      domain: document.getElementById('siteDomain').value.trim()
    };

    saveData();
  });

  document.getElementById('githubForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    githubConfig = {
      enabled: document.getElementById('githubEnabled').checked,
      repository: document.getElementById('githubRepo').value.trim(),
      branch: document.getElementById('githubBranch').value.trim() || 'main',
      token: document.getElementById('githubToken').value.trim()
    };

    localStorage.setItem('githubConfig', JSON.stringify(githubConfig));
    
    if (githubConfig.enabled) {
      showStatus('✓ GitHub auto-save enabled! Changes will save automatically.', 'success');
      document.getElementById('githubSetup').style.display = 'none';
    } else {
      showStatus('GitHub auto-save disabled. Files will download instead.', 'info');
    }
  });

  document.getElementById('clearDispatchForm').addEventListener('click', () => {
    document.getElementById('dispatchForm').reset();
    currentEditingIndex = null;
  });

  // Initialize
  initTabs();
  loadAllData();
})();

