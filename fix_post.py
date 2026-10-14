import re

with open('app/pages/posts/[id].vue', 'r', encoding='utf-8') as f:
    content = f.read()

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

if old_current_user_id in content:
    content = content.replace(old_current_user_id, new_current_user_id)
    with open('app/pages/posts/[id].vue', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed posts/[id].vue")
else:
    print("Pattern not found in posts/[id].vue")
