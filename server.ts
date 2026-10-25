import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { heuristicTriage, formatUrgencyLabel, TriageUrgency } from './src/utils/triage.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize server-side Gemini client per skill instructions
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API: AI Triage Distress Call
app.post('/api/triage', async (req: Request, res: Response) => {
  try {
    const { rawText, callerName = 'Citizen', locationName = 'Unknown Location', vulnerableCount = 0 } = req.body;

    if (!rawText || typeof rawText !== 'string') {
      res.status(400).json({ error: 'rawText string is required for emergency triage.' });
      return;
    }

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are an expert emergency disaster triage officer operating an emergency relief dispatch system.
Analyze this incoming SOS distress report and extract structured, prioritized logistical intelligence.

Report Content: "${rawText}"
Reported By: ${callerName}
Location: ${locationName}
Reported Vulnerable Persons Count: ${vulnerableCount}

Assess the exact urgency (1 = Low/Information, 2 = Moderate Supply, 3 = Elevated Need, 4 = Severe Medical/Hazard, 5 = Critical Imminent Threat to Life).
Categorize into one of: 'medical', 'rescue_evac', 'water_food', 'power_shelter', 'special_needs'.
Identify specific logistical supplies needed, environmental hazards, and tactical recommended response.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                urgencyScore: { type: Type.INTEGER, description: '1 to 5 urgency rating' },
                category: {
                  type: Type.STRING,
                  description: 'Category: medical, rescue_evac, water_food, power_shelter, special_needs'
                },
                triageSummary: { type: Type.STRING, description: 'High-density tactical briefing under 30 words' },
                keyHazards: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Active physical, environmental, or situational hazards'
                },
                requestedItems: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      item: { type: Type.STRING },
                      quantity: { type: Type.NUMBER },
                      unit: { type: Type.STRING }
                    },
                    required: ['item', 'quantity', 'unit']
                  },
                  description: 'Exact supplies and rescue equipment required'
                },
                recommendedAction: { type: Type.STRING, description: 'Immediate operational command directive' },
                vulnerableCount: { type: Type.INTEGER, description: 'Number of high-risk persons requiring priority extraction' }
              },
              required: ['urgencyScore', 'category', 'triageSummary', 'keyHazards', 'requestedItems', 'recommendedAction']
            }
          }
        });

        const parsed = JSON.parse(response.text || '{}');
        const score = Math.max(1, Math.min(5, parsed.urgencyScore || 3)) as TriageUrgency;

        res.json({
          source: 'gemini-3.8-flash',
          urgencyScore: score,
          urgencyLabel: formatUrgencyLabel(score),
          category: parsed.category || 'water_food',
          triageSummary: parsed.triageSummary || 'Emergency report processed.',
          keyHazards: parsed.keyHazards || ['Unspecified terrain risks'],
          requestedItems: parsed.requestedItems || [{ item: 'Emergency Survival Kit', quantity: 1, unit: 'pack' }],
          recommendedAction: parsed.recommendedAction || 'Dispatch nearest regional rapid-response squad.',
          vulnerableCount: parsed.vulnerableCount ?? vulnerableCount
        });
        return;
      } catch (geminiErr) {
        console.warn('Gemini triage call failed or returned error, utilizing deterministic heuristic:', geminiErr);
      }
    }

    // Heuristic Fallback
    const fallback = heuristicTriage(rawText, vulnerableCount);
    res.json({
      source: 'heuristic_engine',
      urgencyScore: fallback.urgencyScore,
      urgencyLabel: fallback.urgencyLabel,
      category: fallback.category,
      triageSummary: fallback.summary,
      keyHazards: fallback.keyHazards,
      requestedItems: fallback.suggestedItems,
      recommendedAction: `Deploy ${fallback.category === 'rescue_evac' ? 'boat/swift-water unit' : 'high-clearance logistics team'} with staged rations.`,
      vulnerableCount: fallback.vulnerableCount
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to triage emergency request.' });
  }
});

