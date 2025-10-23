-- ============================================================================
-- Veriton TVRF Content Verification Queries
-- ============================================================================
-- Run these queries after executing populate_content.sql to verify data

-- ============================================================================
-- 1. Summary: Record counts by table
-- ============================================================================

SELECT 
  'website_sections' as table_name, 
  COUNT(*) as record_count,
  COUNT(CASE WHEN visible = true THEN 1 END) as visible_count
FROM website_sections
UNION ALL
SELECT 
  'content_blocks' as table_name, 
  COUNT(*) as record_count,
  COUNT(CASE WHEN visible = true THEN 1 END) as visible_count
FROM content_blocks
UNION ALL
SELECT 
  'business_hub_sections' as table_name, 
  COUNT(*) as record_count,
  COUNT(CASE WHEN visible = true THEN 1 END) as visible_count
FROM business_hub_sections
UNION ALL
SELECT 
  'business_hub_metrics' as table_name, 
  COUNT(*) as record_count,
  COUNT(CASE WHEN visible = true THEN 1 END) as visible_count
FROM business_hub_metrics
UNION ALL
SELECT 
  'timeline_events' as table_name, 
  COUNT(*) as record_count,
  COUNT(CASE WHEN visible = true THEN 1 END) as visible_count
FROM timeline_events
UNION ALL
SELECT 
  'pages' as table_name, 
  COUNT(*) as record_count,
  COUNT(CASE WHEN visible = true THEN 1 END) as visible_count
FROM pages
ORDER BY table_name;

-- ============================================================================
-- 2. Website Sections: View all sections with their order
-- ============================================================================

SELECT 
  id,
  section_name,
  title,
  LEFT(content, 50) || '...' as content_preview,
  "order",
  visible
FROM website_sections
ORDER BY "order";

-- ============================================================================
-- 3. Content Blocks: Count by section and type
-- ============================================================================

SELECT 
  ws.section_name,
  cb.type,
  COUNT(*) as block_count
FROM content_blocks cb
JOIN website_sections ws ON ws.id = cb.section_id
GROUP BY ws.section_name, cb.type
ORDER BY ws.section_name, cb.type;

-- ============================================================================
-- 4. Content Blocks: View sample content by type
-- ============================================================================

-- Hero Section Content
SELECT 
  'HERO SECTION' as section_type,
  cb.content->>'main_heading' as main_heading,
  cb.content->>'subheading' as subheading,
  cb.content->>'description' as description
FROM content_blocks cb
JOIN website_sections ws ON ws.id = cb.section_id
WHERE ws.section_name = 'hero'
  AND cb.type = 'hero_content';

-- Market Cards
SELECT 
  'MARKET CARDS' as section_type,
  cb."order",
  cb.content->>'heading' as heading,
  cb.content->>'market_size' as market_size,
  cb.content->>'description' as description
FROM content_blocks cb
JOIN website_sections ws ON ws.id = cb.section_id
WHERE ws.section_name = 'why_randomness_matters'
  AND cb.type = 'market_card'
ORDER BY cb."order";

-- Statistics
SELECT 
  'STATISTICS' as section_type,
  cb."order",
  cb.content->>'value' as value,
  cb.content->>'label' as label,
  cb.content->>'description' as description
FROM content_blocks cb
JOIN website_sections ws ON ws.id = cb.section_id
WHERE ws.section_name = 'numbers_that_matter'
  AND cb.type = 'statistic'
ORDER BY cb."order";

-- Comparison Rows
SELECT 
  'COMPETITIVE COMPARISON' as section_type,
  cb."order",
  cb.content->>'solution' as solution,
  cb.content->>'cost_per_call' as cost,
  cb.content->>'speed' as speed,
  cb.content->>'trust_required' as trust,
  cb.content->>'verification' as verification,
  cb.content->>'highlighted' as highlighted
FROM content_blocks cb
JOIN website_sections ws ON ws.id = cb.section_id
WHERE ws.section_name = 'competitive_advantage'
  AND cb.type = 'comparison_row'
ORDER BY cb."order";

-- ============================================================================
-- 5. Business Hub: Sections overview
-- ============================================================================

SELECT 
  id,
  section_name,
  title,
  LEFT(content, 60) || '...' as content_preview,
  "order",
  visible
FROM business_hub_sections
ORDER BY "order";

-- ============================================================================
-- 6. Business Hub: Metrics
-- ============================================================================

SELECT 
  metric_label,
  metric_value,
  metric_description,
  category,
  display_order
FROM business_hub_metrics
WHERE visible = true
ORDER BY display_order;

