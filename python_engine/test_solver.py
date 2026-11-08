"""
Unit Test Suite for Siemens OR-Tools CP-SAT Industrial Solver
"""

import pytest
from solver import SiemensCPQSolver

@pytest.fixture
def solver():
    return SiemensCPQSolver()

def test_water_cooled_extruder_constraint(solver):
    """Verifies that water-cooled motor strictly enforces chiller inclusion and upsized inverter under 48C."""
    res = solver.solve(
        required_power_kw=15.0,
        water_cooling_requested=True,
        ambient_temp_c=48.0,
        cable_length_meters=75.0,
        closed_loop_feedback=True
    )
    assert res["solver_status"] in ("OPTIMAL", "FEASIBLE")
    bom_ids = [item["id"] for item in res["selected_bom"]]

    # Must contain water motor
    assert "mot-1lm1-15kw-water-ie4" in bom_ids
    # Must enforce chiller unit
    assert "acc-chiller-5kw" in bom_ids
    # Must enforce du/dt filter for 75m cable
    assert "acc-dudt-filter" in bom_ids
    # Must upsize to 22 kW inverter due to 48C ambient derating
    assert "inv-pm240-22kw" in bom_ids
    # Must pick CU250S-2 with encoder interface
    assert "cu-250s-2-pn" in bom_ids

def test_short_cable_air_cooled_no_filters(solver):
    """Verifies standard air cooled drive with 15m cable does NOT add chiller or du/dt filter."""
    res = solver.solve(
        required_power_kw=15.0,
        water_cooling_requested=False,
        ambient_temp_c=30.0,
        cable_length_meters=15.0,
        closed_loop_feedback=False
    )
    assert res["solver_status"] in ("OPTIMAL", "FEASIBLE")
    bom_ids = [item["id"] for item in res["selected_bom"]]

    assert "acc-chiller-5kw" not in bom_ids
    assert "acc-dudt-filter" not in bom_ids
    assert "inv-pm240-15kw" in bom_ids  # Standard 15 kW inverter is sufficient

def test_atex_hazard_zone_compliance(solver):
    """Verifies that ATEX requirement strictly selects SIMOTICS XP explosion-proof motor."""
    res = solver.solve(
        required_power_kw=15.0,
        atex_required=True,
        ambient_temp_c=35.0
    )
    assert res["solver_status"] in ("OPTIMAL", "FEASIBLE")
    bom_ids = [item["id"] for item in res["selected_bom"]]
    assert "mot-1mb1-15kw-atex-ie3" in bom_ids
