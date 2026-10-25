/**
 * Measurement schema, verification statuses, and helper utilities.
 *
 * Rules:
 * - Dimensions are stored in millimetres (mm).
 * - Only verified values from manufacturer-approved drawings or physical spec sheets are numeric.
 * - Missing / unverified values are strictly null with status: 'pending'.
 * - Never estimate or convert illustrative Three.js scene units to millimetres.
 * - For unverified measurements, display "Pending verification".
 * - For clamp products, distinguish mechanical clamp opening from supported desk thickness.
 * - Never imply animation movement represents an approved adjustment range.
 * - No synthetic specifications or coordinates may reach production bundles.
 */

export const MEASUREMENT_STATUS = {
  VERIFIED: 'verified',
  PENDING: 'pending',
};

/**
 * Format a measurement for display.
 * @param {Object} item Measurement item
 * @param {string} pendingText Localized string for pending measurement
 * @returns {string} Formatted string
 */
export function formatMeasurementValue(item, pendingText = 'Pending verification') {
  if (!item) return pendingText;
  const hasRange = item.min != null && item.max != null;
  const hasValue = item.value != null;
  if (!hasRange && !hasValue) {
    return pendingText;
  }
  if (hasRange) {
    return `${item.min} – ${item.max} ${item.unit || 'mm'}`;
  }
  return `${item.value} ${item.unit || 'mm'}`;
}

/**
 * Filter measurements relevant to a specific part or the overall assembly.
 * @param {Array} measurements List of measurements
 * @param {string|null} partId Active part ID, or null for overall
 * @param {boolean} isAssembled Whether the view is currently fully assembled
 * @returns {Array} Filtered measurements
 */
export function filterMeasurementsByPart(measurements, partId, isAssembled = false) {
  if (!Array.isArray(measurements)) return [];
  if (isAssembled || !partId) {
    return measurements.filter(m => m.category === 'overall' || m.partId === null);
  }
  return measurements.filter(m => m.partId === partId);
}
