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
  let textContent = '';

  if (resume.full_tailored_text && resume.full_tailored_text.length > 50) {
    textContent = resume.full_tailored_text;
  } else {
    const lines: string[] = [];

    // Header
    lines.push(candidateName.toUpperCase());
    if (candidateContact) {
      lines.push(candidateContact);
    }
    lines.push('');

    const sections = resume.blueprint?.sections || resume.sections;

  if (sections && sections.length > 0) {
    sections.forEach((sec) => {
      lines.push('================================================================');
      lines.push(sec.title.toUpperCase());
      lines.push('================================================================');

      if (sec.type === 'summary') {
        lines.push(sec.content || resume.summary);
      } else if (sec.type === 'skills') {
        const skills = sec.skills || resume.skills;
        lines.push(skills.join(' • '));
      } else if (sec.type === 'experience') {
        const exps = sec.experiences || resume.experiences;
        exps.forEach((exp) => {
          lines.push(`${exp.company.toUpperCase()} | ${exp.role}`);
          if (exp.dates) lines.push(exp.dates);
          exp.bullet_points.forEach((bullet) => {
            lines.push(`  • ${bullet}`);
          });
          lines.push('');
        });
      } else if (sec.type === 'projects') {
        const projs = sec.projects || resume.projects || [];
        projs.forEach((p) => {
          lines.push(`${p.title}${p.technologies ? ` (${p.technologies})` : ''}${p.dates ? ` — ${p.dates}` : ''}`);
          p.bullet_points.forEach((b) => {
            lines.push(`  • ${b}`);
          });
          lines.push('');
        });
      } else if (sec.type === 'education') {
        const edus = sec.education || resume.education || [];
        edus.forEach((edu) => {
          lines.push(`${edu.institution} | ${edu.degree}${edu.dates ? ` (${edu.dates})` : ''}`);
          if (edu.details && edu.details.length > 0) {
            edu.details.forEach((d) => lines.push(`  • ${d}`));
          }
          lines.push('');
        });
      } else if (sec.items && sec.items.length > 0) {
        sec.items.forEach((item) => {
          lines.push(`${item.heading}${item.dates ? ` (${item.dates})` : ''}`);
          if (item.content) lines.push(item.content);
          if (item.bullet_points) {
            item.bullet_points.forEach((b) => lines.push(`  • ${b}`));
          }
          lines.push('');
        });
      } else if (sec.content) {
        lines.push(sec.content);
      }
      lines.push('');
    });
  } else {
    // Default fallback
    lines.push('================================================================');
    lines.push('PROFESSIONAL SUMMARY');
    lines.push('================================================================');
    lines.push(resume.summary);
    lines.push('');

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

    lines.push('================================================================');
    lines.push('TECHNICAL SKILLS & COMPETENCIES');
    lines.push('================================================================');
    lines.push(resume.skills.join(' • '));
    }
    textContent = lines.join('\n');
  }
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
  const sections = resume.blueprint?.sections || resume.sections;

  let bodyHtml = '';

  const filteredSections = (sections && sections.length > 0)
    ? sections.filter((s) => s.title.toLowerCase() !== candidateName.toLowerCase())
    : null;

  if (filteredSections && filteredSections.length > 0) {
    bodyHtml = filteredSections
      .map((sec) => {
        let secContent = '';

        if (sec.type === 'summary') {
          secContent = `<p style="font-size: 10pt; line-height: 1.5; color: #1F2937;">${escapeHtml(sec.content || resume.summary)}</p>`;
        } else if (sec.type === 'skills') {
          if (sec.skill_categories && sec.skill_categories.length > 0) {
            secContent = sec.skill_categories
              .map(
                (cat) => `
              <p style="font-size: 10pt; line-height: 1.45; color: #1F2937; margin: 0 0 3pt 0;">
                <strong style="color: #111827;">${escapeHtml(cat.category)}:</strong> ${escapeHtml(cat.items.join(', '))}
              </p>
            `
              )
              .join('');
          } else {
            const skills = sec.skills || resume.skills;
            secContent = `
              <p style="font-size: 10pt; line-height: 1.5; color: #1F2937; margin: 0;">
                ${skills.map((s) => `<strong>${escapeHtml(s)}</strong>`).join(' &nbsp;•&nbsp; ')}
              </p>
            `;
          }
        } else if (sec.type === 'experience') {
          const exps = sec.experiences || resume.experiences;
          secContent = exps
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
        } else if (sec.type === 'projects') {
          const projs = sec.projects || resume.projects || [];
          secContent = projs
            .map(
              (p) => `
            <div style="margin-bottom: 12pt;">
              <div style="font-weight: bold; font-size: 10.5pt; color: #111827;">${escapeHtml(p.title)} ${p.technologies ? `<span style="font-weight: normal; font-style: italic;">(${escapeHtml(p.technologies)})</span>` : ''} ${p.dates ? `<span style="float: right; font-size: 9.5pt; color: #4B5563;">${escapeHtml(p.dates)}</span>` : ''}</div>
              <ul style="margin: 0; padding-left: 20pt; line-height: 1.45; font-size: 10pt; color: #1F2937;">
                ${p.bullet_points.map((b) => `<li style="margin-bottom: 3pt;">${escapeHtml(b)}</li>`).join('')}
              </ul>
            </div>
          `
            )
            .join('');
        } else if (sec.type === 'education') {
          const edus = sec.education || resume.education || [];
          secContent = edus
            .map(
              (edu) => `
            <div style="margin-bottom: 10pt;">
              <div style="font-weight: bold; font-size: 10.5pt; color: #111827;">${escapeHtml(edu.institution)} &mdash; <span style="font-weight: normal;">${escapeHtml(edu.degree)}</span> ${edu.dates ? `<span style="float: right; font-size: 9.5pt; color: #4B5563;">${escapeHtml(edu.dates)}</span>` : ''}</div>
              ${edu.details && edu.details.length > 0 ? `<ul style="margin: 0; padding-left: 20pt; font-size: 9.5pt; color: #4B5563;">${edu.details.map((d) => `<li>${escapeHtml(d)}</li>`).join('')}</ul>` : ''}
            </div>
          `
            )
            .join('');
        } else if (sec.items && sec.items.length > 0) {
          secContent = sec.items
            .map(
              (item) => `
            <div style="margin-bottom: 8pt;">
              <div style="font-weight: bold; font-size: 10pt; color: #111827;">${escapeHtml(item.heading)} ${item.dates ? `<span style="float: right; font-size: 9pt; color: #4B5563;">${escapeHtml(item.dates)}</span>` : ''}</div>
              ${item.content ? `<p style="font-size: 9.5pt; color: #374151;">${escapeHtml(item.content)}</p>` : ''}
              ${item.bullet_points && item.bullet_points.length > 0 ? `<ul style="margin: 0; padding-left: 20pt; font-size: 9.5pt; color: #374151;">${item.bullet_points.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>` : ''}
            </div>
          `
            )
            .join('');
        } else if (sec.content) {
          secContent = `<p style="font-size: 10pt; line-height: 1.5; color: #1F2937;">${escapeHtml(sec.content)}</p>`;
        }

        return `
          <div class="section-title">${escapeHtml(sec.title)}</div>
          ${secContent}
        `;
      })
      .join('');
  } else {
    // Default fallback
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

    bodyHtml = `
      <div class="section-title">Professional Summary</div>
      <p style="font-size: 10pt; line-height: 1.5; color: #1F2937;">${escapeHtml(resume.summary)}</p>

      <div class="section-title">Professional Experience</div>
      ${experienceHtml}

      <div class="section-title">Technical Skills & Expertise</div>
      ${skillsHtml}
    `;
  }

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
      ${bodyHtml}
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
