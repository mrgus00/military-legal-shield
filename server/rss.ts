import { Request, Response } from 'express';

// RSS Feed data structure for Military Legal Shield content
interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid: string;
  category?: string;
  author?: string;
}

// Military Legal Shield RSS content
const RSS_ITEMS: RSSItem[] = [
  {
    title: "New UCMJ Updates: What Service Members Need to Know",
    description: "Recent changes to the Uniform Code of Military Justice affect court-martial proceedings and administrative actions. Learn how these updates impact your rights and legal protections.",
    link: "https://militarylegalshield.com/articles/ucmj-updates-2024",
    pubDate: new Date('2024-06-10').toUTCString(),
    guid: "ucmj-updates-2024",
    category: "Military Law",
    author: "Military Legal Shield Team"
  },
  {
    title: "Deployment Legal Checklist: Essential Documents for Service Members",
    description: "Comprehensive guide to legal preparations before deployment including powers of attorney, wills, family care plans, and emergency contact procedures.",
    link: "https://militarylegalshield.com/articles/deployment-legal-checklist",
    pubDate: new Date('2024-06-08').toUTCString(),
    guid: "deployment-legal-checklist",
    category: "Deployment Prep",
    author: "JAG Legal Team"
  },
  {
    title: "VA Disability Claims: New Streamlined Process for Veterans",
    description: "The VA has introduced new procedures to expedite disability claims processing. Understanding these changes can help veterans receive benefits faster.",
    link: "https://militarylegalshield.com/articles/va-disability-streamlined-process",
    pubDate: new Date('2024-06-05').toUTCString(),
    guid: "va-disability-streamlined-process",
    category: "Veterans Benefits",
    author: "Veterans Legal Advocates"
  },
  {
    title: "Security Clearance Issues: How to Protect Your Career",
    description: "Common security clearance problems and legal strategies to maintain your clearance. Essential reading for service members with classified access.",
    link: "https://militarylegalshield.com/articles/security-clearance-protection",
    pubDate: new Date('2024-06-03').toUTCString(),
    guid: "security-clearance-protection",
    category: "Security Clearance",
    author: "Security Law Specialists"
  },
  {
    title: "Family Legal Services: Military Spouse Rights During PCS Moves",
    description: "Legal considerations for military families during permanent change of station moves, including custody arrangements, school transfers, and state law variations.",
    link: "https://militarylegalshield.com/articles/military-spouse-pcs-rights",
    pubDate: new Date('2024-06-01').toUTCString(),
    guid: "military-spouse-pcs-rights",
    category: "Family Law",
    author: "Military Family Legal Team"
  },
  {
    title: "Article 15 vs Court-Martial: Understanding Your Options",
    description: "When facing disciplinary action, service members have rights and choices. Learn when to accept Article 15 proceedings versus demanding trial by court-martial.",
    link: "https://militarylegalshield.com/articles/article-15-vs-court-martial",
    pubDate: new Date('2024-05-28').toUTCString(),
    guid: "article-15-vs-court-martial",
    category: "Military Justice",
    author: "Defense Counsel Network"
  },
  {
    title: "Emergency Legal Services: 24/7 Support for Service Members Worldwide",
    description: "Military Legal Shield's emergency response protocols ensure immediate legal assistance for service members facing urgent legal situations anywhere in the world.",
    link: "https://militarylegalshield.com/articles/emergency-legal-services",
    pubDate: new Date('2024-05-25').toUTCString(),
    guid: "emergency-legal-services",
    category: "Emergency Services",
    author: "Emergency Response Team"
  },
  {
    title: "Transition Assistance: Legal Considerations for Military-to-Civilian Career Changes",
    description: "Essential legal guidance for service members transitioning to civilian careers, including employment contracts, veteran preferences, and benefits continuation.",
    link: "https://militarylegalshield.com/articles/transition-legal-guidance",
    pubDate: new Date('2024-05-22').toUTCString(),
    guid: "transition-legal-guidance",
    category: "Career Transition",
    author: "Transition Legal Advisors"
  },
  {
    title: "Military Housing Legal Issues: BAH, On-Base Housing, and Tenant Rights",
    description: "Understanding your rights and obligations regarding military housing, basic allowance for housing disputes, and landlord-tenant issues for service members.",
    link: "https://militarylegalshield.com/articles/military-housing-legal-issues",
    pubDate: new Date('2024-05-20').toUTCString(),
    guid: "military-housing-legal-issues",
    category: "Housing Law",
    author: "Housing Legal Specialists"
  },
  {
    title: "Financial Legal Protection: Avoiding Predatory Lending and Scams",
    description: "Service members are often targeted by predatory lenders and scammers. Learn how to protect yourself legally and financially while serving your country.",
    link: "https://militarylegalshield.com/articles/financial-legal-protection",
    pubDate: new Date('2024-05-18').toUTCString(),
    guid: "financial-legal-protection",
    category: "Financial Protection",
    author: "Financial Crimes Legal Team"
  }
];

