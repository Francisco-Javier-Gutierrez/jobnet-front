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
      const apiBase = config.public.apiUrl || config.public.apiBase || "https://olhoy8ebq7.execute-api.us-east-1.amazonaws.com";
      const profile: any = await $fetch(`${apiBase}/profile/${userId}`);
      if (profile && (profile.fotoPerfil || profile.avatarUrl)) {
        profilePic.value = profile.fotoPerfil || profile.avatarUrl;
        console.log("Profile picture resolved:", profilePic.value);
      } else {
        profilePic.value = ""; // Default or empty
        console.log("No profile picture found in DB for user.");
      }
    } catch (e) {
      console.warn("Error fetching profile picture:", e);
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
