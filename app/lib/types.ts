export interface ArticleItem {
  slug: string;
  title: string;
  rating: number;
  ratingCount: number;
  postDate: number;
  tags: string[];
  carouselBanner: string;
  contestListBanner: string;
  images: string[];
  review: { text: string; link: string; reviewer: number };
  authors: string[];
}
