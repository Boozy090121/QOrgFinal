/**
 * personnel-list.js
 * Responsive personnel list component with search/filter functionality
 */

class PersonnelListComponent {
  /**
   * Constructor
   * @param {string} containerId - ID of the container element
   * @param {PersonnelManager} personnelManager - Instance of PersonnelManager
   */
  constructor(containerId, personnelManager) {
    this.containerId = containerId;
    this.personnelManager = personnelManager;
    this.container = document.getElementById(containerId);
    this.searchTerm = '';
    this.showingAddModal = false;
    this.showingEditModal = false;
    this.currentEditId = null;
    
    // Bind methods to this instance
    this.render = this.render.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleAddSubmit = this.handleAddSubmit.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.setupDragAndDrop = this.setupDragAndDrop.bind(this);
    
    // Set up data change listener
    this.personnelManager.setOnDataChange(this.render);
    
    // Initial render
    this.render();
  }
  
  /**
   * Render the personnel list
   */
  render() {
    if (!this.container) return;
    
    // Clear container
    this.container.innerHTML = '';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'personnel-header';
    header.innerHTML = `
      <h2>Personnel List</h2>
      <button class="btn btn-accent" id="${this.containerId}-add-btn">Add New</button>
    `;
    this.container.appendChild(header);
    
    // Create stats
    const statsDiv = document.createElement('div');
    statsDiv.className = 'personnel-stats';
    statsDiv.innerHTML = `
      <span>Total: <span id="${this.containerId}-total">${this.personnelManager.countTotalPersonnel()}</span></span>
      <span>Assigned: <span id="${this.containerId}-assigned">${this.personnelManager.countAssignedPersonnel()}</span></span>
      <span>Available: <span id="${this.containerId}-available">${this.personnelManager.countAvailablePersonnel()}</span></span>
    `;
    this.container.appendChild(statsDiv);
    
    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'personnel-filter';
    searchInput.id = `${this.containerId}-search`;
    searchInput.placeholder = 'Search personnel...';
    searchInput.value = this.searchTerm;
    this.container.appendChild(searchInput);
    
    // Create personnel list container
    const listContainer = document.createElement('div');
    listContainer.className = 'personnel-list';
    listContainer.id = `${this.containerId}-list`;
    
    // Get filtered personnel
    const filteredPersonnel = this.personnelManager.filterPersonnel(this.searchTerm);
    
    // Group personnel by assignment status
    const availablePersonnel = filteredPersonnel.filter(p => !this.personnelManager.isPersonnelAssigned(p.id));
    const assignedPersonnel = filteredPersonnel.filter(p => this.personnelManager.isPersonnelAssigned(p.id));
    
    // Add available personnel
    if (availablePersonnel.length > 0) {
      const availableHeader = document.createElement('div');
      availableHeader.className = 'personnel-category';
      availableHeader.textContent = 'Available Personnel';
      listContainer.appendChild(availableHeader);
      
      availablePersonnel.forEach(person => {
        const item = this.createPersonnelItem(person, false);
        listContainer.appendChild(item);
      });
    }
    
    // Add assigned personnel
    if (assignedPersonnel.length > 0) {
      const assignedHeader = document.createElement('div');
      assignedHeader.className = 'personnel-category';
      assignedHeader.textContent = 'Assigned Personnel';
      listContainer.appendChild(assignedHeader);
      
      assignedPersonnel.forEach(person => {
        const item = this.createPersonnelItem(person, true);
        listContainer.appendChild(item);
      });
    }
    
    // Add list to container
    this.container.appendChild(listContainer);
    
    // Create modals
    this.createModals();
    
    // Add event listeners
    this.addEventListeners();
    
    // Setup drag and drop
    this.setupDragAndDrop();
  }
  
  /**
   * Create a personnel item element
   * @param {Object} person - Personnel data
   * @param {boolean} isAssigned - Whether the person is assigned
   * @returns {HTMLElement} Personnel item element
   */
  createPersonnelItem(person, isAssigned) {
    const item = document.createElement('div');
    item.className = 'personnel-item';
    item.dataset.id = person.id;
    
    if (!isAssigned) {
      item.classList.add('drag-item');
      item.setAttribute('draggable', 'true');
    }
    
    item.innerHTML = `
      <div class="personnel-info">
        <div class="personnel-name">${person.name}</div>
        <div class="personnel-position">${person.position}</div>
      </div>
      <div class="personnel-actions">
        <button class="btn btn-small btn-outline edit-btn" data-id="${person.id}">Edit</button>
        <button class="btn btn-small btn-outline remove-btn" data-id="${person.id}">Remove</button>
      </div>
    `;
    
    if (isAssigned) {
      item.style.opacity = '0.7';
      item.title = 'Already assigned';
    }
    
    return item;
  }
  
