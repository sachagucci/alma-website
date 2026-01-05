-- Create client_invoices table for storing extracted invoice data
CREATE TABLE IF NOT EXISTS client_invoices (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    invoice_number VARCHAR(100),
    vendor_name VARCHAR(255),
    invoice_date DATE,
    due_date DATE,
    subtotal DECIMAL(12,2),
    tax_amount DECIMAL(12,2),
    total_amount DECIMAL(12,2),
    currency VARCHAR(10) DEFAULT 'CAD',
    category VARCHAR(100),
    invoice_type VARCHAR(50) DEFAULT 'expense', -- 'expense' or 'revenue'
    line_items JSONB,
    raw_text TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster queries by company
CREATE INDEX IF NOT EXISTS idx_client_invoices_company_id ON client_invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_client_invoices_date ON client_invoices(invoice_date);
