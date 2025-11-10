# Replit — Building LLMs for Code Repair

**URL:** https://blog.replit.com/code-repair

**Created:** 2024-04-03T17:05:46.119Z

**Tags:** 

**Favorite:** false

## Excerpt

Introduction

At Replit, we are rethinking the developer experience with AI as a first-class citizen of the development environment. Towards this vision, we are tightly integrating AI tools with our IDE. Currently, LLMs specialized for programming are trained with a mixture of source code and relevant natural language, such as Github issues and StackExchange posts. These models are not trained to interact directly with the development environment, and therefore have limited ability to understand events or use tools within Replit. We believe that by training models that are native to Replit, we can create more powerful AI tools for developers.

A simple example of a Replit-native model takes a session event as input and returns a well-defined response. We set out to identify a scenario where we could develop such a model which could also become a useful tool for our current developers, and settled on code repair. Developers spend a significant fraction of their time fixing bugs in software. In 2018, when Microsoft released “A Common Protocol for Languages”, Replit began supporting the Language Server Protocol. Since then, the LSP has helped millions using Replit to find errors in their code. This puts LSP diagnostics among our most common events, with hundreds of millions per day. However, while the LSP identifies errors, it is only able to provide fixes in limited cases. In fact, only 10% of LSP diagnostic messages in Python projects on Replit have associated fixes. Given the abundance of training data, repairing code errors using LSP diagnostics is therefore the ideal setting to build our first Replit-native AI model.

Methodology

Data

## Cover Image

![Cover](https://cdn.sanity.io/images/bj34pdbp/migration/96d16870122e68b63a07b2306aaed524356a81eb-3840x1920.png)

