/**
 * personnel-data.js
 * Comprehensive data structure for personnel management with drag-and-drop functionality
 */

class PersonnelManager {
  constructor() {
    // Main data structures
    this.personnel = [];
    this.factories = {};
    this.roles = {};
    this.currentFactory = 1;
    
    // Event callbacks
    this.onDataChange = null;
    this.onAssignmentChange = null;
    
    // Initialize with default data
    this.initializeDefaultData();
  }
  
  /**
   * Initialize with default data
   */
  initializeDefaultData() {
    // Default personnel data
    this.personnel = [
      { id: 1, name: "John Smith", position: "Senior Quality Engineer", department: "Quality", skills: "ISO 9001, Six Sigma, Auditing", experience: "8 years", education: "BS in Engineering", certifications: "Six Sigma Black Belt", assigned: false },
      { id: 2, name: "Maria Garcia", position: "Quality Manager", department: "Quality", skills: "Leadership, Process Improvement, Regulatory Compliance", experience: "12 years", education: "MS in Quality Management", certifications: "ASQ CQM", assigned: false },
      { id: 3, name: "David Chen", position: "Quality Technician", department: "Quality", skills: "Testing, Documentation, Data Analysis", experience: "3 years", education: "AS in Quality Technology", certifications: "ASQ CQIA", assigned: false },
      { id: 4, name: "Sarah Johnson", position: "Compliance Specialist", department: "Quality", skills: "Regulatory Affairs, Documentation, Auditing", experience: "6 years", education: "BS in Regulatory Science", certifications: "RAC", assigned: false },
      { id: 5, name: "Michael Brown", position: "Systems Specialist", department: "Quality", skills: "Quality Systems, CAPA, Risk Management", experience: "7 years", education: "BS in Systems Engineering", certifications: "CSQE", assigned: false },
      { id: 6, name: "Emily Davis", position: "Document Controller", department: "Quality", skills: "Documentation, Records Management, Compliance", experience: "4 years", education: "BA in Business Administration", certifications: "CQIA", assigned: false },
      { id: 7, name: "Robert Wilson", position: "Quality Inspector", department: "Quality", skills: "Inspection, Testing, Reporting", experience: "5 years", education: "AS in Quality Assurance", certifications: "CQI", assigned: false },
      { id: 8, name: "Jennifer Lee", position: "Quality Director", department: "Quality", skills: "Strategic Planning, Leadership, Business Development", experience: "15 years", education: "MBA, BS in Engineering", certifications: "ASQ CQE, PMP", assigned: false }
    ];
    
    // Default factory data
    this.factories = {
      1: { 
        name: "Factory 1 - Medical Devices", 
        assignments: {},
        details: {
          location: "Boston, MA",
          employees: 450,
          products: "Medical Devices, Surgical Equipment",
          certifications: "ISO 13485, FDA 21 CFR Part 820"
        }
      },
      2: { 
        name: "Factory 2 - Electronics", 
        assignments: {},
        details: {
          location: "Austin, TX",
          employees: 380,
          products: "Electronic Components, Circuit Boards",
          certifications: "ISO 9001, IPC-A-610"
        }
      },
      3: { 
        name: "Factory 3 - Automotive", 
        assignments: {},
        details: {
          location: "Detroit, MI",
          employees: 320,
          products: "Automotive Parts, Sensors",
          certifications: "IATF 16949, ISO 14001"
        }
      }
    };
    
    // Default role data
    this.roles = {
      "quality-director": {
        title: "Quality Director",
        level: "leadership",
        description: "Oversees all quality operations and strategy",
        responsibilities: [
          "Develop and implement quality strategy",
          "Lead quality department across all factories",
          "Ensure regulatory compliance",
          "Report to executive leadership",
          "Manage quality budget and resources"
        ]
      },
      "quality-manager": {
        title: "Quality Manager",
        level: "leadership",
        description: "Manages quality operations for a factory",
        responsibilities: [
          "Implement quality policies and procedures",
          "Supervise quality staff",
          "Coordinate quality activities",
          "Manage quality metrics and reporting",
          "Interface with other departments"
        ]
      },
      "quality-engineer": {
        title: "Quality Engineer",
        level: "specialist",
        description: "Designs and implements quality systems",
        responsibilities: [
          "Develop quality control procedures",
          "Analyze quality data and metrics",
          "Implement process improvements",
          "Conduct quality audits",
          "Support regulatory compliance"
        ]
      },
      "systems-specialist": {
        title: "Systems Specialist",
        level: "specialist",
        description: "Manages quality management systems",
        responsibilities: [
          "Maintain quality management system",
          "Implement system improvements",
          "Train staff on quality systems",
          "Ensure system compliance",
          "Manage documentation system"
        ]
      },
      "compliance-specialist": {
        title: "Compliance Specialist",
        level: "specialist",
        description: "Ensures regulatory compliance",
        responsibilities: [
          "Monitor regulatory requirements",
          "Conduct compliance audits",
          "Prepare regulatory submissions",
          "Manage compliance documentation",
          "Train staff on compliance requirements"
        ]
      },
      "quality-technician": {
        title: "Quality Technician",
        level: "associate",
        description: "Performs quality testing and inspection",
        responsibilities: [
          "Conduct quality tests and inspections",
          "Document test results",
          "Identify quality issues",
          "Perform calibration activities",
          "Support quality improvement initiatives"
        ]
      },
      "quality-inspector": {
        title: "Quality Inspector",
        level: "associate",
        description: "Inspects products for quality",
        responsibilities: [
          "Inspect products against specifications",
          "Document inspection results",
          "Identify defects and non-conformances",
          "Perform in-process inspections",
          "Support quality control activities"
        ]
      },
      "document-controller": {
        title: "Document Controller",
        level: "associate",
        description: "Manages quality documentation",
        responsibilities: [
          "Maintain document control system",
          "Process document changes",
          "Ensure document compliance",
          "Train staff on documentation procedures",
          "Audit documentation system"
        ]
      }
    };
  }
  
