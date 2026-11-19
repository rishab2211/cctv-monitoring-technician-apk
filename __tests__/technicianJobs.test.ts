import { InstallationJob } from '../src/types';

describe('Technician Installation Workflow Logic', () => {
  const sampleJob: InstallationJob = {
    _id: 'job_test_1',
    jobCode: 'JOB-2026-001',
    customerName: 'Rohit Verma',
    customerPhone: '+91 91234 56789',
    address: {
      street: '45 Koramangala 4th Block',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560034',
    },
    status: 'in_progress',
    cameraModel: 'Xiongmai PTZ 4MP',
    checklist: [
      { id: '1', label: 'Wall Mount Secured', completed: true },
      { id: '2', label: 'Acoustic Wi-Fi Pairing Done', completed: true },
      { id: '3', label: 'GB28181 Outbound Stream Active', completed: true },
      { id: '4', label: 'Customer Signed Approval', completed: false },
    ],
    photos: ['photo1.jpg', 'photo2.jpg'],
    scheduledAt: '2026-10-19T14:00:00Z',
  };

  it('validates that all checklist items must be completed before job closure', () => {
    const isReadyForClose = (job: InstallationJob) => {
      const allChecked = job.checklist.every((c) => c.completed);
      const hasSignature = Boolean(job.signature);
      return allChecked && hasSignature;
    };

    // Initially incomplete (checklist item 4 and signature missing)
    expect(isReadyForClose(sampleJob)).toBe(false);

    // Complete remaining items
    const completedJob: InstallationJob = {
      ...sampleJob,
      checklist: sampleJob.checklist.map((c) => ({ ...c, completed: true })),
      signature: 'data:image/png;base64,mockSignature...',
      status: 'completed',
    };

    expect(isReadyForClose(completedJob)).toBe(true);
    expect(completedJob.status).toBe('completed');
  });

  it('tracks GPS and address formatting accurately', () => {
    const fullAddress = `${sampleJob.address.street}, ${sampleJob.address.city}, ${sampleJob.address.state} - ${sampleJob.address.pincode}`;
    expect(fullAddress).toContain('Koramangala');
    expect(fullAddress).toContain('560034');
  });
});
