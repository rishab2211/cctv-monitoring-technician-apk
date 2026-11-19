import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { useGetAssignedJobsQuery } from '../../api/technicianApi';
import { InstallationJob } from '../../types';

interface Props {
  onSelectJob: (job: InstallationJob) => void;
}

export const JobListScreen: React.FC<Props> = ({ onSelectJob }) => {
  const { data, isLoading, refetch } = useGetAssignedJobsQuery();
  const jobs: InstallationJob[] = data?.data?.jobs || [
    {
      _id: 'job_001',
      jobCode: 'JOB-2026-1042',
      customerName: 'Aditi Sharma',
      customerPhone: '+91 98765 43210',
      address: {
        street: '124 Indiranagar 100ft Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
      },
      status: 'pending',
      cameraModel: 'Xiongmai PTZ 4MP HEVC',
      checklist: [
        { id: '1', label: 'Wall Mounting & Power Adapter Installed', completed: false },
        { id: '2', label: 'Wi-Fi Sound Pairing Verified', completed: false },
        { id: '3', label: 'GB28181 Outbound Cloud Push Verified', completed: false },
        { id: '4', label: 'Customer Digital Signature Collected', completed: false },
      ],
      photos: [],
      scheduledAt: '2026-10-19T10:00:00Z',
    },
  ];

  const renderJobItem = ({ item }: { item: InstallationJob }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => onSelectJob(item)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.jobCode}>{item.jobCode}</Text>
        <View
          style={[
            styles.statusPill,
            item.status === 'completed'
              ? styles.statusCompleted
              : styles.statusPending,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === 'completed'
                ? styles.statusTextCompleted
                : styles.statusTextPending,
            ]}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.customerName}>{item.customerName}</Text>
      <Text style={styles.address}>
        📍 {item.address.street}, {item.address.city}
      </Text>
      <Text style={styles.cameraModel}>📷 {item.cameraModel}</Text>

      <View style={styles.cardFooter}>
        <Text style={styles.actionText}>Open Installation Workflow →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Assigned Installations</Text>
        <Text style={styles.subtitle}>
          Zero-Hardware GB28181 Deployment Queue
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item._id}
          renderItem={renderJobItem}
          contentContainerStyle={styles.listContent}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.h1,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
  },
  loader: {
    marginTop: SPACING.xxxl,
  },
  listContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  jobCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  jobCode: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusPill: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.pill,
  },
  statusPending: {
    backgroundColor: COLORS.warningMuted,
  },
  statusCompleted: {
    backgroundColor: COLORS.accentMuted,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusTextPending: {
    color: COLORS.warning,
  },
  statusTextCompleted: {
    color: COLORS.accent,
  },
  customerName: {
    ...TYPOGRAPHY.h2,
    fontSize: 18,
    marginBottom: SPACING.xs,
  },
  address: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  cameraModel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: SPACING.sm,
    alignItems: 'flex-end',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
