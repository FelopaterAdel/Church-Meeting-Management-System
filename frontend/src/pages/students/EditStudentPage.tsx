import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Paper } from '@mui/material';
import { useStudent, useUpdateStudent } from '../../hooks/useStudents';
import { useStages } from '../../hooks/useStages';
import { StudentForm } from '../../components/students/StudentForm';
import { PageHeader } from '../../components/common/PageHeader';
import { LoadingState, ErrorState } from '../../components/common/StateViews';
import type { StudentFormData } from '../../types/student';

export default function EditStudentPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: student, isLoading, isError, refetch } = useStudent(id);
  const { data: stages = [], isLoading: stagesLoading, isError: stagesError, refetch: refetchStages } = useStages();
  const mutation = useUpdateStudent(id);

  const handleSubmit = async (data: StudentFormData) => {
    await mutation.mutateAsync(data);
    navigate(`/students/${id}`, { replace: true });
  };

  if (isLoading || stagesLoading) return <LoadingState message="Loading student data..." />;
  if (isError || !student) return <ErrorState message="Failed to load student." onRetry={refetch} />;
  if (stagesError) return <ErrorState message="Failed to load stages." onRetry={refetchStages} />;

  return (
    <Box>
      <PageHeader
        title="Edit Student"
        subtitle={student.fullName}
        breadcrumbs={[
          { label: 'Students', to: '/students' },
          { label: student.fullName, to: `/students/${id}` },
          { label: 'Edit' },
        ]}
      />

      {mutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {(mutation.error as Error)?.message || 'Failed to update student. Please try again.'}
        </Alert>
      )}

      {mutation.isSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Student updated successfully.
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <StudentForm
          stages={stages}
          defaultValues={{
            fullName: student.fullName,
            phoneNumber: student.phoneNumber,
            confessionFather: student.confessionFather,
            address: student.address,
            latitude: student.latitude ?? null,
            longitude: student.longitude ?? null,
            stageId: student.stageId,
            internalStudentCode: student.internalStudentCode,
            status: student.status,
          }}
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
          submitLabel="Save Changes"
        />
      </Paper>
    </Box>
  );
}
