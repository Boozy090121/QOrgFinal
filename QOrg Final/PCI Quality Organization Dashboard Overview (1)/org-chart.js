/**
 * org-chart.js
 * Organizational chart component with drop zones for personnel assignment
 */

class OrgChartComponent {
  /**
   * Constructor
   * @param {string} containerId - ID of the container element
   * @param {PersonnelManager} personnelManager - Instance of PersonnelManager
   */
  constructor(containerId, personnelManager) {
    this.containerId = containerId;
    this.personnelManager = personnelManager;
    this.container = document.getElementById(containerId);
    
    // Bind methods to this instance
    this.render = this.render.bind(this);
    this.setupDropTargets = this.setupDropTargets.bind(this);
    this.handleUnassign = this.handleUnassign.bind(this);
    this.handleRoleClick = this.handleRoleClick.bind(this);
    this.handleFactoryChange = this.handleFactoryChange.bind(this);
    
    // Set up data change listener
    this.personnelManager.setOnDataChange(this.render);
    this.personnelManager.setOnAssignmentChange(() => this.render());
    
    // Initial render
    this.render();
  }
  
  /**
   * Render the organizational chart
   */
  render() {
    if (!this.container) return;
    
    // Clear container
    this.container.innerHTML = '';
    
    // Get current factory
    const currentFactory = this.personnelManager.getCurrentFactory();
    const factoryDetails = this.personnelManager.getFactoryDetails();
    
    // Create factory info
    const factoryInfo = document.createElement('div');
    factoryInfo.className = 'factory-info';
    factoryInfo.innerHTML = `
      <h2 id="factoryTitle">${factoryDetails.name}</h2>
      <div class="factory-info-details" id="factoryDetails">
        <div><strong>Location:</strong> ${factoryDetails.details.location}</div>
        <div><strong>Employees:</strong> ${factoryDetails.details.employees}</div>
        <div><strong>Products:</strong> ${factoryDetails.details.products}</div>
        <div><strong>Certifications:</strong> ${factoryDetails.details.certifications}</div>
      </div>
    `;
    this.container.appendChild(factoryInfo);
    
    // Create factory selector
    const factorySelector = document.createElement('div');
    factorySelector.className = 'factory-selector';
    
    const factories = this.personnelManager.getAllFactories();
    for (const factoryId in factories) {
      const btn = document.createElement('button');
      btn.className = 'factory-btn';
      btn.dataset.factory = factoryId;
      btn.textContent = `Factory ${factoryId}`;
      
      if (parseInt(factoryId) === currentFactory) {
        btn.classList.add('active');
      }
      
      factorySelector.appendChild(btn);
    }
    
    this.container.appendChild(factorySelector);
    
    // Create org chart
    const orgChart = document.createElement('div');
    orgChart.className = 'org-chart';
    
    // Get all roles
    const roles = this.personnelManager.getAllRoles();
    
    // Group roles by level
    const leadershipRoles = [];
    const specialistRoles = [];
    const associateRoles = [];
    
    for (const roleId in roles) {
      const role = roles[roleId];
      if (role.level === 'leadership') {
        leadershipRoles.push({ id: roleId, ...role });
      } else if (role.level === 'specialist') {
        specialistRoles.push({ id: roleId, ...role });
      } else if (role.level === 'associate') {
        associateRoles.push({ id: roleId, ...role });
      }
    }
    
    // Create leadership level
    const leadershipLevel = document.createElement('div');
    leadershipLevel.className = 'org-level';
    
    leadershipRoles.forEach(role => {
      const node = this.createRoleNode(role, currentFactory);
      leadershipLevel.appendChild(node);
    });
    
    orgChart.appendChild(leadershipLevel);
    
    // Add connector
    const connector1 = document.createElement('div');
    connector1.className = 'org-connector';
    orgChart.appendChild(connector1);
    
    // Create specialist level
    const specialistLevel = document.createElement('div');
    specialistLevel.className = 'org-level';
    
    specialistRoles.forEach(role => {
      const node = this.createRoleNode(role, currentFactory);
      specialistLevel.appendChild(node);
    });
    
    orgChart.appendChild(specialistLevel);
    
    // Add connector
    const connector2 = document.createElement('div');
    connector2.className = 'org-connector';
    orgChart.appendChild(connector2);
    
    // Create associate level
    const associateLevel = document.createElement('div');
    associateLevel.className = 'org-level';
    
    associateRoles.forEach(role => {
      const node = this.createRoleNode(role, currentFactory);
      associateLevel.appendChild(node);
    });
    
    orgChart.appendChild(associateLevel);
    
    // Add org chart to container
    this.container.appendChild(orgChart);
    
    // Add event listeners
    this.addEventListeners();
    
    // Setup drop targets
    this.setupDropTargets();
  }
  
