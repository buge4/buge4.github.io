-- Migration: Populate Veriton TVRF Website Content
-- Created: 2025-10-18
-- Description: Populates website_sections and content_blocks with initial content

-- ============================================================================
-- PART 1: Clear existing content (if any)
-- ============================================================================

DELETE FROM content_blocks;
DELETE FROM website_sections;

-- ============================================================================
-- PART 2: Populate website_sections table
-- ============================================================================

INSERT INTO website_sections (section_name, title, content, "order", visible) VALUES

-- Hero Section
('hero', 'The Moment Everything Changes', 'For the first time, pure randomness without compromise.', 1, true),

-- Why Randomness Matters
('why_randomness_matters', 'Why Randomness Matters', 'Randomness is the invisible foundation of trust in our digital world. Every fair lottery, secure transaction, and unbiased AI decision depends on truly random numbers.', 2, true),

-- Perfect Storm Opportunity
('perfect_storm_opportunity', 'Why Now? Perfect Storm of Opportunity', '', 3, true),

-- Perfect Storm Banner
('perfect_storm_banner', 'The Perfect Storm', 'All conditions have aligned. The technology is ready. The market is ready. The timing will never be better.', 4, true),

-- Our Advantages
('our_advantages', 'Our Advantages', '', 5, true),

-- Numbers That Matter
('numbers_that_matter', 'The Numbers That Matter', '', 6, true),

-- Competitive Advantage
('competitive_advantage', 'The Competitive Advantage', '', 7, true),

-- Impact We Create
('impact_we_create', 'The Impact We''ll Create', '', 8, true);

-- ============================================================================
-- PART 3: Populate content_blocks table
-- ============================================================================

-- Get section IDs for reference
WITH section_ids AS (
  SELECT id, section_name FROM website_sections
)

-- Insert all content blocks
INSERT INTO content_blocks (section_id, type, content, "order", visible)
SELECT 
  s.id,
  blocks.type,
  blocks.content,
  blocks.order,
  blocks.visible