  /**
   * Get all personnel
   * @returns {Array} Array of personnel objects
   */
  getAllPersonnel() {
    return [...this.personnel];
  }
  
  /**
   * Get available (unassigned) personnel
   * @returns {Array} Array of unassigned personnel objects
   */
  getAvailablePersonnel() {
    return this.personnel.filter(person => !this.isPersonnelAssigned(person.id));
  }
  
  /**
   * Get assigned personnel
   * @returns {Array} Array of assigned personnel objects
   */
  getAssignedPersonnel() {
    return this.personnel.filter(person => this.isPersonnelAssigned(person.id));
  }
  
  /**
   * Get personnel by ID
   * @param {number} id - Personnel ID
   * @returns {Object|null} Personnel object or null if not found
   */
  getPersonnelById(id) {
    return this.personnel.find(person => person.id === id) || null;
  }
  
  /**
   * Add new personnel
   * @param {Object} personData - Personnel data object
   * @returns {number} ID of the new personnel
   */
  addPersonnel(personData) {
    const newId = this.personnel.length > 0 
      ? Math.max(...this.personnel.map(p => p.id)) + 1 
      : 1;
    
    const newPerson = {
      id: newId,
      name: personData.name || 'Unnamed',
      position: personData.position || 'No position',
      department: personData.department || 'Quality',
      skills: personData.skills || '',
      experience: personData.experience || '',
      education: personData.education || '',
      certifications: personData.certifications || '',
      assigned: false
    };
    
    this.personnel.push(newPerson);
    
    if (this.onDataChange) {
      this.onDataChange();
    }
    
    return newId;
  }
  
  /**
   * Update personnel
   * @param {number} id - Personnel ID
   * @param {Object} personData - Updated personnel data
   * @returns {boolean} Success status
   */
  updatePersonnel(id, personData) {
    const index = this.personnel.findIndex(person => person.id === id);
    if (index === -1) return false;
    
    // Update only provided fields
    Object.keys(personData).forEach(key => {
      if (key !== 'id' && key !== 'assigned') {
        this.personnel[index][key] = personData[key];
      }
    });
    
    if (this.onDataChange) {
      this.onDataChange();
    }
    
    return true;
  }
  
  /**
   * Remove personnel
   * @param {number} id - Personnel ID
   * @returns {boolean} Success status
   */
  removePersonnel(id) {
    const index = this.personnel.findIndex(person => person.id === id);
    if (index === -1) return false;
    
    // Remove from all assignments first
    this.unassignPersonnelFromAllRoles(id);
    
    // Remove from personnel list
    this.personnel.splice(index, 1);
    
    if (this.onDataChange) {
      this.onDataChange();
    }
    
    return true;
  }
  
  /**
   * Check if personnel is assigned to any role
   * @param {number} id - Personnel ID
   * @returns {boolean} True if assigned, false otherwise
   */
  isPersonnelAssigned(id) {
    for (const factoryId in this.factories) {
      const assignments = this.factories[factoryId].assignments;
      for (const role in assignments) {
        if (assignments[role] === id) {
          return true;
        }
      }
    }
    return false;
  }
  
  /**
   * Get current factory
   * @returns {number} Current factory ID
   */
  getCurrentFactory() {
    return this.currentFactory;
  }
  
  /**
   * Set current factory
   * @param {number} factoryId - Factory ID
   */
  setCurrentFactory(factoryId) {
    if (this.factories[factoryId]) {
      this.currentFactory = factoryId;
      
      if (this.onDataChange) {
        this.onDataChange();
      }
    }
  }
  
  /**
   * Get factory details
   * @param {number} factoryId - Factory ID (optional, defaults to current factory)
   * @returns {Object} Factory details
   */
  getFactoryDetails(factoryId = null) {
    const id = factoryId || this.currentFactory;
    return this.factories[id] || null;
  }
  
