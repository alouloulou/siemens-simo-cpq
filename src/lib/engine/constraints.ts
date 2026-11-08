import { IndustrialProduct, SIEMENS_PRODUCT_CATALOG } from '../catalog/products';

export interface CustomerRequirements {
  powerKW: number;
  voltageV: number;
  cooling?: 'Air (IC411)' | 'Water (IC71W)' | 'Any';
  efficiency?: 'IE3' | 'IE4' | 'Any';
  atexRequired?: boolean;
  atexZone?: 'Zone 1/21' | 'Zone 2/22';
  cableLengthMeters?: number;
  ambientTempC?: number;
  closedLoopFeedback?: boolean;
  communicationProtocol?: 'PROFINET' | 'PROFIBUS' | 'EtherNet/IP';
  dynamicBraking?: boolean;
  customerTier?: 'Standard (0%)' | 'OEM Partner (12%)' | 'Strategic Enterprise (20%)';
}

export interface ConstraintAuditResult {
  ruleId: string;
  category: 'electrical' | 'thermal' | 'safety_atex' | 'mechanical_cable' | 'control_interface';
  passed: boolean;
  title: string;
  message: string;
  normReference?: string;
  recommendedAction?: string;
}

export interface PriceBreakdown {
  items: {
    productId: string;
    orderNumber: string;
    name: string;
    category: string;
    quantity: number;
    unitPriceEUR: number;
    totalPriceEUR: number;
  }[];
  subtotalEUR: number;
  discountPercentage: number;
  discountAmountEUR: number;
  netTotalEUR: number;
  vatEUR: number;
  grossTotalEUR: number;
}

export interface ValidationSummary {
  isValid: boolean;
  overallStatus: 'COMPATIBLE' | 'INVALID_CONSTRAINTS' | 'MISSING_COMPONENTS';
  score: number; // 0 to 100
  checks: ConstraintAuditResult[];
  pricing: PriceBreakdown;
  selectedBOM: IndustrialProduct[];
  missingComponents: string[];
}

