import { z } from "zod";
import { initializeMcpApiHandler } from "../lib/mcp-api-handler";

const handler = initializeMcpApiHandler(
  (server) => {
    // Fission Initial Analysis Tool
    server.tool(
      "fission_initial_analysis",
      {
        agenda: z.string().describe("The agenda text to be analyzed"),
      },
      async ({ agenda }) => {
        // Generate unique analysis ID
        const analysisId = `INIT-${Math.floor(Math.random() * 90000) + 10000}`;

        // Format the analysis response without calling Claude directly
        const initialAnalysisResponse = formatInitialAnalysisResponse(
          agenda,
          analysisId
        );

        return {
          content: [
            {
              type: "text",
              text: initialAnalysisResponse,
            },
          ],
        };
      }
    );

    // Fission Resource Analysis Tool
    server.tool(
      "fission_resource_analysis",
      {
        initialAnalysis: z
          .string()
          .describe("The initial analysis text to be processed"),
      },
      async ({ initialAnalysis }) => {
        // Generate unique resource ID
        const resourceId = `RES-${Math.floor(Math.random() * 90000) + 10000}`;

        // Format the resource analysis response without calling Claude directly
        const resourceAnalysisResponse = formatResourceAnalysisResponse(
          initialAnalysis,
          resourceId
        );

        return {
          content: [
            {
              type: "text",
              text: resourceAnalysisResponse,
            },
          ],
        };
      }
    );

    // Fission Decision Analysis Tool
    server.tool(
      "fission_decision_analysis",
      {
        agenda: z.string().describe("The original agenda text"),
        initialAnalysis: z.string().describe("The initial analysis text"),
        resourceAnalysis: z.string().describe("The resource analysis text"),
        agentPersonality: z
          .string()
          .optional()
          .describe("Optional personality traits for the decision agent"),
      },
      async ({
        agenda,
        initialAnalysis,
        resourceAnalysis,
        agentPersonality,
      }) => {
        // Generate unique decision ID
        const decisionId = `DEC-${Math.floor(Math.random() * 90000) + 10000}`;

        // Format the decision analysis response without calling Claude directly
        const decisionAnalysisResponse = formatDecisionAnalysisResponse(
          agenda,
          initialAnalysis,
          resourceAnalysis,
          agentPersonality || "",
          decisionId
        );

        return {
          content: [
            {
              type: "text",
              text: decisionAnalysisResponse,
            },
          ],
        };
      }
    );

    // Fission Complete Analysis Pipeline
    server.tool(
      "fission_complete_analysis",
      {
        agenda: z
          .string()
          .describe(
            "The agenda text to be analyzed through the complete pipeline"
          ),
        agentPersonality: z
          .string()
          .optional()
          .describe("Optional personality traits for the decision agent"),
      },
      async ({ agenda, agentPersonality }) => {
        // Generate unique IDs for each step
        const pipelineId = `PIPE-${Math.floor(Math.random() * 90000) + 10000}`;
        const analysisId = `INIT-${Math.floor(Math.random() * 90000) + 10000}`;
        const resourceId = `RES-${Math.floor(Math.random() * 90000) + 10000}`;
        const decisionId = `DEC-${Math.floor(Math.random() * 90000) + 10000}`;

        // Format responses for each step without calling Claude directly
        const initialAnalysisResponse = formatInitialAnalysisResponse(
          agenda,
          analysisId
        );
        const resourceAnalysisResponse = formatResourceAnalysisResponse(
          initialAnalysisResponse,
          resourceId
        );
        const decisionAnalysisResponse = formatDecisionAnalysisResponse(
          agenda,
          initialAnalysisResponse,
          resourceAnalysisResponse,
          agentPersonality || "",
          decisionId
        );

        return {
          content: [
            {
              type: "text",
              text: `🔄 Fission Complete Analysis Pipeline #${pipelineId} 🔄

## Initial Analysis
${initialAnalysisResponse}

## Resource Analysis
${resourceAnalysisResponse}

## Decision Analysis
${decisionAnalysisResponse}`,
            },
          ],
        };
      }
    );
  },
  {
    capabilities: {
      tools: {
        fission_initial_analysis: {
          description: "Formats an agenda for initial analysis with Claude AI",
        },
        fission_resource_analysis: {
          description:
            "Formats an initial analysis for resource analysis with Claude AI",
        },
        fission_decision_analysis: {
          description:
            "Formats agenda, initial analysis, and resource analysis for decision making with Claude AI",
        },
        fission_complete_analysis: {
          description:
            "Formats the complete analysis pipeline from initial analysis to final decision",
        },
      },
    },
  }
);

// Helper function to format initial analysis response
function formatInitialAnalysisResponse(
  agenda: string,
  analysisId: string
): string {
  return `📊 Fission Initial Analysis #${analysisId} 📊

Here is the agenda to analyze:

<agenda>
${agenda}
</agenda>

Please follow these steps to complete your analysis:
  Initial Analysis:
   Before your final analysis, wrap your initial analysis in <initial_analysis> tags to show your thought process and initial interpretation of the agenda. Be thorough and consider all aspects of the agenda. This section can be quite detailed and long. Include the following:
   a. List key agenda items, numbering them for clarity.
   b. For each item, note potential benefits and challenges.
   c. Identify any recurring themes or patterns across the agenda items.
   d. Consider how the agenda aligns with broader organizational goals or strategies.
   e. Explicitly state your reasoning for the initial "Yes" or "No" decision.

   <analysis>
   <immediate_thoughts>
   [Provide your initial impressions and key observations. Be specific and cite particular elements of the agenda that stood out to you. Limit each point to 1-2 sentences for clarity.]
   </immediate_thoughts>
   </analysis>
Remember to be as precise and detailed as possible in your analysis, providing specific insights and examples throughout.
Do not generate duplicated context and informations from the agenda. Be concise and precise not overly exaggerated,
Your goal is to deliver valuable insights that can guide decision-making and further discussion related to the agenda items.`;
}

