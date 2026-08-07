<template>
</template>

<script setup lang="ts">
import { useApplicants } from '~/composables/useApplicants'
import { useApplicantActions } from '~/composables/useApplicantActions'

const { selectedCandidate, candidateDetailPanel, isPdfViewerOpen, selectedPdfUrl, selectedPdfCandidateName } = useApplicants()
const { getStatusBadgeClass, getStatusLabel, advanceCandidateStage, triggerReject } = useApplicantActions()

const openPdfViewer = (candidate: any) => {
  selectedPdfUrl.value = candidate.cvUrl || "";
  selectedPdfCandidateName.value = candidate.name || "";
  isPdfViewerOpen.value = true;
};
</script>