  /**
   * Create modals for adding and editing personnel
   */
  createModals() {
    // Add modal
    const addModal = document.createElement('div');
    addModal.className = 'modal';
    addModal.id = `${this.containerId}-add-modal`;
    addModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Add New Personnel</h3>
          <button class="modal-close">&times;</button>
        </div>
        <form id="${this.containerId}-add-form">
          <div class="form-group">
            <label class="form-label" for="${this.containerId}-add-name">Name</label>
            <input type="text" class="form-input" id="${this.containerId}-add-name" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="${this.containerId}-add-position">Current Position</label>
            <input type="text" class="form-input" id="${this.containerId}-add-position">
          </div>
          <div class="form-group">
            <label class="form-label" for="${this.containerId}-add-department">Department</label>
            <input type="text" class="form-input" id="${this.containerId}-add-department" value="Quality">
          </div>
          <div class="form-group">
            <label class="form-label" for="${this.containerId}-add-skills">Skills</label>
            <input type="text" class="form-input" id="${this.containerId}-add-skills" placeholder="Separate skills with commas">
          </div>
          <div class="form-group">
            <label class="form-label" for="${this.containerId}-add-experience">Experience</label>
            <input type="text" class="form-input" id="${this.containerId}-add-experience" placeholder="e.g., 5 years">
          </div>
          <div class="form-group">
            <label class="form-label" for="${this.containerId}-add-education">Education</label>
            <input type="text" class="form-input" id="${this.containerId}-add-education" placeholder="e.g., BS in Engineering">
          </div>
          <div class="form-group">
            <label class="form-label" for="${this.containerId}-add-certifications">Certifications</label>
            <input type="text" class="form-input" id="${this.containerId}-add-certifications" placeholder="e.g., Six Sigma, ASQ CQE">
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-outline modal-close-btn">Cancel</button>
            <button type="submit" class="btn btn-accent">Add Personnel</button>
          </div>
        </form>
      </div>
    `;
    
    // Edit modal
    const editModal = document.createElement('div');
    editModal.className = 'modal';
    editModal.id = `${this.containerId}-edit-modal`;
    editModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Edit Personnel</h3>
          <button class="modal-close">&times;</button>
        </div>
        <form id="${this.containerId}-edit-form">
          <input type="hidden" id="${this.containerId}-edit-id">
          <div class="form-group">
            <label class="form-label" for="${this.containerId}-edit-name">Name</label>
            <input type="text" class="form-input" id="${this.containerId}-edit-name" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="${this.containerId}-edit-position">Current Position</label>
            <input type="text" class="form-input" id="${this.containerId}-edit-position">
          </div>
          <div class="form-group">
            <label class="form-label" for="${this.containerId}-edit-department">Department</label>
            <input type="text" class="form-input" id="${this.containerId}-edit-department">
          </div>
          <div class="form-group">
            <label class="form-label" for="${this.containerId}-edit-skills">Skills</label>
            <input type="text" class="form-input" id="${this.containerId}-edit-skills" placeholder="Separate skills with commas">
          </div>
          <div class="form-group">
            <label class="form-label" for="${this.containerId}-edit-experience">Experience</label>
            <input type="text" class="form-input" id="${this.containerId}-edit-experience" placeholder="e.g., 5 years">
          </div>
          <div class="form-group">
            <label class="form-label" for="${this.containerId}-edit-education">Education</label>
            <input type="text" class="form-input" id="${this.containerId}-edit-education" placeholder="e.g., BS in Engineering">
          </div>
          <div class="form-group">
            <label class="form-label" for="${this.containerId}-edit-certifications">Certifications</label>
            <input type="text" class="form-input" id="${this.containerId}-edit-certifications" placeholder="e.g., Six Sigma, ASQ CQE">
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-outline modal-close-btn">Cancel</button>
            <button type="submit" class="btn btn-accent">Save Changes</button>
          </div>
        </form>
      </div>
    `;
    
    // Add modals to document
    document.body.appendChild(addModal);
    document.body.appendChild(editModal);
  }
  
