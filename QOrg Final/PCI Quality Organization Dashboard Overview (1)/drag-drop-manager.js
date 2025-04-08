/**
 * drag-drop-manager.js
 * Comprehensive drag and drop functionality with touch support and visual feedback
 */

class DragDropManager {
  /**
   * Constructor
   * @param {PersonnelManager} personnelManager - Instance of PersonnelManager
   */
  constructor(personnelManager) {
    this.personnelManager = personnelManager;
    
    // State variables
    this.draggedItem = null;
    this.draggedClone = null;
    this.touchActive = false;
    this.touchTarget = null;
    this.lastTouch = { x: 0, y: 0 };
    
    // Bind methods to this instance
    this.initialize = this.initialize.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.updateDragFeedbackPosition = this.updateDragFeedbackPosition.bind(this);
    this.createDragFeedback = this.createDragFeedback.bind(this);
    this.removeDragFeedback = this.removeDragFeedback.bind(this);
    this.getElementUnderPoint = this.getElementUnderPoint.bind(this);
    
    // Initialize
    this.initialize();
  }
  
  /**
   * Initialize drag and drop functionality
   */
  initialize() {
    // Listen for custom events from components
    document.addEventListener('personnel-drag-start', (e) => {
      this.handleDragStart(e.detail.event, e.detail.element);
    });
    
    document.addEventListener('personnel-drag-end', () => {
      this.handleDragEnd();
    });
    
    // Add global event listeners for drag feedback
    document.addEventListener('dragover', this.updateDragFeedbackPosition);
    
    // Initialize touch events for mobile support
    this.initializeTouchEvents();
    
    // Initialize drop targets
    this.initializeDropTargets();
  }
  
  /**
   * Initialize touch events for mobile support
   */
  initializeTouchEvents() {
    // Find all draggable items
    const draggableItems = document.querySelectorAll('.drag-item');
    
    draggableItems.forEach(item => {
      // Add touch event listeners
      item.addEventListener('touchstart', (e) => this.handleTouchStart(e, item), { passive: false });
      item.addEventListener('touchmove', this.handleTouchMove, { passive: false });
      item.addEventListener('touchend', this.handleTouchEnd, { passive: false });
      item.addEventListener('touchcancel', this.handleTouchEnd, { passive: false });
    });
  }
  
  /**
   * Initialize drop targets
   */
  initializeDropTargets() {
    // Find all drop targets
    const dropTargets = document.querySelectorAll('.drop-target');
    
    dropTargets.forEach(target => {
      // Add dragover event
      target.addEventListener('dragover', (e) => this.handleDragOver(e, target));
      
      // Add dragleave event
      target.addEventListener('dragleave', () => this.handleDragLeave(target));
      
      // Add drop event
      target.addEventListener('drop', (e) => this.handleDrop(e, target));
    });
  }
  
  /**
   * Handle drag start
   * @param {DragEvent} e - Drag event
   * @param {HTMLElement} item - Dragged item
   */
  handleDragStart(e, item) {
    // Store reference to dragged item
    this.draggedItem = item;
    
    // Create visual drag feedback
    this.createDragFeedback(e, item);
  }
  
  /**
   * Handle drag end
   */
  handleDragEnd() {
    // Remove visual drag feedback
    this.removeDragFeedback();
    
    // Reset draggedItem
    this.draggedItem = null;
  }
  
  /**
   * Handle drag over
   * @param {DragEvent} e - Drag event
   * @param {HTMLElement} target - Drop target
   */
  handleDragOver(e, target) {
    // Prevent default to allow drop
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Add drag-over class
    target.classList.add('drag-over');
  }
  
  /**
   * Handle drag leave
   * @param {HTMLElement} target - Drop target
   */
  handleDragLeave(target) {
    // Remove drag-over class
    target.classList.remove('drag-over');
  }
  
  /**
   * Handle drop
   * @param {DragEvent} e - Drop event
   * @param {HTMLElement} target - Drop target
   */
  handleDrop(e, target) {
    // Prevent default action
    e.preventDefault();
    
    // Remove drag-over class
    target.classList.remove('drag-over');
    
    // Get dragged item ID
    const personnelId = parseInt(e.dataTransfer.getData('text/plain'));
    const roleId = target.dataset.role;
    
    // Assign personnel to role
    this.personnelManager.assignPersonnelToRole(personnelId, roleId);
    
    // Save to localStorage
    this.personnelManager.saveToLocalStorage();
  }
  
  /**
   * Handle touch start
   * @param {TouchEvent} e - Touch event
   * @param {HTMLElement} item - Touched item
   */
  handleTouchStart(e, item) {
    // Prevent default to avoid scrolling
    e.preventDefault();
    
    // Check if item is draggable
    if (!item.classList.contains('drag-item')) return;
    
    // Store reference to touched item
    this.touchActive = true;
    this.touchTarget = item;
    
    // Store initial touch position
    const touch = e.touches[0];
    this.lastTouch = { x: touch.clientX, y: touch.clientY };
    
    // Add touching class
    item.classList.add('touching');
    
    // Create visual drag feedback
    this.createDragFeedback({ clientX: touch.clientX, clientY: touch.clientY }, item);
  }
  
