/**
 * Presentational layout for a room's Open Graph image (1200×630).
 *
 * Written with inline styles only, using the flexbox subset that Satori
 * (the engine behind `next/og`'s `ImageResponse`, i.e. `@vercel/og`) supports.
 * This lets the very same component be:
 *   - rendered to a PNG on the server by `opengraph-image.tsx` / `twitter-image.tsx`
 *   - previewed as plain HTML in Storybook (`RoomOgImage.stories.tsx`).
 *
 * Keep it free of Tailwind classes, external CSS and unsupported CSS features.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;

/** Brand palette mirrored from globals.css (hex so Satori renders it reliably). */
const COLORS = {
  bgFrom: "#121218",
  bgTo: "#1d1320",
  primary: "#f43f5e",
  text: "#fafafa",
  muted: "#a1a1aa",
  cardBorder: "rgba(244, 63, 94, 0.35)",
} as const;

export interface RoomOgImageProps {
  /**
   * Raw title as captured by the extension, e.g.
   * `"作品名 - 第1話 - サブタイトル"`. May be empty for rooms created by older
   * extension versions; a generic headline is shown in that case.
   */
  title?: string;
}

/** Split the extension's `"work - episode - subtitle"` title into work + the rest. */
function splitTitle(title: string): { work: string; sub: string } {
  const parts = title
    .split(" - ")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return { work: "", sub: "" };
  return { work: parts[0], sub: parts.slice(1).join("　") };
}

export function RoomOgImage({
  title = "",
}: RoomOgImageProps): React.JSX.Element {
  const { work, sub } = splitTitle(title.trim());
  const hasTitle = work.length > 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        backgroundColor: COLORS.bgFrom,
        backgroundImage: `radial-gradient(1100px 540px at 88% -10%, rgba(244,63,94,0.30), rgba(244,63,94,0) 60%), linear-gradient(135deg, ${COLORS.bgFrom} 0%, ${COLORS.bgTo} 100%)`,
        color: COLORS.text,
        fontFamily: "Noto Sans JP",
        position: "relative",
      }}
    >
      {/* Header: brand wordmark + watch-party badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 20,
              backgroundColor: COLORS.primary,
              marginRight: 24,
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            ▶
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            d-party
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "14px 28px",
            borderRadius: 999,
            border: `2px solid ${COLORS.cardBorder}`,
            backgroundColor: "rgba(244, 63, 94, 0.12)",
            color: COLORS.primary,
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          WATCH PARTY
        </div>
      </div>

      {/* Center: headline + title */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            color: COLORS.primary,
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          {hasTitle ? "この作品を一緒に視聴中" : "dアニメストアで同時視聴"}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: hasTitle ? 76 : 64,
            fontWeight: 700,
            lineHeight: 1.18,
            letterSpacing: -1,
            // Clamp very long titles to keep the layout balanced.
            overflow: "hidden",
            maxHeight: 76 * 1.18 * 3,
          }}
        >
          {hasTitle ? work : "友だちと、同じ瞬間を。"}
        </div>

        {hasTitle && sub.length > 0 ? (
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 38,
              fontWeight: 400,
              color: COLORS.muted,
              overflow: "hidden",
              maxHeight: 38 * 1.3 * 2,
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>

      {/* Footer: tagline + domain */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 30,
          color: COLORS.muted,
        }}
      >
        <div style={{ display: "flex" }}>dアニメストアを友だちと同時視聴</div>
        <div style={{ display: "flex", fontWeight: 700, color: COLORS.text }}>
          d-party.net
        </div>
      </div>
    </div>
  );
}
