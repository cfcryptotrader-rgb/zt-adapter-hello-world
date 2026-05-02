# ROI Metrics

This document explains why a shared Zero Trust adapter layer is cheaper and safer than every team building custom agent security from scratch.

## Cost Avoidance

| In-House Build Area | Common Cost | ZT-Infra Direction |
| --- | --- | --- |
| Per-framework guardrails | Each team writes separate wrappers for LangGraph, OpenAI, MCP, A2A, and custom tools. | One shared adapter contract and conformance suite. |
| Audit evidence | Teams design custom logs that auditors cannot compare. | One audit record shape with verifier CLI and future KMS/DAAL verification. |
| Execution isolation | Teams choose ad hoc sandbox patterns. | Broker contract separates policy decision from approved execution. |
| Policy consistency | Least privilege rules drift across teams. | Shared ABAC policy schema and examples. |
| Security review | Every agent project needs bespoke threat modeling. | Reusable threat model, risk register, and controls mapping. |

## Operational Metrics To Track

| Metric | Why It Matters | Phase 1 Measurement |
| --- | --- | --- |
| Time to first denied action | Shows onboarding speed. | Target: under 5 minutes with Docker Compose. |
| Policy decision overhead | Shows agent workflow impact. | Target for production gateway: less than 100 ms p95, with DAAL asynchronous. |
| Blocked dangerous action count | Shows prevented blast radius. | Count `decision: deny` by action family. |
| Allow-list size | Shows least-privilege discipline. | Track number of explicitly allowed actions per actor. |
| Audit verification pass rate | Shows evidence integrity. | Target: 100% for local demo records, higher rigor with production KMS. |
| Custom security code avoided | Shows developer productivity. | Track adapter teams using shared SDK instead of writing their own control point. |

## Business Value Statement

ZT-Infra helps teams avoid rebuilding the same agent security layer for every framework. The business value is reduced duplicate engineering, faster security review, clearer audit evidence, and lower blast radius when an autonomous agent receives a bad instruction.

