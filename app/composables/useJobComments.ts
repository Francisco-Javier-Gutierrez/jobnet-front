import { ref, computed } from "vue";
import { useRuntimeConfig } from "#imports";
import { useAuth } from "#imports";
import { useAppFeedback } from "#imports";

interface CommentData {
  id: string;
  parentId?: string | null;
  text: string;
  createdAt: string;
  user: string;
}

type CommentNode = CommentData & { children: CommentNode[] };

export function useJobComments(jobId: string, jobRef: any) {
  const config = useRuntimeConfig();
  const { data: session, status } = useAuth();
  
  const commentsList = ref<CommentData[]>([]);
  const totalComments = ref(0);
  const newCommentText = ref("");
  const replyContentText = ref("");
  const replyingToCommentId = ref<string | null>(null);
  const isCreatingComment = ref(false);

  const canDeleteComment = (c: CommentData): boolean => {
    if (status.value !== "authenticated") return false;
    if (c.user === session.value?.user?.name || c.user === session.value?.user?.email) return true;
    const role = (session.value?.user as any)?.tipoUsuario?.toUpperCase();
    return role === "ADMIN" || role === "MODERATOR";
  };

  const commentTree = computed<CommentNode[]>(() => {
    const nodes = new Map<string, CommentNode>();
    const roots: CommentNode[] = [];

    commentsList.value.forEach((c) => {
      nodes.set(c.id, { ...c, children: [] });
    });

    nodes.forEach((node) => {
      const parentId = node.parentId;
      const parent = parentId ? nodes.get(parentId) : undefined;

      if (parent && parent.id !== node.id) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    });

    roots.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const sortChildren = (nodeList: CommentNode[]) => {
      nodeList.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      nodeList.forEach((child) => sortChildren(child.children));
    };

    roots.forEach((root) => sortChildren(root.children));
    return roots;
  });

  const loadComments = async () => {
    try {
      const fetchedJob = await $fetch<any>(`${config.public.apiUrl}/jobs/${jobId}`);
      commentsList.value = fetchedJob?.comments || [];
      totalComments.value = commentsList.value.length;
    } catch (e) {
      console.error("Error loading comments:", e);
    }
  };

  const saveCommentsToLocalStorage = () => {
    if (jobRef.value) {
      jobRef.value.comments = commentsList.value;
    }
  };

  const submitComment = async () => {
    if (!newCommentText.value.trim()) return;
    isCreatingComment.value = true;
    const username = session.value?.user?.name || "Usuario Anónimo";

    try {
      const created = await $fetch<CommentData>(`/api/jobs/${jobId}/comment`, {
        method: "POST",
        body: {
          user: username,
          text: newCommentText.value.trim(),
          parentId: null,
        },
      });

      commentsList.value.push(created);
      saveCommentsToLocalStorage();
      newCommentText.value = "";
      totalComments.value = commentsList.value.length;
    } catch (e) {
      console.error("Error submitting comment:", e);
      const { showError } = useAppFeedback();
      showError("Error", "Error al guardar el comentario.");
    } finally {
      isCreatingComment.value = false;
    }
  };

  const toggleReplyForm = (commentId: string) => {
    if (replyingToCommentId.value === commentId) {
      replyingToCommentId.value = null;
    } else {
      replyingToCommentId.value = commentId;
      replyContentText.value = "";
    }
  };

  const submitReply = async (parentCommentId: string) => {
    if (!replyContentText.value.trim()) return;
    isCreatingComment.value = true;
    const username = session.value?.user?.name || "Usuario Anónimo";

    try {
      const created = await $fetch<CommentData>(`/api/jobs/${jobId}/comment`, {
        method: "POST",
        body: {
          user: username,
          text: replyContentText.value.trim(),
          parentId: parentCommentId,
        },
      });

      commentsList.value.push(created);
      saveCommentsToLocalStorage();
      replyContentText.value = "";
      replyingToCommentId.value = null;
      totalComments.value = commentsList.value.length;
    } catch (e) {
      console.error("Error submitting reply:", e);
      const { showError } = useAppFeedback();
      showError("Error", "Error al guardar la respuesta.");
    } finally {
      isCreatingComment.value = false;
    }
  };

  const deleteComment = async (commentId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este comentario?")) {
      try {
        await $fetch(`/api/jobs/${jobId}/comment/${encodeURIComponent(commentId)}`, {
          method: "DELETE",
        });

        const idsToRemove = new Set<string>();
        const queue = [commentId];

        while (queue.length > 0) {
          const currentId = queue.shift();
          if (!currentId) continue;
          idsToRemove.add(currentId);
          commentsList.value
            .filter((c) => c.parentId === currentId)
            .forEach((child) => queue.push(child.id));
        }

        commentsList.value = commentsList.value.filter(
          (c) => !idsToRemove.has(c.id),
        );
        saveCommentsToLocalStorage();
        totalComments.value = commentsList.value.length;
      } catch (e) {
        console.error("Error deleting comment:", e);
        const { showError } = useAppFeedback();
        showError("Error", "No se pudo eliminar el comentario.");
      }
    }
  };

  const formatDate = (isoString: string): string => {
    if (!isoString) return "N/A";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return "N/A";
      return d.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "N/A";
    }
  };

  return {
    commentsList,
    totalComments,
    newCommentText,
    replyContentText,
    replyingToCommentId,
    isCreatingComment,
    commentTree,
    loadComments,
    submitComment,
    toggleReplyForm,
    submitReply,
    deleteComment,
    canDeleteComment,
    formatDate
  };
}
