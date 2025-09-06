document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selection ---
    const blogPostForm = document.getElementById('blogPostForm');
    const myPostsList = document.getElementById('my-posts-list');
    const logoutBtn = document.getElementById('logoutBtn');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const toastContainer = document.getElementById('toast-container');
    const imageInput = document.getElementById('image'); // Get file input
    const fileNameSpan = document.getElementById('fileName'); // Get filename span
    // --- Fetch and Render Blogs from Server ---
    
    function getStatus(isDraft) {
        // If isDraft is true, show as 'Draft', else 'Published'
        return isDraft === true ? 'Draft' : 'Published';
    }
    function fetchAndRenderBlogs() {
        fetch('/get-blogs')
            .then(response => response.json())
            .then(blogs => {
                // Replace local storedPosts with server blogs
                storedPosts = blogs.map(blog => ({
                    id: blog.id, // <-- Add this line
                    title: blog.title,
                    image: blog.image,
                    category: blog.category,
                    summary: blog.summary,
                    content: blog.content,
                    isDraft: blog.draft // server uses 'draft' field
                }));
                renderMyPosts();
            })
            .catch(() => {
                showToast('Failed to fetch blogs from server.', 'error');
            });
    }

    // Call fetchAndRenderBlogs on page load
    fetchAndRenderBlogs();
    // --- Data Management (Local Storage) ---
    let storedPosts = JSON.parse(localStorage.getItem('blogPosts_doctor')) || [];

    // --- UI Rendering (This function remains unchanged) ---
    function renderMyPosts() {
        // ... (No changes needed in this function)
        myPostsList.innerHTML = '';
        if (storedPosts.length === 0) {
            myPostsList.innerHTML = '<p style="text-align: center; color: var(--subtle-text-color);">You have not created any posts yet.</p>';
            return;
        }

        storedPosts.forEach((post, index) => {
            const status = getStatus(post.isDraft);
            const statusClass = status === 'Draft' ? 'status-draft' : 'status-published';

            const postItem = document.createElement('div');
            postItem.className = 'post-item';

            let actionsHtml = `
                <button class="action-btn edit-btn" data-index="${index}">
                    <!-- Edit SVG -->
                    Edit
                </button>
                <button class="action-btn delete-btn" data-index="${index}">
                    <!-- Delete SVG -->
                    Delete
                </button>
            `;

            // Add "Complete Blog" button if draft
            if (post.isDraft) {
                actionsHtml += `
                    <button class="action-btn complete-btn" data-id="${post.id}">
                        Complete Blog
                    </button>
                `;
            }

            postItem.innerHTML = `
                <div class="post-item-content">
                    <div class="post-header">
                        <h3>${post.title}</h3>
                        <span class="post-status ${statusClass}">${status}</span>
                    </div>
                    <p>${post.summary}</p>
                    <div class="post-meta">
                        <span class="post-category">${post.category}</span>
                    </div>
                </div>
                <div class="post-actions">
                    ${actionsHtml}
                </div>
            `;
            myPostsList.appendChild(postItem);
        });
    }

    // --- Toast Notification (This function remains unchanged) ---
    function showToast(message, type = 'success') {
        // ... (No changes needed in this function)
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000);
    }

    // --- MODIFIED EVENT HANDLER ---
    function handleFormSubmit(e) {
        e.preventDefault();

        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

        const file = imageInput.files[0];
        const existingImageUrl = document.getElementById('existingImageUrl').value;

        const newPost = {
            title: document.getElementById('title').value.trim(),
            category: document.getElementById('category').value,
            summary: document.getElementById('summary').value.trim(),
            content: document.getElementById('content').value.trim(),
            isDraft: document.getElementById('isDraft').checked,
        };

        const formData = new FormData();
        formData.append('title', newPost.title);
        formData.append('category', newPost.category);
        formData.append('summary', newPost.summary);
        formData.append('content', newPost.content);
        formData.append('isDraft', newPost.isDraft);

        if (file) {
            formData.append('image', file);
        } else if (existingImageUrl) {
            formData.append('image_url', existingImageUrl); // Use the existing image URL
        } else {
            showToast('Please select an image file.', 'error');
            return;
        }

        fetch('/submit-blog', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken') // Include CSRF token if needed
            }
        })
        .then(response => response.json())
        .then(data => {
            // Optionally handle server response
            showToast('Post submitted to server!');
        })
        .catch(error => {
            showToast('Failed to submit post to server.', 'error');
        });

        blogPostForm.reset();
        fileNameSpan.textContent = 'No file selected'; // Reset filename display
        renderMyPosts();
        showToast('Post saved successfully!');
    }

    // --- (handlePostActions, handleLogout, and toggleMobileMenu functions remain unchanged) ---
    function handlePostActions(e) {
        if (e.target.classList.contains('complete-btn')) {
            const postId = e.target.getAttribute('data-id');
            fetch(`/get-blog/${postId}`)
                .then(response => response.json())
                .then(blog => {
                    // Fill the form with previous data
                    document.getElementById('title').value = blog.title;
                    document.getElementById('category').value = blog.category;
                    document.getElementById('summary').value = blog.summary;
                    document.getElementById('content').value = blog.content;
                    document.getElementById('isDraft').checked = false; // Uncheck draft to complete

                    // Show image name or URL
                    if (blog.image) {
                        fileNameSpan.textContent = blog.image.split('/').pop();
                        fileNameSpan.innerHTML += `<br><img src="${blog.image}" alt="Preview" style="max-width:100px;max-height:100px;">`;
                        document.getElementById('existingImageUrl').value = blog.image; // <-- Set hidden input
                    } else {
                        fileNameSpan.textContent = 'No file selected';
                        document.getElementById('existingImageUrl').value = '';
                    }

                    showToast('Loaded draft for completion!');
                })
                .catch(() => {
                    showToast('Failed to load draft blog.', 'error');
                });
        }
        // ...existing edit/delete logic...
    }
    function handleLogout(e) { /* ... no changes ... */ }
    function toggleMobileMenu() { /* ... no changes ... */ }
    

    // --- Event Listeners ---
    blogPostForm.addEventListener('submit', handleFormSubmit);
    myPostsList.addEventListener('click', handlePostActions);
    logoutBtn.addEventListener('click', handleLogout);
    hamburger.addEventListener('click', toggleMobileMenu);

    // --- NEW Event Listener to display the chosen filename ---
    imageInput.addEventListener('change', () => {
        if (imageInput.files.length > 0) {
            fileNameSpan.textContent = imageInput.files[0].name;
        } else {
            fileNameSpan.textContent = 'No file selected';
        }
    });

    // --- Initial Render ---
    renderMyPosts();
});