FROM section_ids s
CROSS JOIN LATERAL (
  VALUES
  
  -- ========================================================================
  -- HERO SECTION CONTENT
  -- ========================================================================
  (
    'hero',
    'hero_content',
    jsonb_build_object(
      'main_heading', 'The Moment Everything Changes',
      'subheading', 'For the first time, pure randomness without compromise.',
      'body_text', 'No oracles. No trust required. Just pure mathematics. TVRF is the breakthrough everyone has been waiting for.',
      'description', 'Gaming. AI. Finance. NFTs. Security. One technology. $800B in applications.',
      'cta_buttons', jsonb_build_array(
        jsonb_build_object('text', 'See the Technology →', 'style', 'dark_blue'),
        jsonb_build_object('text', 'View Business Hub →', 'style', 'white_bordered')
      ),
      'feature_labels', jsonb_build_array(
        jsonb_build_object('icon', 'info', 'text', 'Patent-pending'),
        jsonb_build_object('icon', 'checkmark', 'text', '99.9% cheaper'),
        jsonb_build_object('icon', 'checkmark', 'text', 'Zero trust needed')
      )
    ),
    1,
    true
  ),
  
  -- ========================================================================
  -- WHY RANDOMNESS MATTERS - MARKET CARDS
  -- ========================================================================
  (
    'why_randomness_matters',
    'market_card',
    jsonb_build_object(
      'icon', 'money_bag',
      'heading', 'Gaming',
      'description', 'Fair lottery draws that players can verify',
      'market_size', '$400B Market'
    ),
    1,
    true
  ),
  (
    'why_randomness_matters',
    'market_card',
    jsonb_build_object(
      'icon', 'padlock',
      'heading', 'Security',
      'description', 'Cryptographic keys that can''t be predicted',
      'market_size', '$200B Market'
    ),
    2,
    true
  ),
  (
    'why_randomness_matters',
    'market_card',
    jsonb_build_object(
      'icon', 'robot',
      'heading', 'AI/ML',
      'description', 'Unbiased AI training that produces fair results',
      'market_size', '$100B Market'
    ),
    3,
    true
  ),
  (
    'why_randomness_matters',
    'market_card',
    jsonb_build_object(
      'icon', 'diamond',
      'heading', 'NFTs',
      'description', 'Transparent reveals that collectors can trust',
      'market_size', '$70B Market'
    ),
    4,
    true
  ),
  
  -- ========================================================================
  -- PERFECT STORM OPPORTUNITY - OPPORTUNITY CARDS
  -- ========================================================================
  (
    'perfect_storm_opportunity',
    'opportunity_card',
    jsonb_build_object(
      'icon', 'blockchain_link',
      'heading', 'Blockchain Maturity',
      'description', 'Infrastructure finally ready for mass adoption. Gas fees manageable, speeds acceptable, UX is smooth'
    ),
    1,
    true
  ),
  (
    'perfect_storm_opportunity',
    'opportunity_card',
    jsonb_build_object(
      'icon', 'government_building',
      'heading', 'Regulatory Clarity',
      'description', 'Governments embracing blockchain innovation. Clear guidelines emerging, institutional adoption accelerating'
    ),
    2,
    true
  ),
  (
    'perfect_storm_opportunity',
    'opportunity_card',
    jsonb_build_object(
      'icon', 'bar_chart',
      'heading', 'Market Demand',
      'description', 'Users demanding transparency and true ownership. Traditional systems failing user trust, decentralized solutions sought'
    ),
    3,
    true
  ),
  (
    'perfect_storm_opportunity',
    'opportunity_card',
    jsonb_build_object(
      'icon', 'microscope_flask',
      'heading', 'Technical Breakthrough',
      'description', 'We solved what others couldn''t (oracle-free randomness). Years of research culminated in our patent-pending TVRF technology'
    ),
    4,
    true
  ),
  (
    'perfect_storm_opportunity',
    'opportunity_card',
    jsonb_build_object(
      'icon', 'robot',
      'heading', 'AI Revolution',
      'description', 'Every AI needs our solution desperately. AI growth creates massive demand for cost-effective random numbers'
    ),
    5,
    true
  ),
  (
    'perfect_storm_opportunity',
    'opportunity_card',
    jsonb_build_object(
      'icon', 'alarm_clock',
      'heading', 'Perfect Timing',
      'description', 'Before competitors realize what we''ve built. First-mover advantage in a market that will be worth trillions'
    ),
    6,
    true
  ),
  
  -- ========================================================================
  -- OUR ADVANTAGES - ADVANTAGE CARDS
  -- ========================================================================
  (
    'our_advantages',
    'advantage_card',
    jsonb_build_object(
      'icon', 'padlock',
      'heading', 'Patent Pending Technology',
      'description', 'Our TVRF extraction method is protected intellectual property. No one else can provide oracle-free blockchain randomness. We''re the only ones who can do this'
    ),
    1,
    true
  ),
  (
    'our_advantages',
    'advantage_card',
    jsonb_build_object(
      'icon', 'trophy',
      'heading', 'No Competition',
      'description', 'Years of research led to our breakthrough. Competitors are still trying to figure out what we''ve already perfected. Nobody else has solved randomness without oracles'
    ),
    2,
    true
  ),
  (
    'our_advantages',
    'advantage_card',
    jsonb_build_object(
      'icon', 'money_bag',
      'heading', 'Immediate Revenue',
      'description', 'No waiting for adoption. Every integration, every transaction, every use case generates revenue immediately. Every product generates income from day one'
    ),
    3,
    true
  ),
  (
    'our_advantages',
    'advantage_card',
    jsonb_build_object(
      'icon', 'chain_link',
      'heading', 'Network Effects',
      'description', 'Unlike linear growth, our ecosystem creates compound effects where success breeds more success exponentially. Each product strengthens the others'
    ),
    4,
    true
  ),
  
  -- ========================================================================
  -- NUMBERS THAT MATTER - STATISTICS
  -- ========================================================================
  (
    'numbers_that_matter',
    'statistic',
    jsonb_build_object(
      'value', '$800B+',
      'unit', 'USD',
      'label', 'Market Opportunity',
      'description', 'Total addressable market across gaming, AI, finance, and security sectors'
    ),
    1,
    true
  ),
  (
    'numbers_that_matter',
    'statistic',
    jsonb_build_object(
      'value', '99.9%',
      'unit', 'Percent',
      'label', 'Cost Reduction',
      'description', 'Cost reduction compared to Chainlink VRF ($0.005 vs $4-25 per call)'
    ),
    2,
    true
  ),
  (
    'numbers_that_matter',
    'statistic',
    jsonb_build_object(
      'value', 'Instant',
      'unit', 'Time',
      'label', 'Processing Speed',
      'description', 'Immediate randomness generation vs 3-block wait times'
    ),
    3,
    true
  ),
  (
    'numbers_that_matter',
    'statistic',
    jsonb_build_object(
      'value', '0%',
      'unit', 'Percent',
      'label', 'Trust Required',
      'description', 'Zero trust needed - pure mathematical verification'
    ),
    4,
    true
  ),
  (
    'numbers_that_matter',
    'statistic',
    jsonb_build_object(
      'value', '2',
      'unit', 'Count',
      'label', 'Patent Status',
      'description', 'Patent applications pending with 4 more in development'
    ),
    5,
    true
  ),
  (
    'numbers_that_matter',
    'statistic',
    jsonb_build_object(
      'value', '4',
      'unit', 'Count',
      'label', 'Platform Applications',
      'description', 'YouLottery, GameForge, AgentRand, and Digital Assets platforms'
    ),
    6,
    true
  ),
  (
    'numbers_that_matter',
    'statistic',
    jsonb_build_object(
      'value', '$400B',
      'unit', 'USD',
      'label', 'Gaming Market',
      'description', 'Gaming and lottery market opportunity'
    ),
    7,
    true
  ),
  (
    'numbers_that_matter',
    'statistic',
    jsonb_build_object(
      'value', '$150B',
      'unit', 'USD',
      'label', 'AI Market',
      'description', 'AI and machine learning market opportunity'
    ),
    8,
    true
  ),
  (
    'numbers_that_matter',
    'statistic',
    jsonb_build_object(
      'value', '$200B',
      'unit', 'USD',
      'label', 'Finance Market',
      'description', 'Financial services market opportunity'
    ),
    9,
    true
  ),
  (
    'numbers_that_matter',
    'statistic',
    jsonb_build_object(
      'value', '$120B',
      'unit', 'USD',
      'label', 'Blockchain Market',
      'description', 'DeFi and blockchain market opportunity'
    ),
    10,
    true
  ),
  (
    'numbers_that_matter',
    'statistic',
    jsonb_build_object(
      'value', '80%',
      'unit', 'Percent',
      'label', 'Energy Efficiency',
      'description', 'Reduction in computational overhead compared to traditional VRF'
    ),
    11,
    true
  ),
  (
    'numbers_that_matter',
    'statistic',
    jsonb_build_object(
      'value', '2025',
      'unit', 'Year',
      'label', 'Revenue Timeline',
      'description', 'Expected first revenue generation from platform launches'
    ),
    12,
    true
  ),
  (
    'numbers_that_matter',
    'statistic',
    jsonb_build_object(
      'value', '1',
      'unit', 'Line',
      'label', 'Adoption Barrier',
      'description', 'of code to integrate'
    ),
    13,
    true
  ),
  
  -- ========================================================================
  -- COMPETITIVE ADVANTAGE - COMPARISON TABLE ROWS
  -- ========================================================================
  (
    'competitive_advantage',
    'comparison_row',
    jsonb_build_object(
      'solution', 'Chainlink VRF',
      'cost_per_call', '$4-25',
      'speed', '3-block wait',
      'trust_required', 'Oracle trust',
      'verification', 'Limited',
      'highlighted', false,
      'checkmarks', false
    ),
    1,
    true
  ),
  (
    'competitive_advantage',
    'comparison_row',
    jsonb_build_object(
      'solution', 'Traditional RNG',
      'cost_per_call', 'Variable',
      'speed', 'Fast',
      'trust_required', 'Complete trust',
      'verification', 'Not verifiable',
      'highlighted', false,
      'checkmarks', false
    ),
    2,
    true
  ),
  (
    'competitive_advantage',
    'comparison_row',
    jsonb_build_object(
      'solution', 'Veriton TVRF',
      'cost_per_call', '$0.005',
      'speed', 'Instant',
      'trust_required', 'Zero trust',
      'verification', 'Verifiable forever',
      'highlighted', true,
      'checkmarks', true
    ),
    3,
    true
  ),
  (
    'competitive_advantage',
    'comparison_banner',
    jsonb_build_object(
      'text', 'We''re not 10% better. We''re 99.9% cheaper AND infinitely more trustworthy.'
    ),
    4,
    true
  ),
  
  -- ========================================================================
  -- IMPACT WE CREATE - IMPACT CARDS
  -- ========================================================================
  (
    'impact_we_create',
    'impact_card',
    jsonb_build_object(
      'icon', 'globe',
      'heading', 'Economic Impact',
      'description', 'By eliminating oracle costs and enabling new use cases, TVRF will create massive economic value across industries.',
      'statistic', '$50B+ in annual value creation'
    ),
    1,
    true
  ),
  (
    'impact_we_create',
    'impact_card',
    jsonb_build_object(
      'icon', 'gamepad',
      'heading', 'Gaming Revolution',
      'description', 'Every lottery draw, every game outcome, every prize drop becomes verifiable by anyone. $400B gaming industry transformed.',
      'sub_description', 'Making gaming provably fair worldwide'
    ),
    2,
    true
  ),
  (
    'impact_we_create',
    'impact_card',
    jsonb_build_object(
      'icon', 'robot',
      'heading', 'AI Fairness',
      'description', 'Remove bias from AI training and decision-making. Enable provably fair AI systems that anyone can verify.',
      'sub_description', 'Unbiased AI for everyone'
    ),
    3,
    true
  ),
  (
    'impact_we_create',
    'impact_card',
    jsonb_build_object(
      'icon', 'padlock',
      'heading', 'Security Enhancement',
      'description', 'Better random numbers mean stronger encryption, more secure wallets, and safer digital assets for billions of users.',
      'sub_description', 'Strengthening crypto security globally'
    ),
    4,
    true
  ),
  
  -- ========================================================================
  -- IMPACT WE CREATE - LARGE STATISTICS
  -- ========================================================================
  (
    'impact_we_create',
    'large_statistic',
    jsonb_build_object(
      'value', '1 Billion+',
      'label', 'Users Impacted'
    ),
    5,
    true
  ),
  (
    'impact_we_create',
    'large_statistic',
    jsonb_build_object(
      'value', '$2.5B',
      'label', 'Annual Savings'
    ),
    6,
    true
  ),
  (
    'impact_we_create',
    'large_statistic',
    jsonb_build_object(
      'value', '100,000+',
      'label', 'Developers Enabled'
    ),
    7,
    true
  ),
  (
    'impact_we_create',
    'large_statistic',
    jsonb_build_object(
      'value', 'Zero',
      'label', 'Trust Required'
    ),
    8,
    true
  ),
  (
    'impact_we_create',
    'impact_footer',
    jsonb_build_object(
      'text', 'By 2027, TVRF will touch over 1 billion users across gaming, finance, AI, and digital assets.'
    ),
    9,
    true
  )
  
) AS blocks(section_name, type, content, "order", visible)
WHERE s.section_name = blocks.section_name;

