from pathlib import Path
import argparse, json, re, logging
import pdfplumber

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description='Extract local course PDFs into ignored research files.')
parser.add_argument('--source', type=Path, required=True, help='Folder containing the supplied course PDFs')
SOURCE = parser.parse_args().source
logging.getLogger('pdfminer').setLevel(logging.ERROR)
OUT = ROOT / 'research'
OUT.mkdir(exist_ok=True)
docs = []
for path in sorted(SOURCE.glob('*.pdf')):
    doc = pdfplumber.open(path)
    slug = re.sub(r'[^a-z0-9]+', '-', path.stem.lower()).strip('-')
    pages = [{'page': i+1, 'text': p.extract_text(layout=False) or ''} for i,p in enumerate(doc.pages)]
    data = {'id': slug, 'name': path.name, 'pages': pages}
    (OUT / (slug + '.json')).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    (OUT / (slug + '.txt')).write_text('\n\n'.join(f'=== PAGE {p["page"]} ===\n{p["text"]}' for p in pages), encoding='utf-8')
    docs.append({'id': slug, 'name': path.name, 'pages': len(pages), 'characters': sum(len(p['text']) for p in pages)})
(OUT / 'manifest.json').write_text(json.dumps(docs, indent=2), encoding='utf-8')
print(json.dumps(docs, indent=2))
