// content/index.js — generated list of every content page (order = display order).
// Add a page: create the file per CONTENT_SPEC.md and add it here.

import GHowToFindClientsAsAFreelancer from "./guides/how-to-find-clients-as-a-freelancer.js";
import GColdEmailThatGetsReplies from "./guides/cold-email-that-gets-replies.js";
import GBuyingSignals from "./guides/buying-signals.js";
import GIdealClientProfile from "./guides/ideal-client-profile.js";
import GLinkedinOutreachForFreelancers from "./guides/linkedin-outreach-for-freelancers.js";
import GWhatsappBusinessOutreach from "./guides/whatsapp-business-outreach.js";
import GFollowUpEmails from "./guides/follow-up-emails.js";
import GColdOutreachLaws from "./guides/cold-outreach-laws.js";
import GLeadQualification from "./guides/lead-qualification.js";
import GFindBusinessContactDetails from "./guides/find-business-contact-details.js";
import GJobPostsAsLeads from "./guides/job-posts-as-leads.js";
import GTrackLeadsInASpreadsheet from "./guides/track-leads-in-a-spreadsheet.js";
import PWebDevelopers from "./professions/web-developers.js";
import PWebDesigners from "./professions/web-designers.js";
import PMobileAppDevelopers from "./professions/mobile-app-developers.js";
import PSeoConsultants from "./professions/seo-consultants.js";
import PGraphicDesigners from "./professions/graphic-designers.js";
import PCopywriters from "./professions/copywriters.js";
import PVideoEditors from "./professions/video-editors.js";
import PSocialMediaManagers from "./professions/social-media-managers.js";
import PUxDesigners from "./professions/ux-designers.js";
import PMarketingAgencies from "./professions/marketing-agencies.js";
import PBookkeepers from "./professions/bookkeepers.js";
import PAiAutomationConsultants from "./professions/ai-automation-consultants.js";
import TColdEmailWebsiteRedesign from "./templates/cold-email-website-redesign.js";
import TColdEmailSeoAudit from "./templates/cold-email-seo-audit.js";
import TColdEmailAppDevelopment from "./templates/cold-email-app-development.js";
import TColdEmailHiringSignal from "./templates/cold-email-hiring-signal.js";
import TColdEmailFundingSignal from "./templates/cold-email-funding-signal.js";
import TColdEmailCopywriting from "./templates/cold-email-copywriting.js";
import TColdEmailVideoProduction from "./templates/cold-email-video-production.js";
import TColdEmailSocialMedia from "./templates/cold-email-social-media.js";
import TColdEmailAiAutomation from "./templates/cold-email-ai-automation.js";
import TLinkedinConnectionRequest from "./templates/linkedin-connection-request.js";
import TLinkedinMessageAfterConnecting from "./templates/linkedin-message-after-connecting.js";
import TWhatsappFirstMessage from "./templates/whatsapp-first-message.js";
import TFollowUpEmail from "./templates/follow-up-email.js";
import TBreakupEmail from "./templates/breakup-email.js";
import TReferralRequestEmail from "./templates/referral-request-email.js";

export const guides = [GHowToFindClientsAsAFreelancer, GColdEmailThatGetsReplies, GBuyingSignals, GIdealClientProfile, GLinkedinOutreachForFreelancers, GWhatsappBusinessOutreach, GFollowUpEmails, GColdOutreachLaws, GLeadQualification, GFindBusinessContactDetails, GJobPostsAsLeads, GTrackLeadsInASpreadsheet];
export const professions = [PWebDevelopers, PWebDesigners, PMobileAppDevelopers, PSeoConsultants, PGraphicDesigners, PCopywriters, PVideoEditors, PSocialMediaManagers, PUxDesigners, PMarketingAgencies, PBookkeepers, PAiAutomationConsultants];
export const templates = [TColdEmailWebsiteRedesign, TColdEmailSeoAudit, TColdEmailAppDevelopment, TColdEmailHiringSignal, TColdEmailFundingSignal, TColdEmailCopywriting, TColdEmailVideoProduction, TColdEmailSocialMedia, TColdEmailAiAutomation, TLinkedinConnectionRequest, TLinkedinMessageAfterConnecting, TWhatsappFirstMessage, TFollowUpEmail, TBreakupEmail, TReferralRequestEmail];

const bySlug = (list) => Object.fromEntries(list.map((x) => [x.slug, x]));
const G = bySlug(guides), P = bySlug(professions), T = bySlug(templates);

export const getGuide = (s) => G[s] || null;
export const getProfession = (s) => P[s] || null;
export const getTemplate = (s) => T[s] || null;

// Resolve a related-slugs object into real items, silently dropping unknown slugs.
export function resolveRelated(rel = {}) {
  return {
    guides: (rel.guides || []).map(getGuide).filter(Boolean),
    templates: (rel.templates || []).map(getTemplate).filter(Boolean),
    professions: (rel.professions || []).map(getProfession).filter(Boolean),
  };
}

export const CONTENT_UPDATED = "2026-10-03";
