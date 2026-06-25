import io
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

def generate_pdf_buffer(version, proposal):
    """
    Takes a generated ProposalVersion and dynamically draws a professional PDF document.
    Instead of saving to the hard drive, it returns the PDF in a memory buffer 
    so we can send it directly over the internet to the client.
    """
    # Create an empty container in the computer's memory
    buffer = io.BytesIO()
    
    # Initialize the PDF engine
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=72)
    styles = getSampleStyleSheet()
    
    # The 'Story' is a list of elements that will be drawn top-to-bottom on the page
    Story = []
    
    # 1. Title (Centered)
    title_style = styles['Heading1']
    title_style.alignment = 1 
    Story.append(Paragraph(version.title, title_style))
    Story.append(Spacer(1, 24))
    
    # 2. Executive Summary
    Story.append(Paragraph("Executive Summary", styles['Heading2']))
    Story.append(Paragraph(version.executive_summary, styles['Normal']))
    Story.append(Spacer(1, 12))
    
    # 3. Pricing Table
    Story.append(Paragraph("Proposed Package Details", styles['Heading2']))
    
    # Define table rows (Row 1 is the header)
    table_data = [['Item Name', 'Qty Per Gift', 'Unit Price']]
    
    for item in version.items:
        table_data.append([
            item.item_name, 
            str(item.quantity_per_gift), 
            f"INR {float(item.unit_price):,.2f}"
        ])
        
    # Draw the table with styling
    quote_table = Table(table_data, colWidths=[250, 100, 100])
    quote_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#2C3E50")), # Dark blue header
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor("#ECF0F1")), # Light grey rows
        ('GRID', (0,0), (-1,-1), 1, colors.black)
    ]))
    Story.append(quote_table)
    Story.append(Spacer(1, 24))
    
    # 4. Financial Summary
    Story.append(Paragraph(f"Required Quantity: {proposal.quantity} gifts", styles['Normal']))
    Story.append(Paragraph(f"<b>Total Project Estimate: INR {float(version.total_price):,.2f}</b>", styles['Heading3']))
    Story.append(Spacer(1, 24))
    
    # 5. Timeline & Closing
    Story.append(Paragraph("Delivery Timeline", styles['Heading2']))
    Story.append(Paragraph(version.delivery_timeline, styles['Normal']))
    Story.append(Spacer(1, 12))
    
    Story.append(Paragraph("Looking Forward", styles['Heading2']))
    Story.append(Paragraph(version.closing_pitch, styles['Normal']))
    
    # Ask ReportLab to compile all these elements into the actual PDF binary data
    doc.build(Story)
    
    # Rewind the memory buffer back to the start so it can be read by the API route
    buffer.seek(0)
    return buffer
