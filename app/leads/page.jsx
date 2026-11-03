import { Page } from "../../components/SiteChrome";
import { Breadcrumbs, JsonLd, ToolCta, fmtDate } from "../../components/Content";
import { RedditBoard, DiscordBoard, FeedBoard, ShareBar } from "../../components/LeadsBoard";
import AdSlot from "../../components/AdSlot";
import { getRedditBoard, getDiscordBoard, getFeedsBoard, getLinkedInBoard, getTwitterBoard, safe } from "../../lib/board";
import { SITE, ADS, absUrl } from "../../lib/site";

// Rendered per request from the data cache (lib/board.js), so a build-time fetch
// failure can never freeze an empty page; the sources themselves refresh on their own schedule.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Fresh freelance leads — Reddit, Hacker News, remote job boards",
  description:
    "Free daily list of people and companies hiring freelancers: Reddit [Hiring] posts, Hacker News freelance and contract work, Remote OK and We Work Remotely jobs, and Discord job channels.",
  alternates: { canonical: "/leads" },
};

export default async function LeadsPage() {
  const [reddit, discord, feeds, linkedin, xb] = await Promise.all([safe(getRedditBoard), safe(getDiscordBoard), safe(getFeedsBoard), safe(getLinkedInBoard), safe(getTwitterBoard)]);
  const xCount = xb ? xb.items.length : 0;
  const nCount = feeds?.launches ? feeds.launches.length : 0;
  const lCount = linkedin ? linkedin.items.length : 0;
  const hCount = feeds ? feeds.hn.length : 0;
  const jCount = feeds ? feeds.remote.length : 0;
  const rCount = reddit ? reddit.cats.reduce((n, c) => n + c.posts.length, 0) : 0;
  const dCount = discord ? discord.posts.length : 0;
  const shareText = `Fresh freelance leads — ${rCount + dCount + hCount + jCount + lCount + xCount} people and companies hiring right now, free on ${SITE.name}:`;

  return (
    <Page>
      <Breadcrumbs items={[{ name: "Fresh leads", href: "/leads" }]} />
      <header className="page-head">
        <h1>Fresh freelance <em>leads.</em></h1>
        <p>People posting that they want to hire a freelancer — collected from Reddit, X (Twitter), LinkedIn jobs, Hacker News, remote job boards, new product launches and Discord job channels, refreshed automatically. Free to browse, export and share.</p>
        <div className="pills" style={{ marginTop: 16 }}>
          <a href="#reddit" className="tagpill">Reddit · {rCount}</a>
          <a href="#x" className="tagpill">X (Twitter) · {xCount}</a>
          <a href="#linkedin" className="tagpill">LinkedIn · {lCount}</a>
          <a href="#hackernews" className="tagpill">Hacker News · {hCount}</a>
          <a href="#remote" className="tagpill">Remote job boards · {jCount}</a>
          <a href="#launches" className="tagpill">New launches · {nCount}</a>
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

      <section id="x" className="board-sec">
        <div className="sec-head">
          <h2>X (Twitter) <span className="count">HIRING POSTS · LAST 10 DAYS</span></h2>
          {xb?.updated && <span className="fine">Updated {fmtDate(xb.updated.slice(0, 10))}</span>}
        </div>
        {xb ? <FeedBoard items={xb.items} name="x-twitter" /> : <div className="pipe-empty">Refreshing — check back in a few minutes.</div>}
        <p className="fine">Public tweets from people and companies hiring freelancers or contractors, as indexed by search engines. Reply to the tweet or check the poster's profile for how to apply.</p>
      </section>

      <section id="linkedin" className="board-sec">
        <div className="sec-head">
          <h2>LinkedIn <span className="count">FREELANCE &amp; CONTRACT JOBS · THIS WEEK</span></h2>
          {linkedin?.updated && <span className="fine">Updated {fmtDate(linkedin.updated.slice(0, 10))}</span>}
        </div>
        {linkedin ? <FeedBoard items={linkedin.items} name="linkedin" /> : <div className="pipe-empty">Refreshing — check back in a few minutes.</div>}
        <p className="fine">Public LinkedIn job posts for freelance, contract and part-time work, newest first. Staffing agencies and job aggregators are filtered out. Apply on LinkedIn, or reach the company directly with a short, specific pitch.</p>
      </section>

      <section id="hackernews" className="board-sec">
        <div className="sec-head">
          <h2>Hacker News <span className="count">FREELANCE &amp; CONTRACT · THIS MONTH</span></h2>
          {feeds?.updated && <span className="fine">Updated {fmtDate(feeds.updated.slice(0, 10))}</span>}
        </div>
        {feeds ? <FeedBoard items={feeds.hn} name="hacker-news" /> : <div className="pipe-empty">Refreshing — check back in a few minutes.</div>}
        <p className="fine">From the monthly "Freelancer? Seeking freelancer?" threads (people seeking a freelancer) and contract or part-time roles in "Who is hiring?". Mostly startups — reply on the thread or use the contact in the post.</p>
      </section>

      <AdSlot slot={ADS.slots.display} />

      <section id="remote" className="board-sec">
        <div className="sec-head">
          <h2>Remote job boards <span className="count">REMOTE OK · WWR · REMOTIVE · ARBEITNOW · JOBICY · HIMALAYAS · 14 DAYS</span></h2>
          {feeds?.updated && <span className="fine">Updated {fmtDate(feeds.updated.slice(0, 10))}</span>}
        </div>
        {feeds ? <FeedBoard items={feeds.remote} name="remote-jobs" /> : <div className="pipe-empty">Refreshing — check back in a few minutes.</div>}
        <p className="fine">Companies hiring remotely for skills freelancers sell — a hiring post means they need the work done, and many will take a contractor while they recruit. Jobs via <a href="https://remoteok.com" target="_blank" rel="noopener">Remote OK</a>, <a href="https://weworkremotely.com" target="_blank" rel="noopener">We Work Remotely</a>, <a href="https://remotive.com" target="_blank" rel="noopener">Remotive</a>, <a href="https://www.arbeitnow.com" target="_blank" rel="noopener">Arbeitnow</a>, <a href="https://jobicy.com" target="_blank" rel="noopener">Jobicy</a> and <a href="https://himalayas.app" target="_blank" rel="noopener">Himalayas</a>.</p>
      </section>

      <section id="launches" className="board-sec">
        <div className="sec-head">
          <h2>New launches <span className="count">SHOW HN · LAUNCH HN · THIS WEEK</span></h2>
          {feeds?.updated && <span className="fine">Updated {fmtDate(feeds.updated.slice(0, 10))}</span>}
        </div>
        {feeds?.launches ? <FeedBoard items={feeds.launches} name="new-launches" /> : <div className="pipe-empty">Refreshing — check back in a few minutes.</div>}
        <p className="fine">Founders who just launched a product on Hacker News, ranked by upvotes. New products usually need design, landing pages, marketing and content — the link goes to the product; run it through the <a href="/tools/website-extractor">website extractor</a> for contacts.</p>
      </section>

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
