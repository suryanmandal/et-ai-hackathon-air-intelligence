import os
from dotenv import load_dotenv
load_dotenv()

from typing import List, Dict, Any
from crewai import Agent, Task, Crew, Process
from langchain_google_genai import ChatGoogleGenerativeAI

# Import the pre-defined spatial tools from your local directory structure
from ..services.agent_tools import inspect_hexagon_neighbors, forecast_air_quality_scenario, find_facilities_near_hexagon

def run_vayu_crew(h3_index: str, base_pm25: float) -> str:
    """
    Instantiates and runs the VayuSense CrewAI agent crew to analyze local air quality data,
    trace potential polluters in PostGIS, and simulate mitigation forecasts using Google Gemini.
    """
    
    # Initialize the Google Gemini Pro LLM using the key from your root .env file
    gemini_llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-pro",
        verbose=True,
        temperature=0.2,
        google_api_key=os.getenv("GEMINI_API_KEY")
    )

    # 1. Define the CrewAI Agents with Gemini LLM Assigned
    spatial_analyst = Agent(
        role="Spatial Air Quality Analyst",
        goal=f"Analyze spatial air quality variations starting from H3 hexagon index {h3_index}.",
        backstory=(
            "You are a GIS and environmental specialist skilled in tracking spatial air pollution distribution "
            "using the Uber H3 grid system. You inspect neighbor grids to track dispersion patterns."
        ),
        tools=[inspect_hexagon_neighbors],
        llm=gemini_llm,  # <-- Crucial: Gemini bound
        verbose=True
    )
    
    compliance_auditor = Agent(
        role="Industrial Emissions Compliance Auditor",
        goal="Correlate spatial pollution peaks with active physical industrial facilities.",
        backstory=(
            "You are a forensic investigator who queries PostGIS spatial databases to locate registered industrial "
            "facilities, inspect their current compliance status, and identify suspected source emitters."
        ),
        tools=[find_facilities_near_hexagon],
        llm=gemini_llm,  # <-- Crucial: Gemini bound
        verbose=True
    )
    
    policy_planner = Agent(
        role="Environmental Policy and Mitigation Planner",
        goal="Simulate air quality forecasts under custom mitigation scenarios and suggest actionable policy paths.",
        backstory=(
            "You are a data-driven policy advisor who evaluates mitigation scenarios by running machine learning "
            "forecasting projections (e.g., comparing traffic and industrial emissions reductions)."
        ),
        tools=[forecast_air_quality_scenario],
        llm=gemini_llm,  # <-- Crucial: Gemini bound
        verbose=True
    )

    # 2. Define the Tasks for each Agent
    task_spatial = Task(
        description=(
            f"Inspect the adjacent hexagons around the primary location '{h3_index}' up to a distance of 1 ring. "
            "Analyze the zone IDs to establish the immediate neighborhood layout for the dispersion audit."
        ),
        expected_output="A structured list of neighboring H3 hexagons with their spatial layout relationships.",
        agent=spatial_analyst
    )

    task_audit = Task(
        description=(
            f"Identify physical facilities registered in the database located within 5000 meters of H3 hexagon '{h3_index}'. "
            "Look for facilities whose compliance status is non-compliant or active, and summarize the potential emission sources."
        ),
        expected_output="A detailed summary of active industrial facilities nearby, including names, categories, and compliance status.",
        agent=compliance_auditor
    )

    task_mitigation = Task(
        description=(
            f"Conduct two scenario forecasting simulations for H3 index '{h3_index}' starting at a baseline PM2.5 level of {base_pm25}: "
            "1. Business As Usual (traffic_density_scalar=1.0, industrial_output_scalar=1.0)\n"
            "2. Traffic & Industrial Control (traffic_density_scalar=0.70, industrial_output_scalar=0.50)\n\n"
            "Compare the peak PM2.5 projected in both 12-hour trajectories and write a final recommendation report."
        ),
        expected_output="A structured air quality mitigation report comparing the two scenario projections and outlining the recommended policy path.",
        agent=policy_planner
    )

    # 3. Assemble and Kick Off the Crew Sequentially
    crew = Crew(
        agents=[spatial_analyst, compliance_auditor, policy_planner],
        tasks=[task_spatial, task_audit, task_mitigation],
        process=Process.sequential,
        verbose=True
    )

    result = crew.kickoff()
    return str(result)