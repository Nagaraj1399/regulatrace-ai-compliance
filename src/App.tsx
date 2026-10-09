/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { ToastProvider, useToast } from './components/common/Toast';
import { AppShell } from './components/layout/AppShell';
import { MappingWorkbench } from './components/workbench/MappingWorkbench';
import { mappingService } from './services/mappingService';
import { repository } from './services/storage';

function AppContent() {
  const { showToast } = useToast();
  const [resetKey, setResetKey] = useState(0);
  const [isSimulatingError, setIsSimulatingError] = useState(false);

  const handleExportCsv = useCallback(() => {
    try {
      const state = mappingService.getState();
      const csv = mappingService.exportRegisterCsv(state.obligations, state);

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `regulatrace-mapping-register-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast({
        type: 'success',
        title: 'Export Successful',
        message: 'The compliance mapping register has been downloaded as a formatted CSV file.',
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Export Failed',
        message: err?.message || 'Unable to generate CSV export.',
      });
    }
  }, [showToast]);

  const handleResetSeedData = useCallback(() => {
    try {
      mappingService.resetDemoData();
      setResetKey((prev) => prev + 1);
      showToast({
        type: 'success',
        title: 'Seed Data Restored',
        message: 'Application prototype repository reset to initial deterministic compliance dataset.',
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Reset Error',
        message: err?.message || 'Failed to restore seed dataset.',
      });
    }
  }, [showToast]);

  const handleToggleSimulateError = useCallback(
    (enabled: boolean) => {
      setIsSimulatingError(enabled);
      repository.setSimulationError(enabled);
      if (enabled) {
        showToast({
          type: 'warning',
          title: 'Storage Error Simulation Enabled',
          message: 'Future save operations will now encounter a simulated disk write failure (Test 18 validation).',
        });
      } else {
        showToast({
          type: 'info',
          title: 'Storage Error Simulation Disabled',
          message: 'Normal storage persistence restored.',
        });
      }
    },
    [showToast]
  );

  return (
    <AppShell
      onExportCsv={handleExportCsv}
      onResetSeedData={handleResetSeedData}
      isSimulatingError={isSimulatingError}
      onToggleSimulateError={handleToggleSimulateError}
    >
      <MappingWorkbench key={resetKey} />
    </AppShell>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