-- ============================================================================
-- 7. Timeline Events
-- ============================================================================

SELECT 
  event_title,
  event_description,
  event_date,
  status,
  category,
  display_order
FROM timeline_events
WHERE visible = true
ORDER BY display_order;

-- ============================================================================
-- 8. Pages: Site structure
-- ============================================================================

SELECT 
  page_name,
  page_title,
  page_url,
  parent_page,
  "order",
  visible
FROM pages
ORDER BY 
  COALESCE(parent_page, page_name),
  "order";

-- ============================================================================
-- 9. Content Integrity Checks
-- ============================================================================

-- Check for orphaned content blocks (should return 0 rows)
SELECT 
  'Orphaned Content Blocks' as check_name,
  COUNT(*) as issue_count
FROM content_blocks cb
LEFT JOIN website_sections ws ON ws.id = cb.section_id
WHERE ws.id IS NULL;

-- Check for sections without content blocks
SELECT 
  'Sections Without Content' as check_name,
  ws.section_name,
  ws.title
FROM website_sections ws
LEFT JOIN content_blocks cb ON cb.section_id = ws.id
WHERE cb.id IS NULL;

-- Check for duplicate orders within sections
SELECT 
  'Duplicate Order Numbers' as check_name,
  ws.section_name,
  cb."order",
  COUNT(*) as duplicate_count
FROM content_blocks cb
JOIN website_sections ws ON ws.id = cb.section_id
GROUP BY ws.section_name, cb."order"
HAVING COUNT(*) > 1;

-- ============================================================================
-- 10. Full Content Summary Report
-- ============================================================================

SELECT 
  ws.section_name,
  ws.title as section_title,
  ws."order" as section_order,
  COUNT(cb.id) as content_blocks_count,
  STRING_AGG(DISTINCT cb.type, ', ' ORDER BY cb.type) as content_types
FROM website_sections ws
LEFT JOIN content_blocks cb ON cb.section_id = ws.id
GROUP BY ws.id, ws.section_name, ws.title, ws."order"
ORDER BY ws."order";

-- ============================================================================
-- 11. Expected vs Actual Record Counts
-- ============================================================================

WITH expected_counts AS (
  SELECT 'website_sections' as table_name, 8 as expected_count
  UNION ALL SELECT 'content_blocks', 47
  UNION ALL SELECT 'business_hub_sections', 4
  UNION ALL SELECT 'business_hub_metrics', 4
  UNION ALL SELECT 'timeline_events', 4
  UNION ALL SELECT 'pages', 6
),
actual_counts AS (
  SELECT 'website_sections' as table_name, COUNT(*) as actual_count FROM website_sections
  UNION ALL SELECT 'content_blocks', COUNT(*) FROM content_blocks
  UNION ALL SELECT 'business_hub_sections', COUNT(*) FROM business_hub_sections
  UNION ALL SELECT 'business_hub_metrics', COUNT(*) FROM business_hub_metrics
  UNION ALL SELECT 'timeline_events', COUNT(*) FROM timeline_events
  UNION ALL SELECT 'pages', COUNT(*) FROM pages
)
SELECT 
  e.table_name,
  e.expected_count,
  a.actual_count,
  CASE 
    WHEN e.expected_count = a.actual_count THEN '✓ PASS'
    ELSE '✗ FAIL'
  END as status,
  CASE 
    WHEN e.expected_count = a.actual_count THEN 0
    ELSE a.actual_count - e.expected_count
  END as difference
FROM expected_counts e
JOIN actual_counts a ON e.table_name = a.table_name
ORDER BY e.table_name;

-- ============================================================================
-- 12. Sample Content Preview (for manual verification)
-- ============================================================================

-- Show first market card in detail
SELECT 
  'Sample Market Card' as preview_type,
  cb.content
FROM content_blocks cb
JOIN website_sections ws ON ws.id = cb.section_id
WHERE ws.section_name = 'why_randomness_matters'
  AND cb.type = 'market_card'
  AND cb."order" = 1;

-- Show first statistic in detail
SELECT 
  'Sample Statistic' as preview_type,
  cb.content
FROM content_blocks cb
JOIN website_sections ws ON ws.id = cb.section_id
WHERE ws.section_name = 'numbers_that_matter'
  AND cb.type = 'statistic'
  AND cb."order" = 1;

-- Show hero content in detail
SELECT 
  'Hero Content' as preview_type,
  cb.content
FROM content_blocks cb
JOIN website_sections ws ON ws.id = cb.section_id
WHERE ws.section_name = 'hero'
  AND cb.type = 'hero_content';
