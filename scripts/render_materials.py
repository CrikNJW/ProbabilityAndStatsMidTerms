from pathlib import Path
import argparse, json
import pypdfium2 as pdfium

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description='Render publishable course source pages for the slide panel.')
parser.add_argument('--source', type=Path, required=True, help='Folder containing the supplied course PDFs')
SOURCE = parser.parse_args().source
FILES = [('week1','Week 1 Updated.pdf',1), ('week2','Week2 lecture update.pdf',2), ('week3','Week 3 Lecture 2026.pdf',3), ('week4','Week 4 Lecture 2026.pdf',4), ('week5','Week 5 Lecture 2026.pdf',5), ('formula','Midterm 2026 Formula Sheet.pdf',0), ('tutorial2','Week 2 Tutorial 2026 (1).pdf',2), ('tutorial3','Week 3 Tutorial 2026 (1).pdf',3), ('tutorial4','Week 4 Tutorial 2026.pdf',4), ('tutorial5','Week 5 Tutorial 2026.pdf',5), ('quiz4am','Week 4 Quiz 2026 Morning Solutions Revised.pdf',4), ('quiz4pm','Week 4 Quiz 2026 Afternoon Solutions Revised.pdf',4)]
assets = ROOT / 'assets' / 'slides'
assets.mkdir(parents=True, exist_ok=True)
(ROOT / 'data').mkdir(exist_ok=True)
manifest = {}
for key, name, week in FILES:
    doc = pdfium.PdfDocument(str(SOURCE / name))
    folder = assets / key
    folder.mkdir(exist_ok=True)
    for i in range(len(doc)):
        dest = folder / f'{i+1}.webp'
        if not dest.exists():
            page = doc[i]
            scale = 1600 / page.get_width()
            bitmap = page.render(scale=scale)
            bitmap.to_pil().convert('RGB').save(dest, 'WEBP', quality=85)
            bitmap.close()
            page.close()
    manifest[key] = {'id': key, 'title': name.removesuffix('.pdf'), 'week': week, 'pages': len(doc), 'imageBase': f'assets/slides/{key}/'}
    print(f'{key}: {len(doc)} pages', flush=True)
    doc.close()
(ROOT / 'data' / 'materials.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
