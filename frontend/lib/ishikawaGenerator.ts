// lib/ishikawaGenerator.ts

// Re-export component and interface from component
export { default as IshikawaDiagram, type CauseCategory } from '../app/components/IshikawaDiagram';

// Import/export utility functions to avoid duplications
import { formatCausesFor5M as fcf5m, generate5MCauses as g5m } from './ishikawaUtils';
export const generate5MCauses = g5m;
export const formatCausesFor5M = fcf5m;