// API: AI Tactical Dispatch Plan
app.post('/api/dispatch-plan', async (req: Request, res: Response) => {
  try {
    const { sosRequest, matchedHub, matchedTeam } = req.body;

    if (!sosRequest || !matchedHub || !matchedTeam) {
      res.status(400).json({ error: 'sosRequest, matchedHub, and matchedTeam are required.' });
      return;
    }

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are a disaster operations logistics commander. Generate an operational mission dispatch order for an emergency rescue team.
SOS Incident:
- Caller: ${sosRequest.callerName} at ${sosRequest.locationName}
- Triage Urgency: ${sosRequest.urgencyScore}/5 (${sosRequest.urgencyLabel})
- Category: ${sosRequest.category}
- Hazards: ${JSON.stringify(sosRequest.keyHazards)}
- Requested Goods: ${JSON.stringify(sosRequest.requestedItems)}
- Context: ${sosRequest.rawText}

Staging Hub: ${matchedHub.name} (${matchedHub.address})
Assigned Unit: ${matchedTeam.name} (Vehicle: ${matchedTeam.vehicleType}, Certs: ${matchedTeam.certifications?.join(', ')})

Provide tactical navigation advice, safety protocols for the crew, and specialized gear verification.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                routeCaution: { type: Type.STRING, description: 'Route navigation safety alert, flooded underpasses, debris zones' },
                safetyBriefing: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Mandatory tactical safety checklist for field operators (3-4 points)'
                },
                priorityEquipment: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Mandatory vehicle gear beyond standard payload'
                },
                etaMinutes: { type: Type.INTEGER, description: 'Estimated arrival time under crisis conditions' }
              },
              required: ['routeCaution', 'safetyBriefing', 'priorityEquipment', 'etaMinutes']
            }
          }
        });

        const parsed = JSON.parse(response.text || '{}');
        res.json({
          source: 'gemini-3.8-flash',
          routeCaution: parsed.routeCaution || 'Exercise extreme caution near low-lying culverts and downed utility lines.',
          safetyBriefing: parsed.safetyBriefing || [
            'Maintain secondary VHF radio contact on Crisis Net Channel 3',
            'Wear Level 2 personal flotation or PPE vests at all times',
            'Establish 360-degree perimeter assessment before patient extraction'
          ],
          priorityEquipment: parsed.priorityEquipment || ['Night-ops searchlights', 'Thermal hypothermia wraps', 'Tow winch & recovery straps'],
          etaMinutes: parsed.etaMinutes || 24
        });
        return;
      } catch (geminiErr) {
        console.warn('Gemini dispatch generation fallback:', geminiErr);
      }
    }

    // Deterministic fallback
    res.json({
      source: 'heuristic_engine',
      routeCaution: 'Avoid Interstate 10 low-grade underpasses due to reported storm surge pooling. Use North Ridge bypass.',
      safetyBriefing: [
        'Ensure PPE water-rescue flotation or bio-hazard protocols are active',
        'Verify caller identity upon arrival and secure immediate triage vitals',
        'Radio back confirmation to Central Staging Depot upon patient contact'
      ],
      priorityEquipment: [
        'Satellite communicators / VHF backup',
        'Heavy hydraulic winch & tow ropes',
        'Insulated medical refrigeration tote'
      ],
      etaMinutes: 22
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate dispatch plan.' });
  }
});

// API: AI Humanitarian Situation Report (SitRep)
app.post('/api/generate-sitrep', async (req: Request, res: Response) => {
  try {
    const { scenarioName, activeIncidentsCount, criticalCount, hubs, pledgesCount } = req.body;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Produce an official, crisp Humanitarian Operations Situation Report (SitRep) for disaster coordination leadership.
Scenario: ${scenarioName}
Active Incidents: ${activeIncidentsCount}
Critical/Life-Threat Emergencies: ${criticalCount}
Regional Supply Hubs: ${hubs?.length || 3}
Mutual Aid Community Pledges: ${pledgesCount || 0}

Structure the briefing into:
1. Executive Situation Overview
2. Priority Action Directives
3. Supply Deficit Bottlenecks
4. 12-Hour Operational Forecast`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                executiveOverview: { type: Type.STRING },
                priorityDirectives: { type: Type.ARRAY, items: { type: Type.STRING } },
                supplyBottlenecks: { type: Type.ARRAY, items: { type: Type.STRING } },
                forecast12h: { type: Type.STRING }
              },
              required: ['executiveOverview', 'priorityDirectives', 'supplyBottlenecks', 'forecast12h']
            }
          }
        });

        res.json(JSON.parse(response.text || '{}'));
        return;
      } catch (geminiErr) {
        console.warn('Gemini SitRep generation fallback:', geminiErr);
      }
    }

    res.json({
      executiveOverview: `Sector operations report for ${scenarioName || 'Active Disaster Zone'}: ${activeIncidentsCount} active emergency incidents recorded, with ${criticalCount} critical life-safety distress calls undergoing rapid field dispatch.`,
      priorityDirectives: [
        'Prioritize high-clearance 4x4 and watercraft assets to flooded residential zones',
        'Accelerate cold-chain medical supply delivery for insulin and oxygen-dependent individuals',
        'Establish auxiliary power generator transfer to secondary community shelters'
      ],
      supplyBottlenecks: [
        'Critical deficit of 5kW portable inverter generators for oxygen support',
        'High demand for pediatric infant formula and sterile drinking water rations'
      ],
      forecast12h: 'Storm surge cresting within 4 hours; transit window closing along eastern drainage basin. Rapid deployment window active now.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate SitRep.' });
  }
});

// Setup Vite middleware in development or static serving in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`ReliefGrid server running on port ${PORT}`);
  });
}

startServer();
