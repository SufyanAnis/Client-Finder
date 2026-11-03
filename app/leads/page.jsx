import { Page } from "../../components/SiteChrome";
import { Breadcrumbs, JsonLd, ToolCta, fmtDate } from "../../components/Content";
import { RedditBoard, DiscordBoard, ShareBar } from "../../components/LeadsBoard";
import AdSlot from "../../components/AdSlot";
import { getRedditBoard, getDiscordBoard, safe } from "../../lib/board";
import { SITE, ADS, absUrl } from "../../lib/site";

export const revalidate = 3600;

export const metadata = {
  title: "Fresh freelance leads from Reddit & Discord — updated daily",
  description:
    "Free daily list of people hiring freelancers right now: [Hiring] posts from Reddit and Discord job channels for developers, designers, editors, writers and marketers.",
  alternates: { canonical: "/leads" },
};

export default async function LeadsPage() {
  const [reddit, discord] = await Promise.all([safe(getRedditBoard), safe(getDiscordBoard)]);
  const rCount = reddit ? reddit.cats.reduce((n, c) => n + c.posts.length, 0) : 0;
  const dCount = discord ? discord.posts.length : 0;
  const shareText = `Fresh freelance leads — ${rCount + dCount} people hiring right now, free on ${SITE.name}:`;

  return (
    <Page>
      <Breadcrumbs items={[{ name: "Fresh leads", href: "/leads" }]} />
      <header className="page-head">
        <h1>Fresh freelance <em>leads.</em></h1>
        <p>People posting that they want to hire a freelancer — collected from public Reddit posts and Discord job channels, refreshed automatically. Free to browse, export and share.</p>
        <div className="pills" style={{ marginTop: 16 }}>
          <a href="#reddit" className="tagpill">Reddit · {rCount}</a>
          <a href="#discord" className="tagpill">Discord · {dCount}</a>
        </div>
      </header>

      <ShareBar url={absUrl("/leads")} text={shareText} />

      <section id="reddit" className="board-sec">
        <div className="sec-head">
          <h2>Reddit <span className="count">[HIRING] POSTS · THIS WEEK</span></h2>
          {reddit?.updated && <span className="fine">Updated {fmtDate(reddit.updated.slice(0, 10))}</span>}
        </div>
        {reddit ? <RedditBoard cats={reddit.cats} /> : (
          <div className="pipe-empty">The Reddit list is refreshing — check back in a few minutes.</div>
        )}
        <p className="fine">Posts are public Reddit threads, newest first. Reply on Reddit following each subreddit's rules — most allow replies to [Hiring] posts but ban unsolicited DMs.</p>
      </section>

      <AdSlot slot={ADS.slots.display} />

      <section id="discord" className="board-sec">
        <div className="sec-head">
          <h2>Discord <span className="count">JOB CHANNELS · LAST 14 DAYS</span></h2>
          {discord?.updated && <span className="fine">Updated {fmtDate(discord.updated.slice(0, 10))}</span>}
        </div>
        {discord ? (
          <>
            {discord.channels?.length > 0 && <p className="fine" style={{ marginBottom: 10 }}>From: {discord.channels.map((c) => c.label).join(" · ")}</p>}
            <DiscordBoard posts={discord.posts} />
          </>
        ) : (
          <div className="pipe-empty">Discord job channels are coming soon. Run a community with a jobs channel? <a href="/contact">Get in touch</a> to have it included.</div>
        )}
        <p className="fine">Discord links open for members of that server. We show the job text only — never usernames.</p>
      </section>

      <ToolCta title="Want companies that need you, not just posts?" text="The finder searches company job posts, funding and launch news for businesses that need your exact service, scores fit and drafts the first message." />

      {reddit && (
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Freelance hiring posts on Reddit this week",
          url: absUrl("/leads"),
          numberOfItems: rCount,
          itemListElement: reddit.cats.flatMap((c) => c.posts).slice(0, 50).map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.title, url: p.url })),
        }} />
      )}
    </Page>
  );
}