  /**
   * Create a role node element
   * @param {Object} role - Role data
   * @param {number} factoryId - Factory ID
   * @returns {HTMLElement} Role node element
   */
  createRoleNode(role, factoryId) {
    const node = document.createElement('div');
    node.className = `org-node ${role.level}`;
    node.dataset.role = role.id;
    
    // Get assigned personnel
    const assignedPerson = this.personnelManager.getPersonnelAssignedToRole(role.id);
    
    // Create node content
    node.innerHTML = `
      <div class="factory-indicator">${factoryId}</div>
      <div class="org-node-title">${role.title}</div>
      <div class="org-node-subtitle">${role.level.charAt(0).toUpperCase() + role.level.slice(1)}</div>
      <div class="org-node-description">${role.description}</div>
      <div class="org-node-content drop-target" data-role="${role.id}">
        ${assignedPerson ? `
          <div class="assigned-personnel" data-id="${assignedPerson.id}">
            ${assignedPerson.name}
            <button class="btn btn-small btn-outline unassign-btn" data-role="${role.id}">Unassign</button>
          </div>
        ` : `
          <div class="drop-placeholder">Drag personnel here</div>
        `}
      </div>
      <button class="btn btn-small btn-outline view-details-btn" data-role="${role.id}">View Details</button>
    `;
    
    return node;
  }
  
  /**
   * Add event listeners
   */
  addEventListeners() {
    // Factory buttons
    const factoryButtons = this.container.querySelectorAll('.factory-btn');
    factoryButtons.forEach(btn => {
      btn.addEventListener('click', this.handleFactoryChange);
    });
    
    // Unassign buttons
    const unassignButtons = this.container.querySelectorAll('.unassign-btn');
    unassignButtons.forEach(btn => {
      btn.addEventListener('click', this.handleUnassign);
    });
    
    // View details buttons
    const viewDetailsButtons = this.container.querySelectorAll('.view-details-btn');
    viewDetailsButtons.forEach(btn => {
      btn.addEventListener('click', this.handleRoleClick);
    });
  }
  
  /**
   * Setup drop targets
   */
  setupDropTargets() {
    const dropTargets = this.container.querySelectorAll('.drop-target');
    
    dropTargets.forEach(target => {
      // Add dragover event
      target.addEventListener('dragover', (e) => {
        // Prevent default to allow drop
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        // Add drag-over class
        target.classList.add('drag-over');
      });
      
      // Add dragleave event
      target.addEventListener('dragleave', () => {
        // Remove drag-over class
        target.classList.remove('drag-over');
      });
      
      // Add drop event
      target.addEventListener('drop', (e) => {
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
        
        // Dispatch custom event for drag feedback
        const event = new CustomEvent('personnel-dropped', {
          detail: {
            personnelId,
            roleId,
            factoryId: this.personnelManager.getCurrentFactory()
          }
        });
        document.dispatchEvent(event);
      });
    });
  }
  
  /**
   * Handle unassign button click
   * @param {Event} e - Click event
   */
  handleUnassign(e) {
    const roleId = e.target.dataset.role;
    
    // Unassign personnel from role
    this.personnelManager.unassignPersonnelFromRole(roleId);
    
    // Save to localStorage
    this.personnelManager.saveToLocalStorage();
  }
  
  /**
   * Handle role click
   * @param {Event} e - Click event
   */
  handleRoleClick(e) {
    const roleId = e.target.dataset.role;
    const role = this.personnelManager.getRoleDetails(roleId);
    
    if (!role) return;
    
    // Create and show role details modal
    this.showRoleDetailsModal(role);
  }
  
  /**
   * Show role details modal
   * @param {Object} role - Role data
   */
  showRoleDetailsModal(role) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('role-details-modal');
    
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal';
      modal.id = 'role-details-modal';
      document.body.appendChild(modal);
    }
    
    // Create responsibilities list
    let responsibilitiesHtml = '';
    if (role.responsibilities && role.responsibilities.length > 0) {
      responsibilitiesHtml = '<ul class="role-responsibilities">';
      role.responsibilities.forEach(resp => {
        responsibilitiesHtml += `<li>${resp}</li>`;
      });
      responsibilitiesHtml += '</ul>';
    }
    
    // Set modal content
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">${role.title}</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="role-level"><strong>Level:</strong> ${role.level.charAt(0).toUpperCase() + role.level.slice(1)}</div>
          <div class="role-description"><strong>Description:</strong> ${role.description}</div>
          <div class="role-responsibilities-section">
            <strong>Responsibilities:</strong>
            ${responsibilitiesHtml}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline modal-close-btn">Close</button>
        </div>
      </div>
    `;
    
    // Show modal
    modal.style.display = 'flex';
    
    // Add event listeners
    const closeButtons = modal.querySelectorAll('.modal-close, .modal-close-btn');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
  
  /**
   * Handle factory change
   * @param {Event} e - Click event
   */
  handleFactoryChange(e) {
    const factoryId = parseInt(e.target.dataset.factory);
    
    // Update active button
    const factoryButtons = this.container.querySelectorAll('.factory-btn');
    factoryButtons.forEach(btn => {
      btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Set current factory
    this.personnelManager.setCurrentFactory(factoryId);
    
    // Save to localStorage
    this.personnelManager.saveToLocalStorage();
  }
}

// Export the OrgChartComponent class
window.OrgChartComponent = OrgChartComponent;
