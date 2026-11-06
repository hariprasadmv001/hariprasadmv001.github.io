"""Create the download PDF without a runtime dependency (portable fallback)."""
from pathlib import Path

W = 595
out = Path('public/invitation.pdf')
out.parent.mkdir(exist_ok=True)
stream = ['0.208 0.071 0.059 rg 0 0 595 842 re f', '1 0.973 0.914 rg 23 23 549 796 re f', '0.776 0.604 0.271 RG 1.4 w 23 23 549 796 re S 0.45 w 31 31 533 780 re S']
def esc(value): return value.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
def center(text, y, size=12, font='F1', colour='0.227 0.129 0.098'):
    x = (W - len(text) * size * .51) / 2
    stream.append(f'{colour} rg BT /{font} {size} Tf {x:.1f} {y} Td ({esc(text)}) Tj ET')
def rule(y): stream.append(f'0.776 0.604 0.271 RG 0.7 w 175 {y} m 420 {y} l S')
center('GRUHA PRAVESHA', 750, 25, 'F2', '0.208 0.071 0.059')
center('A ROYAL SOUTH INDIAN HOUSEWARMING INVITATION', 726, 9, 'F1', '0.776 0.604 0.271'); rule(714)
entries = [
    ('With immense pleasure, we cordially invite you and your family to grace the',680,13,'F3'), ('auspicious occasion of the Gruha Pravesha ceremony of our new home.',663,13,'F3'),
    ('SHRI HARI NILAYA',625,20,'F2'), ('DATE & DAY',583,10,'F2'), ('Thursday, 12th November 2026',564,14,'F2'), ('POOJA TIME',528,10,'F2'), ('7:30 AM - 8:30 AM',509,14,'F2'),
    ('LUNCH',478,10,'F2'), ('12:00 PM (Noon)',459,14,'F2'), ('VENUE',421,10,'F2'), ('Mudalododdi, Koppa Hobli,',401,13,'F1'), ('Maddur Taluk, Mandya District,',385,13,'F1'),
    ('Karnataka.',369,13,'F1'), ('CORDIALLY INVITED BY',333,10,'F2'), ('Mr. Veerendra Heggade',312,13,'F2'), ('Mrs. Shobha',296,13,'F2'), ('Harikiran M. V.',280,13,'F2'),
    ('Hariprasad M. V.',264,13,'F2'), ('We warmly welcome you and your family to join us on this special occasion and bless our new home.',226,10,'F3'),
    ('Your gracious presence will make our celebration more memorable.',210,10,'F3'), ('THE HEGGAGE FAMILY',47,10,'F2')]
for text,y,size,font in entries:
    center(text, y, size, font, '0.49 0.216 0.122' if y in (625,583,528,478,421,333) else '0.227 0.129 0.098')
stream.append('0.208 0.071 0.059 rg 0 0 595 14 re f')
content = '\n'.join(stream).encode('latin-1')
objects = [b'<< /Type /Catalog /Pages 2 0 R >>', b'<< /Type /Pages /Kids [3 0 R] /Count 1 >>', b'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >> >> /Contents 4 0 R >>', b'<< /Length %d >>\nstream\n' % len(content) + content + b'\nendstream', b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>', b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>']
pdf = b'%PDF-1.4\n%\xe2\xe3\xcf\xd3\n'; offsets = [0]
for number, obj in enumerate(objects, 1):
    offsets.append(len(pdf)); pdf += f'{number} 0 obj\n'.encode() + obj + b'\nendobj\n'
xref = len(pdf); pdf += f'xref\n0 {len(objects)+1}\n0000000000 65535 f \n'.encode() + b''.join(f'{offset:010d} 00000 n \n'.encode() for offset in offsets[1:])
pdf += f'trailer\n<< /Size {len(objects)+1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF\n'.encode()
out.write_bytes(pdf)
