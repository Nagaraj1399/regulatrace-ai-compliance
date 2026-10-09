import {
  RegulatoryObligation,
  InternalControl,
  ControlMapping,
  AuditEvent,
} from '../types';
import {
  INITIAL_OBLIGATIONS,
  INITIAL_CONTROLS,
  INITIAL_MAPPINGS,
  INITIAL_AUDIT_EVENTS,
} from '../data/seedData';

export const STORAGE_KEY_PREFIX = 'regulatrace_v1_';
export const STORAGE_VERSION = 1;

export interface AppState {
  version: number;
  obligations: RegulatoryObligation[];
  controls: InternalControl[];
  mappings: ControlMapping[];
  auditEvents: AuditEvent[];
}

export interface StorageRepository {
  loadState(): AppState;
  saveState(state: AppState): boolean;
  resetToSeed(): AppState;
  setSimulationError(enabled: boolean): void;
}

class LocalStorageRepository implements StorageRepository {
  private simulateError = false;

  public setSimulationError(enabled: boolean): void {
    this.simulateError = enabled;
  }

  public isSimulationError(): boolean {
    return this.simulateError;
  }

  public loadState(): AppState {
    if (typeof window === 'undefined' || !window.localStorage) {
      return this.getDefaultState();
    }

    try {
      const raw = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}state`);
      if (!raw) {
        const initial = this.getDefaultState();
        this.saveState(initial);
        return initial;
      }

      const parsed = JSON.parse(raw) as Partial<AppState>;
      if (!parsed || parsed.version !== STORAGE_VERSION || !Array.isArray(parsed.obligations)) {
        console.warn('Storage schema version mismatch or corrupted data. Resetting to seed.');
        const fresh = this.getDefaultState();
        this.saveState(fresh);
        return fresh;
      }

      return {
        version: parsed.version,
        obligations: parsed.obligations || INITIAL_OBLIGATIONS,
        controls: parsed.controls || INITIAL_CONTROLS,
        mappings: parsed.mappings || INITIAL_MAPPINGS,
        auditEvents: parsed.auditEvents || INITIAL_AUDIT_EVENTS,
      };
    } catch (err) {
      console.error('Failed to read from localStorage:', err);
      return this.getDefaultState();
    }
  }

  public saveState(state: AppState): boolean {
    if (this.simulateError) {
      throw new Error('Simulated Storage Adapter Error: Disk write lock / storage quota failure.');
    }

    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    try {
      window.localStorage.setItem(`${STORAGE_KEY_PREFIX}state`, JSON.stringify(state));
      return true;
    } catch (err) {
      console.error('Failed to write to localStorage:', err);
      throw err;
    }
  }

  public resetToSeed(): AppState {
    const seed = this.getDefaultState();
    const resetEvent: AuditEvent = {
      id: `AUD-RESET-${Date.now()}`,
      entityType: 'System',
      entityId: 'ALL',
      action: 'Demo data reset',
      actorId: 'usr-analyst',
      actorDisplayName: 'Elena Rostova (Compliance Analyst)',
      timestamp: new Date().toISOString(),
      reason: 'User executed manual reset of prototype local storage to baseline deterministic seed dataset.',
    };

    seed.auditEvents = [resetEvent, ...seed.auditEvents];
    this.saveState(seed);
    return seed;
  }

  private getDefaultState(): AppState {
    return {
      version: STORAGE_VERSION,
      // Deep clones so in-memory mutations don't dirty static arrays
      obligations: JSON.parse(JSON.stringify(INITIAL_OBLIGATIONS)),
      controls: JSON.parse(JSON.stringify(INITIAL_CONTROLS)),
      mappings: JSON.parse(JSON.stringify(INITIAL_MAPPINGS)),
      auditEvents: JSON.parse(JSON.stringify(INITIAL_AUDIT_EVENTS)),
    };
  }
}

export const repository = new LocalStorageRepository();
