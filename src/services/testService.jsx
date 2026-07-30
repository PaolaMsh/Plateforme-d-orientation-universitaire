// services/testService.js

// Sauvegarder un test terminé
export const saveTestResult = (testResult) => {
    console.log('💾 saveTestResult appelé dans testService');

    const stored = localStorage.getItem('testHistory');
    let tests = stored ? JSON.parse(stored) : [];

    const newTest = {
        id: Date.now(),
        title: testResult.title || "Test d'orientation",
        date: new Date().toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }),
        score: testResult.score,
        type: testResult.type || 'RIASEC',
        code: testResult.code || '',
        status: 'completed',
        fullReport: testResult.fullReport || {},
        completedAt: new Date().toISOString(),
    };

    tests.unshift(newTest);
    localStorage.setItem('testHistory', JSON.stringify(tests));

    console.log('   - testHistory après sauvegarde:', localStorage.getItem('testHistory'));

    // Déclencher un événement pour mettre à jour l'interface
    window.dispatchEvent(new CustomEvent('newTestResult', { detail: { testResult: newTest } }));

    return newTest;
};

// Récupérer tous les tests
export const getTestHistory = () => {
    const stored = localStorage.getItem('testHistory');
    return stored ? JSON.parse(stored) : [];
};

// Supprimer un test
export const deleteTestResult = (testId) => {
    const tests = getTestHistory();
    const updated = tests.filter((t) => t.id !== testId);
    localStorage.setItem('testHistory', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('testDeleted', { detail: { testId } }));
    return updated;
};

// Sauvegarder un rapport PDF
export const savePdfReport = (report) => {
    const stored = localStorage.getItem('pdfReports');
    let reports = stored ? JSON.parse(stored) : [];

    const newReport = {
        id: Date.now(),
        title:
            report.title ||
            `Rapport ${report.type || 'orientation'} - ${new Date().toLocaleDateString()}`,
        date: new Date().toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }),
        size:
            report.size ||
            `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)} Mo`,
        type: report.type || 'RIASEC',
        testId: report.testId || null,
        content: report.content || {},
        savedAt: new Date().toISOString(),
    };

    reports.unshift(newReport);
    localStorage.setItem('pdfReports', JSON.stringify(reports));

    window.dispatchEvent(new CustomEvent('newReportSaved', { detail: { report: newReport } }));

    return newReport;
};

// Récupérer tous les rapports
export const getPdfReports = () => {
    const stored = localStorage.getItem('pdfReports');
    return stored ? JSON.parse(stored) : [];
};

// Supprimer un rapport
export const deletePdfReport = (reportId) => {
    const reports = getPdfReports();
    const updated = reports.filter((r) => r.id !== reportId);
    localStorage.setItem('pdfReports', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('reportDeleted', { detail: { reportId } }));
    return updated;
};
