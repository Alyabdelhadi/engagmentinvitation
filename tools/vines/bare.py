"""
Paint the two side vines out of the sofa portrait.

Writes public/assets/vines-bare.png (and -phone.png): a transparent image
holding only the patched pixels. Laid over the portrait it hides the vines,
and main.js peels it away from the bottom up so they seem to grow.

Behind the vines the painting is made of vertical bands — cream border, frame
line, terracotta field — that each keep one colour down the column. So every
column gets a background colour (its most common warm colour, since leaves
are green), and a hidden pixel is painted that colour, shaded to meet the
clean pixels at either end of its row. Where the vine crosses the sofa or the
dress the mask is narrowed to what is safe.

    python3 tools/vines/bare.py
"""
from PIL import Image, ImageFilter
import os, random, math

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.normpath(os.path.join(HERE, '..', '..', 'public', 'assets'))
SRC = os.path.join(ASSETS, 'portrait-sofa.jpg')
PHONE_OFFSET = 183          # the phone crop is the painting 183px lower, with more olive border
Y0, Y1 = 265, 1405          # the vines' rows: below the arch, above the base band (the base stays as a sprout)
ZONES = [(Y0, 878), (878, 1201), (1201, Y1)]   # field · sofa rows · floor: the background changes between them

def lerp_edge(points, y):
    """piecewise-linear x for a y, from (y, x) points"""
    for (ya, xa), (yb, xb) in zip(points, points[1:]):
        if ya <= y <= yb:
            return xa + (xb - xa) * (y - ya) / (yb - ya)
    return points[0][1] if y < points[0][0] else points[-1][1]

# the groom's suit and trousers: the left band stops short of them; over the sofa rows only cream and frame
LEFT_INNER = [(Y0, 300), (725, 300), (760, 245), (800, 225), (850, 212), (878, 205), (879, 116), (1200, 116), (1201, 215), (Y1, 215)]
# the bride's veil and dress edge, as (y, x), measured from the pixels with 8px to spare
DRESS = [(560, 640), (670, 577), (700, 603), (740, 628), (760, 650), (780, 691), (800, 714), (840, 732), (880, 749), (920, 766), (960, 787), (1000, 798), (1040, 813), (1080, 829), (1120, 846), (1240, 846), (1250, 820), (1270, 833), (1300, 844), (Y1, 838)]

WHITE = (242, 238, 230)
def dist(a, b): return math.sqrt(sum((a[i]-b[i])**2 for i in range(3)))
def unit(p):
    n = math.sqrt(sum(c*c for c in p)) or 1
    return tuple(c / n for c in p)
def angle(a, b):
    ua, ub = unit(a), unit(b)
    return math.acos(max(-1, min(1, sum(ua[i]*ub[i] for i in range(3)))))
def differs(p, ref):
    return angle(p, ref) > math.radians(7) or dist(p, ref) > 60
def is_star(p):   # the gold stars stay
    r, g, b = p
    return r > 180 and g > 140 and b < 130 and g > r * .65
def warm(p):      # cream, terracotta, frame and floor are all warm; leaves are not
    return p[0] > p[1] + 20 and p[1] >= p[2]

im = Image.open(SRC).convert('RGB')
W, H = im.size
px = im.load()
# the painting's grain, to lay over the flat fill
grain = Image.effect_noise((W, H), 16).filter(ImageFilter.GaussianBlur(.7)).load()
mottle = Image.effect_noise((W, H), 40).filter(ImageFilter.GaussianBlur(7)).load()

# the scalloped arch hangs lower near the frame: the vine rows start under it
ARCH_L = [(0, 345), (160, 345), (200, Y0), (470, Y0)]           # (x, y) for the left side
ARCH_R = [(470, Y0), (742, Y0), (782, 345), (W, 345)]           # and the right
def y_top(x): return lerp_edge(ARCH_L if x < 470 else ARCH_R, x)
def allowed_left(x, y):  return 72 <= x < lerp_edge(LEFT_INNER, y)
def allowed_right(x, y): return x < 868 and x > lerp_edge(DRESS, y) and not (878 <= y <= 1210 and x <= 832)
def allowed(x, y):
    if not (y_top(x) <= y < Y1): return False
    return allowed_left(x, y) if x < 470 else allowed_right(x, y)

# --- each column's background colour, per zone
REF = {}
def ref(x, y):
    z = next((i for i, (a, b) in enumerate(ZONES) if a <= y < b), None)
    if z is None: return None
    k = (x, z)
    if k not in REF:
        a, b = ZONES[z]
        bins = {}
        for yy in range(a, b):
            if allowed(x, yy):
                p = px[x, yy]
                if warm(p): bins.setdefault((p[0] >> 4, p[1] >> 4, p[2] >> 4), []).append(p)
        best = max(bins.values(), key=len) if bins else []
        REF[k] = tuple(sum(c[i] for c in best) / len(best) for i in range(3)) if len(best) >= 15 else None
    return REF[k]

