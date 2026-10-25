/**
 * Jenefas Mount Finder & Compatibility Engine
 * Grounded in manufacturer-verified specifications and strict provenance gating.
 */

export function checkProductVesaSupport(product, targetVesa) {
  if (!targetVesa || targetVesa === 'unknown') return { status: 'unknown' };
  const [tW, tH] = targetVesa.split('x').map(n => parseInt(n, 10));
  if (!tW || !tH) return { status: 'unknown' };

  const str = product.vesa || '';
  const matches = str.match(/(\d+)x(\d+)/g);
  let maxW = 0, maxH = 0;
  let explicitlyListed = false;

  if (matches) {
    for (const m of matches) {
      const [w, h] = m.split('x').map(Number);
      if (w === tW && h === tH) explicitlyListed = true;
      if (w > maxW) maxW = w;
      if (h > maxH) maxH = h;
    }
  }

  // If target exceeds max dimensions, definite failure
  if (maxW > 0 && maxH > 0 && (tW > maxW || tH > maxH)) {
    return { status: 'fail', maxW, maxH };
  }

  if (explicitlyListed || (tW <= maxW && tH <= maxH && (str.toLowerCase().includes('up to') || str.toLowerCase().includes('to')))) {
    return { status: 'pass', maxW, maxH };
  }

  if (tW <= maxW && tH <= maxH) {
    return { status: 'pass', maxW, maxH };
  }

  return { status: 'fail', maxW, maxH };
}

export function getProductMaxLoadKg(product) {
  if (!product.maxLoad) return null;
  const match = product.maxLoad.match(/(\d+)\s*kg/i);
  return match ? parseInt(match[1], 10) : null;
}

export function evaluateProductCompatibility(product, answers = {}) {
  const surface = answers.surface || 'wall';
  let hasFail = false;
  let hasUnknown = false;
  const checks = [];

  // VESA Check for display mounting products
  if (['wall', 'ceiling', 'tabletop', 'desk'].includes(surface)) {
    if (!answers.vesa || answers.vesa === 'unknown') {
      hasUnknown = true;
      checks.push({ name: 'VESA Pattern', status: 'unknown', note: 'Customer VESA unknown' });
    } else {
      const vesaRes = checkProductVesaSupport(product, answers.vesa);
      if (vesaRes.status === 'fail') {
        hasFail = true;
        checks.push({ name: `VESA ${answers.vesa}`, status: 'fail', note: 'Exceeds mount limit' });
      } else if (vesaRes.status === 'unknown') {
        hasUnknown = true;
        checks.push({ name: `VESA ${answers.vesa}`, status: 'unknown', note: 'Awaiting confirmation' });
      } else {
        // Strict provenance gating: If the product itself is from internal planning taxonomy or unconfirmed, cannot issue affirmative 'pass'
        if (product.sourceType === 'internal_planning_taxonomy' ||
            product.specifications?.vesa?.status === 'unconfirmed_planning_estimate' ||
            product.specifications?.vesa?.status === 'unconfirmed_estimate') {
          hasUnknown = true;
          checks.push({ name: `VESA ${answers.vesa}`, status: 'unknown', note: 'Within planning estimate, awaits factory spec sheet' });
        } else {
          checks.push({ name: `VESA ${answers.vesa}`, status: 'pass', note: 'Supported' });
        }
      }
    }
  }

  // Display Weight Check
  if (answers.weightUnknown || answers.weightKg === null || answers.weightKg === undefined) {
    hasUnknown = true;
    checks.push({ name: 'Display Weight', status: 'unknown', note: 'Weight unknown' });
  } else {
    const maxKg = getProductMaxLoadKg(product);
    if (maxKg === null) {
      hasUnknown = true;
      checks.push({ name: `Weight (${answers.weightKg} kg)`, status: 'unknown', note: 'Load rating awaiting test data' });
    } else if (answers.weightKg > maxKg) {
      hasFail = true;
      checks.push({ name: `Weight (${answers.weightKg} kg)`, status: 'fail', note: `Exceeds ${maxKg} kg load limit` });
    } else {
      // Within limit, check provenance
      if (product.specifications?.maxLoad?.status === 'unconfirmed_planning_estimate') {
        hasUnknown = true;
        checks.push({ name: `Weight (${answers.weightKg} kg)`, status: 'unknown', note: `Within estimated ${maxKg} kg limit; requires certification` });
      } else {
        checks.push({ name: `Weight (${answers.weightKg} kg)`, status: 'pass', note: 'Within verified rating' });
      }
    }
  }

  // Screen Size Check (Supplementary only, never overrides VESA or weight)
  if (answers.sizeGroup) {
    if (product.sizeGroup !== answers.sizeGroup && product.sizeGroup !== 'Universal') {
      checks.push({ name: `Screen Size (${answers.sizeGroup})`, status: 'unknown', note: 'Differs from nominal screen guide' });
    } else {
      checks.push({ name: `Screen Size (${answers.sizeGroup})`, status: 'pass', note: 'Within nominal screen guide' });
    }
  }

  let finalState = 'meets_spec';
  if (hasFail) {
    finalState = 'fails_spec';
  } else if (hasUnknown) {
    finalState = 'more_info_needed';
  }

  return {
    state: finalState,
    checks,
  };
}