-- ============================================================================
-- PART 4: Create and populate business_hub_sections table
-- ============================================================================

-- Create business_hub_sections table if it doesn't exist
CREATE TABLE IF NOT EXISTS business_hub_sections (
  id SERIAL PRIMARY KEY,
  section_name VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  "order" INT DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Populate business hub sections
INSERT INTO business_hub_sections (section_name, title, content, "order", visible) VALUES
('business_hub_intro', 'VERITON BUSINESS HUB', 'Comprehensive business intelligence and documentation.', 1, true),
('why_randomness', 'Why Randomness Matters', 'Random numbers are fundamental for digital trust (fair lotteries, secure transactions, unbiased AI). The problem: current solutions require trusting third parties or lack verification, leading to vulnerability.', 2, true),
('metrics_status', 'Metrics & Status', '', 3, true),
('timeline', 'Technology Development Timeline', '', 4, true);

-- ============================================================================
-- PART 5: Create and populate business_hub_metrics table
-- ============================================================================

-- Create business_hub_metrics table
CREATE TABLE IF NOT EXISTS business_hub_metrics (
  id SERIAL PRIMARY KEY,
  metric_key VARCHAR(100) UNIQUE NOT NULL,
  metric_value VARCHAR(50) NOT NULL,
  metric_label VARCHAR(200) NOT NULL,
  metric_description TEXT,
  change_percentage VARCHAR(20),
  trend VARCHAR(20),
  category VARCHAR(50),
  display_order INT DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Populate business hub metrics
INSERT INTO business_hub_metrics (metric_key, metric_value, metric_label, metric_description, category, display_order, visible) VALUES
('patent_pending', '2 Pending', 'PATENT STATUS', '+4 more in development', 'patent', 1, true),
('platform_status', '4 In Progress', 'PLATFORM STATUS', 'YouLottery, GameForge, AgentRand, Digital Assets', 'platform', 2, true),
('technology_stage', 'Patent Pending', 'TECHNOLOGY STAGE', 'TVRF Core Technology', 'technology', 3, true),
('market_opportunity', '$800B+', 'MARKET OPPORTUNITY', 'Addressable across Multiple Industries', 'market', 4, true);

-- ============================================================================
-- PART 6: Create and populate timeline_events table
-- ============================================================================

-- Create timeline_events table
CREATE TABLE IF NOT EXISTS timeline_events (
  id SERIAL PRIMARY KEY,
  event_title VARCHAR(200) NOT NULL,
  event_description TEXT,
  event_date VARCHAR(50),
  status VARCHAR(50),
  icon VARCHAR(50),
  category VARCHAR(50),
  display_order INT DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Populate timeline events
INSERT INTO timeline_events (event_title, event_description, event_date, status, category, display_order, visible) VALUES
('Patent Filing', 'TVRF Core Algorithm patent filed', '2024 Q1-Q2', 'Complete', 'technology', 1, true),
('Platform Development', 'Building YouLottery, GameForge, AgentRand, Digital Assets', '2024 Q3-Q4', 'In Progress', 'product', 2, true),
('Beta Launch Testing', 'User testing and feedback collection', '2025 Q1-Q2', 'Planned', 'product', 3, true),
('Full Launch & Scale', 'Public launch and market expansion', '2025 Q3-Q4', 'Planned', 'business', 4, true);

-- ============================================================================
-- PART 7: Create and populate pages table for sub-pages
-- ============================================================================

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id SERIAL PRIMARY KEY,
  page_name VARCHAR(100) UNIQUE NOT NULL,
  page_title VARCHAR(200) NOT NULL,
  page_description TEXT,
  page_url VARCHAR(200),
  parent_page VARCHAR(100),
  "order" INT DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Populate pages
INSERT INTO pages (page_name, page_title, page_description, page_url, parent_page, "order", visible) VALUES
('home', 'The Moment Everything Changes', 'Revolutionary blockchain randomness technology', '/', NULL, 1, true),
('business_hub', 'Business Hub', 'Comprehensive business intelligence and documentation', '/business-hub', NULL, 2, true),
('overview', 'Executive Overview', 'Business overview and strategic priorities', '/business-hub/overview', 'business_hub', 1, true),
('analytics', 'Analytics Dashboard', 'Website traffic and engagement metrics', '/business-hub/analytics', 'business_hub', 2, true),
('documents', 'Documents Library', 'Patents, whitepapers, and technical documentation', '/business-hub/documents', 'business_hub', 3, true),
('investor_view', 'Investor View', 'Financial projections and investment opportunities', '/business-hub/investor-view', 'business_hub', 4, true);

-- ============================================================================
-- PART 8: Verification queries
-- ============================================================================

-- Count records inserted
SELECT 
  'website_sections' as table_name, 
  COUNT(*) as record_count 
FROM website_sections
UNION ALL
SELECT 
  'content_blocks' as table_name, 
  COUNT(*) as record_count 
FROM content_blocks
UNION ALL
SELECT 
  'business_hub_sections' as table_name, 
  COUNT(*) as record_count 
FROM business_hub_sections
UNION ALL
SELECT 
  'business_hub_metrics' as table_name, 
  COUNT(*) as record_count 
FROM business_hub_metrics
UNION ALL
SELECT 
  'timeline_events' as table_name, 
  COUNT(*) as record_count 
FROM timeline_events
UNION ALL
SELECT 
  'pages' as table_name, 
  COUNT(*) as record_count 
FROM pages
ORDER BY table_name;