# --- the mask: what differs from its column's background
mask = Image.new('L', (W, H), 0)
mp = mask.load()
for y in range(Y0, Y1):
    for x in list(range(72, 300)) + list(range(600, 868)):
        if allowed(x, y):
            r = ref(x, y); p = px[x, y]
            if r and not is_star(p) and differs(p, r): mp[x, y] = 255
        elif x >= 740 and y >= 1150 and x > 470 and x <= lerp_edge(DRESS, y):
            # over the dress: only the bottom cluster's leaves and red flower
            r, g, b = px[x, y]
            if g > r or (r > g + 60 and b < 140) or max(r, g, b) < 110: mp[x, y] = 255

mask = mask.filter(ImageFilter.MaxFilter(5))
mp = mask.load()

# neighbouring columns of the same band share a colour: average them so the fill has no vertical lines
def smooth_ref(x, y):
    r = ref(x, y)
    if r is None: return None
    ps = [q for xx in range(x - 4, x + 5) if 0 <= xx < W for q in [ref(xx, y)] if q and not differs(q, r)]
    return tuple(sum(q[i] for q in ps) / len(ps) for i in range(3))

# the field is not one flat colour: where enough clean pixels sit near (x, y), their average is the fill
CUM = {}
def cum(x):
    """running sums down column x of its clean background pixels: (r, g, b, n) after each row"""
    if x not in CUM:
        acc = [(0, 0, 0, 0)]
        r = g = b = n = 0
        for y in range(H):
            if allowed(x, y) and not mp[x, y]:
                p = px[x, y]; z = ref(x, y)
                if z and not differs(p, z):
                    r += p[0]; g += p[1]; b += p[2]; n += 1
            acc.append((r, g, b, n))
        CUM[x] = acc
    return CUM[x]
def local_ref(x, y, R=70):
    z = next(((a, b) for (a, b) in ZONES if a <= y < b), None)
    if z is None: return smooth_ref(x, y)
    ya, yb = max(z[0], y - R), min(z[1], y + R)
    r = g = b = n = 0
    for xx in range(max(0, x - 6), min(W, x + 7)):
        base = smooth_ref(xx, y)
        mine = smooth_ref(x, y)
        if base is None or mine is None or differs(base, mine): continue
        c0, c1 = cum(xx)[ya], cum(xx)[yb]
        r += c1[0] - c0[0]; g += c1[1] - c0[1]; b += c1[2] - c0[2]; n += c1[3] - c0[3]
    if n < 60: return smooth_ref(x, y)
    return (r / n, g / n, b / n)

# --- the fill
out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
op = out.load()
random.seed(3)
def clean(x, y):
    """a clean pixel, averaged with its clean vertical neighbours"""
    ps = [px[x, yy] for yy in range(max(0, y - 4), min(H, y + 5)) if not mp[x, yy]]
    return tuple(sum(p[i] for p in ps) / len(ps) for i in range(3))
def dev(x, y):
    """how far the clean pixel at x sits from its column's background; nothing if it is something else"""
    if x < 0 or x >= W: return (0, 0, 0)
    p, r = clean(x, y), ref(x, y)
    if r is None or differs(p, r): return (0, 0, 0)
    return tuple(p[i] - r[i] for i in range(3))
def put(x, y, c):
    g = (grain[x, y] - 128) * .9 + (mottle[x, y] - 128) * 1.6
    op[x, y] = tuple(int(max(0, min(255, v + g * f))) for v, f in zip(c, (1, .7, .55))) + (255,)

pending = []   # masked pixels with no column colour (over the dress): filled afterwards from their neighbours
for y in range(H):
    x = 0
    while x < W:
        if not mp[x, y]: x += 1; continue
        x0 = x
        while x < W and mp[x, y]: x += 1
        x1 = x
        for xx in range(x0, x1):
            r = local_ref(xx, y)
            if r is None: pending.append((xx, y)); continue
            put(xx, y, r)
for (x, y) in pending:
    def side(step):
        yy = y + step
        while 0 <= yy < H and mp[x, yy] and op[x, yy][3] == 0: yy += step
        if not (0 <= yy < H): return None, 0
        return (op[x, yy][:3] if mp[x, yy] else px[x, yy]), abs(yy - y)
    (a, da), (b, db) = side(-1), side(1)
    if a is None: a = b
    if b is None: b = a
    t = da / (da + db) if da + db else .5
    put(x, y, [a[k] + (b[k] - a[k]) * t for k in range(3)])

out.save(os.path.join(ASSETS, 'vines-bare.png'), optimize=True)
phone = Image.new('RGBA', (W, 2039), (0, 0, 0, 0))
phone.paste(out, (0, PHONE_OFFSET))
phone.save(os.path.join(ASSETS, 'vines-bare-phone.png'), optimize=True)

# previews, for checking by eye
prev = im.convert('RGBA'); prev.alpha_composite(out)
prev.convert('RGB').save(os.path.join(HERE, 'preview-bare.jpg'), quality=90)
mask.save(os.path.join(HERE, 'preview-mask.png'))
print('vines-bare.png', os.path.getsize(os.path.join(ASSETS, 'vines-bare.png')) // 1024, 'KB')
