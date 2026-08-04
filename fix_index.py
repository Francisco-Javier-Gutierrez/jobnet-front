import re

with open('app/pages/index.vue', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace alert with showError/showInfo
content = content.replace('alert("Por favor selecciona un archivo PDF.");', 'showInfo("Notificación", "Por favor selecciona un archivo PDF.");')
content = content.replace('alert("Error al subir la imagen a S3: " + res.error);', 'showError("Error", "Error al subir la imagen a S3: " + res.error);')
content = content.replace('alert("Error al subir el archivo PDF a S3: " + res.error);', 'showError("Error", "Error al subir el archivo PDF a S3: " + res.error);')
content = content.replace('alert("Error al publicar la publicación en el servidor.");', 'showError("Error", "Error al publicar la publicación en el servidor.");')
content = content.replace('alert("Error al guardar el comentario.");', 'showError("Error", "Error al guardar el comentario.");')
content = content.replace('alert("Error al guardar la respuesta.");', 'showError("Error", "Error al guardar la respuesta.");')
content = content.replace('alert("Error al eliminar el comentario del servidor.");', 'showError("Error", "Error al eliminar el comentario del servidor.");')
content = re.sub(r'alert\(\s*`Enlace copiado al portapapeles: (.*?)`,\s*\);', r'showSuccess("Éxito", `Enlace copiado al portapapeles: \1`,);', content)

# Add useAppFeedback import
content = content.replace('<script setup lang="ts">', '<script setup lang="ts">\nimport { useAppFeedback } from "~/composables/useAppFeedback";\nconst { showError, showSuccess, showInfo } = useAppFeedback();')

# Fix currentUserId
old_current_user_id = '''const currentUserId = computed(() => {
  return (
    session.value?.user?.email ||
    (session.value?.user as any)?.id ||
    "anonymous-user"
  );
});'''

new_current_user_id = '''const currentUserId = computed(() => {
  return (
    (session.value?.user as any)?.id ||
    session.value?.user?.email ||
    "anonymous-user"
  );
});'''

content = content.replace(old_current_user_id, new_current_user_id)

with open('app/pages/index.vue', 'w', encoding='utf-8') as f:
    f.write(content)