  /**
   * Get all factories
   * @returns {Object} All factories
   */
  getAllFactories() {
    return {...this.factories};
  }
  
  /**
   * Get all roles
   * @returns {Object} All roles
   */
  getAllRoles() {
    return {...this.roles};
  }
  
  /**
   * Get role details
   * @param {string} roleId - Role ID
   * @returns {Object|null} Role details or null if not found
   */
  getRoleDetails(roleId) {
    return this.roles[roleId] || null;
  }
  
  /**
   * Get personnel assigned to role
   * @param {string} roleId - Role ID
   * @param {number} factoryId - Factory ID (optional, defaults to current factory)
   * @returns {Object|null} Assigned personnel or null if none
   */
  getPersonnelAssignedToRole(roleId, factoryId = null) {
    const id = factoryId || this.currentFactory;
    const factory = this.factories[id];
    
    if (!factory || !factory.assignments[roleId]) {
      return null;
    }
    
    const personnelId = factory.assignments[roleId];
    return this.getPersonnelById(personnelId);
  }
  
  /**
   * Assign personnel to role
   * @param {number} personnelId - Personnel ID
   * @param {string} roleId - Role ID
   * @param {number} factoryId - Factory ID (optional, defaults to current factory)
   * @returns {boolean} Success status
   */
  assignPersonnelToRole(personnelId, roleId, factoryId = null) {
    const id = factoryId || this.currentFactory;
    const factory = this.factories[id];
    const person = this.getPersonnelById(personnelId);
    
    if (!factory || !person || !this.roles[roleId]) {
      return false;
    }
    
    // Unassign from any current role in this factory
    this.unassignPersonnelFromAllRolesInFactory(personnelId, id);
    
    // If someone else is assigned to this role, unassign them
    if (factory.assignments[roleId]) {
      const currentPersonId = factory.assignments[roleId];
      const currentPerson = this.getPersonnelById(currentPersonId);
      if (currentPerson) {
        currentPerson.assigned = false;
      }
    }
    
    // Assign to new role
    factory.assignments[roleId] = personnelId;
    person.assigned = true;
    
    if (this.onAssignmentChange) {
      this.onAssignmentChange(personnelId, roleId, id);
    }
    
    if (this.onDataChange) {
      this.onDataChange();
    }
    
    return true;
  }
  
  /**
   * Unassign personnel from role
   * @param {string} roleId - Role ID
   * @param {number} factoryId - Factory ID (optional, defaults to current factory)
   * @returns {boolean} Success status
   */
  unassignPersonnelFromRole(roleId, factoryId = null) {
    const id = factoryId || this.currentFactory;
    const factory = this.factories[id];
    
    if (!factory || !factory.assignments[roleId]) {
      return false;
    }
    
    const personnelId = factory.assignments[roleId];
    const person = this.getPersonnelById(personnelId);
    
    if (person) {
      // Check if person is assigned to any other role
      let stillAssigned = false;
      
      for (const fId in this.factories) {
        const assignments = this.factories[fId].assignments;
        for (const rId in assignments) {
          if (assignments[rId] === personnelId && !(fId === id && rId === roleId)) {
            stillAssigned = true;
            break;
          }
        }
        if (stillAssigned) break;
      }
      
      person.assigned = stillAssigned;
    }
    
    // Remove assignment
    delete factory.assignments[roleId];
    
    if (this.onAssignmentChange) {
      this.onAssignmentChange(null, roleId, id);
    }
    
    if (this.onDataChange) {
      this.onDataChange();
    }
    
    return true;
  }
  
  /**
   * Unassign personnel from all roles in a factory
   * @param {number} personnelId - Personnel ID
   * @param {number} factoryId - Factory ID (optional, defaults to current factory)
   */
  unassignPersonnelFromAllRolesInFactory(personnelId, factoryId = null) {
    const id = factoryId || this.currentFactory;
    const factory = this.factories[id];
    
    if (!factory) return;
    
    const assignments = factory.assignments;
    for (const roleId in assignments) {
      if (assignments[roleId] === personnelId) {
        delete assignments[roleId];
        
        if (this.onAssignmentChange) {
          this.onAssignmentChange(null, roleId, id);
        }
      }
    }
  }
  
  /**
   * Unassign personnel from all roles in all factories
   * @param {number} personnelId - Personnel ID
   */
  unassignPersonnelFromAllRoles(personnelId) {
    for (const factoryId in this.factories) {
      this.unassignPersonnelFromAllRolesInFactory(personnelId, factoryId);
    }
    
    const person = this.getPersonnelById(personnelId);
    if (person) {
      person.assigned = false;
    }
    
    if (this.onDataChange) {
      this.onDataChange();
    }
  }
  
  /**
   * Get role assignments for a factory
   * @param {number} factoryId - Factory ID (optional, defaults to current factory)
   * @returns {Object} Role assignments
   */
  getFactoryAssignments(factoryId = nu
(Content truncated due to size limit. Use line ranges to read in chunks)