  /**
   * Handle touch move
   * @param {TouchEvent} e - Touch event
   */
  handleTouchMove(e) {
    // Check if touch is active
    if (!this.touchActive || !this.touchTarget) return;
    
    // Prevent default to avoid scrolling
    e.preventDefault();
    
    // Get touch position
    const touch = e.touches[0];
    this.lastTouch = { x: touch.clientX, y: touch.clientY };
    
    // Update drag feedback position
    this.updateDragFeedbackPosition({ clientX: touch.clientX, clientY: touch.clientY });
    
    // Find element under touch point
    const elementUnderPoint = this.getElementUnderPoint(touch.clientX, touch.clientY);
    
    // Check if element is a drop target
    if (elementUnderPoint && elementUnderPoint.classList.contains('drop-target')) {
      // Add drag-over class
      elementUnderPoint.classList.add('drag-over');
      
      // Remove drag-over class from other drop targets
      document.querySelectorAll('.drop-target.drag-over').forEach(target => {
        if (target !== elementUnderPoint) {
          target.classList.remove('drag-over');
        }
      });
    }
  }
  
  /**
   * Handle touch end
   * @param {TouchEvent} e - Touch event
   */
  handleTouchEnd(e) {
    // Check if touch is active
    if (!this.touchActive || !this.touchTarget) return;
    
    // Prevent default
    e.preventDefault();
    
    // Find element under last touch point
    const elementUnderPoint = this.getElementUnderPoint(this.lastTouch.x, this.lastTouch.y);
    
    // Check if element is a drop target
    if (elementUnderPoint && elementUnderPoint.classList.contains('drop-target')) {
      // Get personnel ID and role ID
      const personnelId = parseInt(this.touchTarget.dataset.id);
      const roleId = elementUnderPoint.dataset.role;
      
      // Assign personnel to role
      this.personnelManager.assignPersonnelToRole(personnelId, roleId);
      
      // Save to localStorage
      this.personnelManager.saveToLocalStorage();
      
      // Remove drag-over class
      elementUnderPoint.classList.remove('drag-over');
    }
    
    // Remove touching class
    this.touchTarget.classList.remove('touching');
    
    // Remove visual drag feedback
    this.removeDragFeedback();
    
    // Reset touch state
    this.touchActive = false;
    this.touchTarget = null;
  }
  
  /**
   * Create visual drag feedback
   * @param {Object} e - Event with clientX and clientY properties
   * @param {HTMLElement} item - Dragged item
   */
  createDragFeedback(e, item) {
    // Create clone for visual feedback
    this.draggedClone = document.createElement('div');
    this.draggedClone.className = 'personnel-clone';
    
    // Get personnel data
    const personnelId = parseInt(item.dataset.id);
    const person = this.personnelManager.getPersonnelById(personnelId);
    
    if (person) {
      this.draggedClone.innerHTML = `
        <div class="personnel-name">${person.name}</div>
        <div class="personnel-position">${person.position}</div>
      `;
    } else {
      // Fallback to element content
      const nameElement = item.querySelector('.personnel-name');
      const positionElement = item.querySelector('.personnel-position');
      
      this.draggedClone.innerHTML = `
        <div class="personnel-name">${nameElement ? nameElement.textContent : 'Unknown'}</div>
        <div class="personnel-position">${positionElement ? positionElement.textContent : ''}</div>
      `;
    }
    
    // Position clone
    this.draggedClone.style.left = (e.clientX + 10) + 'px';
    this.draggedClone.style.top = (e.clientY + 10) + 'px';
    
    // Add to document
    document.body.appendChild(this.draggedClone);
  }
  
  /**
   * Update drag feedback position
   * @param {Object} e - Event with clientX and clientY properties
   */
  updateDragFeedbackPosition(e) {
    if (this.draggedClone) {
      this.draggedClone.style.left = (e.clientX + 10) + 'px';
      this.draggedClone.style.top = (e.clientY + 10) + 'px';
    }
  }
  
  /**
   * Remove drag feedback
   */
  removeDragFeedback() {
    if (this.draggedClone) {
      document.body.removeChild(this.draggedClone);
      this.draggedClone = null;
    }
    
    // Remove drag-over class from all drop targets
    document.querySelectorAll('.drop-target.drag-over').forEach(target => {
      target.classList.remove('drag-over');
    });
  }
  
  /**
   * Get element under point
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {HTMLElement|null} Element under point or null
   */
  getElementUnderPoint(x, y) {
    // Hide drag clone temporarily to get correct element
    if (this.draggedClone) {
      this.draggedClone.style.display = 'none';
    }
    
    // Get element under point
    const element = document.elementFromPoint(x, y);
    
    // Show drag clone again
    if (this.draggedClone) {
      this.draggedClone.style.display = '';
    }
    
    // If element is not a drop target, check parents
    if (element && !element.classList.contains('drop-target')) {
      let parent = element.closest('.drop-target');
      return parent || element;
    }
    
    return element;
  }
  
  /**
   * Refresh event listeners
   * This should be called after DOM updates
   */
  refresh() {
    // Re-initialize touch events
    this.initializeTouchEvents();
    
    // Re-initialize drop targets
    this.initializeDropTargets();
  }
}

// Export the DragDropManager class
window.DragDropManager = DragDropManager;
