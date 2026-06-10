import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { ErrorState, LoadingState } from '../../components/common/StateViews';
import { MeetingForm } from '../../components/meetings/MeetingForm';
import { useCreateMeeting } from '../../hooks/useMeetings';
import { useStages } from '../../hooks/useStages';
import type { MeetingFormData } from '../../types/meeting';

const toApiDate = (value: string) => new Date(value).toISOString();

export default function CreateMeetingPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { data: stages = [], isLoading, isError, refetch } = useStages();
  const createMeeting = useCreateMeeting();

  const handleSubmit = async (values: MeetingFormData) => {
    setError(null);
    try {
      const meeting = await createMeeting.mutateAsync({
        ...values,
        date: toApiDate(values.date),
      });
      navigate(`/meetings/${meeting.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create meeting.');
    }
  };

  return (
    <MainLayout title="Create Meeting">
      <PageHeader
        title="Create Meeting"
        breadcrumbs={[
          { label: 'Meetings', to: '/meetings' },
          { label: 'Create' },
        ]}
      />

      {isLoading ? (
        <LoadingState message="Loading stages..." />
      ) : isError ? (
        <ErrorState message="Failed to load stages." onRetry={refetch} />
      ) : (
        <MeetingForm
          stages={stages}
          submitLabel="Create Meeting"
          loading={createMeeting.isPending}
          error={error}
          onSubmit={handleSubmit}
        />
      )}
    </MainLayout>
  );
}
