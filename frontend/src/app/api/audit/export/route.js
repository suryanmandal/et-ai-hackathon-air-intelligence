import pool from '@/lib/db.js';

export const dynamic = 'force-dynamic';

/**
 * Helper to format a cell value according to RFC-4180 specifications.
 * Encloses the string in double quotes if it contains commas, double quotes,
 * or line endings, and escapes any embedded double quotes by doubling them.
 */
function escapeCSVValue(value) {
  if (value === null || value === undefined) {
    return '';
  }
  let strVal = String(value);
  if (/[",\r\n]/.test(strVal)) {
    return `"${strVal.replace(/"/g, '""')}"`;
  }
  return strVal;
}

/**
 * Next.js App Router GET Route Handler.
 * Retrieves all rows from the audit_ledger table ordered chronologically,
 * formats them into an RFC-4180 compliant CSV format, and triggers
 * a secure file download attachment on the client.
 */
export async function GET() {
  try {
    const sqlQuery = `
      SELECT 
        timestamp,
        target_endpoint,
        triggering_agent,
        crypto_hash,
        integrity_status
      FROM audit_ledger
      ORDER BY timestamp DESC;
    `;

    const result = await pool.query(sqlQuery);

    // CSV Header row aligned with frontend mapping
    const headers = [
      "Timestamp", 
      "Target Endpoint", 
      "Triggering Agent", 
      "Cryptographic Hash", 
      "Integrity Status"
    ];
    
    let csvRows = [];
    csvRows.push(headers.map(escapeCSVValue).join(','));

    // Populate data rows
    result.rows.forEach((row) => {
      // Ensure ISO format timestamp representation
      const formattedTimestamp = row.timestamp instanceof Date 
        ? row.timestamp.toISOString() 
        : new Date(row.timestamp).toISOString();

      const lineValues = [
        formattedTimestamp,
        row.target_endpoint,
        row.triggering_agent,
        row.crypto_hash,
        row.integrity_status
      ];
      csvRows.push(lineValues.map(escapeCSVValue).join(','));
    });

    // Join with CRLF line endings as required by RFC-4180 specifications
    const csvContent = csvRows.join('\r\n') + '\r\n';

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename=vayusense_audit_ledger.csv',
        'Cache-Control': 'no-cache, no-transform',
      },
    });

  } catch (error) {
    console.error("CSV Export Route Execution Failed:", error.message);
    return new Response(JSON.stringify({
      error: `Internal Server Error: ${error.message}`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