// Helper function to format resource analysis response
function formatResourceAnalysisResponse(
  initialAnalysis: string,
  resourceId: string
): string {
  return `🔍 Fission Resource Analysis #${resourceId} 🔍

Here is the initial analysis of the agenda:

<initial_analysis>
${initialAnalysis}
</initial_analysis>

Your primary focus is to identify and analyze relevant materials that are essential for decision-making and deep thoughts related to the agenda items discussed in the initial analysis. Your analysis should be thorough, precise, and tailored to the specific context provided.

Before providing your final analysis, wrap your thought process inside <strategic_analysis_process> tags. In this section:

1. List out key agenda items identified in the initial analysis.
2. For each of the following aspects (social, technological, cultural, economic, legal):
   a) List potential relevant materials
   b) Explain how each material relates to the identified agenda items
   c) Describe potential impacts or implications of each material
3. Synthesize your findings across all aspects, noting any interconnections or overarching themes.
4. Consider how these materials could influence decision-making.
5. Reflect on how these materials could prompt deeper thoughts or discussions.
6. Don't explain too long, just put the key points.
Be thorough in this section, as it will form the foundation for your final analysis. Be consice and precise. You should not be overly long or exaggerated or duplicate text contents.

After your strategic analysis process, provide your analysis using the following structure:

<relevant_materials_analysis>
  <social_aspects>
    [Detailed analysis of social materials, including specific examples and their relevance to decision-making]
  </social_aspects>

  <technological_aspects>
    [Detailed analysis of technological materials, including specific examples and their relevance to decision-making]
  </technological_aspects>

  <cultural_aspects>
    [Detailed analysis of cultural materials, including specific examples and their relevance to decision-making]
  </cultural_aspects>

  <economic_aspects>
    [Detailed analysis of economic materials, including specific examples and their relevance to decision-making]
  </economic_aspects>

  <legal_aspects>
    [Detailed analysis of legal materials, including specific examples and their relevance to decision-making]
  </legal_aspects>

  <decision_making_implications>
    [Summary of how these materials collectively inform decision-making processes]
  </decision_making_implications>

  <deep_thought_prompts>
    [List of questions or topics that arise from this analysis, which could prompt deeper strategic thinking]
  </deep_thought_prompts>
</relevant_materials_analysis>
Do not generate duplicated context and informations from the agenda. Be concise and precise not overly exaggerated,
Remember to be as precise and detailed as possible in your analysis, providing specific insights and examples throughout. Your goal is to offer valuable, actionable information that can guide strategic planning and decision-making based on the initial agenda analysis.`;
}

// Helper function to format decision analysis response
function formatDecisionAnalysisResponse(
  agenda: string,
  initialAnalysis: string,
  resourceAnalysis: string,
  agentPersonality: string,
  decisionId: string
): string {
  const personalitySection = agentPersonality
    ? `Before that, you should align your behavior according to the personality described below.
<Agent_personality>
${agentPersonality}
</Agent_personality>`
    : `You may act as a general agent with no specific personality traits.`;

  return `⚖️ Fission Decision Analysis #${decisionId} ⚖️

You are a highly skilled analytical agent specializing in strategic planning and agenda analysis. Your task is to provide a comprehensive analysis of a given agenda and make a final decision based on multiple sources of information.

${personalitySection}

Here are the materials you need to analyze:

1. The original agenda:
<agenda>
${agenda}
</agenda>

2. An initial analysis of the agenda:
<initial_analysis>
${initialAnalysis}
</initial_analysis>

3. A research-based analysis:
<research_analysis>
${resourceAnalysis}
</research_analysis>

Your goal is to combine these three sources of information to make a final decision (Yes or No) and provide a detailed explanation for your choice. Follow these steps:

1. Carefully review all three sources of information.
2. In your analysis, consider the following:
   - Key points from the original agenda
   - Insights from the initial analysis
   - Additional information or perspectives from the research analysis
   - Potential pros and cons of the agenda items
   - Short-term and long-term implications
   - Any critical factors that might influence the decision

3. Based on your analysis, make a final decision: Yes or No.
4. Provide a detailed explanation for your decision, referencing specific points from all three sources of information.

Use the following structure for your response:

<analysis>
1. Summarize key points from each source:
   a. Original agenda:
   b. Initial analysis:
   c. Research analysis:

2. List pros and cons:
   Pros:
   Cons:

3. Evaluate short-term and long-term implications:
   Short-term:
   Long-term:

4. Identify critical factors:

5. Weigh the evidence for and against the agenda:
   Arguments in favor:
   Arguments against:

[It's okay for this section to be quite long. Provide a thorough analysis, considering all available information and breaking down your thinking step-by-step.]
</analysis>

<decision>
[Your final decision: YES or NO]
</decision>

<explanation>
[Your detailed explanation for the decision]
</explanation>
Your decision is always YES or NO. There is no middle or qualified YES or NO kind of result.
Remember to be thorough, precise, and objective in your analysis. Your explanation should clearly demonstrate how you've considered all available information to reach your final decision.`;
}

export default handler;
