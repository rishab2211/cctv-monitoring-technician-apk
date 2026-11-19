import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { InstallationJob, ChecklistItem } from '../../types';
import {
  useUpdateChecklistMutation,
  useSubmitJobSignatureMutation,
  useCompleteInstallationJobMutation,
} from '../../api/technicianApi';
import { CameraPairingScreen } from '../pairing/CameraPairingScreen';

interface Props {
  job: InstallationJob;
  onBack: () => void;
}

export const JobDetailScreen: React.FC<Props> = ({ job, onBack }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(job.checklist);
  const [showPairing, setShowPairing] = useState(false);
  const [hasSignature, setHasSignature] = useState(Boolean(job.signature));
  const [isCompleted, setIsCompleted] = useState(job.status === 'completed');

  const [updateChecklistMutation] = useUpdateChecklistMutation();
  const [submitSignatureMutation] = useSubmitJobSignatureMutation();
  const [completeJobMutation, { isLoading: isCompleting }] =
    useCompleteInstallationJobMutation();

  const toggleChecklistItem = async (id: string) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updated);
    try {
      await updateChecklistMutation({ id: job._id, items: updated });
    } catch {}
  };

  const handleCaptureSignature = async () => {
    setHasSignature(true);
    try {
      await submitSignatureMutation({
        id: job._id,
        signatureBase64: 'data:image/png;base64,mockSignData...',
      });
      Alert.alert('Signed', 'Customer digital signature recorded.');
    } catch {}
  };

  const handleCompleteJob = async () => {
    const allChecked = checklist.every((c) => c.completed);
    if (!allChecked) {
      Alert.alert('Checklist Incomplete', 'Please verify all checklist items before finishing.');
      return;
    }
    if (!hasSignature) {
      Alert.alert('Signature Required', 'Please collect customer signature before completing.');
      return;
    }

    try {
      await completeJobMutation({ id: job._id }).unwrap();
      setIsCompleted(true);
      Alert.alert(
        'Installation Completed! 🎉',
        'Camera is verified, cloud stream is online, and customer sign-off is recorded. Zero hardware left behind!'
      );
      onBack();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to complete job.');
    }
  };

  if (showPairing) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setShowPairing(false)}>
          <Text style={styles.backBtnText}>← Return to Job Detail</Text>
        </TouchableOpacity>
        <CameraPairingScreen
          jobId={job._id}
          onSuccess={() => setShowPairing(false)}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backBtnText}>← Back to Jobs</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>{job.customerName}</Text>
        <Text style={styles.subtitle}>{job.jobCode} • {job.cameraModel}</Text>
        <Text style={styles.address}>📍 {job.address.street}, {job.address.city}</Text>
      </View>

      {/* Camera Pairing Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>1. Camera Outbound Pairing</Text>
        <Text style={styles.cardDesc}>
          Use sound-wave SmartConfig chime and inject GB28181 parameters over local LAN.
        </Text>
        <TouchableOpacity
          style={styles.pairingButton}
          onPress={() => setShowPairing(true)}
        >
          <Text style={styles.pairingButtonText}>
            Launch 2-Minute Sound Pairing →
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4-Step Installation Checklist */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>2. Installation Quality Checklist</Text>
        {checklist.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.checkItem}
            onPress={() => toggleChecklistItem(item.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, item.completed && styles.checkboxActive]}>
              {item.completed && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={[styles.checkLabel, item.completed && styles.checkLabelCompleted]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Digital Customer Sign-Off */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>3. Customer Digital Sign-Off</Text>
        <Text style={styles.cardDesc}>
          Customer reviews live WebRTC stream on phone and signs screen to approve.
        </Text>
        <TouchableOpacity
          style={[styles.signButton, hasSignature && styles.signButtonActive]}
          onPress={handleCaptureSignature}
        >
          <Text style={styles.signButtonText}>
            {hasSignature ? '✓ Customer Signature Recorded' : 'Collect Customer Signature'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Finish & Depart */}
      <TouchableOpacity
        style={[styles.completeButton, isCompleted && styles.completeButtonDone]}
        onPress={handleCompleteJob}
        disabled={isCompleting || isCompleted}
      >
        <Text style={styles.completeButtonText}>
          {isCompleted ? '✓ Job Completed' : 'Complete Installation Job'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  backBtn: {
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  backBtnText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h1,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    marginBottom: 4,
  },
  address: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.xs,
  },
  cardDesc: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  pairingButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.button,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  pairingButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    marginRight: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  checkMark: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkLabel: {
    ...TYPOGRAPHY.body,
    flex: 1,
  },
  checkLabelCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  signButton: {
    backgroundColor: COLORS.cardBorder,
    borderRadius: RADIUS.button,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  signButtonActive: {
    backgroundColor: COLORS.accentMuted,
    borderColor: COLORS.accent,
    borderWidth: 1,
  },
  signButtonText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  completeButton: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.button,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  completeButtonDone: {
    backgroundColor: COLORS.textMuted,
  },
  completeButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
