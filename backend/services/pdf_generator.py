"""PDF generation service for PRDs."""

import os
import tempfile
from pathlib import Path
from typing import Optional
import structlog
from datetime import datetime

from backend.app.core.config import settings

logger = structlog.get_logger()

class PDFGenerator:
    """Generate PDF files from Markdown PRDs."""
    
    def __init__(self, generator_type: Optional[str] = None):
        self.generator_type = generator_type or settings.pdf_generator
    
    def generate_from_markdown(self, markdown_content: str, output_path: str) -> bool:
        """Generate PDF from Markdown content."""
        logger.info("Generating PDF", output_path=output_path, generator_type=self.generator_type)
        
        try:
            if self.generator_type == "reportlab":
                return self._generate_with_reportlab(markdown_content, output_path)
            elif self.generator_type == "html":
                return self._generate_with_html(markdown_content, output_path)
            else:
                logger.warning(f"Unknown PDF generator: {self.generator_type}, falling back to HTML")
                return self._generate_with_html(markdown_content, output_path)
        except Exception as e:
            logger.error("PDF generation failed", error=str(e), generator_type=self.generator_type)
            # Fallback to creating a simple placeholder PDF
            return self._create_placeholder_pdf(markdown_content, output_path)
    
    def _generate_with_reportlab(self, markdown_content: str, output_path: str) -> bool:
        """Generate PDF using ReportLab."""
        try:
            from reportlab.lib.pagesizes import letter
            from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.lib.units import inch
            from reportlab.lib import colors
            import markdown
            
            # Convert markdown to HTML then to plain text for ReportLab
            html_content = markdown.markdown(markdown_content)
            
            # Create PDF document
            doc = SimpleDocTemplate(
                output_path,
                pagesize=letter,
                rightMargin=72,
                leftMargin=72,
                topMargin=72,
                bottomMargin=72
            )
            
            # Create styles
            styles = getSampleStyleSheet()
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=24,
                spaceAfter=30,
                textColor=colors.HexColor('#1E3A8A')
            )
            
            heading1_style = ParagraphStyle(
                'CustomHeading1',
                parent=styles['Heading1'],
                fontSize=18,
                spaceAfter=12,
                textColor=colors.HexColor('#374151')
            )
            
            heading2_style = ParagraphStyle(
                'CustomHeading2',
                parent=styles['Heading2'],
                fontSize=14,
                spaceAfter=8,
                textColor=colors.HexColor('#4B5563')
            )
            
            normal_style = ParagraphStyle(
                'CustomNormal',
                parent=styles['Normal'],
                fontSize=11,
                spaceAfter=6,
                textColor=colors.HexColor('#1F2937')
            )
            
            # Build story (content)
            story = []
            
            # Add title
            title = "Product Requirements Document"
            story.append(Paragraph(title, title_style))
            story.append(Spacer(1, 0.2 * inch))
            
            # Add generation info
            gen_info = f"Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            story.append(Paragraph(gen_info, normal_style))
            story.append(Spacer(1, 0.3 * inch))
            
            # Parse markdown and add content
            lines = markdown_content.split('\n')
            current_section = []
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                if line.startswith('# '):
                    # Title
                    if current_section:
                        story.append(Paragraph(' '.join(current_section), normal_style))
                        current_section = []
                    story.append(Paragraph(line[2:], title_style))
                    story.append(Spacer(1, 0.2 * inch))
                elif line.startswith('## '):
                    # Heading 1
                    if current_section:
                        story.append(Paragraph(' '.join(current_section), normal_style))
                        current_section = []
                    story.append(Paragraph(line[3:], heading1_style))
                    story.append(Spacer(1, 0.1 * inch))
                elif line.startswith('### '):
                    # Heading 2
                    if current_section:
                        story.append(Paragraph(' '.join(current_section), normal_style))
                        current_section = []
                    story.append(Paragraph(line[4:], heading2_style))
                    story.append(Spacer(1, 0.05 * inch))
                else:
                    # Normal text
                    current_section.append(line)
            
            # Add any remaining text
            if current_section:
                story.append(Paragraph(' '.join(current_section), normal_style))
            
            # Add footer
            story.append(Spacer(1, 0.5 * inch))
            footer = "Generated by AI Product Manager (AutoGen)"
            story.append(Paragraph(footer, ParagraphStyle(
                'Footer',
                parent=styles['Normal'],
                fontSize=9,
                textColor=colors.gray,
                alignment=1  # Center
            )))
            
            # Build PDF
            doc.build(story)
            logger.info("PDF generated successfully with ReportLab", output_path=output_path)
            return True
            
        except ImportError:
            logger.warning("ReportLab not installed, falling back to HTML method")
            return self._generate_with_html(markdown_content, output_path)
        except Exception as e:
            logger.error("ReportLab PDF generation failed", error=str(e))
            return False
    
    def _generate_with_html(self, markdown_content: str, output_path: str) -> bool:
        """Generate PDF by converting Markdown to HTML then to PDF."""
        try:
            import markdown
            from weasyprint import HTML
            import tempfile
            
            # Convert markdown to HTML
            html_content = markdown.markdown(markdown_content)
            
            # Create full HTML document
            full_html = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Product Requirements Document</title>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                    }}
                    h1 {{
                        color: #1E3A8A;
                        border-bottom: 2px solid #E5E7EB;
                        padding-bottom: 10px;
                    }}
                    h2 {{
                        color: #374151;
                        margin-top: 30px;
                    }}
                    h3 {{
                        color: #4B5563;
                    }}
                    .footer {{
                        margin-top: 50px;
                        padding-top: 20px;
                        border-top: 1px solid #E5E7EB;
                        color: #6B7280;
                        font-size: 0.9em;
                        text-align: center;
                    }}
                    .generation-info {{
                        color: #6B7280;
                        font-style: italic;
                        margin-bottom: 30px;
                    }}
                </style>
            </head>
            <body>
                <h1>Product Requirements Document</h1>
                <div class="generation-info">
                    Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
                </div>
                {html_content}
                <div class="footer">
                    Generated by AI Product Manager (AutoGen)
                </div>
            </body>
            </html>
            """
            
            # Generate PDF
            HTML(string=full_html).write_pdf(output_path)
            logger.info("PDF generated successfully with HTML/WeasyPrint", output_path=output_path)
            return True
            
        except ImportError:
            logger.warning("WeasyPrint not installed, creating placeholder PDF")
            return self._create_placeholder_pdf(markdown_content, output_path)
        except Exception as e:
            logger.error("HTML PDF generation failed", error=str(e))
            return self._create_placeholder_pdf(markdown_content, output_path)
    
    def _create_placeholder_pdf(self, markdown_content: str, output_path: str) -> bool:
        """Create a simple placeholder PDF when other methods fail."""
        try:
            # Create a simple text file as placeholder
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write("PDF Generation Placeholder\n")
                f.write("=" * 40 + "\n\n")
                f.write("Full PDF generation requires either:\n")
                f.write("1. ReportLab: pip install reportlab\n")
                f.write("2. WeasyPrint: pip install weasyprint\n\n")
                f.write("For now, here's the PRD content:\n\n")
                f.write(markdown_content)
            
            # Rename to .txt if it's not a real PDF
            if not self.generator_type == "reportlab" and "weasyprint" not in str(Exception):
                txt_path = output_path.replace('.pdf', '.txt')
                os.rename(output_path, txt_path)
                logger.warning("Created placeholder text file instead of PDF", path=txt_path)
                return False
            else:
                logger.warning("Created placeholder PDF file", path=output_path)
                return True
                
        except Exception as e:
            logger.error("Failed to create placeholder PDF", error=str(e))
            return False

# Global PDF generator instance
pdf_generator = PDFGenerator()