export function validateConfigurationConstraints(
  requirements: CustomerRequirements,
  selectedComponentIds: string[]
): ValidationSummary {
  const selectedBOM = selectedComponentIds
    .map(id => SIEMENS_PRODUCT_CATALOG.find(p => p.id === id))
    .filter((p): p is IndustrialProduct => p !== undefined);

  const checks: ConstraintAuditResult[] = [];
  const missingComponents: string[] = [];

  const motor = selectedBOM.find(p => p.category === 'motor');
  const inverter = selectedBOM.find(p => p.category === 'inverter');
  const controlUnit = selectedBOM.find(p => p.category === 'control_unit');
  const encoder = selectedBOM.find(p => p.category === 'encoder');
  const accessories = selectedBOM.filter(p => p.category === 'accessory');

  // Check component presence
  if (!motor) {
    missingComponents.push('Motor (SIMOTICS Series)');
  }
  if (!inverter) {
    missingComponents.push('Power Inverter (SINAMICS Series)');
  }
  if (!controlUnit && inverter?.series !== 'SINAMICS G120X') {
    missingComponents.push('Control Unit (e.g. CU240E-2 or CU250S-2)');
  }

  // --- RULE 1: Motor Power & Voltage Match ---
  if (motor) {
    const powerOk = motor.powerKW! >= requirements.powerKW;
    checks.push({
      ruleId: 'ELEC-01',
      category: 'electrical',
      passed: powerOk,
      title: 'Motor Continuous Power Rating',
      message: powerOk
        ? `Motor continuous power (${motor.powerKW} kW) meets or exceeds requirement of ${requirements.powerKW} kW.`
        : `Motor continuous power (${motor.powerKW} kW) is insufficient for specified load requirement (${requirements.powerKW} kW).`,
      normReference: 'IEC 60034-1'
    });

    const voltageOk = motor.voltageV === requirements.voltageV;
    checks.push({
      ruleId: 'ELEC-02',
      category: 'electrical',
      passed: voltageOk,
      title: 'Supply Voltage Level',
      message: voltageOk
        ? `Motor nominal voltage (3AC ${motor.voltageV}V) is identical to grid specification.`
        : `Voltage mismatch: Motor is rated for ${motor.voltageV}V but grid is ${requirements.voltageV}V.`,
      normReference: 'IEC 60038'
    });
  }

  // --- RULE 2: Inverter Current Sizing & Ambient Derating ---
  if (motor && inverter) {
    const ambientTemp = requirements.ambientTempC || 40;
    // Derating: 1.5% per °C above 40°C
    const deratePercent = ambientTemp > 40 ? (ambientTemp - 40) * 1.5 : 0;
    const deratingFactor = Math.max(0.6, 1 - deratePercent / 100);
    const effectiveInverterCurrent = (inverter.ratedCurrentA || 0) * deratingFactor;
    const requiredMotorCurrent = (motor.ratedCurrentA || 0) * 1.05; // 5% safety margin

    const currentSizingOk = effectiveInverterCurrent >= requiredMotorCurrent;
    checks.push({
      ruleId: 'ELEC-03',
      category: 'electrical',
      passed: currentSizingOk,
      title: 'Inverter Current Capacity & Thermal Derating',
      message: currentSizingOk
        ? `Inverter effective current capacity (${effectiveInverterCurrent.toFixed(1)}A at ${ambientTemp}°C) comfortably handles motor rated current (${(motor.ratedCurrentA || 0).toFixed(1)}A with 5% margin).`
        : `Inverter current bottleneck! Effective capacity at ${ambientTemp}°C is ${effectiveInverterCurrent.toFixed(1)}A, but motor draws ${(motor.ratedCurrentA || 0).toFixed(1)}A (requires ${requiredMotorCurrent.toFixed(1)}A). Upsize to next frame size.`,
      normReference: 'EN 61800-5-1',
      recommendedAction: currentSizingOk ? undefined : 'Select a higher-tier inverter module (e.g. 22 kW PM240-2).'
    });
  }

  // --- RULE 3: Thermal & Cooling System Validation ---
  if (motor) {
    if (motor.coolingType === 'Water (IC71W)') {
      const hasChiller = accessories.some(a => a.id === 'acc-recooling-water-5kw');
      checks.push({
        ruleId: 'THERM-01',
        category: 'thermal',
        passed: hasChiller,
        title: 'Water Jacket Coolant Loop Integrity',
        message: hasChiller
          ? `Closed-loop active water chiller unit (6SY8101 5kW) verified. Flow rate and heat dissipation capacity matched to IC71W jacket.`
          : `Water-cooled motor (IC71W) selected without active chiller unit! Operating without closed-circuit chiller will cause thermal tripping within minutes.`,
        normReference: 'DIN EN 60034-6 (IC71W)',
        recommendedAction: hasChiller ? undefined : 'Add Active Closed-Circuit Water Chiller (6SY8101) to Bill of Materials.'
      });
    } else {
      checks.push({
        ruleId: 'THERM-01',
        category: 'thermal',
        passed: true,
        title: 'Standard Surface Cooling Verification',
        message: `Air-cooled surface fin cooling (IC411) verified. Permissible for ambient environments up to 40°C.`,
        normReference: 'DIN EN 60034-6'
      });
    }
  }

  // --- RULE 4: Hazardous Area / ATEX Compliance ---
  if (requirements.atexRequired) {
    const motorAtexOk = motor?.atexCertified === true;
    checks.push({
      ruleId: 'SAFE-01',
      category: 'safety_atex',
      passed: motorAtexOk,
      title: 'ATEX Explosion-Proof Zone Certification',
      message: motorAtexOk
        ? `Motor (${motor?.name}) holds certified Ex db eb IIC T4 Gb approval for hazardous atmospheres.`
        : `Non-ATEX motor selected for hazardous atmosphere! Violates EU Directive 2014/34/EU. Must use SIMOTICS XP series.`,
      normReference: 'ATEX Directive 2014/34/EU / EN 60079',
      recommendedAction: motorAtexOk ? undefined : 'Replace with SIMOTICS XP explosion-proof motor.'
    });

    // In ATEX applications, motor PTC thermistor temperature evaluation is mandatory
    const hasPt1000OrPtc = selectedBOM.some(p => p.id === 'sensor-pt1000-set') || motor?.keyFeatures.some(f => f.includes('PTC'));
    checks.push({
      ruleId: 'SAFE-02',
      category: 'safety_atex',
      passed: Boolean(hasPt1000OrPtc),
      title: 'Certified Thermal Overload Telemetry',
      message: hasPt1000OrPtc
        ? `Certified winding temperature telemetry embedded and routed for safety trip.`
        : `ATEX safety regulations require certified thermal winding monitoring.`,
      normReference: 'EN 60079-14'
    });
  }

  // --- RULE 5: Motor Cable Length & du/dt Voltage Reflection ---
  const cableLength = requirements.cableLengthMeters || 15;
  if (cableLength > 50) {
    const hasDuDt = accessories.some(a => a.id === 'acc-dudt-filter-15kw');
    checks.push({
      ruleId: 'MECH-01',
      category: 'mechanical_cable',
      passed: hasDuDt,
      title: 'Long Cable du/dt Voltage Peak Limitation',
      message: hasDuDt
        ? `Motor cable length is ${cableLength}m. du/dt filter with voltage peak limiter installed, keeping transient spikes <500 V/µs.`
        : `Motor cable length is ${cableLength}m (>50m threshold). Long cable reflections will subject motor windings to destructive voltage spikes up to 1600V! A du/dt filter is mandatory.`,
      normReference: 'IEC 60034-25 / VDE 0532',
      recommendedAction: hasDuDt ? undefined : 'Add du/dt Filter with Voltage Peak Limiter (6SL3000) to BOM.'
    });
  } else {
    checks.push({
      ruleId: 'MECH-01',
      category: 'mechanical_cable',
      passed: true,
      title: 'Motor Cable Length Permissibility',
      message: `Motor cable run (${cableLength}m) is within standard 50m limit without requiring extra du/dt filter.`,
      normReference: 'SINAMICS G120 Manual Ch. 4'
    });
  }

  // --- RULE 6: Closed-Loop / Encoder Compatibility ---
  if (requirements.closedLoopFeedback) {
    const hasEncoder = encoder !== undefined;
    const cuSupportsEncoder = controlUnit?.id === 'cu-250s-2-pn' || controlUnit?.id === 'cu-310-2-pn';

    checks.push({
      ruleId: 'CTRL-01',
      category: 'control_interface',
      passed: hasEncoder && cuSupportsEncoder,
      title: 'Closed-Loop Speed/Positioning Feedback',
      message: (hasEncoder && cuSupportsEncoder)
        ? `Rotary encoder paired with closed-loop vector control unit (${controlUnit?.name}). Dynamic speed accuracy ±0.01% guaranteed.`
        : `Closed-loop feedback requested, but either encoder is missing or control unit lacks encoder interface (CU240E-2 is sensorless only). Need CU250S-2 PN + Encoder.`,
      normReference: 'SINAMICS Motion Control Spec',
      recommendedAction: (hasEncoder && cuSupportsEncoder) ? undefined : 'Select CU250S-2 PN control unit and HTL/Absolute Encoder.'
    });
  }

  // --- RULE 7: Dynamic Braking Resistor ---
  if (requirements.dynamicBraking) {
    const hasBrakingResistor = accessories.some(a => a.id === 'acc-braking-resistor-15kw');
    checks.push({
      ruleId: 'ELEC-04',
      category: 'electrical',
      passed: hasBrakingResistor,
      title: 'Dynamic Braking & Energy Dissipation',
      message: hasBrakingResistor
        ? `External dynamic braking resistor verified. Enables rapid deceleration without inverter DC link overvoltage trip (F0002).`
        : `Dynamic braking requested for regenerative load, but external braking resistor is missing.`,
      normReference: 'SINAMICS Hardware Installation Guide',
      recommendedAction: hasBrakingResistor ? undefined : 'Add Braking Resistor (6SL3201-0BE23-8AA0) to Bill of Materials.'
    });
  }

  // --- PRICING CALCULATION (Deterministic, Zero Hallucination) ---
  const discountRate = requirements.customerTier === 'Strategic Enterprise (20%)'
    ? 0.20
    : requirements.customerTier === 'OEM Partner (12%)'
      ? 0.12
      : 0.0;

  const items = selectedBOM.map(p => ({
    productId: p.id,
    orderNumber: p.orderNumber,
    name: p.name,
    category: p.category,
    quantity: 1,
    unitPriceEUR: p.basePriceEUR,
    totalPriceEUR: p.basePriceEUR
  }));

  const subtotalEUR = items.reduce((sum, item) => sum + item.totalPriceEUR, 0);
  const discountAmountEUR = Math.round(subtotalEUR * discountRate);
  const netTotalEUR = subtotalEUR - discountAmountEUR;
  const vatEUR = Math.round(netTotalEUR * 0.20); // 20% Austrian/EU VAT standard
  const grossTotalEUR = netTotalEUR + vatEUR;

  const pricing: PriceBreakdown = {
    items,
    subtotalEUR,
    discountPercentage: Math.round(discountRate * 100),
    discountAmountEUR,
    netTotalEUR,
    vatEUR,
    grossTotalEUR
  };

  const failedChecks = checks.filter(c => !c.passed);
  const isValid = failedChecks.length === 0 && missingComponents.length === 0;
  const passedCount = checks.filter(c => c.passed).length;
  const score = checks.length > 0 ? Math.round((passedCount / checks.length) * 100) : 0;

  let overallStatus: ValidationSummary['overallStatus'] = 'COMPATIBLE';
  if (missingComponents.length > 0) {
    overallStatus = 'MISSING_COMPONENTS';
  } else if (!isValid) {
    overallStatus = 'INVALID_CONSTRAINTS';
  }

  return {
    isValid,
    overallStatus,
    score,
    checks,
    pricing,
    selectedBOM,
    missingComponents
  };
}

