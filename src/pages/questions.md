---
layout: base.njk
title: Questions | Galactic Horizon
description: Answers to common questions about the Galactic Horizon Accelerator and Pre-Accelerator.
---

{% set heroTitle = "Questions" %}
{% set heroLead = "What founders ask us most about the Accelerator and the Pre-Accelerator." %}
{% set heroAction = "" %}
{% set heroLink = "" %}
{% set heroArt = "none" %}
{% include "partials/pageHero.njk" %}

{% set sectionTitle = "The Accelerator" %}
{% set questionsGroup = "Accelerator" %}
{% set sectionBg = "sand" %}
{% include "partials/questionsList.njk" %}

{% set sectionTitle = "The Pre-Accelerator" %}
{% set questionsGroup = "Pre-Accelerator" %}
{% set sectionBg = "paper" %}
{% include "partials/questionsList.njk" %}