export function cleanIncompatibleAnswers(prevCategory, newCategory, state = {}) {
  const cleaned = { ...state };
  cleaned.surface = newCategory;

  if (prevCategory !== newCategory) {
    // Clear category-specific settings
    delete cleaned.motion;
    delete cleaned.tabletopBase;
    delete cleaned.tabletopDepth;
    delete cleaned.deskThickness;
    delete cleaned.deskThicknessUnknown;
    delete cleaned.deskDisplays;
    delete cleaned.otherType;

    // Default category-specific fields for new category
    if (newCategory === 'desk') {
      cleaned.deskDisplays = 'single';
    } else if (newCategory === 'other') {
      cleaned.otherType = 'projector';
    }
  }

  return cleaned;
}

export function evaluateClampDeskSupport(clampMeasurements, deskThicknessMm) {
  if (deskThicknessMm === null || deskThicknessMm === undefined) {
    return { status: 'unknown', reason: 'Desk thickness not provided' };
  }
  const deskRecord = clampMeasurements.find(m => m.id === 'supportedDeskThickness');
  const clampOpening = clampMeasurements.find(m => m.id === 'clampOpening');

  if (!deskRecord) {
    return { status: 'unknown', reason: 'No supported desk thickness record' };
  }

  const { min, max } = deskRecord;
  if (deskThicknessMm < min) {
    return {
      status: 'fail',
      reason: `Desk thickness ${deskThicknessMm} mm is less than minimum safe thickness ${min} mm`,
    };
  }
  if (deskThicknessMm > max) {
    // Check if within clamp opening mechanical limit
    const clampMax = clampOpening ? clampOpening.max : max;
    const isUnderMechanical = deskThicknessMm <= clampMax;
    return {
      status: 'fail',
      isUnderMechanicalClearance: isUnderMechanical,
      reason: `Desk thickness ${deskThicknessMm} mm exceeds safe supported maximum ${max} mm (mechanical clamp opening: ${clampMax} mm)`,
    };
  }

  return {
    status: 'pass',
    reason: `Desk thickness ${deskThicknessMm} mm is within safe supported range ${min}-${max} mm`,
  };
}

export const VERIFIED_WHATSAPP_NUMBER = '919840817220';

export function buildWhatsAppEnquiry(productOrTitle, answers = {}, customerDetails = {}, originUrl = 'https://jenefas.netlify.app/') {
  const surface = answers.surface || 'General';
  const vesa = answers.vesa || 'Not specified';
  const weight = answers.weightUnknown ? 'Unknown' : (answers.weightKg ? `${answers.weightKg} kg` : 'Not specified');
  const motion = answers.motion || 'No preference';
  const model = answers.model || 'Not provided';

  const buyerName = customerDetails.name || 'Anonymous Inquiry';
  const company = customerDetails.company || 'N/A';
  const mobile = customerDetails.phone || 'Not provided';
  const qty = customerDetails.quantity || 'Dealer quotation';
  const city = customerDetails.city || 'Tamil Nadu';
  const notes = customerDetails.notes || 'Please confirm bracket compatibility and wholesale price.';

  const text = `*New Wholesale & Compatibility Enquiry from Jenefas Platform*\n\n` +
               `• *Product / Archetype:* ${productOrTitle}\n` +
               `• *Sales Desk:* +91 98408 17220 (Ritchie Street Showroom, Chennai)\n` +
               `• *Reference Page:* ${originUrl}\n\n` +
               `*Finder Specifications Checked:*\n` +
               `• *Mounting Location:* ${surface}\n` +
               `• *VESA Pattern:* ${vesa}\n` +
               `• *Display Weight:* ${weight}\n` +
               `• *Movement Preference:* ${motion}\n` +
               `• *Customer TV Model:* ${model}\n\n` +
               `*Customer Details:*\n` +
               `• *Buyer Name:* ${buyerName}\n` +
               `• *Company / Shop:* ${company}\n` +
               `• *Mobile:* ${mobile}\n` +
               `• *Quantity Required:* ${qty}\n` +
               `• *Location:* ${city}\n` +
               `• *Additional Notes:* ${notes}`;

  const encoded = encodeURIComponent(text);
  const waUrl = `https://wa.me/${VERIFIED_WHATSAPP_NUMBER}?text=${encoded}`;

  return {
    destination: VERIFIED_WHATSAPP_NUMBER,
    text,
    waUrl,
  };
}

// Attach to window if running in browser
if (typeof window !== 'undefined') {
  window.checkProductVesaSupport = checkProductVesaSupport;
  window.getProductMaxLoadKg = getProductMaxLoadKg;
  window.evaluateProductCompatibility = evaluateProductCompatibility;
  window.cleanIncompatibleAnswers = cleanIncompatibleAnswers;
  window.evaluateClampDeskSupport = evaluateClampDeskSupport;
  window.buildWhatsAppEnquiry = buildWhatsAppEnquiry;
  window.VERIFIED_WHATSAPP_NUMBER = VERIFIED_WHATSAPP_NUMBER;
}
