---
name: Feature request
description: Suggest a product improvement for AgencyOS
title: "[Feature]: "
labels: [enhancement]
body:
  - type: textarea
    id: problem
    attributes:
      label: Problem
      description: What agency workflow problem does this solve?
      placeholder: "As a consulting team, we need..."
    validations:
      required: true
  - type: textarea
    id: solution
    attributes:
      label: Proposed solution
      description: What should AgencyOS do?
    validations:
      required: true
  - type: dropdown
    id: area
    attributes:
      label: Product area
      options:
        - Customers
        - Projects
        - Tickets
        - Time tracking
        - Reports
        - Team/workspaces
        - Auth/database
        - UX/UI
        - Docs/community
        - Other
    validations:
      required: true
  - type: textarea
    id: notes
    attributes:
      label: Notes, screenshots, references
      description: Add examples, mockups, or similar tools if useful.
