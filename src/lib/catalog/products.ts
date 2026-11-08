export interface IndustrialProduct {
  id: string;
  category: 'motor' | 'inverter' | 'control_unit' | 'encoder' | 'accessory';
  series: string;
  name: string;
  orderNumber: string; // MLFB (Siemens Machine-Readable Product Code)
  powerKW?: number;
  voltageV: number;
  frequencyHz?: number;
  ratedCurrentA?: number;
  ratedSpeedRPM?: number;
  coolingType: 'Air (IC411)' | 'Water (IC71W)' | 'Forced Air (IC416)' | 'Natural (IP20)';
  efficiencyClass?: 'IE1' | 'IE2' | 'IE3' | 'IE4';
  protectionRating: 'IP00' | 'IP20' | 'IP54' | 'IP55' | 'IP65' | 'IP66' | 'IP67';
  mountingType?: 'B3 (Foot)' | 'B5 (Flange)' | 'B35 (Foot & Flange)';
  atexCertified: boolean;
  atexZone?: 'Zone 1/21' | 'Zone 2/22';
  communication?: ('PROFINET' | 'PROFIBUS' | 'EtherNet/IP' | 'Modbus TCP' | 'PROFIsafe')[];
  basePriceEUR: number;
  description: string;
  keyFeatures: string[];
}

