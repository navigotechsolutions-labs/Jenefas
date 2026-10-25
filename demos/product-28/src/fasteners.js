/**
 * Hardware & Connection schema, verification rules, and helper utilities.
 *
 * Rules:
 * - Use only manufacturer-confirmed information with recorded approval.
 * - A manufacturer checklist identifies missing information; it must not be treated as proof of verification.
 * - Where component existence is unconfirmed, use neutral connection records
 *   (base-to-post, lower-rail-to-post, upper-rail-to-post, TV attachment).
 * - Show named screws, washers, or spacers only when supported by evidence.
 * - Missing details are strictly null with status: 'pending'.
 * - Require a valid source reference and recorded manufacturer approval before
 *   displaying confirmed installation locations or instructions.
 * - Never invent screw sizes, tightening torque, wall-anchor suitability, or connection methods.
 * - Synthetic test fixtures must never be exported from or bundled into production code.
 */

export const FASTENER_STATUS = {
  VERIFIED: 'verified',
  PENDING: 'pending',
};

/**
 * Check whether a connection/fastener item has formal manufacturer approval
 * and verified installation coordinates.
 * @param {Object} item Connection or fastener record
 * @returns {boolean} True if approved with a verified source and location
 */
export function hasManufacturerApproval(item) {
  return Boolean(
    item &&
    item.approved === true &&
    item.status === FASTENER_STATUS.VERIFIED &&
    item.source &&
    Array.isArray(item.location) &&
    item.location.length === 3
  );
}

/**
 * Format a hardware/connection property for customer-facing display.
 * @param {*} value The raw field value
 * @param {string} pendingText Localized customer-facing text for unverified values
 * @param {string} suffix Optional unit suffix (e.g. 'mm')
 * @returns {string} Formatted string
 */
export function formatFastenerField(value, pendingText = 'Pending verification', suffix = '') {
  if (value === null || value === undefined || value === '') {
    return pendingText;
  }
  return suffix ? `${value} ${suffix}` : String(value);
}

/**
 * Filter connections/fasteners relevant to a specific assembly step/stage.
 * @param {Array} list List of connection or fastener records
 * @param {number|null} stage Active assembly stage index (1-based), or 0/null for all
 * @returns {Array} Filtered list
 */
export function filterFastenersByStage(list, stage) {
  if (!Array.isArray(list)) return [];
  if (!stage || stage === 0) {
    return list;
  }
  return list.filter(item => item.stage === stage);
}