// Generate deterministic alternative configurations (e.g. Standard Air vs Super Premium vs Water-Cooled)
export function getRecommendedAlternativeConfigurations(requirements: CustomerRequirements): {
  id: string;
  name: string;
  tag: string;
  componentIds: string[];
  totalPriceEUR: number;
  highlightDifference: string;
}[] {
  const power = requirements.powerKW || 15;

  if (power <= 15) {
    return [
      {
        id: 'alt-water-compact',
        name: 'High-Density Water-Cooled Silent Package',
        tag: 'Recommended for Extruders / Confined Cabinets',
        componentIds: [
          'mot-1lm1203-15kw-water-ie4',
          'inv-pm240-2-15kw',
          'cu-240e-2-pn',
          'acc-recooling-water-5kw'
        ],
        totalPriceEUR: 4650 + 1850 + 410 + 1650,
        highlightDifference: 'IE4 Super-Premium with active liquid chiller. 30% smaller volume, noise <68 dB.'
      },
      {
        id: 'alt-standard-air-ie3',
        name: 'Cost-Optimized Standard Air-Cooled Package',
        tag: 'Lowest Capex / Standard Plant Operating Conditions',
        componentIds: [
          'mot-1le1001-15kw-air-ie3',
          'inv-pm240-2-15kw',
          'cu-240e-2-pn'
        ],
        totalPriceEUR: 2450 + 1850 + 410,
        highlightDifference: 'Standard aluminum frame, air fin cooling (IC411). Zero chiller maintenance required.'
      },
      {
        id: 'alt-severe-duty-ie4',
        name: 'Severe Duty Cast-Iron Long-Life Package',
        tag: 'Continuous Process / Chemical / Paper Industry',
        componentIds: [
          'mot-1le1503-15kw-air-ie4',
          'inv-pm240-2-15kw',
          'cu-240e-2-pn',
          'acc-line-reactor-15kw'
        ],
        totalPriceEUR: 3280 + 1850 + 410 + 210,
        highlightDifference: 'Rugged cast-iron housing, reinforced bearings, line reactor for grid harmonic damping.'
      }
    ];
  } else {
    return [
      {
        id: 'alt-22kw-water',
        name: '22 kW Liquid-Cooled Heavy Duty Extruder Drive',
        tag: 'High Torque Density',
        componentIds: [
          'mot-1lm1205-22kw-water-ie4',
          'inv-pm240-2-22kw',
          'cu-240e-2-pn',
          'acc-recooling-water-5kw'
        ],
        totalPriceEUR: 5890 + 2420 + 410 + 1650,
        highlightDifference: 'Water-cooled 22 kW package for space-constrained machine beds.'
      },
      {
        id: 'alt-22kw-air-standard',
        name: '22 kW Standard Air-Cooled Package',
        tag: 'Standard Plant Machinery',
        componentIds: [
          'mot-1le1001-22kw-air-ie3',
          'inv-pm240-2-22kw',
          'cu-240e-2-pn'
        ],
        totalPriceEUR: 3340 + 2420 + 410,
        highlightDifference: 'Standard IE3 aluminum drive with 45A inverter capacity.'
      }
    ];
  }
}
