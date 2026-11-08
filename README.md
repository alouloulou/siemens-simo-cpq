# Siemens SimoCPQ — Industrial AI Product Configuration & Decision Support Agent

> **Enterprise AI Architect & Solution Engineer Proof of Concept**  
> Built for Siemens Digital Industries & Drive Technology (Motion Control).

An autonomous AI CPQ (Configure, Price, Quote) and decision-support system for **Siemens SIMOTICS electric motors** and **SINAMICS frequency inverters**. Combines **Generative AI tool-calling (Gemini 2.5 Flash)** with **Symbolic Constraint Satisfaction (Google OR-Tools / Deterministic Engine)** and **RAG Technical Documentation Grounding** to eliminate AI hallucinations on physical engineering constraints and pricing.

---

## ⚡ Key Highlights & Architectural Strengths

1. **Zero Hallucination on Physics & Pricing:**
   The LLM does **not** invent compatibility or pricing. Component sizing, ambient de-rating (1.5%/°C above 40°C), voltage peak limitation (IEC 60034-25), water chiller loop integrity, and discount rates are calculated deterministically.

2. **Transparent Autonomous Tool-Calling Trace:**
   The UI visualizes the agent's live reasoning and execution sequence:
   * `parse_customer_intent` ➔ extracts structured engineering constraints.
   * `search_product_catalog` ➔ identifies candidate motors and drives from Siemens MLFB codes.
   * `query_technical_documentation` (RAG) ➔ retrieves official Siemens engineering standards and page citations.
   * `validate_and_solve_constraints` ➔ evaluates physical feasibility.
   * `calculate_bom_pricing` ➔ generates itemized commercial quotes.

3. **Multi-Model / Hybrid Architecture:**
   * **Production Web App (Vercel-ready):** Next.js 15 (App Router, React 19, Tailwind CSS v4) with streaming tool-trace.
   * **Python OR-Tools Engine (`python_engine/`):** Standalone CP-SAT Mixed-Integer Programming solver with formal boolean implications (`10.36 ms` solve time).

4. **Interactive CPQ Dashboard:**
   * **1-Click Industrial Scenarios:** Extruder Drive (Water-Cooled), ATEX Zone 1 Chemical Pump, Severe Duty Cement Mill, Cleanroom HVAC Fan.
   * **Dynamic BOM:** Live additions and removals trigger instantaneous constraint re-validation.
   * **1-Click Excel Deliverable (`.xlsx`):** Professional engineering specification sheet.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend & UI** | Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons |
| **AI Agent Loop** | Google Gemini 2.5 Flash via `@google/genai` SDK with tool calling |
| **Constraint Solver** | Symbolic rule engine + Google OR-Tools CP-SAT (`python_engine/solver.py`) |
| **RAG Grounding** | Siemens D 81.1, Drive Tech Doc GH1, ATEX Directive 2014/34/EU, IEC 60034-25 |
| **Export Engine** | SheetJS (`xlsx`) for industrial spec sheet generation |
| **Hosting** | Vercel (1-Click zero-config serverless deployment) |

---

## 🚀 Getting Started

### 1. Web Application (Next.js)

```bash
# Navigate to project
cd C:\Users\Ali\Desktop\Siemens

# Development server
npm run dev

# Production build
npm run build
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Standalone Python OR-Tools Solver (For Interview Showcase)

```bash
# Navigate to python engine
cd python_engine

# Run the solver scenario
python solver.py

# Run automated constraint unit tests
python -m pytest test_solver.py -v
```

---

## 📋 Deterministic Engineering Rules Modeled

* **ELEC-01 & 02:** Motor power $\ge$ requirement & 3AC nominal voltage grid match.
* **ELEC-03:** Inverter continuous current rating $\ge 1.05 \times I_{\text{motor}}$, de-rated by $1.5\%/\text{K}$ above $40^\circ\text{C}$ (EN 61800-5-1).
* **THERM-01:** Liquid cooling (IC71W) strictly enforces active closed-circuit chiller unit (6SY8101).
* **SAFE-01 & 02:** Hazardous atmospheres enforce SIMOTICS XP (1MB) ATEX Zone 1/21 certified flameproof enclosures with PTC thermistor safety relay.
* **MECH-01:** Motor cable runs $> 50\text{m}$ mandate a du/dt filter with voltage peak limiter to protect stator insulation against reflected waves (IEC 60034-25).
* **CTRL-01:** Closed-loop speed/position control requires CU250S-2 PN or CU310-2 with optical encoder.
