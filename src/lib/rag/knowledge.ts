export interface TechnicalDocumentCitation {
  id: string;
  docTitle: string;
  docCode: string; // e.g. "Siemens D 81.1 • 2024"
  section: string;
  page: number;
  topic: 'cooling' | 'derating' | 'cable_length' | 'atex' | 'energy_efficiency' | 'encoder_control';
  keywords: string[];
  excerpt: string;
  siemensGuidelineSummary: string;
}

export const SIEMENS_TECHNICAL_KNOWLEDGE_BASE: TechnicalDocumentCitation[] = [
  {
    id: 'doc-ic71w-water-cooling',
    docTitle: 'SIMOTICS FD / 1LM1 Technical Manual: Water-Jacket Cooling System Design',
    docCode: 'Siemens Manual D 81.1 • Edition 2024',
    section: 'Section 3.4.2: Liquid Cooling Circuits & Chiller Interface',
    page: 47,
    topic: 'cooling',
    keywords: ['water', 'cooling', 'chiller', 'ic71w', 'flow rate', 'temperature', 'liquid', 'silent', 'heat'],
    excerpt: 'Motors designed with cooling method IC71W (water-cooled jacket) require a continuous cooling medium circulation at an inlet temperature between +5°C and +30°C. For a 15 kW machine, a minimum coolant flow rate of 8.0 L/min at 1.5 bar differential pressure is mandatory. Operation without an active closed-circuit re-cooling unit or cold water supply will exceed stator insulation thermal limits within 180 seconds, triggering irreversible thermal trip.',
    siemensGuidelineSummary: 'Water-cooled motors (1LM1 series) must be paired with an active re-cooling unit (e.g. 6SY8101 5kW) or an existing plant chiller network.'
  },
  {
    id: 'doc-dudt-filter-cable-length',
    docTitle: 'SINAMICS G120 / S120 Engineering Guide: Long Motor Cables & Wave Reflection',
    docCode: 'Siemens Drive Technology Doc GH1 • 2023',
    section: 'Section 6.1.4: Reflected Wave Phenomena & du/dt Voltage Limitation',
    page: 112,
    topic: 'cable_length',
    keywords: ['cable', 'filter', 'dudt', 'length', '50m', 'voltage spike', 'insulation', 'reflection'],
    excerpt: 'Fast-switching IGBT inverters produce steep voltage rise rates (du/dt exceeding 5 kV/µs). On unshielded or shielded motor cables exceeding 50 meters, transmission line impedance mismatches cause wave reflections that double the peak voltage at the motor terminals (up to 1,600 V). In accordance with IEC 60034-25, a du/dt filter with voltage peak limiter (6SL3000) must be inserted at the inverter output to dampen rise rates below 500 V/µs and protect winding enamel.',
    siemensGuidelineSummary: 'Whenever motor cable run exceeds 50 meters, a du/dt filter (e.g. 6SL3000-2DE23) is mandatory to prevent motor insulation breakdown.'
  },
  {
    id: 'doc-ambient-derating-pm240',
    docTitle: 'SINAMICS G120 Power Module PM240-2 Hardware Installation & Engineering',
    docCode: 'Siemens Manual A5E33294624 • Rev 2024',
    section: 'Section 7.2: Environmental Constraints & Current De-Rating',
    page: 89,
    topic: 'derating',
    keywords: ['ambient', 'temperature', 'derating', 'current', 'thermal', '40c', '50c', 'overload'],
    excerpt: 'The rated continuous output current of PM240-2 power units is specified for an ambient temperature range of -20°C to +40°C. At ambient temperatures between +40°C and +55°C, the permissible output current must be de-rated by 1.5% per Kelvin temperature rise. If ambient operating conditions reach 50°C, the inverter can only supply 85% of its nominal rated current. The engineering team must upsize the power module to the next higher rating if continuous current draw exceeds the de-rated threshold.',
    siemensGuidelineSummary: 'Above 40°C ambient, de-rate inverter capacity by 1.5% per °C. Upsize frame size if effective current is less than motor requirement.'
  },
  {
    id: 'doc-atex-zone-protection',
    docTitle: 'Explosion-Protected Drive Systems according to ATEX Directive 2014/34/EU',
    docCode: 'Siemens Compendium E20001-A120-P000',
    section: 'Section 4.1: Selection of SIMOTICS XP in Gas and Dust Hazardous Atmospheres',
    page: 24,
    topic: 'atex',
    keywords: ['atex', 'explosion', 'zone', 'hazard', 'hazardous', 'chemical', 'flameproof', 'ptc'],
    excerpt: 'In Zone 1 (flammable gas/vapor) or Zone 21 (conductive dust) environments, explosion-proof motors (SIMOTICS XP 1MB series) with Ex db eb IIC T4 Gb protection type are required by law. Inverter operation in hazardous areas demands certified motor temperature monitoring. Certified PTC thermistor sensors embedded into the motor windings must be connected to a certified evaluation unit with Safe Torque Off (STO) certified according to EN ISO 13849-1 PL e.',
    siemensGuidelineSummary: 'Hazardous environments require SIMOTICS XP (1MB) certified motors paired with certified PTC thermistor monitoring relays.'
  },
  {
    id: 'doc-ie4-efficiency-lifecycle',
    docTitle: 'EcoDesign Regulation EU 2019/1781 & Industrial Energy Optimization',
    docCode: 'Siemens White Paper WP-EE-04 • 2024',
    section: 'Section 2: Total Cost of Ownership (TCO) Comparison: IE3 vs IE4',
    page: 15,
    topic: 'energy_efficiency',
    keywords: ['ie3', 'ie4', 'efficiency', 'energy', 'tco', 'cost', 'green', 'savings', 'kwh'],
    excerpt: 'Over a 10-year operating horizon, purchase price accounts for only 2.5% of total electric motor lifecycle cost, whereas energy consumption accounts for 94.5%. Upgrading a continuous 15 kW motor (operating 6,000 hours per annum at €0.18/kWh) from IE3 (92.1% efficiency) to IE4 (93.9% efficiency) yields annual electricity savings of approximately €835. The extra capital expense of an IE4 motor amortizes within 11.8 months.',
    siemensGuidelineSummary: 'IE4 Super-Premium motors pay for themselves in under 12 months for continuous duty applications through lower electrical consumption.'
  },
  {
    id: 'doc-cu-encoder-feedback',
    docTitle: 'SINAMICS Control Units CU240E-2 vs CU250S-2 Application Comparison',
    docCode: 'Siemens System Manual D 31.1 • 2024',
    section: 'Section 5.3: Closed-Loop Vector Control & Encoder Interfaces',
    page: 63,
    topic: 'encoder_control',
    keywords: ['encoder', 'closed-loop', 'vector', 'cu240e', 'cu250s', 'positioning', 'feedback', 'htl'],
    excerpt: 'The CU240E-2 control unit is designed exclusively for sensorless vector control (SLVC) and V/f characteristics. For dynamic speed control down to 0 RPM, position control, or precision torque regulation, an optical encoder (HTL or TTL) must be interfaced. This requires upgrading the control unit to CU250S-2 PN, which includes integrated hardware encoder evaluation and the basic positioner (EPos) functionality.',
    siemensGuidelineSummary: 'For closed-loop speed/position control, CU250S-2 PN or CU310-2 with rotary encoder is strictly required; CU240E-2 does not support encoder inputs.'
  }
];

export function searchTechnicalDocumentation(query: string): TechnicalDocumentCitation[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

  const scoredDocs = SIEMENS_TECHNICAL_KNOWLEDGE_BASE.map(doc => {
    let score = 0;
    for (const word of queryWords) {
      if (doc.keywords.some(k => k.includes(word) || word.includes(k))) score += 5;
      if (doc.docTitle.toLowerCase().includes(word)) score += 4;
      if (doc.excerpt.toLowerCase().includes(word)) score += 2;
      if (doc.siemensGuidelineSummary.toLowerCase().includes(word)) score += 3;
    }
    return { doc, score };
  });

  return scoredDocs
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.doc)
    .slice(0, 3);
}
