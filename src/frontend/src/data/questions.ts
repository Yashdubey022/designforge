import type { Question } from "../types";

export const questions: Question[] = [
  {
    id: 1,
    title: "Design Twitter",
    difficulty: "Hard",
    time: "60 min",
    tags: ["Scaling", "NoSQL", "CDN"],
    category: "Social Media",
    description:
      "Design a simplified version of Twitter where users can post tweets, follow other users, and view a personalized home timeline. The system must support millions of users posting and reading tweets in real time.",
    requirements: [
      "Users can post tweets (up to 280 characters)",
      "Users can follow / unfollow other users",
      "Home timeline shows tweets from followed users (reverse chronological)",
      "Support likes and retweets",
      "System must handle 300M monthly active users",
      "Read-heavy workload: ~100x more reads than writes",
    ],
    constraints: [
      "Tweet volume: ~500M tweets/day (~5700 tweets/sec)",
      "Timeline generation latency < 200ms",
      "High availability (99.99% uptime)",
      "Data must be durable — no tweet loss",
      "Storage: each tweet ~300 bytes; media stored separately",
    ],
    examples: [
      {
        input: "User A (10M followers) posts a tweet",
        output: "All 10M followers see it in their timeline within 5 seconds",
        explanation:
          "Fan-out on write pre-computes timelines for followers; celebrity accounts use fan-out on read to avoid write amplification.",
      },
      {
        input: "User B requests their home timeline",
        output: "Top 20 recent tweets from followed users",
        explanation: "Timeline is served from a pre-materialized Redis cache.",
      },
    ],
  },
  {
    id: 2,
    title: "Design Uber",
    difficulty: "Hard",
    time: "60 min",
    tags: ["Geo", "Real-time", "Microservices"],
    category: "Ride-sharing",
    description:
      "Design the core backend of a ride-sharing platform like Uber. The system must match riders with nearby drivers in real time, track locations continuously, and handle the full ride lifecycle from request to payment.",
    requirements: [
      "Riders can request a ride with pickup and destination",
      "System finds the nearest available driver within seconds",
      "Real-time GPS tracking for both rider and driver during the trip",
      "Dynamic pricing (surge) based on supply/demand",
      "Trip history and receipts stored per user",
      "Support 10M+ concurrent users globally",
    ],
    constraints: [
      "Driver location updates every 4 seconds",
      "Match latency < 3 seconds for 95th percentile",
      "Location data volume: ~1M location updates/min",
      "Geo-queries must cover radius of 2–5 km efficiently",
      "System must be fault-tolerant across regions",
    ],
    examples: [
      {
        input: "Rider requests a trip from lat:37.77, lng:-122.41",
        output: "Driver matched within 2.1 seconds, ETA shown as 4 min",
        explanation:
          "Geohash partitioning narrows search to nearby grid cells; available drivers list is kept in Redis sorted sets.",
      },
      {
        input: "Driver moves 500m north",
        output: "Rider's app shows updated driver position",
        explanation:
          "WebSocket push from the location service keeps both apps in sync.",
      },
    ],
  },
  {
    id: 3,
    title: "Design Instagram Feed",
    difficulty: "Medium",
    time: "45 min",
    tags: ["Storage", "CDN", "Caching"],
    category: "Social Media",
    description:
      "Design the photo feed system for Instagram. Users can upload photos, follow others, and see a ranked feed of photos from the people they follow. Focus on photo storage, feed generation, and delivery at scale.",
    requirements: [
      "Users can upload photos with captions and filters",
      "Home feed shows recent posts from followed accounts",
      "Support likes and comments",
      "Photos must load fast globally",
      "500M daily active users, 100M photos uploaded per day",
    ],
    constraints: [
      "Photo upload size: up to 8 MB",
      "Feed load time < 500ms (p95)",
      "Store multiple resolutions per photo (thumbnail, medium, original)",
      "CDN must serve 99% of photo requests",
      "Storage grows by ~800 TB/day",
    ],
    examples: [
      {
        input: "User uploads a 5 MB JPEG photo",
        output: "Photo available in feed within 10 seconds",
        explanation:
          "Upload service stores original in object storage, triggers async transcoding job to generate thumbnails, then CDN edge nodes cache all resolutions.",
      },
      {
        input: "User opens the app and pulls the feed",
        output: "First 20 posts rendered in 320ms",
        explanation:
          "Pre-computed feed stored in Redis; CDN serves photo assets from nearest edge location.",
      },
    ],
  },
  {
    id: 4,
    title: "Design URL Shortener",
    difficulty: "Easy",
    time: "30 min",
    tags: ["Hashing", "Database", "API"],
    category: "Utility",
    description:
      "Design a URL shortening service like bit.ly. Users submit a long URL and receive a short alias. Anyone with the short URL is redirected to the original. The service should handle billions of URLs and hundreds of thousands of redirects per second.",
    requirements: [
      "Generate a unique short code (6–8 chars) for any given URL",
      "Redirect short URLs to the original with HTTP 301/302",
      "Custom aliases (e.g. bit.ly/mylink) should be supported",
      "URLs should expire after a configurable TTL",
      "Analytics: click count, referrer, geo per short URL",
    ],
    constraints: [
      "100M URLs created per day (~1150 writes/sec)",
      "10B redirects per day (~115K reads/sec)",
      "Read:write ratio ≈ 100:1",
      "Short code must be unique across the system",
      "Redirect latency < 10ms (p99)",
    ],
    examples: [
      {
        input: "POST /shorten  { url: 'https://very-long-url.com/path?q=1' }",
        output: "{ shortUrl: 'https://sho.rt/aB3xYz' }",
        explanation:
          "Base62 encode a unique ID from a distributed counter (e.g. Snowflake ID) to get the 7-character alias.",
      },
      {
        input: "GET /aB3xYz",
        output: "HTTP 302 → https://very-long-url.com/path?q=1",
        explanation:
          "Lookup in Redis cache first; on miss, query the database and populate cache with a 24h TTL.",
      },
    ],
  },
  {
    id: 5,
    title: "Design Netflix",
    difficulty: "Hard",
    time: "75 min",
    tags: ["Streaming", "CDN", "Encoding"],
    category: "Streaming",
    description:
      "Design the video streaming backend for Netflix. The system must handle video uploads from content teams, transcode them into multiple formats/resolutions, and stream them to millions of concurrent viewers worldwide with minimal buffering.",
    requirements: [
      "Content team uploads raw video files (up to 100 GB)",
      "Videos transcoded into multiple resolutions (4K, 1080p, 720p, 480p) and codecs (H.264, H.265, AV1)",
      "Adaptive bitrate streaming (ABR) adjusts quality based on network speed",
      "Support 200M subscribers, peak 15M concurrent streams",
      "Personalized recommendation feed per user",
    ],
    constraints: [
      "Video start latency < 2 seconds",
      "Buffering ratio < 0.1% of total play time",
      "Encoding pipeline must complete within 30 minutes of upload",
      "CDN must serve > 95% of all streaming traffic",
      "Global coverage with < 50ms CDN hop latency",
    ],
    examples: [
      {
        input: "Content team uploads a 2-hour movie (50 GB raw)",
        output: "Movie available for streaming in all regions within 25 min",
        explanation:
          "Upload triggers a distributed transcoding pipeline (chunked parallel workers); output files are pushed to multi-CDN edge nodes.",
      },
      {
        input: "User on a 3 Mbps connection starts playback",
        output: "Video starts in 1.4 seconds at 720p, no initial buffer",
        explanation:
          "ABR client selects the 720p segment playlist; CDN serves segments pre-fetched from origin; bitrate drops to 480p if bandwidth falls.",
      },
    ],
  },
  {
    id: 6,
    title: "Design WhatsApp",
    difficulty: "Medium",
    time: "45 min",
    tags: ["Messaging", "WebSocket", "Storage"],
    category: "Messaging",
    description:
      "Design a real-time messaging system like WhatsApp supporting 1-on-1 and group chats. Messages must be delivered reliably with end-to-end encryption, stored for offline users, and synchronized across multiple devices.",
    requirements: [
      "Send and receive text, image, video, and document messages",
      "1-on-1 and group chats (up to 1024 members)",
      "Message delivery receipts: sent, delivered, read",
      "Offline message queuing — deliver when user comes online",
      "End-to-end encryption (E2EE) using Signal Protocol",
      "2B+ users, 100B messages/day",
    ],
    constraints: [
      "Message delivery latency < 100ms (online users)",
      "Messages stored server-side until delivered, then deleted",
      "Media files stored in object storage for 30 days",
      "Group message fan-out for large groups must not degrade latency",
      "System must handle 1M+ concurrent WebSocket connections per region",
    ],
    examples: [
      {
        input: "Alice sends 'Hello' to Bob (both online)",
        output: "Bob receives message in 80ms; double-tick appears for Alice",
        explanation:
          "Persistent WebSocket to Alice's connection server; message routed via broker to Bob's connection server; ACK triggers delivery receipt.",
      },
      {
        input: "Alice sends a message while Bob is offline",
        output: "Bob receives the message when he comes back online",
        explanation:
          "Message stored in a persistent queue; push notification sent; on reconnect, Bob's client syncs missed messages.",
      },
    ],
  },
  {
    id: 7,
    title: "Design Google Drive",
    difficulty: "Medium",
    time: "50 min",
    tags: ["Storage", "Sync", "Collaboration"],
    category: "Cloud Storage",
    description:
      "Design a cloud file storage and sync service like Google Drive. Users can upload files, organize them in folders, sync changes across devices, and share files with others for collaboration.",
    requirements: [
      "File upload, download, and delete",
      "Folder hierarchy and file organization",
      "Real-time sync across multiple devices",
      "Share files/folders with view or edit permissions",
      "File versioning — restore previous versions",
      "Support 1B users with 15 GB free storage each",
    ],
    constraints: [
      "Chunked upload for large files (up to 5 TB)",
      "Delta sync — only changed chunks are uploaded",
      "Sync conflict resolution when two devices edit simultaneously",
      "Strong consistency for metadata; eventual consistency OK for content",
      "Storage cost optimization: deduplication across users",
    ],
    examples: [
      {
        input: "User edits a 1 GB file on laptop, saves",
        output: "Only the modified 4 MB chunk is uploaded; phone syncs in 3s",
        explanation:
          "Client splits file into 4 MB chunks, computes checksums, uploads only dirty chunks to object storage, updates metadata service.",
      },
      {
        input: "Two users edit the same Google Doc simultaneously",
        output: "Both users see each other's changes within 500ms",
        explanation:
          "Operational Transformation (OT) or CRDT merges concurrent edits; changes broadcast via WebSocket to all active collaborators.",
      },
    ],
  },
  {
    id: 8,
    title: "Design Rate Limiter",
    difficulty: "Easy",
    time: "30 min",
    tags: ["Algorithms", "Redis", "API"],
    category: "Utility",
    description:
      "Design a distributed rate limiting service that can throttle API requests per user, per IP, or per API key. The limiter should work across multiple servers and support different rate limiting algorithms.",
    requirements: [
      "Limit requests per user/IP/API key (e.g. 100 req/min)",
      "Support multiple algorithms: Token Bucket, Sliding Window, Fixed Window",
      "Work correctly across a distributed cluster of API servers",
      "Return HTTP 429 with Retry-After header when limit exceeded",
      "Limits configurable per API endpoint or client tier",
    ],
    constraints: [
      "Rate limit check latency < 5ms (p99)",
      "Must not introduce a single point of failure",
      "Counter drift across nodes < 0.1% (eventual consistency is acceptable)",
      "Support 1M+ unique clients",
      "Redis cluster for shared state across API servers",
    ],
    examples: [
      {
        input:
          "Client sends the 101st request within 1 minute (limit: 100/min)",
        output: "HTTP 429  { error: 'Too Many Requests', retryAfter: 23 }",
        explanation:
          "Redis INCR + EXPIRE implements a fixed window counter. Sliding window uses a sorted set of timestamps to count requests in the rolling window.",
      },
      {
        input:
          "API server A and server B both receive requests from the same user",
        output: "Combined count enforced correctly — no bypass possible",
        explanation:
          "Both servers share the same Redis key; atomic INCR ensures race-condition-free counting.",
      },
    ],
  },
];

