# Eureka Discovery

## Why Service Discovery?

Microservices should not communicate using hardcoded IP addresses.

Instead:

Gateway
↓

Eureka
↓

Service Registry

## Registered Services

PRODUCT-SERVICE

USER-SERVICE

BASKET-SERVICE

AUTH-SERVICE

GATEWAY-SERVICE

## Discovery Flow

Service Startup

↓

Register to Eureka

↓

Gateway resolves service dynamically
