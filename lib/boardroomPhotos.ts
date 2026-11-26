export const BOARDROOM_WIDTHS = [640, 1280, 1920, 2560] as const;

export type BoardroomId = 1 | 2 | 3;

export function boardroomSrcSet(id: BoardroomId, format: "avif" | "webp") {
  return BOARDROOM_WIDTHS.map(
    (width) => `/media/boardroom/${id}-${width}.${format} ${width}w`,
  ).join(", ");
}

export function boardroomSrc(id: BoardroomId) {
  return `/media/boardroom/${id}-1280.webp`;
}
