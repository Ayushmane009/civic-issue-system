/**
 * Department Mapping Utility
 * 
 * Maps issue categories to department IDs automatically.
 * When a user reports an issue, the system uses this mapping
 * to assign the issue to the correct department.
 * 
 * Department IDs (must match the seeded departments table):
 *   1 = Infrastructure
 *   2 = Sanitization
 *   3 = Safety
 *   4 = Transport
 */

// Category → Department ID mapping
const CATEGORY_TO_DEPARTMENT = {
  infrastructure: 1,
  sanitation: 2,
  safety: 3,
  transport: 4,
};

// Department ID → Department Name (for display purposes)
const DEPARTMENT_NAMES = {
  1: 'Infrastructure',
  2: 'Sanitization',
  3: 'Safety',
  4: 'Transport',
};

// Department color codes (for frontend consistency)
const DEPARTMENT_COLORS = {
  1: '#f59e0b',  // Infrastructure — Amber
  2: '#10b981',  // Sanitization — Emerald
  3: '#ef4444',  // Safety — Red
  4: '#3b82f6',  // Transport — Blue
};

/**
 * Get department ID from issue category
 * @param {string} category - The issue category (e.g., 'infrastructure')
 * @returns {number|null} - Department ID or null if no match
 */
const getDepartmentIdFromCategory = (category) => {
  if (!category) return null;
  return CATEGORY_TO_DEPARTMENT[category.toLowerCase()] || null;
};

/**
 * Get department name from ID
 * @param {number} deptId - Department ID
 * @returns {string} - Department name or 'Unknown'
 */
const getDepartmentName = (deptId) => {
  return DEPARTMENT_NAMES[deptId] || 'Unknown';
};

module.exports = {
  CATEGORY_TO_DEPARTMENT,
  DEPARTMENT_NAMES,
  DEPARTMENT_COLORS,
  getDepartmentIdFromCategory,
  getDepartmentName,
};
