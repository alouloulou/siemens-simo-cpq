import { GoogleGenAI } from '@google/genai';
import { SIEMENS_PRODUCT_CATALOG, IndustrialProduct } from '../catalog/products';
import {
  CustomerRequirements,
  validateConfigurationConstraints,
  getRecommendedAlternativeConfigurations,
  ValidationSummary
} from '../engine/constraints';
import { searchTechnicalDocumentation, TechnicalDocumentCitation } from '../rag/knowledge';

export interface AgentActivityStep {
  id: string;
  timestamp: string;
  stepNumber: number;
  toolName: string;
  toolInput: Record<string, unknown>;
  toolOutputSummary: string;
  status: 'executing' | 'success' | 'warning' | 'error';
  reasoning: string;
}

export interface AgentExecutionResult {
  naturalLanguageResponse: string;
  activitySteps: AgentActivityStep[];
  parsedRequirements: CustomerRequirements;
  validation: ValidationSummary;
  ragCitations: TechnicalDocumentCitation[];
  alternatives: ReturnType<typeof getRecommendedAlternativeConfigurations>;
  missingRequirementsQuestions?: string[];
}

// Tool 1: Catalog Search
function toolSearchCatalog(args: {
  category?: string;
  minPowerKW?: number;
  cooling?: string;
  atex?: boolean;
  query?: string;
}): IndustrialProduct[] {
  return SIEMENS_PRODUCT_CATALOG.filter(p => {
    if (args.category && p.category !== args.category) return false;
    if (args.minPowerKW && p.powerKW && p.powerKW < args.minPowerKW) return false;
    if (args.cooling && !p.coolingType.toLowerCase().includes(args.cooling.toLowerCase())) return false;
    if (args.atex !== undefined && p.atexCertified !== args.atex) return false;
    if (args.query) {
      const q = args.query.toLowerCase();
      const match = p.name.toLowerCase().includes(q) ||
                    p.orderNumber.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

export async function runSimoCPQAgent(
  userPrompt: string,
  customerTier: 'Standard (0%)' | 'OEM Partner (12%)' | 'Strategic Enterprise (20%)' = 'Standard (0%)'
): Promise<AgentExecutionResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const activitySteps: AgentActivityStep[] = [];
  let stepCounter = 1;

  // Step 1: Semantic Requirement Extraction with Gemini
  const extractionPrompt = `
You are the Chief AI Solution Architect at Siemens Digital Industries & Drive Technology.
Analyze this industrial customer configuration request and extract engineering parameters as clean JSON:

Customer Request: "${userPrompt}"

Extract these fields accurately:
- powerKW: number (nominal motor power in kW, default 15 if unspecified)
- voltageV: number (supply voltage, e.g. 400, 500, 690)
- cooling: string ('Water (IC71W)' or 'Air (IC411)' or 'Any')
- efficiency: string ('IE3' or 'IE4' or 'Any')
- atexRequired: boolean (true if explosion-proof, hazardous area, refinery, chemicals, dust zone mentioned)
- atexZone: string or null ('Zone 1/21' or 'Zone 2/22')
- cableLengthMeters: number (cable distance between converter cabinet and motor, default 15)
- ambientTempC: number (ambient operating temperature in Celsius, default 35)
- closedLoopFeedback: boolean (true if precision positioning, extruder, encoder, tight speed control mentioned)
- communicationProtocol: string ('PROFINET' or 'PROFIBUS' or 'EtherNet/IP')
- dynamicBraking: boolean (true if high inertia, rapid stopping, braking resistor mentioned)
- missingInformation: string[] (questions to ask user if critical parameters are completely ambiguous)
- engineeringIntent: string (brief explanation of what industrial machine/application this is for)

Return ONLY valid JSON matching this schema, no markdown codeblocks, no commentary.
`;

  const extractResponse = await ai.models.generateContent({
    model: 'gemini-3.5-flash-lite',
    contents: extractionPrompt,
    config: {
      temperature: 0.1,
      responseMimeType: 'application/json'
    }
  });

  let parsedReqs: CustomerRequirements = {
    powerKW: 15,
    voltageV: 400,
    cooling: 'Air (IC411)',
    efficiency: 'IE3',
    atexRequired: false,
    cableLengthMeters: 15,
    ambientTempC: 35,
    closedLoopFeedback: false,
    communicationProtocol: 'PROFINET',
    dynamicBraking: false,
    customerTier
  };
  let missingQuestions: string[] = [];
  let engineeringIntent = 'Industrial Drive Application';

  try {
    const raw = JSON.parse(extractResponse.text || '{}');
    parsedReqs = {
      powerKW: Number(raw.powerKW) || 15,
      voltageV: Number(raw.voltageV) || 400,
      cooling: raw.cooling?.includes('Water') ? 'Water (IC71W)' : 'Air (IC411)',
      efficiency: raw.efficiency || 'IE3',
      atexRequired: Boolean(raw.atexRequired),
      atexZone: raw.atexZone || undefined,
      cableLengthMeters: Number(raw.cableLengthMeters) || 15,
      ambientTempC: Number(raw.ambientTempC) || 35,
      closedLoopFeedback: Boolean(raw.closedLoopFeedback),
      communicationProtocol: raw.communicationProtocol || 'PROFINET',
      dynamicBraking: Boolean(raw.dynamicBraking),
      customerTier
    };
    missingQuestions = Array.isArray(raw.missingInformation) ? raw.missingInformation : [];
    engineeringIntent = raw.engineeringIntent || engineeringIntent;
  } catch (err) {
    console.error('Failed to parse extracted requirements JSON:', err);
  }

  activitySteps.push({
    id: `step-${stepCounter}`,
    timestamp: new Date().toLocaleTimeString(),
    stepNumber: stepCounter++,
    toolName: 'parse_customer_intent',
    toolInput: { userPrompt },
    toolOutputSummary: `Extracted: ${parsedReqs.powerKW} kW, ${parsedReqs.voltageV}V, ${parsedReqs.cooling}, Cable: ${parsedReqs.cableLengthMeters}m, Ambient: ${parsedReqs.ambientTempC}°C, ATEX: ${parsedReqs.atexRequired}`,
    status: 'success',
    reasoning: `Natural language requirement parsed into engineering constraints for: ${engineeringIntent}`
  });

  // Step 2: Catalog Component Search Tool Call
  activitySteps.push({
    id: `step-${stepCounter}`,
    timestamp: new Date().toLocaleTimeString(),
    stepNumber: stepCounter++,
    toolName: 'search_product_catalog',
    toolInput: {
      powerKW: parsedReqs.powerKW,
      cooling: parsedReqs.cooling,
      atex: parsedReqs.atexRequired,
      voltage: parsedReqs.voltageV
    },
    toolOutputSummary: 'Searching SIMOTICS motor series & SINAMICS frequency inverters...',
    status: 'executing',
    reasoning: 'Selecting candidate motor, frequency inverter power module, and control unit from Siemens MLFB catalog.'
  });

  // Select candidates
  const matchingMotors = toolSearchCatalog({
    category: 'motor',
    minPowerKW: parsedReqs.powerKW,
    cooling: parsedReqs.cooling === 'Water (IC71W)' ? 'Water' : undefined,
    atex: parsedReqs.atexRequired ? true : undefined
  });
  const selectedMotor = matchingMotors[0] || SIEMENS_PRODUCT_CATALOG.find(p => p.category === 'motor' && p.powerKW === parsedReqs.powerKW) || SIEMENS_PRODUCT_CATALOG[0];

  // Inverter selection: check if ambient temp de-rating requires upsizing
  const ambient = parsedReqs.ambientTempC || 35;
  const derate = ambient > 40 ? (ambient - 40) * 1.5 : 0;
  const effectiveCapacityNeeded = (selectedMotor.ratedCurrentA || 30) * 1.05;

  let candidateInverters = toolSearchCatalog({
    category: 'inverter',
    minPowerKW: selectedMotor.powerKW
  });

  // If high ambient, check if we need higher kW inverter
  let selectedInverter = candidateInverters[0] || SIEMENS_PRODUCT_CATALOG.find(p => p.category === 'inverter');
  if (derate > 0 && selectedInverter) {
    const effectiveA = (selectedInverter.ratedCurrentA || 32) * (1 - derate / 100);
    if (effectiveA < effectiveCapacityNeeded) {
      // Upsize inverter
      const upsized = SIEMENS_PRODUCT_CATALOG.find(p => p.category === 'inverter' && (p.powerKW || 0) > (selectedInverter?.powerKW || 0));
      if (upsized) selectedInverter = upsized;
    }
  }

  // Control Unit selection: CU250S-2 if closedLoop, else CU240E-2
  const selectedCU = parsedReqs.closedLoopFeedback
    ? SIEMENS_PRODUCT_CATALOG.find(p => p.id === 'cu-250s-2-pn')!
    : SIEMENS_PRODUCT_CATALOG.find(p => p.id === 'cu-240e-2-pn')!;

  const candidateComponentIds: string[] = [selectedMotor.id];
  if (selectedInverter) candidateComponentIds.push(selectedInverter.id);
  if (selectedCU) candidateComponentIds.push(selectedCU.id);

  if (parsedReqs.closedLoopFeedback) {
    candidateComponentIds.push('enc-htl-1024');
  }

  // Check if water cooling needs chiller accessory
  if (selectedMotor.coolingType === 'Water (IC71W)') {
    candidateComponentIds.push('acc-recooling-water-5kw');
  }

  // Check if long cable (>50m) needs du/dt filter
  if ((parsedReqs.cableLengthMeters || 0) > 50) {
    candidateComponentIds.push('acc-dudt-filter-15kw');
  }

  // Check if dynamic braking resistor needed
  if (parsedReqs.dynamicBraking) {
    candidateComponentIds.push('acc-braking-resistor-15kw');
  }

  // Update catalog step
  activitySteps[activitySteps.length - 1].status = 'success';
  activitySteps[activitySteps.length - 1].toolOutputSummary = `Selected primary BOM: ${selectedMotor.name} (${selectedMotor.orderNumber}) + ${selectedInverter?.name} + ${selectedCU?.name} + ${candidateComponentIds.length - 3} auxiliary components.`;

  // Step 3: RAG Retrieval for Technical Norms and Design Documentation
  activitySteps.push({
    id: `step-${stepCounter}`,
    timestamp: new Date().toLocaleTimeString(),
    stepNumber: stepCounter++,
    toolName: 'query_technical_documentation',
    toolInput: {
      query: `${parsedReqs.cooling} ${parsedReqs.cableLengthMeters}m cable ${parsedReqs.ambientTempC}C ambient ${parsedReqs.atexRequired ? 'ATEX' : ''}`
    },
    toolOutputSummary: 'Querying Siemens Engineering Knowledge Base...',
    status: 'executing',
    reasoning: 'Retrieving official Siemens design guidelines for long cable reflections, chiller specifications, and thermal de-rating.'
  });

  const ragCitations = searchTechnicalDocumentation(
    `${parsedReqs.cooling} cable length ${parsedReqs.cableLengthMeters}m ${parsedReqs.ambientTempC}°C ambient ${parsedReqs.atexRequired ? 'ATEX explosion' : ''} ${parsedReqs.closedLoopFeedback ? 'encoder vector' : ''}`
  );

  activitySteps[activitySteps.length - 1].status = 'success';
  activitySteps[activitySteps.length - 1].toolOutputSummary = `Retrieved ${ragCitations.length} official technical citations: ${ragCitations.map(c => c.docCode).join(', ')}`;

  // Step 4: Deterministic Constraint Engine Verification (OR-Tools Logic)
  activitySteps.push({
    id: `step-${stepCounter}`,
    timestamp: new Date().toLocaleTimeString(),
    stepNumber: stepCounter++,
    toolName: 'validate_and_solve_constraints',
    toolInput: {
      requirements: parsedReqs,
      selectedComponentIds: candidateComponentIds
    },
    toolOutputSummary: 'Running symbolic constraint solver across electrical, thermal, and mechanical rules...',
    status: 'executing',
    reasoning: 'Zero-hallucination mathematical verification of voltage, power, cable length, and thermal limits.'
  });

  const validation = validateConfigurationConstraints(parsedReqs, candidateComponentIds);

  activitySteps[activitySteps.length - 1].status = validation.isValid ? 'success' : 'warning';
  activitySteps[activitySteps.length - 1].toolOutputSummary = `Status: ${validation.overallStatus} (${validation.score}/100 score). Passed ${validation.checks.filter(c => c.passed).length}/${validation.checks.length} deterministic rules. Total Net: €${validation.pricing.netTotalEUR.toLocaleString()}`;

  // Step 5: Generate Alternatives
  const alternatives = getRecommendedAlternativeConfigurations(parsedReqs);

  // Step 6: Final Technical Synthesis with Gemini
  const synthesisPrompt = `
You are the Lead Solution Engineer for Siemens Drive Technology presenting a validated industrial product configuration to an engineering client.

Customer Request: "${userPrompt}"
Parsed Engineering Requirements:
${JSON.stringify(parsedReqs, null, 2)}

Selected Bill of Materials:
${validation.selectedBOM.map(p => `- ${p.name} (MLFB: ${p.orderNumber}) - €${p.basePriceEUR}`).join('\n')}

Deterministic Constraint Verification:
Overall: ${validation.overallStatus} (${validation.score}% score)
Rules:
${validation.checks.map(c => `[${c.passed ? 'PASSED' : 'FAILED'}] ${c.title} (${c.ruleId}): ${c.message}`).join('\n')}

Technical Documentation Citations:
${ragCitations.map(c => `- ${c.docTitle} (${c.docCode}, p. ${c.page}): ${c.siemensGuidelineSummary}`).join('\n')}

Pricing Breakdown (Deterministic):
Subtotal: €${validation.pricing.subtotalEUR.toLocaleString()}
Discount (${validation.pricing.discountPercentage}%): -€${validation.pricing.discountAmountEUR.toLocaleString()}
Net Total: €${validation.pricing.netTotalEUR.toLocaleString()}

Please provide a crisp, authoritative executive engineering summary:
1. Recommendation Summary: What components were selected and why they satisfy the customer's operational intent.
2. Engineering & Constraint Compliance: Explicitly highlight how technical constraints (cooling, voltage, current derating, cable du/dt, safety) are met according to Siemens guidelines.
3. Pricing & Deliverables: Highlight the net configuration price and reference the attached Bill of Materials.
Keep the tone professional, technical, direct, and structured with markdown bolding and bullet points.
`;

  const synthesisResponse = await ai.models.generateContent({
    model: 'gemini-3.5-flash-lite',
    contents: synthesisPrompt,
    config: {
      temperature: 0.2
    }
  });

  const naturalLanguageResponse = synthesisResponse.text || 'Configuration compiled and verified successfully.';

  return {
    naturalLanguageResponse,
    activitySteps,
    parsedRequirements: parsedReqs,
    validation,
    ragCitations,
    alternatives,
    missingRequirementsQuestions: missingQuestions.length > 0 ? missingQuestions : undefined
  };
}
