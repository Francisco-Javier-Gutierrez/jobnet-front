export interface PostComment {
  id?: string;
  uniqueId?: string;
  author?: string;
  authorId?: string;
  authorUuid?: string;
  authorAvatar?: string;
  fotoPerfil?: string;
  content: string;
  createdAt?: string;
  replies?: PostComment[];
}

export interface Post {
  id?: string;
  uniqueId?: string;
  author?: string;
  authorId?: string;
  authorUuid?: string;
  userId?: string;
  authorAvatar?: string;
  fotoPerfil?: string;
  role?: string;
  tipoUsuario?: string;
  isCompany?: boolean;
  content?: string;
  media?: string;
  pdfUrl?: string;
  pdfName?: string;
  createdAt?: string;
  likes?: number;
  likesList?: string[];
  likedBy?: string[];
  likes_list?: string[];
  isLiked?: boolean;
  comments?: PostComment[];
  commentsCount?: number;
  sharesCount?: number;
  bookmarks?: string[];
  bookmarksList?: string[];
  bookmarkedBy?: string[];
  bookmarksCount?: number;
  isBookmarked?: boolean;
}
