export const useProfileState = () => {
  const profilePic = useState<string>("userProfilePic", () => "");
  const isFetching = useState<boolean>("isFetchingProfilePic", () => false);
  const hasFetched = useState<boolean>("hasFetchedProfilePic", () => false);

  const fetchProfilePic = async (userId: string) => {
    if (!userId || !process.client) return;
    if (isFetching.value || hasFetched.value) return;

    isFetching.value = true;
    try {
      const config = useRuntimeConfig();
      const apiBase =
        config.public.apiUrl ||
        config.public.apiBase ||
        "https://olhoy8ebq7.execute-api.us-east-1.amazonaws.com";
      const res = await $fetch(`${apiBase}/profile/${userId}`).catch(
        () => null,
      );
      const profile: any = typeof res === "string" ? JSON.parse(res) : res;
      if (
        profile &&
        (profile.fotoPerfil ||
          profile.avatarUrl ||
          profile.logo ||
          profile.image)
      ) {
        profilePic.value =
          profile.fotoPerfil ||
          profile.avatarUrl ||
          profile.logo ||
          profile.image;
      } else {
        profilePic.value = "";
      }
    } catch {
      profilePic.value = "";
    } finally {
      isFetching.value = false;
      hasFetched.value = true;
    }
  };

  const setProfilePic = (url: string) => {
    profilePic.value = url;
  };

  return {
    profilePic,
    hasFetched,
    fetchProfilePic,
    setProfilePic,
  };
};