export const SIEMENS_PRODUCT_CATALOG: IndustrialProduct[] = [
  // --- SIMOTICS MOTORS ---
  {
    id: 'mot-1le1001-15kw-air-ie3',
    category: 'motor',
    series: 'SIMOTICS GP',
    name: 'SIMOTICS GP 1LE1 General Purpose Motor 15 kW',
    orderNumber: '1LE1001-1DB23-4AA4',
    powerKW: 15,
    voltageV: 400,
    frequencyHz: 50,
    ratedCurrentA: 29.5,
    ratedSpeedRPM: 1475,
    coolingType: 'Air (IC411)',
    efficiencyClass: 'IE3',
    protectionRating: 'IP55',
    mountingType: 'B3 (Foot)',
    atexCertified: false,
    basePriceEUR: 2450,
    description: 'Rugged aluminum low-voltage standard motor for industrial fan, pump, and conveyor continuous operations.',
    keyFeatures: ['IE3 Premium Efficiency', 'Cast aluminum frame', 'Vibration severity grade A', 'Low thermal dissipation']
  },
  {
    id: 'mot-1le1503-15kw-air-ie4',
    category: 'motor',
    series: 'SIMOTICS SD',
    name: 'SIMOTICS SD 1LE1 Severe Duty Motor 15 kW Super-Premium',
    orderNumber: '1LE1503-1DB23-4AF4',
    powerKW: 15,
    voltageV: 400,
    frequencyHz: 50,
    ratedCurrentA: 28.2,
    ratedSpeedRPM: 1480,
    coolingType: 'Air (IC411)',
    efficiencyClass: 'IE4',
    protectionRating: 'IP55',
    mountingType: 'B35 (Foot & Flange)',
    atexCertified: false,
    basePriceEUR: 3280,
    description: 'Heavy cast-iron industrial motor engineered for demanding environments, paper, cement, and chemical process plants.',
    keyFeatures: ['IE4 Super Premium Efficiency', 'Rugged cast-iron housing', 'Reinforced bearing system for high radial loads', 'Extended lifespan']
  },
  {
    id: 'mot-1lm1203-15kw-water-ie4',
    category: 'motor',
    series: 'SIMOTICS FD',
    name: 'SIMOTICS FD Compact Water-Cooled Motor 15 kW',
    orderNumber: '1LM1203-2AB33-4AF4',
    powerKW: 15,
    voltageV: 400,
    frequencyHz: 50,
    ratedCurrentA: 28.0,
    ratedSpeedRPM: 1480,
    coolingType: 'Water (IC71W)',
    efficiencyClass: 'IE4',
    protectionRating: 'IP65',
    mountingType: 'B35 (Foot & Flange)',
    atexCertified: false,
    basePriceEUR: 4650,
    description: 'Ultra-compact, low-noise water-jacket-cooled motor designed for test benches, plastic extruders, and confined spaces.',
    keyFeatures: ['Water-cooled IC71W jacket', 'Up to 30% smaller volume than air-cooled', 'Ultra-silent acoustic profile (<68 dB)', 'IP65 stainless cooling ports']
  },
  {
    id: 'mot-1mb1533-15kw-atex-ie3',
    category: 'motor',
    series: 'SIMOTICS XP',
    name: 'SIMOTICS XP Explosion-Proof Motor 15 kW ATEX Zone 1',
    orderNumber: '1MB1533-1DB23-4AA4',
    powerKW: 15,
    voltageV: 400,
    frequencyHz: 50,
    ratedCurrentA: 30.5,
    ratedSpeedRPM: 1470,
    coolingType: 'Air (IC411)',
    efficiencyClass: 'IE3',
    protectionRating: 'IP66',
    mountingType: 'B3 (Foot)',
    atexCertified: true,
    atexZone: 'Zone 1/21',
    basePriceEUR: 5120,
    description: 'Certified explosion-proof motor for explosive atmospheres, oil & gas refineries, paint shops, and grain silos.',
    keyFeatures: ['ATEX / IECEx certified Zone 1/21 (Ex db eb IIC T4 Gb)', 'Certified PTC temperature sensors embedded', 'Flameproof cast-iron enclosure', 'IP66 extreme sealing']
  },
  {
    id: 'mot-1le1001-22kw-air-ie3',
    category: 'motor',
    series: 'SIMOTICS GP',
    name: 'SIMOTICS GP 1LE1 General Purpose Motor 22 kW',
    orderNumber: '1LE1001-1EB23-4AA4',
    powerKW: 22,
    voltageV: 400,
    frequencyHz: 50,
    ratedCurrentA: 42.0,
    ratedSpeedRPM: 1475,
    coolingType: 'Air (IC411)',
    efficiencyClass: 'IE3',
    protectionRating: 'IP55',
    mountingType: 'B3 (Foot)',
    atexCertified: false,
    basePriceEUR: 3340,
    description: 'Standard 22 kW aluminum housing drive motor for industrial mixing, heavy pumping, and stamping presses.',
    keyFeatures: ['IE3 Premium Efficiency', 'High overload torque capacity', 'PTC thermistors included', 'Modular mounting']
  },
  {
    id: 'mot-1lm1205-22kw-water-ie4',
    category: 'motor',
    series: 'SIMOTICS FD',
    name: 'SIMOTICS FD Compact Water-Cooled Motor 22 kW',
    orderNumber: '1LM1205-2AB33-4AF4',
    powerKW: 22,
    voltageV: 400,
    frequencyHz: 50,
    ratedCurrentA: 40.5,
    ratedSpeedRPM: 1485,
    coolingType: 'Water (IC71W)',
    efficiencyClass: 'IE4',
    protectionRating: 'IP65',
    mountingType: 'B35 (Foot & Flange)',
    atexCertified: false,
    basePriceEUR: 5890,
    description: 'High-torque water-cooled synchronous/induction drive for high power-density industrial machinery.',
    keyFeatures: ['Water-cooled IC71W', 'High torque density', 'Thermal isolation from ambient air', 'Compact frame size 180']
  },
  {
    id: 'mot-1le1001-75kw-air-ie3',
    category: 'motor',
    series: 'SIMOTICS GP',
    name: 'SIMOTICS GP 1LE1 General Purpose Motor 7.5 kW',
    orderNumber: '1LE1001-1CB23-4AA4',
    powerKW: 7.5,
    voltageV: 400,
    frequencyHz: 50,
    ratedCurrentA: 15.2,
    ratedSpeedRPM: 1465,
    coolingType: 'Air (IC411)',
    efficiencyClass: 'IE3',
    protectionRating: 'IP55',
    mountingType: 'B3 (Foot)',
    atexCertified: false,
    basePriceEUR: 1580,
    description: 'Standard 7.5 kW continuous motor for light industrial drives and blowers.',
    keyFeatures: ['IE3 Efficiency', 'Lightweight aluminum', 'Reliable continuous duty S1']
  },

  // --- SINAMICS FREQUENCY INVERTERS / POWER MODULES ---
  {
    id: 'inv-pm240-2-15kw',
    category: 'inverter',
    series: 'SINAMICS G120',
    name: 'SINAMICS G120 PM240-2 Power Module 15 kW (FSD)',
    orderNumber: '6SL3210-1PE23-3AL0',
    powerKW: 15,
    voltageV: 400,
    ratedCurrentA: 32.0, // continuous output current
    coolingType: 'Air (IC411)',
    protectionRating: 'IP20',
    atexCertified: false,
    basePriceEUR: 1850,
    description: 'Standard modular power unit with integrated Class A line filter and braking chopper for cabinet installation.',
    keyFeatures: ['32.0A Continuous rated current', 'Safe Torque Off (STO) certified up to SIL3 / PLe', 'Integrated braking chopper', 'Optimized for vector & V/f control']
  },
  {
    id: 'inv-pm240-2-22kw',
    category: 'inverter',
    series: 'SINAMICS G120',
    name: 'SINAMICS G120 PM240-2 Power Module 22 kW (FSD)',
    orderNumber: '6SL3210-1PE24-5AL0',
    powerKW: 22,
    voltageV: 400,
    ratedCurrentA: 45.0,
    coolingType: 'Air (IC411)',
    protectionRating: 'IP20',
    atexCertified: false,
    basePriceEUR: 2420,
    description: 'Heavy duty 22 kW frequency converter power module for high continuous torque requirements.',
    keyFeatures: ['45.0A Continuous rated current', 'High overload capability (150% for 60s)', 'Integrated braking transistor', 'Compact booksize format']
  },
  {
    id: 'inv-pm240-2-75kw',
    category: 'inverter',
    series: 'SINAMICS G120',
    name: 'SINAMICS G120 PM240-2 Power Module 7.5 kW (FSB)',
    orderNumber: '6SL3210-1PE21-8AL0',
    powerKW: 7.5,
    voltageV: 400,
    ratedCurrentA: 18.0,
    coolingType: 'Air (IC411)',
    protectionRating: 'IP20',
    atexCertified: false,
    basePriceEUR: 1220,
    description: 'Mid-range converter power module for 7.5 kW continuous motors.',
    keyFeatures: ['18.0A Continuous output current', 'Integrated Class A filter', 'Safe Torque Off']
  },
  {
    id: 'inv-s120-booksize-15kw',
    category: 'inverter',
    series: 'SINAMICS S120',
    name: 'SINAMICS S120 Motor Module Booksize 15 kW',
    orderNumber: '6SL3120-1TE23-0AA3',
    powerKW: 15,
    voltageV: 400,
    ratedCurrentA: 30.0,
    coolingType: 'Air (IC411)',
    protectionRating: 'IP20',
    atexCertified: false,
    basePriceEUR: 3150,
    description: 'High-performance servo & multi-axis drive module with ultra-precise positioning and motion control.',
    keyFeatures: ['Ultra-fast current control loop (31.25 µs)', 'DRIVE-CLiQ digital interface', 'Advanced positioning & synchronism', 'Integrated safety Extended Functions']
  },
  {
    id: 'inv-g120x-15kw-ip55',
    category: 'inverter',
    series: 'SINAMICS G120X',
    name: 'SINAMICS G120X Infrastructure Converter 15 kW (IP55)',
    orderNumber: '6SL3220-3YE28-0UF0',
    powerKW: 15,
    voltageV: 400,
    ratedCurrentA: 32.0,
    coolingType: 'Air (IC411)',
    protectionRating: 'IP55',
    atexCertified: false,
    basePriceEUR: 2250,
    description: 'Standalone cabinetless drive certified for pumps, fans, and harsh wastewater environments.',
    keyFeatures: ['IP55 / UL Type 12 wall-mount enclosure', 'Deragging pump cleaning function', 'Multi-pump staging control', 'Built-in DC link choke']
  },

  // --- SINAMICS CONTROL UNITS ---
  {
    id: 'cu-240e-2-pn',
    category: 'control_unit',
    series: 'SINAMICS G120',
    name: 'Control Unit CU240E-2 PN (PROFINET)',
    orderNumber: '6SL3244-0BB12-1FA0',
    voltageV: 24,
    coolingType: 'Natural (IP20)',
    protectionRating: 'IP20',
    atexCertified: false,
    communication: ['PROFINET', 'EtherNet/IP'],
    basePriceEUR: 410,
    description: 'Modular intelligent control head featuring dual-port PROFINET, integrated STO safety, and 6 digital inputs.',
    keyFeatures: ['PROFINET IO & PROFIsafe', 'Integrated Safe Torque Off (SIL3)', 'Sensorless vector control', 'SD card slot for parameter backup']
  },
  {
    id: 'cu-250s-2-pn',
    category: 'control_unit',
    series: 'SINAMICS G120',
    name: 'Control Unit CU250S-2 PN Vector with Encoder Interface',
    orderNumber: '6SL3246-0BA22-1FA0',
    voltageV: 24,
    coolingType: 'Natural (IP20)',
    protectionRating: 'IP20',
    atexCertified: false,
    communication: ['PROFINET', 'PROFIsafe'],
    basePriceEUR: 690,
    description: 'High-end vector control unit with closed-loop encoder evaluation (HTL/TTL/SSI) and basic positioner (EPos).',
    keyFeatures: ['Closed-loop vector control with encoder', 'Basic Positioner (EPos) integrated', 'Dual encoder evaluation interface', 'Extended Safety Functions (SS1, SLS, SDI)']
  },
  {
    id: 'cu-310-2-pn',
    category: 'control_unit',
    series: 'SINAMICS S120',
    name: 'SINAMICS S120 Control Unit CU310-2 PN Single Axis',
    orderNumber: '6SL3040-1LA01-0AA0',
    voltageV: 24,
    coolingType: 'Natural (IP20)',
    protectionRating: 'IP20',
    atexCertified: false,
    communication: ['PROFINET', 'PROFIsafe'],
    basePriceEUR: 820,
    description: 'High-speed motion control unit for SINAMICS S120 Power Modules with servo positioning and DRIVE-CLiQ.',
    keyFeatures: ['DRIVE-CLiQ communication hub', 'Servo control mode for dynamic acceleration', 'High-speed probe inputs', 'Full motion control synchronization']
  },

  // --- ENCODERS & SENSORS ---
  {
    id: 'enc-htl-1024',
    category: 'encoder',
    series: 'SIMOTICS Motion Feedback',
    name: 'HTL Incremental Rotary Encoder 1024 Pulse/Rev',
    orderNumber: '1XP8001-1/1024',
    voltageV: 24,
    coolingType: 'Natural (IP20)',
    protectionRating: 'IP65',
    atexCertified: false,
    basePriceEUR: 340,
    description: 'Heavy duty optical incremental encoder for speed feedback in closed-loop inverter drives.',
    keyFeatures: ['1024 pulses per revolution', 'Differential HTL signal output', 'High noise immunity up to 100m cable']
  },
  {
    id: 'enc-drive-cliq-abs',
    category: 'encoder',
    series: 'DRIVE-CLiQ Feedback',
    name: 'DRIVE-CLiQ Absolute Multiturn 22-bit Encoder',
    orderNumber: '1XP8024-21',
    voltageV: 24,
    coolingType: 'Natural (IP20)',
    protectionRating: 'IP67',
    atexCertified: false,
    basePriceEUR: 780,
    description: 'High-precision digital absolute encoder communicating electronic nameplate directly to SINAMICS S120.',
    keyFeatures: ['22-bit singleturn + 12-bit multiturn', 'Automatic parameter upload via DRIVE-CLiQ', 'Zero homing required after power cycle']
  },
  {
    id: 'sensor-pt1000-set',
    category: 'encoder',
    series: 'Thermal Protection',
    name: 'PT1000 Winding & Bearing Temperature Sensor Set',
    orderNumber: '3RN2012-1BW30',
    voltageV: 24,
    coolingType: 'Natural (IP20)',
    protectionRating: 'IP65',
    atexCertified: false,
    basePriceEUR: 160,
    description: 'Linear platinum temperature sensor elements embedded into motor stator windings for continuous thermal telemetry.',
    keyFeatures: ['Linear PT1000 characteristic curve', '3x Stator winding monitoring', 'Certified motor protection relay interface']
  },

  // --- ACCESSORIES & COOLING UNITS ---
  {
    id: 'acc-recooling-water-5kw',
    category: 'accessory',
    series: 'Industrial Water Cooling',
    name: 'Active Closed-Circuit Water Chiller & Re-Cooling Unit 5 kW',
    orderNumber: '6SY8101-0AA05-0AA0',
    voltageV: 400,
    coolingType: 'Water (IC71W)',
    protectionRating: 'IP54',
    atexCertified: false,
    basePriceEUR: 1650,
    description: 'Dedicated standalone chiller circulating temperature-controlled coolant for water-jacket motors.',
    keyFeatures: ['5 kW heat exchange capacity', 'Integrated coolant pump & pressure reservoir', 'Automatic flow and thermal alarms', 'Corrosion inhibitor compatible']
  },
  {
    id: 'acc-dudt-filter-15kw',
    category: 'accessory',
    series: 'SINAMICS Filter',
    name: 'du/dt Filter with Voltage Peak Limiter 15 kW',
    orderNumber: '6SL3000-2DE23-0AA0',
    voltageV: 400,
    coolingType: 'Air (IC411)',
    protectionRating: 'IP00',
    atexCertified: false,
    basePriceEUR: 490,
    description: 'Mandatory motor protection filter for long motor cable runs (>50m) to limit voltage rise rate to <500 V/µs.',
    keyFeatures: ['Limits du/dt to <500 V/µs', 'Reduces bearing current stress', 'Enables unshielded cables up to 300m', 'Protects motor insulation']
  },
  {
    id: 'acc-braking-resistor-15kw',
    category: 'accessory',
    series: 'SINAMICS Braking',
    name: 'Braking Resistor 15 kW / 5% Continuous Rating',
    orderNumber: '6SL3201-0BE23-8AA0',
    voltageV: 400,
    coolingType: 'Air (IC411)',
    protectionRating: 'IP20',
    atexCertified: false,
    basePriceEUR: 280,
    description: 'High-temperature dynamic braking resistor absorbing kinetic energy during rapid deceleration of high-inertia loads.',
    keyFeatures: ['Absorbs regenerative braking power', 'Integrated thermal overload switch', 'Direct connection to PM240-2 braking terminals']
  },
  {
    id: 'acc-line-reactor-15kw',
    category: 'accessory',
    series: 'SINAMICS Power Quality',
    name: 'Line Commutating Reactor 15 kW 3AC 400V',
    orderNumber: '6SL3203-0CE23-8AA0',
    voltageV: 400,
    coolingType: 'Air (IC411)',
    protectionRating: 'IP20',
    atexCertified: false,
    basePriceEUR: 210,
    description: 'Reduces low-frequency harmonic currents fed back into the supply grid and protects converter input rectifiers.',
    keyFeatures: ['Reduces THD(I) grid pollution', 'Protects against line voltage surges', 'Extends DC bus capacitor lifespan']
  }
];
