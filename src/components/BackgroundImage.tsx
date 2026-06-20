import Image from 'next/image';

export function BackgroundImage() {
  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Image
        src="/home_long.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/30 via-[#030712]/10 to-[#030712]/60" />
    </div>
  );
}