  /**
   * Add event listeners
   */
  addEventListeners() {
    // Search input
    const searchInput = document.getElementById(`${this.containerId}-search`);
    if (searchInput) {
      searchInput.addEventListener('input', this.handleSearch);
    }
    
    // Add button
    const addBtn = document.getElementById(`${this.containerId}-add-btn`);
    if (addBtn) {
      addBtn.addEventListener('click', this.handleAddClick);
    }
    
    // Add form
    const addForm = document.getElementById(`${this.containerId}-add-form`);
    if (addForm) {
      addForm.addEventListener('submit', this.handleAddSubmit);
    }
    
    // Edit form
    const editForm = document.getElementById(`${this.containerId}-edit-form`);
    if (editForm) {
      editForm.addEventListener('submit', this.handleEditSubmit);
    }
    
    // Edit buttons
    const editBtns = document.querySelectorAll(`#${this.containerId}-list .edit-btn`);
    editBtns.forEach(btn => {
      btn.addEventListener('click', this.handleEditClick);
    });
    
    // Remove buttons
    const removeBtns = document.querySelectorAll(`#${this.containerId}-list .remove-btn`);
    removeBtns.forEach(btn => {
      btn.addEventListener('click', this.handleRemoveClick);
    });
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('.modal-close, .modal-close-btn');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', this.handleModalClose);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.handleModalClose();
      }
    });
  }
  
  /**
   * Setup drag and drop functionality
   */
  setupDragAndDrop() {
    const dragItems = document.querySelectorAll(`#${this.containerId}-list .drag-item`);
    
    dragItems.forEach(item => {
      // Prevent drag when clicking on buttons
      item.querySelectorAll('button').forEach(button => {
        button.addEventListener('mousedown', e => {
          e.stopPropagation();
        });
      });
      
      // Add drag start event
      item.addEventListener('dragstart', (e) => {
        // Set data transfer
        e.dataTransfer.setData('text/plain', item.dataset.id);
        e.dataTransfer.effectAllowed = 'move';
        
        // Add dragging class
        item.classList.add('dragging');
        
        // Dispatch custom event for drag feedback
        const event = new CustomEvent('personnel-drag-start', {
          detail: {
            id: item.dataset.id,
            element: item,
            event: e
          }
        });
        document.dispatchEvent(event);
      });
      
      // Add drag end event
      item.addEventListener('dragend', () => {
        // Remove dragging class
        item.classList.remove('dragging');
        
        // Dispatch custom event for drag feedback
        const event = new CustomEvent('personnel-drag-end', {
          detail: {
            id: item.dataset.id,
            element: item
          }
        });
        document.dispatchEvent(event);
      });
    });
  }
  
  /**
   * Handle search input
   * @param {Event} e - Input event
   */
  handleSearch(e) {
    this.searchTerm = e.target.value.toLowerCase();
    this.render();
  }
  
  /**
   * Handle add button click
   */
  handleAddClick() {
    const modal = document.getElementById(`${this.containerId}-add-modal`);
    if (modal) {
      modal.style.display = 'flex';
      this.showingAddModal = true;
    }
  }
  
  /**
   * Handle add form submit
   * @param {Event} e - Submit event
   */
  handleAddSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById(`${this.containerId}-add-name`).value;
    const position = document.getElementById(`${this.containerId}-add-position`).value;
    const department = document.getElementById(`${this.containerId}-add-department`).value;
    const skills = document.getElementById(`${this.containerId}-add-skills`).value;
    const experience = document.getElementById(`${this.containerId}-add-experience`).value;
    const education = document.getElementById(`${this.containerId}-add-education`).value;
    const certifications = document.getElementById(`${this.containerId}-add-certifications`).value;
    
    // Add new personnel
    this.personnelManager.addPersonnel({
      name,
      position,
      department,
      skills,
      experience,
      education,
      certifications
    });
    
    // Save to localStorage
    this.personnelManager.saveToLocalStorage();
    
    // Close modal
    this.handleModalClose();
  }
  
  /**
   * Handle edit button click
   * @param {Event} e - Click event
   */
  handleEditClick(e) {
    const id = parseInt(e.target.dataset.id);
    const person = this.personnelManager.getPersonnelById(id);
    
    if (!person) return;
    
    // Set current edit ID
    this.currentEditId = id;
    
    // Fill form fields
    document.getElementById(`${this.containerId}-edit-id`).value = id;
    document.getElementById(`${this.containerId}-ed
(Content truncated due to size limit. Use line ranges to read in chunks)