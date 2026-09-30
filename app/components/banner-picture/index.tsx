import { getImageProps } from "next/image";

export const BannerPicture = () => {
  const bannerCommon = { alt: "banner", sizes: "100vw", loading: "eager" as const };
  const {
    props: { srcSet: desktopBanner },
  } = getImageProps({ ...bannerCommon, src: "/banner.webp", width: 3000, height: 1000 });
  const {
    props: { srcSet: _phoneBanner, ...phoneBannerProps },
  } = getImageProps({ ...bannerCommon, src: "/banner-phone.webp", width: 1500, height: 1024 });

  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={desktopBanner} />
      {/* oxlint-disable-next-line react/jsx-props-no-spreading */}
      <img {...phoneBannerProps} alt="banner" className="h-auto w-full" />
    </picture>
  );
};
