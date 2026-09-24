"""
Cut single flowers and leaves out of the sofa portrait, with transparent
backgrounds, for the section dividers and the RSVP thank-you.

Each piece is a box in the painting and a shape inside it to keep. Inside the
box, the background (terracotta, cream, frame, dress) is flood-filled from the
box's edge, so a petal whose colour drifts towards the background still stays
solid as long as its outline holds; then the piece is clipped to its shape,
eroded a pixel to drop the fringe, and softened.

    python3 tools/vines/cut.py
"""
from PIL import Image, ImageDraw, ImageFilter
import os, math

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.normpath(os.path.join(HERE, '..', '..', 'public', 'assets'))
OUT = os.path.join(ASSETS, 'flowers')
os.makedirs(OUT, exist_ok=True)

TERRA, CREAM, FRAME, WHITE, FLOOR = (192, 92, 58), (236, 205, 160), (104, 48, 44), (242, 238, 230), (128, 60, 42)

def E(cx, cy, rx, ry):   # an ellipse to keep
    return ('ellipse', (cx - rx, cy - ry, cx + rx, cy + ry))
def P(*pts):             # a polygon to keep
    return ('polygon', list(pts))

PIECES = {
    'tulip':   dict(box=(150, 540, 265, 665), keep=E(207, 600, 46, 56), bg=[TERRA]),
    'bell':    dict(box=(70, 640, 135, 722), keep=E(104, 680, 28, 34), bg=[TERRA, FRAME, (CREAM, 28)]),   # its own white is close to the cream border: a tight match only
    'daisy':   dict(box=(94, 428, 138, 472), keep=E(116, 450, 20, 20), bg=[TERRA, CREAM, FRAME]),
    'pink':    dict(box=(222, 268, 290, 336), keep=E(255, 300, 31, 32), bg=[TERRA]),
    'blue':    dict(box=(68, 788, 108, 834), keep=E(87, 810, 18, 21), bg=[TERRA, CREAM, FRAME]),
    'leaf-a':  dict(box=(164, 400, 236, 452), keep=P((166, 412), (200, 403), (232, 413), (233, 425), (205, 447), (170, 443)), bg=[TERRA]),
    'leaf-b':  dict(box=(170, 448, 242, 488), keep=P((172, 457), (205, 450), (240, 466), (238, 478), (205, 484), (175, 479)), bg=[TERRA]),
}

def unit(p):
    n = math.sqrt(sum(c * c for c in p)) or 1
    return tuple(c / n for c in p)
def angle(a, b):
    return math.acos(max(-1, min(1, sum(x * y for x, y in zip(unit(a), unit(b))))))
def dist(a, b): return math.sqrt(sum((a[i] - b[i]) ** 2 for i in range(3)))
def is_bg(p, protos):
    for q in protos:
        q, lim = (q[0], q[1]) if len(q) == 2 else (q, 62)
        if angle(p, q) < math.radians(6) and dist(p, q) < lim: return True
    return False

im = Image.open(os.path.join(ASSETS, 'portrait-sofa.jpg')).convert('RGB')
for name, spec in PIECES.items():
    x0, y0, x1, y1 = spec['box']
    crop = im.crop(spec['box'])
    w, h = crop.size
    px = crop.load()
    bg = [[is_bg(px[x, y], spec['bg']) for x in range(w)] for y in range(h)]
    # flood the background in from the edge of the box
    seen = [[False] * w for _ in range(h)]
    stack = [(x, y) for x in range(w) for y in (0, h - 1)] + [(x, y) for y in range(h) for x in (0, w - 1)]
    while stack:
        x, y = stack.pop()
        if x < 0 or y < 0 or x >= w or y >= h or seen[y][x] or not bg[y][x]: continue
        seen[y][x] = True
        stack += [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
    mask = Image.new('L', (w, h), 0)
    mp = mask.load()
    for y in range(h):
        for x in range(w):
            if not seen[y][x]: mp[x, y] = 255
    # keep only the piece itself
    keep = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(keep)
    kind, geo = spec['keep']
    if kind == 'ellipse':
        d.ellipse([geo[0] - x0, geo[1] - y0, geo[2] - x0, geo[3] - y0], fill=255)
    else:
        d.polygon([(x - x0, y - y0) for x, y in geo], fill=255)
    mask = Image.composite(mask, Image.new('L', (w, h), 0), keep)
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.6))
    out = crop.convert('RGBA')
    out.putalpha(mask)
    bbox = mask.getbbox()
    out = out.crop(bbox)
    out.save(os.path.join(OUT, name + '.png'), optimize=True)
    print(f'{name:8s} {out.size[0]}x{out.size[1]}  {os.path.getsize(os.path.join(OUT, name + ".png")) // 1024} KB')
