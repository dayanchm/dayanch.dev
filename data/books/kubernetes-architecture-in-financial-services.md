---
title: "Kubernetes Architecture in Financial Services"
author: "Daniele Polencic"
status: "finish"
readYear: "2026"
cover: "/images/books/kubernetes-architecture-in-financial-services.png"
description: "Explores architectural decisions for isolation, security, application delivery, and operational reliability in Kubernetes platforms through the experiences of seven banks."
---

# Kubernetes Architecture in Financial Services

Daniele Polencic’s book examines the challenges of designing Kubernetes platforms in financial services through the real experiences of seven banks. It focuses on how architectural choices affect security, team responsibilities, and service continuity.

Key topics covered in the book include:

- **Isolation:** Choosing appropriate boundaries across namespaces, network policies, separate control planes, and cloud accounts.
- **Application delivery:** Designing CI/CD processes that standardize shared requirements while accommodating application teams’ needs.
- **Policy management:** Enforcing security rules, keeping exceptions visible, and producing reports for audits.
- **Service communication:** Managing identity, access, and connections between services in different clusters.
- **Reliability:** Investigating failed requests even when individual components appear healthy.
- **Dependencies and maintenance:** Managing dependencies such as database permissions, DNS, and certificates, and preserving service continuity when replacing clusters.

The book’s central message is that a successful Kubernetes platform requires clear ownership boundaries and sustainable operational processes. Lessons from these banking examples also apply to other organizations that need strong isolation and high reliability.

Source: [LearnKube — book overview and chapter descriptions](https://learnkube.com/kubernetes-architecture-financial-services).
