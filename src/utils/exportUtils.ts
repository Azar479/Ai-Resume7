import { ResumeEngineResponse, TailoredResume } from '../types';

export function exportToJson(data: ResumeEngineResponse, filename = 'tailored_resume.json'): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToPlainText(
  resume: TailoredResume,
  candidateName = 'Candidate Name',
  candidateContact = ''
): void {
  const lines: string[] = [];

  // Header
  lines.push(candidateName.toUpperCase());
  if (candidateContact) {
    lines.push(candidateContact);
  }
  lines.push('');
  lines.push('================================================================');
  lines.push('PROFESSIONAL SUMMARY');
  lines.push('================================================================');
  lines.push(resume.summary);
  lines.push('');

  // Experience
  lines.push('================================================================');
  lines.push('PROFESSIONAL EXPERIENCE');
  lines.push('================================================================');
  resume.experiences.forEach((exp) => {
    lines.push(`${exp.company.toUpperCase()} | ${exp.role}`);
    lines.push(exp.dates);
    exp.bullet_points.forEach((bullet) => {
      lines.push(`  • ${bullet}`);
    });
    lines.push('');
  });

  // Skills
  lines.push('================================================================');
  lines.push('TECHNICAL SKILLS & COMPETENCIES');
  lines.push('================================================================');
  lines.push(resume.skills.join(' • '));
  lines.push('');

  const textContent = lines.join('\n');
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${candidateName.replace(/\s+/g, '_')}_Tailored_Resume.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToWordDoc(
  resume: TailoredResume,
  candidateName = 'Candidate Name',
  candidateContact = ''
): void {
  // Generates Microsoft Word compatible XML document (Office XML / .doc)
  const experienceHtml = resume.experiences
    .map(
      (exp) => `
    <div style="margin-bottom: 14pt;">
      <div style="font-weight: bold; font-size: 11pt; color: #111827;">${escapeHtml(exp.company)} &mdash; <span style="font-weight: normal; font-style: italic;">${escapeHtml(exp.role)}</span></div>
      <div style="font-size: 9.5pt; color: #4B5563; margin-bottom: 4pt;">${escapeHtml(exp.dates)}</div>
      <ul style="margin: 0; padding-left: 20pt; line-height: 1.45; font-size: 10pt; color: #1F2937;">
        ${exp.bullet_points.map((b) => `<li style="margin-bottom: 3pt;">${escapeHtml(b)}</li>`).join('')}
      </ul>
    </div>
  `
    )
    .join('');

  const skillsHtml = `
    <p style="font-size: 10pt; line-height: 1.5; color: #1F2937; margin: 0;">
      ${resume.skills.map((s) => `<strong>${escapeHtml(s)}</strong>`).join(' &nbsp;•&nbsp; ')}
    </p>
  `;

  const docContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${escapeHtml(candidateName)} - Resume</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        body {
          font-family: 'Calibri', 'Arial', sans-serif;
          font-size: 10pt;
          line-height: 1.4;
          color: #111827;
          margin: 0.75in 0.75in 0.75in 0.75in;
        }
        h1 {
          font-size: 20pt;
          font-weight: bold;
          text-align: center;
          margin: 0 0 4pt 0;
          color: #0F172A;
          letter-spacing: 0.5pt;
        }
        .contact {
          font-size: 9.5pt;
          text-align: center;
          color: #4B5563;
          margin-bottom: 16pt;
          border-bottom: 1pt solid #D1D5DB;
          padding-bottom: 10pt;
        }
        .section-title {
          font-size: 11pt;
          font-weight: bold;
          text-transform: uppercase;
          color: #1E293B;
          border-bottom: 1pt solid #E2E8F0;
          padding-bottom: 2pt;
          margin-top: 14pt;
          margin-bottom: 6pt;
          letter-spacing: 0.5pt;
        }
        p {
          margin: 0 0 6pt 0;
        }
      </style>
    </head>
    <body>
      <h1>${escapeHtml(candidateName)}</h1>
      ${candidateContact ? `<div class="contact">${escapeHtml(candidateContact)}</div>` : ''}

      <div class="section-title">Professional Summary</div>
      <p style="font-size: 10pt; line-height: 1.5; color: #1F2937;">${escapeHtml(resume.summary)}</p>

      <div class="section-title">Professional Experience</div>
      ${experienceHtml}

      <div class="section-title">Technical Skills & Expertise</div>
      ${skillsHtml}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + docContent], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${candidateName.replace(/\s+/g, '_')}_Tailored_Resume.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function triggerPrint(): void {
  window.print();
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