// Generate RSS XML feed
export function generateRSSFeed(): string {
  const baseUrl = process.env.REPLIT_DOMAINS 
    ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
    : 'https://militarylegalshield.com';

  const rssItems = RSS_ITEMS.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <guid isPermaLink="false">${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
      ${item.category ? `<category><![CDATA[${item.category}]]></category>` : ''}
      ${item.author ? `<author><![CDATA[${item.author}]]></author>` : ''}
    </item>`
  ).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Military Legal Shield - Legal News &amp; Updates</title>
    <description>Latest legal news, updates, and guidance for military service members, veterans, and their families. Stay informed about UCMJ changes, benefits updates, and essential legal information.</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <managingEditor>legal@militarylegalshield.com (Military Legal Shield Legal Team)</managingEditor>
    <webMaster>support@militarylegalshield.com (Military Legal Shield Support)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <category>Legal Services</category>
    <category>Military Law</category>
    <category>Veterans Affairs</category>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/images/military-legal-shield-logo.png</url>
      <title>Military Legal Shield</title>
      <link>${baseUrl}</link>
      <description>Military Legal Shield Logo</description>
      <width>144</width>
      <height>144</height>
    </image>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;
}

// RSS Feed route handler
export function handleRSSFeed(req: Request, res: Response) {
  try {
    const rssXML = generateRSSFeed();
    
    res.set({
      'Content-Type': 'application/rss+xml; charset=UTF-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      'Last-Modified': new Date().toUTCString()
    });
    
    res.send(rssXML);
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    res.status(500).json({ error: 'Failed to generate RSS feed' });
  }
}

// JSON Feed format for modern feed readers
export function generateJSONFeed(): object {
  const baseUrl = process.env.REPLIT_DOMAINS 
    ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
    : 'https://militarylegalshield.com';

  return {
    version: "https://jsonfeed.org/version/1.1",
    title: "Military Legal Shield - Legal News & Updates",
    description: "Latest legal news, updates, and guidance for military service members, veterans, and their families.",
    home_page_url: baseUrl,
    feed_url: `${baseUrl}/feed.json`,
    language: "en-US",
    favicon: `${baseUrl}/favicon.ico`,
    icon: `${baseUrl}/images/military-legal-shield-logo.png`,
    authors: [
      {
        name: "Military Legal Shield Legal Team",
        email: "legal@militarylegalshield.com"
      }
    ],
    items: RSS_ITEMS.map(item => ({
      id: item.guid,
      title: item.title,
      content_text: item.description,
      url: item.link,
      date_published: new Date(item.pubDate).toISOString(),
      tags: item.category ? [item.category] : undefined,
      authors: item.author ? [{ name: item.author }] : undefined
    }))
  };
}

// JSON Feed route handler
export function handleJSONFeed(req: Request, res: Response) {
  try {
    const jsonFeed = generateJSONFeed();
    
    res.set({
      'Content-Type': 'application/json; charset=UTF-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      'Last-Modified': new Date().toUTCString()
    });
    
    res.json(jsonFeed);
  } catch (error) {
    console.error('Error generating JSON feed:', error);
    res.status(500).json({ error: 'Failed to generate JSON feed' });
  }
}