export const aiFeedback: Record<number, { score: number; bullets: string[] }> =
  {
    1: {
      score: 78,
      bullets: [
        "Good use of tweet fan-out architecture for timeline generation",
        "Consider adding a Redis-based hot cache for celebrity accounts",
        "Sharding strategy for tweets table needs more detail",
        "Add CDN for media delivery to reduce latency globally",
      ],
    },
    2: {
      score: 82,
      bullets: [
        "Solid geo-spatial indexing with geohashing for driver matching",
        "Good WebSocket usage for real-time location updates",
        "Consider a consistent hashing ring for the dispatch service",
        "Add circuit breaker patterns between microservices",
      ],
    },
    3: {
      score: 75,
      bullets: [
        "Correct use of CDN for photo delivery at scale",
        "Pre-computed feed vs. pull model tradeoffs need more discussion",
        "Add Cassandra for timeline storage - wide column fits this use case",
        "Consider Bloom filters to reduce database lookups",
      ],
    },
    4: {
      score: 85,
      bullets: [
        "Great use of Base62 encoding for short URL generation",
        "Cache layer (Redis) well-integrated for hot URLs",
        "Add rate limiting to prevent abuse of the API",
        "Consider consistent hashing for distributed KV store",
      ],
    },
    5: {
      score: 80,
      bullets: [
        "Multi-CDN strategy for global content delivery is well-thought-out",
        "Adaptive bitrate streaming (ABR) logic needs more detail",
        "Add encoding pipeline with transcoding workers for multiple resolutions",
        "Recommendation engine architecture could be more specific",
      ],
    },
    6: {
      score: 77,
      bullets: [
        "WebSocket + XMPP for persistent messaging connections is solid",
        "Message delivery guarantees (at-least-once vs exactly-once) unclear",
        "Add end-to-end encryption architecture overview",
        "Group message fan-out strategy needs more thought for large groups",
      ],
    },
    7: {
      score: 73,
      bullets: [
        "Chunked upload with S3-compatible storage is well-described",
        "Conflict resolution in collaborative editing needs CRDT discussion",
        "Add delta-sync algorithm to reduce bandwidth usage",
        "File versioning and storage costs not adequately addressed",
      ],
    },
    8: {
      score: 88,
      bullets: [
        "Excellent token bucket + sliding window hybrid approach",
        "Redis INCR with TTL for distributed rate limiting is correct",
        "Consider sticky sessions or consistent hashing for user-based limits",
        "Add multi-tier limiting (per IP, per user, per API key)",
      ],
    },
  };
