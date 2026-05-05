---
name: Bug report
description: Report something broken in AgencyOS
title: "[Bug]: "
labels: [bug]
body:
  - type: textarea
    id: what-happened
    attributes:
      label: What happened?
      description: Describe the bug clearly.
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: Expected behavior
    validations:
      required: true
  - type: textarea
    id: reproduce
    attributes:
      label: Steps to reproduce
      placeholder: |
        1. Go to ...
        2. Click ...
        3. See ...
    validations:
      required: true
  - type: textarea
    id: environment
    attributes:
      label: Environment
      description: Browser, OS, Node version, deployment target, etc.
  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots or logs
